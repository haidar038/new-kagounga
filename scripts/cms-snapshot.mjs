// Build-time product snapshot. Keeps prerendered HTML, JSON-LD, and the client
// bundle on the same data; runtime loaders can still refresh from CMS.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src", "data", "cms-products.generated.json");
const CMS = (process.env.CMS_URL || process.env.VITE_CMS_URL || "").replace(/\/+$/, "");

function absMedia(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return CMS ? `${CMS}${raw.startsWith("/") ? "" : "/"}${raw}` : raw;
}

function normalizeDoc(doc) {
  const image =
    doc?.image && typeof doc.image === "object"
      ? { ...doc.image, url: absMedia(doc.image.url) }
      : doc?.image;
  return {
    ...doc,
    image,
    imageUrl: doc?.imageUrl ? absMedia(doc.imageUrl) : doc?.imageUrl,
  };
}

async function main() {
  if (!existsSync(OUT)) {
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, "[]\n");
  }
  if (!CMS) {
    console.log("cms-products: CMS_URL unset, using static fallback");
    return;
  }

  let body;
  let timer;
  try {
    const ctrl = new AbortController();
    timer = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(
      `${CMS}/api/products?where[status][equals]=published&sort=sortOrder&limit=100&depth=1&locale=all`,
      { signal: ctrl.signal },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    body = await res.json();
  } catch (error) {
    console.warn(`cms-products: fetch failed (${error.message}); keeping existing snapshot`);
    return;
  } finally {
    clearTimeout(timer);
  }

  const docs = Array.isArray(body?.docs) ? body.docs : [];
  if (docs.length === 0) {
    console.warn("cms-products: no published products; keeping existing snapshot");
    return;
  }

  const next = docs
    .filter((doc) => doc && typeof doc.slug === "string" && typeof doc.title === "string")
    .map(normalizeDoc);
  if (next.length === 0) {
    console.warn("cms-products: no valid products; keeping existing snapshot");
    return;
  }

  const previous = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
  const output = `${JSON.stringify(next, null, 2)}\n`;
  if (output !== previous) writeFileSync(OUT, output);
  console.log(`cms-products: ${next.length} published products (${CMS})`);
}

await main();
