// One-off dist verification for the SEO fixes. Safe to delete.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = join(process.cwd(), "dist");
const charLen = (s) => [...s].length;
/** HTML head text contains entities (&amp;); count what renders. */
const rendered = (s) => s.replaceAll("&amp;", "&");

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (f === "index.html") out.push(p);
  }
  return out;
}

const files = walk(DIST);
let issues = 0;
const robotsBad = [];
const homeCounts = {};

for (const f of files) {
  const html = readFileSync(f, "utf8");
  const rel = f.slice(DIST.length).replaceAll("\\", "/");
  const is404 = rel.includes("404");

  const robots = (html.match(/<meta name="robots" content="([^"]*)"/) || [])[1];
  if (!is404 && robots !== "index, follow") robotsBad.push(`${rel} -> ${robots}`);

  const title = rendered(
    (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "",
  );
  const desc = rendered(
    (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "",
  );
  const tl = charLen(title);
  const dl = charLen(desc);
  const isArticle = /^\/(id\/)?news\/[^/]+\/index\.html$/.test(rel);
  if (!is404 && (dl < 120 || dl > 160)) {
    issues++;
    console.log("DESC-LEN", rel, dl);
  }
  if (!is404 && !isArticle && (tl < 50 || tl > 60)) {
    issues++;
    console.log("TITLE-LEN", rel, tl, JSON.stringify(title));
  }

  if (rel === "/index.html") {
    homeCounts.imgs = (html.match(/<img /g) || []).length;
    homeCounts.emptyAlt = (html.match(/alt=""/g) || []).length;
    homeCounts.h1 = (html.match(/<h1[ >]/g) || []).length;
    homeCounts.h2 = (html.match(/<h2[ >]/g) || []).length;
    homeCounts.h3 = (html.match(/<h3[ >]/g) || []).length;
    homeCounts.faq = html.includes('id="faq"') ? "yes" : "NO";
    homeCounts.preload = html.includes('rel="preload" as="image"') ? "yes" : "NO";
    homeCounts.titleLen = tl;
    homeCounts.descLen = dl;
  }
  if (rel === "/id/index.html") {
    homeCounts.preloadId = html.includes('rel="preload" as="image"') ? "yes" : "NO";
  }
  if (rel === "/news/index.html") {
    homeCounts.newsH = ["h1", "h2", "h3"]
      .map((h) => `${h}:${(html.match(new RegExp(`<${h}[ >]`, "g")) || []).length}`)
      .join(" ");
  }
  if (rel === "/contact/index.html") {
    homeCounts.contactH = ["h1", "h2", "h3"]
      .map((h) => `${h}:${(html.match(new RegExp(`<${h}[ >]`, "g")) || []).length}`)
      .join(" ");
    homeCounts.contactDesc = dl;
  }
  if (rel === "/privacy/index.html") {
    homeCounts.privacyH = ["h1", "h2", "h3"]
      .map((h) => `${h}:${(html.match(new RegExp(`<${h}[ >]`, "g")) || []).length}`)
      .join(" ");
  }
  if (rel === "/terms/index.html") {
    homeCounts.termsH = ["h1", "h2", "h3"]
      .map((h) => `${h}:${(html.match(new RegExp(`<${h}[ >]`, "g")) || []).length}`)
      .join(" ");
  }
  if (rel === "/catalog/popeda/index.html") {
    homeCounts.popedaDesc = dl;
    homeCounts.popedaTitle = title;
  }
}

console.log("pages checked:", files.length);
console.log("robotsBad:", robotsBad.length ? robotsBad : "none");
console.log("length issues:", issues);
console.log(JSON.stringify(homeCounts, null, 2));
