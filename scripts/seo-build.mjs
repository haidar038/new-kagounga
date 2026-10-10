// SEO build: sitemap + image sitemap + per-route prerendered HTML (EN + ID).
// Run AFTER `vite build`: reads dist/index.html as template, writes
// dist/<route>/index.html with final head tags so crawlers / social scrapers
// see full meta without JS. No external bot, no extra deps.
// Copy source of truth: src/locales/{en,id}/seo.json + news.json (Id fields).
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const PUBLIC = join(ROOT, "public");
const TEMPLATE = join(DIST, "index.html");
const NEWS_JSON = join(ROOT, "src", "data", "news.json");
const LOCALES_DIR = join(ROOT, "src", "locales");

const SITE = (process.env.VITE_SITE_URL || "https://kagounga.com").replace(/\/+$/, "");
// Build-time CMS export (M5). Unset = static file (Vercel-safe). Set CMS_URL
// (atau VITE_CMS_URL) untuk memanggang konten CMS ke prerender + sitemap.
const CMS = (process.env.CMS_URL || process.env.VITE_CMS_URL || "").replace(/\/+$/, "");
const OG_DEFAULT =
  "https://res.cloudinary.com/fal5otmd/image/upload/v1791556121/OpenGraph.webp";
const LOGO =
  "https://res.cloudinary.com/fal5otmd/image/upload/f_auto,q_auto/logo-primary-emblem.svg";
const today = new Date().toISOString().slice(0, 10);

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const seo = { en: readJson(join(LOCALES_DIR, "en", "seo.json")), id: readJson(join(LOCALES_DIR, "id", "seo.json")) };
const crumbs = { en: readJson(join(LOCALES_DIR, "en", "common.json")).crumbs, id: readJson(join(LOCALES_DIR, "id", "common.json")).crumbs };
const suffix = { en: readJson(join(LOCALES_DIR, "en", "news.json")).suffix, id: readJson(join(LOCALES_DIR, "id", "news.json")).suffix };

function loadStaticNews() {
  try {
    const raw = readJson(NEWS_JSON);
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((p) => p && typeof p.slug === "string")
      .sort((a, b) => String(b.dateISO).localeCompare(String(a.dateISO)));
  } catch {
    return [];
  }
}

const bagOf = (v) =>
  v && typeof v === "object" && !Array.isArray(v) ? v : { en: v };
const pickBag = (v) => {
  const b = bagOf(v);
  return { en: b.en ?? "", id: b.id ?? undefined };
};

/** Dokumen CMS (`locale=all`) -> bentuk rekaman news.json (tanpa body). */
function cmsPost(p) {
  const title = pickBag(p.title);
  const desc = pickBag(p.metaDescription);
  const coverAlt = pickBag(p.coverAlt);
  const cover =
    typeof p.coverUrl === "string" && p.coverUrl
      ? p.coverUrl
      : p.featuredImage && typeof p.featuredImage === "object" && p.featuredImage.url
        ? `${CMS}${p.featuredImage.url}`
        : "";
  const dateISO = String(p.publishedAt ?? p.createdAt ?? "").slice(0, 10);
  return {
    slug: String(p.slug),
    title: title.en || title.id || String(p.slug),
    description: desc.en,
    dateISO,
    updatedAt: String(p.updatedAt ?? p.publishedAt ?? "").slice(0, 10) || dateISO,
    cover,
    coverAlt: coverAlt.en,
    titleId: title.id,
    descriptionId: desc.id,
    coverAltId: coverAlt.id,
  };
}

async function fetchCmsNews() {
  if (!CMS) return [];
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(
      `${CMS}/api/posts?where[status][equals]=published&sort=-publishedAt&limit=100&depth=1&locale=all`,
      { signal: ctrl.signal },
    );
    clearTimeout(timer);
    if (!res.ok) return [];
    const body = await res.json();
    const docs = Array.isArray(body?.docs) ? body.docs : [];
    return docs
      .filter((d) => d && typeof d.slug === "string")
      .map(cmsPost)
      .sort((a, b) => String(b.dateISO).localeCompare(String(a.dateISO)));
  } catch {
    return [];
  }
}

async function loadNews() {
  const fromCms = await fetchCmsNews();
  if (fromCms.length) return { list: fromCms, source: `cms (${fromCms.length} docs)` };
  return { list: loadStaticNews(), source: "static file" };
}

const { list: news, source: newsSource } = await loadNews();
const first = news[0];
const newsLastmod = first ? String(first.updatedAt || first.dateISO).slice(0, 10) : today;

// Base routes (EN paths). Each renders twice: EN + /id/*.
const BASE_ROUTES = [
  { en: "/", key: "home", type: "website", changefreq: "weekly", priority: "1.0", lastmod: today, crumbs: null },
  { en: "/about", key: "about", type: "website", changefreq: "monthly", priority: "0.8", lastmod: today, crumbs: ["home", "about"] },
  { en: "/news", key: "news", type: "website", changefreq: "weekly", priority: "0.8", lastmod: newsLastmod, crumbs: ["home", "news"] },
  { en: "/catalog", key: "catalog", type: "website", changefreq: "weekly", priority: "0.9", lastmod: today, crumbs: ["home", "catalog"] },
  { en: "/music", key: "music", type: "website", changefreq: "monthly", priority: "0.7", lastmod: today, crumbs: ["home", "music"] },
  { en: "/contact", key: "contact", type: "website", changefreq: "monthly", priority: "0.7", lastmod: today, crumbs: ["home", "contact"] },
  { en: "/privacy", key: "privacy", type: "website", changefreq: "yearly", priority: "0.3", lastmod: today, crumbs: ["home", "privacy"] },
  { en: "/terms", key: "terms", type: "website", changefreq: "yearly", priority: "0.3", lastmod: today, crumbs: ["home", "terms"] },
];

const ROUTES = [];
for (const locale of ["en", "id"]) {
  const prefix = locale === "id" ? "/id" : "";
  for (const b of BASE_ROUTES) {
    const path = b.en === "/" ? (locale === "id" ? "/id" : "/") : `${prefix}${b.en}`;
    ROUTES.push({
      path,
      locale,
      title: seo[locale][b.key].title,
      desc: seo[locale][b.key].description,
      type: b.type,
      changefreq: b.changefreq,
      priority: b.priority,
      lastmod: b.lastmod,
      crumbs: b.crumbs
        ? b.crumbs.map((k, i) => ({
            name: crumbs[locale][k],
            path: i === 0 ? "/" : b.en,
          }))
        : null,
    });
  }
  for (const p of news) {
    const hasId = Boolean(p.titleId);
    const useId = locale === "id" && hasId;
    ROUTES.push({
      path: `${prefix}/news/${p.slug}`,
      locale,
      title: `${useId ? p.titleId : p.title}${suffix[locale]}`,
      desc: useId && p.descriptionId ? p.descriptionId : p.description,
      type: "article",
      image: p.cover,
      imageAlt: useId && p.coverAltId ? p.coverAltId : p.coverAlt,
      changefreq: "yearly",
      priority: "0.6",
      lastmod: String(p.updatedAt || p.dateISO).slice(0, 10),
      publishedTime: new Date(p.dateISO).toISOString(),
      crumbs: [
        { name: crumbs[locale].home, path: "/" },
        { name: crumbs[locale].news, path: "/news" },
        { name: useId ? p.titleId : p.title, path: `/news/${p.slug}` },
      ],
      news: p,
      newsId: useId,
    });
  }
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function setTitle(html, title) {
  const t = esc(title);
  return html.includes("<title>")
    ? html.replace(/<title>.*?<\/title>/s, () => `<title>${t}</title>`)
    : html.replace("</head>", () => `<title>${t}</title>\n</head>`);
}

function setMeta(html, attr, key, content) {
  const c = esc(content);
  const re = new RegExp(`<meta\\s+${attr}="${key}"[^>]*>`);
  const tag =
    attr === "property"
      ? `<meta property="${key}" content="${c}" />`
      : `<meta name="${key}" content="${c}" />`;
  return re.test(html) ? html.replace(re, () => tag) : html.replace("</head>", () => `${tag}\n</head>`);
}

function removeMeta(html, attr, key) {
  return html.replace(new RegExp(`<meta\\s+${attr}="${key}"[^>]*>\\n?`), "");
}

function setLink(html, rel, href, hreflang) {
  const sel = hreflang
    ? new RegExp(`<link\\s+rel="${rel}"\\s+hreflang="${hreflang}"[^>]*>`)
    : new RegExp(`<link\\s+rel="${rel}"(?![^>]*hreflang)[^>]*>`);
  const tag = hreflang
    ? `<link rel="${rel}" hreflang="${hreflang}" href="${esc(href)}" />`
    : `<link rel="${rel}" href="${esc(href)}" />`;
  return sel.test(html) ? html.replace(sel, () => tag) : html.replace("</head>", () => `${tag}\n</head>`);
}

function pageJsonLd(route, url) {
  const nodes = [];
  if (route.path === "/" || route.path === "/id") {
    nodes.push(
      {
        "@type": "Organization",
        "@id": `${SITE}/#organization`,
        name: "Kagōunga",
        url: `${SITE}/`,
        logo: LOGO,
        sameAs: [
          "https://www.instagram.com/kagounga.id/",
          "https://www.tiktok.com/@kagounga.id/",
          "https://x.com/kagounga/",
          "https://www.threads.com/@kagounga.id",
          "https://www.youtube.com/@Kagounga",
        ],
      },
      { "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: "Kagōunga", inLanguage: route.locale },
    );
  } else {
    if (route.news) {
      const p = route.news;
      const title = route.newsId ? p.titleId : p.title;
      const desc = route.newsId && p.descriptionId ? p.descriptionId : p.description;
      nodes.push({
        "@type": "NewsArticle",
        headline: title,
        description: desc,
        image: [p.cover],
        inLanguage: route.locale,
        datePublished: new Date(p.dateISO).toISOString(),
        dateModified: new Date(p.updatedAt || p.dateISO).toISOString(),
        author: { "@type": "Organization", name: "Kagōunga", url: `${SITE}/` },
        publisher: { "@type": "Organization", name: "Kagōunga", logo: { "@type": "ImageObject", url: LOGO } },
        mainEntityOfPage: url,
      });
    }
    if (route.crumbs) {
      nodes.push({
        "@type": "BreadcrumbList",
        itemListElement: route.crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          item: c.path === "/" ? `${SITE}/` : `${SITE}${c.path}`,
        })),
      });
    }
  }
  return { "@context": "https://schema.org", "@graph": nodes };
}

function renderRoute(template, route) {
  const url = `${SITE}${route.path}`;
  const enPath = route.path.replace(/^\/id(?=\/|$)/, "") || "/";
  const enUrl = `${SITE}${enPath}`;
  const idUrl = `${SITE}${enPath === "/" ? "/id" : `/id${enPath}`}`;
  const img = route.image || OG_DEFAULT;
  const localeTag = route.locale === "id" ? "id_ID" : "en_US";
  const altTag = route.locale === "id" ? "en_US" : "id_ID";
  let html = template.replace(/<html\s+lang="[^"]*"/, `<html lang="${route.locale}"`);
  html = setTitle(html, route.title);
  html = setMeta(html, "name", "description", route.desc);
  html = setLink(html, "canonical", url);
  html = setLink(html, "alternate", enUrl, "en");
  html = setLink(html, "alternate", idUrl, "id");
  html = setLink(html, "alternate", enUrl, "x-default");
  html = setMeta(html, "property", "og:type", route.type);
  html = setMeta(html, "property", "og:locale", localeTag);
  html = setMeta(html, "property", "og:locale:alternate", altTag);
  html = setMeta(html, "property", "og:site_name", "Kagōunga");
  html = setMeta(html, "property", "og:title", route.title);
  html = setMeta(html, "property", "og:description", route.desc);
  html = setMeta(html, "property", "og:url", url);
  html = setMeta(html, "property", "og:image", img);
  html = setMeta(html, "property", "og:image:width", "1200");
  html = setMeta(html, "property", "og:image:height", "630");
  html = setMeta(html, "property", "og:image:alt", route.imageAlt || route.title);
  html = setMeta(html, "name", "twitter:card", "summary_large_image");
  html = setMeta(html, "name", "twitter:title", route.title);
  html = setMeta(html, "name", "twitter:description", route.desc);
  html = setMeta(html, "name", "twitter:image", img);
  html = setMeta(html, "name", "twitter:image:alt", route.imageAlt || route.title);
  html =
    route.type === "article" && route.publishedTime
      ? setMeta(html, "property", "article:published_time", route.publishedTime)
      : removeMeta(html, "property", "article:published_time");
  html = html.replace(/<script\s+id="kga-jsonld-page"[^>]*>.*?<\/script>\n?/s, "");
  const ld = `<script type="application/ld+json">${JSON.stringify(pageJsonLd(route, url))}</script>`;
  html = html.replace("</head>", () => `${ld}\n</head>`);
  return html;
}

function xmlEsc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildSitemaps() {
  const urls = ROUTES.map(
    (r) =>
      `  <url><loc>${xmlEsc(`${SITE}${r.path}`)}</loc><lastmod>${r.lastmod}</lastmod><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`,
  ).join("\n");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  const imgUrls = [
    `  <url><loc>${xmlEsc(`${SITE}/`)}</loc><image:image><image:loc>${xmlEsc(OG_DEFAULT)}</image:loc><image:title>${xmlEsc(seo.en.home.title)}</image:title></image:image></url>`,
    ...ROUTES.filter((r) => r.news).map(
      (r) =>
        `  <url><loc>${xmlEsc(`${SITE}${r.path}`)}</loc><image:image><image:loc>${xmlEsc(r.image)}</image:loc><image:title>${xmlEsc(r.title)}</image:title></image:image></url>`,
    ),
  ].join("\n");
  const imgSitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${imgUrls}\n</urlset>\n`;

  for (const dir of [PUBLIC, DIST]) {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "sitemap.xml"), sitemap);
    writeFileSync(join(dir, "sitemap-images.xml"), imgSitemap);
  }
}

if (!existsSync(TEMPLATE)) {
  console.error(`seo-build: template missing: ${TEMPLATE} (run vite build first)`);
  process.exit(1);
}
const template = readFileSync(TEMPLATE, "utf8");
for (const route of ROUTES) {
  const html = renderRoute(template, route);
  const out = route.path === "/" ? join(DIST, "index.html") : join(DIST, route.path, "index.html");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
}
buildSitemaps();
console.log(`seo-build: ${ROUTES.length} pages, sitemap + sitemap-images written (SITE=${SITE}, news=${newsSource})`);
