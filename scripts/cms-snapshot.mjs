// Build-time CMS snapshots. Keeps prerendered HTML, JSON-LD, and the client
// bundle on the same data; runtime loaders can still refresh from CMS.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCT_OUT = join(ROOT, "src", "data", "cms-products.generated.json");
const STOCKIST_OUT = join(ROOT, "src", "data", "cms-stockists.generated.json");
const CMS = (process.env.CMS_URL || process.env.VITE_CMS_URL || "").replace(/\/+$/, "");

function ensureFile(path, content) {
  if (existsSync(path)) return;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function readJson(path, fallback) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

function absMedia(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return CMS ? `${CMS}${raw.startsWith("/") ? "" : "/"}${raw}` : raw;
}

function normalizeProduct(doc) {
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

function normalizeStockistPoint(point) {
  if (!point || typeof point.pointId !== "string" || typeof point.name !== "string") {
    return null;
  }
  const lng = Number(point.lng);
  const lat = Number(point.lat);
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  return {
    pointId: point.pointId,
    name: point.name,
    area: typeof point.area === "string" ? point.area : "",
    kind: point.kind === "hub" || point.kind === "partner" ? point.kind : "retail",
    lng,
    lat,
    active: point.active !== false,
  };
}

function normalizeStockist(doc) {
  return {
    slug: doc.slug,
    city: doc.city,
    region: typeof doc.region === "string" ? doc.region : "",
    sortOrder: Number.isFinite(Number(doc.sortOrder)) ? Number(doc.sortOrder) : 0,
    seoTitle: doc.seoTitle,
    metaDescription: doc.metaDescription,
    title: doc.title,
    lede: doc.lede,
    paragraphs: doc.paragraphs,
    points: Array.isArray(doc.points)
      ? doc.points.map(normalizeStockistPoint).filter(Boolean)
      : [],
  };
}

async function fetchDocs(path, label) {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(`${CMS}${path}`, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return Array.isArray(body?.docs) ? body.docs : [];
  } catch (error) {
    console.warn(`cms-${label}: fetch failed (${error.message}); keeping existing snapshot`);
    return null;
  }
}

async function syncProducts() {
  const docs = await fetchDocs(
    "/api/products?where[status][equals]=published&sort=sortOrder&limit=100&depth=1&locale=all",
    "products",
  );
  if (docs === null) return;
  if (docs.length === 0) {
    console.warn("cms-products: no published products; keeping existing snapshot");
    return;
  }

  const next = docs
    .filter((doc) => doc && typeof doc.slug === "string" && typeof doc.title === "string")
    .map(normalizeProduct);
  if (next.length === 0) {
    console.warn("cms-products: no valid products; keeping existing snapshot");
    return;
  }

  const previous = existsSync(PRODUCT_OUT) ? readFileSync(PRODUCT_OUT, "utf8") : "";
  const output = `${JSON.stringify(next, null, 2)}\n`;
  if (output !== previous) writeFileSync(PRODUCT_OUT, output);
  console.log(`cms-products: ${next.length} published products (${CMS})`);
}

async function syncStockists() {
  const docs = await fetchDocs(
    "/api/stockist-cities?where[status][equals]=published&sort=sortOrder&limit=100&depth=0&locale=all",
    "stockists",
  );
  if (docs === null) return;
  if (docs.length === 0) {
    console.warn("cms-stockists: no published cities; keeping existing snapshot");
    return;
  }

  const cities = docs
    .filter((doc) => doc && typeof doc.slug === "string" && typeof doc.city === "string")
    .map(normalizeStockist);
  if (cities.length === 0) {
    console.warn("cms-stockists: no valid cities; keeping existing snapshot");
    return;
  }

  const previous = readJson(STOCKIST_OUT, null);
  if (previous && JSON.stringify(previous.cities) === JSON.stringify(cities)) {
    console.log(`cms-stockists: ${cities.length} published cities unchanged (${CMS})`);
    return;
  }

  const output = `${JSON.stringify(
    { syncedAt: new Date().toISOString(), cities },
    null,
    2,
  )}\n`;
  writeFileSync(STOCKIST_OUT, output);
  console.log(`cms-stockists: ${cities.length} published cities (${CMS})`);
}

ensureFile(PRODUCT_OUT, "[]\n");
ensureFile(STOCKIST_OUT, '{\n  "syncedAt": null,\n  "cities": []\n}\n');

if (!CMS) {
  console.log("cms-snapshot: CMS_URL unset, using static fallback");
} else {
  await syncProducts();
  await syncStockists();
}
