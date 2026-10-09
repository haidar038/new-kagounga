// i18n parity: every key in locales/en must exist in locales/id.
// Data overlays that live only in ID (products, signatures, movements,
// roles, subjects) are exempt: EN source is the TS base (news.ts read +
// products.ts etc.), ID overlay is the JSON. Extra ID keys warn only.
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "locales");
const EXEMPT = new Set(["products", "signatures", "movements", "roles", "subjects"]);

function keys(value, prefix = "") {
  const out = [];
  if (Array.isArray(value)) {
    value.forEach((v, i) => out.push(...keys(v, `${prefix}[${i}]`)));
  } else if (value && typeof value === "object") {
    for (const k of Object.keys(value)) {
      out.push(...keys(value[k], prefix ? `${prefix}.${k}` : k));
    }
  } else {
    out.push(prefix);
  }
  return out;
}

let missing = 0;
let warned = 0;
const files = readdirSync(join(ROOT, "en")).filter((f) => f.endsWith(".json"));
for (const f of files) {
  const en = JSON.parse(readFileSync(join(ROOT, "en", f), "utf8"));
  let id;
  try {
    id = JSON.parse(readFileSync(join(ROOT, "id", f), "utf8"));
  } catch {
    console.error(`MISSING FILE locales/id/${f}`);
    missing += 1;
    continue;
  }
  const enKeys = keys(en);
  const idSet = new Set(keys(id));
  for (const k of enKeys) {
    if (!idSet.has(k)) {
      console.error(`MISSING locales/id/${f}: ${k}`);
      missing += 1;
    }
  }
  // Array length parity (badges, tiles, stats, sections).
  const checkArrays = (a, b, path) => {
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) {
        console.error(`ARRAY locales/id/${f}: ${path || "<root>"} en=${a.length} id=${Array.isArray(b) ? b.length : "n/a"}`);
        missing += 1;
      }
      return;
    }
    if (a && typeof a === "object" && b && typeof b === "object") {
      for (const k of Object.keys(a)) checkArrays(a[k], b[k], path ? `${path}.${k}` : k);
    }
  };
  checkArrays(en, id, "");
  for (const k of idSet) {
    const top = k.split(".")[0];
    if (EXEMPT.has(top)) {
      warned += 1;
      break;
    }
  }
}
if (warned > 0) console.log(`note: ID-only overlay subtrees present (exempt): ${[...EXEMPT].join(", ")}`);
if (missing > 0) {
  console.error(`i18n-parity: ${missing} problem(s)`);
  process.exit(1);
}
console.log(`i18n-parity: OK (${files.length} namespaces)`);
