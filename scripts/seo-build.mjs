// SEO build: sitemap + image sitemap + per-route prerendered HTML (EN + ID).
// Run AFTER `vite build`: reads dist/index.html as template, writes
// dist/<route>/index.html with final head tags so crawlers / social scrapers
// see full meta without JS. No external bot, no extra deps.
// Copy source of truth: src/locales/{en,id}/seo.json + news.json (Id fields).
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

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
// Hero LCP candidates - must match src/features/home/Hero.tsx srcSet exactly so
// the preload is reused instead of triggering a second fetch.
const HERO_SRCSET = [640, 960, 1280, 1920]
  .map((w) => `https://res.cloudinary.com/fal5otmd/image/upload/f_webp,q_55,w_${w}/hero-bg-nature.webp ${w}w`)
  .join(", ");
const LOGO =
  "https://res.cloudinary.com/fal5otmd/image/upload/f_auto,q_auto/logo-primary-emblem.svg";
const today = new Date().toISOString().slice(0, 10);

/** Absolute media URL. CMS may return relative paths or absolute Cloudinary URLs. */
function absMedia(value) {
  let s = String(value ?? "").trim();
  if (!s) return "";
  // Legacy CMS export wrote `${CMS}https://…`; keep only the nested absolute URL.
  if (CMS && s.startsWith(`${CMS}http`)) s = s.slice(CMS.length);
  if (/^https?:\/\//i.test(s)) return s;
  if (!CMS) return s;
  return `${CMS}${s.startsWith("/") ? "" : "/"}${s}`;
}

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
  const featured =
    p.featuredImage && typeof p.featuredImage === "object" && p.featuredImage.url
      ? p.featuredImage.url
      : "";
  const cover = absMedia(p.coverUrl) || absMedia(featured);
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

const FALLBACK_CONTACT = {
  email: "hello@kagounga.com",
  phoneLabel: "+62 811-1538-111",
  address: ["Jl. Raya Pertamina, No.800, Jambula", "Ternate, Indonesia, 97751"],
};
const FALLBACK_SOCIALS = [
  "https://www.instagram.com/kagounga.id/",
  "https://www.tiktok.com/@kagounga.id/",
  "https://x.com/kagounga/",
  "https://www.threads.com/@kagounga.id",
  "https://www.youtube.com/@Kagounga",
];

/** Create one Vite SSR server for schema data + route body prerendering. */
async function createSsrServer() {
  return createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "silent",
  });
}

/** Load typed site data through Vite so schema matches the app, without duplicating it. */
async function loadSchemaData(server) {
  try {
    const [
      productsMod,
      siteMod,
      tracksMod,
      stockistMod,
      productContentMod,
    ] = await Promise.all([
      server.ssrLoadModule("/src/data/products.ts"),
      server.ssrLoadModule("/src/data/site.ts"),
      server.ssrLoadModule("/src/data/tracks.ts"),
      server.ssrLoadModule("/src/data/stockists.ts"),
      server.ssrLoadModule("/src/data/productContent.ts"),
    ]);
    return {
      products: {
        en: productsMod.getProducts("en"),
        id: productsMod.getProducts("id"),
      },
      contact: siteMod.CONTACT,
      socials: siteMod.SOCIALS.map((s) => s.href),
      tracks: tracksMod.TRACKS,
      stockistCities: {
        en: stockistMod.getStockistCities("en"),
        id: stockistMod.getStockistCities("id"),
      },
      productSeo: productContentMod.getProductSeoTitles(),
      productSeoDesc: productContentMod.getProductSeoDescriptions(),
    };
  } catch (error) {
    console.warn(`seo-build: schema data unavailable (${error.message})`);
    return {
      products: { en: [], id: [] },
      contact: null,
      socials: [],
      tracks: [],
      stockistCities: { en: [], id: [] },
      productSeo: {},
      productSeoDesc: {},
    };
  }
}

let ssrServer;
try {
  ssrServer = await createSsrServer();
} catch (error) {
  console.warn(`seo-build: Vite SSR unavailable (${error.message})`);
}
const schemaData = ssrServer
  ? await loadSchemaData(ssrServer)
  : {
      products: { en: [], id: [] },
      contact: null,
      socials: [],
      tracks: [],
      stockistCities: { en: [], id: [] },
      productSeo: {},
      productSeoDesc: {},
    };
let renderRouteBody = null;
if (ssrServer) {
  try {
    const mod = await ssrServer.ssrLoadModule("/src/entry-server.tsx");
    renderRouteBody = mod.render;
  } catch (error) {
    console.warn(`seo-build: body prerender unavailable (${error.message})`);
  }
}
const first = news[0];
const newsLastmod = first ? String(first.updatedAt || first.dateISO).slice(0, 10) : today;

// Base routes (EN paths). Each renders twice: EN + /id/*.
const BASE_ROUTES = [
  { en: "/", key: "home", type: "website", changefreq: "weekly", priority: "1.0", lastmod: today, crumbs: null },
  { en: "/about", key: "about", type: "website", changefreq: "monthly", priority: "0.8", lastmod: today, crumbs: ["home", "about"] },
  { en: "/news", key: "news", type: "website", changefreq: "weekly", priority: "0.8", lastmod: newsLastmod, crumbs: ["home", "news"] },
  { en: "/catalog", key: "catalog", type: "website", changefreq: "weekly", priority: "0.9", lastmod: today, crumbs: ["home", "catalog"] },
  { en: "/artworks", key: "artworks", type: "website", changefreq: "monthly", priority: "0.7", lastmod: today, crumbs: ["home", "artworks"] },
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
      key: b.key,
      title: seo[locale][b.key].title,
      desc: seo[locale][b.key].description,
      type: b.type,
      changefreq: b.changefreq,
      priority: b.priority,
      lastmod: b.lastmod,
      crumbs: b.crumbs
        ? b.crumbs.map((k, i) => ({
            name: crumbs[locale][k],
            path:
              i === 0
                ? locale === "id"
                  ? "/id"
                  : "/"
                : `${prefix}${b.en}`,
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
        { name: crumbs[locale].home, path: locale === "id" ? "/id" : "/" },
        { name: crumbs[locale].news, path: `${prefix}/news` },
        {
          name: useId ? p.titleId : p.title,
          path: `${prefix}/news/${p.slug}`,
        },
      ],
      news: p,
      newsId: useId,
    });
  }
  for (const p of schemaData.products[locale] ?? []) {
    ROUTES.push({
      path: `${prefix}/catalog/${p.id}`,
      locale,
      key: "product",
      title:
        schemaData.productSeo?.[p.id]?.[locale] ?? `${p.name} | Kagōunga`,
      desc: schemaData.productSeoDesc?.[p.id]?.[locale] ?? p.blurb,
      type: "website",
      image: p.image,
      imageAlt: p.alt,
      imageWidth: "800",
      imageHeight: "800",
      changefreq: "monthly",
      priority: "0.7",
      lastmod: today,
      crumbs: [
        { name: crumbs[locale].home, path: locale === "id" ? "/id" : "/" },
        { name: crumbs[locale].catalog, path: `${prefix}/catalog` },
        { name: p.name, path: `${prefix}/catalog/${p.id}` },
      ],
      product: p,
    });
  }
  for (const city of schemaData.stockistCities[locale] ?? []) {
    if (!city.copy || city.points.length === 0) continue;
    ROUTES.push({
      path: `${prefix}/stockists/${city.slug}`,
      locale,
      key: "stockist",
      title: city.copy.seoTitle,
      desc: city.copy.description,
      type: "website",
      image: OG_DEFAULT,
      imageAlt: city.copy.title,
      changefreq: "monthly",
      priority: "0.6",
      lastmod: today,
      crumbs: [
        { name: crumbs[locale].home, path: locale === "id" ? "/id" : "/" },
        { name: crumbs[locale].contact, path: `${prefix}/contact` },
        { name: city.city, path: `${prefix}/stockists/${city.slug}` },
      ],
      city: city.city,
      citySlug: city.slug,
      points: city.points,
      region: city.region,
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

function priceOf(display) {
  const match = String(display ?? "").match(/\d+(?:[.,]\d+)?/);
  if (!match) return null;
  const value = Number(match[0].replace(",", "."));
  return Number.isFinite(value) ? value : null;
}

function contactOf(data) {
  return data.contact ?? FALLBACK_CONTACT;
}

function socialsOf(data) {
  return data.socials.length ? data.socials : FALLBACK_SOCIALS;
}

function organizationNode(data) {
  const contact = contactOf(data);
  return {
    "@type": "Organization",
    "@id": `${SITE}/#organization`,
    name: "Kagōunga",
    url: `${SITE}/`,
    logo: { "@type": "ImageObject", url: LOGO },
    image: LOGO,
    email: contact.email,
    telephone: contact.phoneLabel,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address[0],
      addressLocality: "Ternate",
      addressRegion: "North Maluku",
      postalCode: "97751",
      addressCountry: "ID",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: contact.email,
        telephone: contact.phoneLabel,
        areaServed: "ID",
        availableLanguage: ["en", "id"],
      },
    ],
    sameAs: socialsOf(data),
  };
}

function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: `${SITE}/`,
    name: "Kagōunga",
    publisher: { "@id": `${SITE}/#organization` },
    inLanguage: ["en", "id"],
  };
}

function webPageNode(route, url) {
  return {
    "@type": "WebPage",
    "@id": url,
    url,
    name: route.title,
    description: route.desc,
    inLanguage: route.locale,
    isPartOf: { "@id": `${SITE}/#website` },
    about: { "@id": `${SITE}/#organization` },
  };
}

function breadcrumbNode(route, url) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: route.crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE}${c.path}`,
    })),
  };
}

function productListNode(route, url, data) {
  const products = data.products[route.locale] ?? [];
  return {
    "@type": "ItemList",
    "@id": `${url}#products`,
    name:
      route.locale === "id"
        ? "Katalog produk Kagōunga"
        : "Kagōunga product catalog",
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => {
      const price = priceOf(p.price);
      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          "@id": `${url}#${p.id}`,
          name: p.name,
          image: p.image,
          description: p.blurb,
          sku: p.id,
          brand: { "@type": "Brand", name: "Kagōunga" },
          ...(price == null
            ? {}
            : {
                offers: {
                  "@type": "Offer",
                  price,
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
                  url: `${url}#${p.id}`,
                  seller: { "@id": `${SITE}/#organization` },
                },
              }),
        },
      };
    }),
  };
}

function productNode(route, url) {
  const p = route.product;
  const price = priceOf(p.price);
  return {
    "@type": "Product",
    "@id": `${url}#product`,
    name: p.name,
    url,
    image: [p.image],
    description: p.blurb,
    sku: p.id,
    brand: { "@type": "Brand", name: "Kagōunga" },
    ...(price == null
      ? {}
      : {
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url,
            seller: { "@id": `${SITE}/#organization` },
          },
        }),
  };
}

function stockistListNode(route, url) {
  const name =
    route.locale === "id"
      ? `Stockist Kagōunga di ${route.city}`
      : `Kagōunga stockists in ${route.city}`;
  return {
    "@type": "ItemList",
    "@id": `${url}#stockists`,
    name,
    numberOfItems: route.points.length,
    itemListElement: route.points.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Store",
        "@id": `${url}#${p.id}`,
        name: p.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: p.area,
          addressLocality: p.city,
          addressRegion: route.region,
          addressCountry: "ID",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: p.lat,
          longitude: p.lng,
        },
        branchOf: { "@id": `${SITE}/#organization` },
      },
    })),
  };
}

function newsListNode(route, url) {
  const prefix = route.locale === "id" ? "/id" : "";
  return {
    "@type": "ItemList",
    "@id": `${url}#news`,
    name: route.locale === "id" ? "Berita Kagōunga" : "Kagōunga news",
    numberOfItems: news.length,
    itemListElement: news.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE}${prefix}/news/${p.slug}`,
      name: route.locale === "id" && p.titleId ? p.titleId : p.title,
    })),
  };
}

function articleNode(route, url) {
  const p = route.news;
  const title = route.newsId ? p.titleId : p.title;
  const desc = route.newsId && p.descriptionId ? p.descriptionId : p.description;
  const image = route.image || OG_DEFAULT;
  return {
    "@type": "NewsArticle",
    "@id": `${url}#article`,
    headline: title,
    description: desc,
    image: [image],
    inLanguage: route.locale,
    datePublished: new Date(p.dateISO).toISOString(),
    dateModified: new Date(p.updatedAt || p.dateISO).toISOString(),
    author: { "@id": `${SITE}/#organization` },
    publisher: { "@id": `${SITE}/#organization` },
    isPartOf: { "@id": `${SITE}/#website` },
    mainEntityOfPage: { "@id": url },
    breadcrumb: { "@id": `${url}#breadcrumb` },
  };
}

function musicGroupNode(url, tracks) {
  return {
    "@type": "MusicGroup",
    "@id": `${SITE}/#musicgroup`,
    name: "Kagōunga",
    url,
    track: tracks.map((track) => ({
      "@type": "MusicRecording",
      name: track.title,
      byArtist: { "@type": "MusicGroup", name: "Kagōunga" },
    })),
  };
}

function localBusinessNode(url, data) {
  const contact = contactOf(data);
  return {
    "@type": "LocalBusiness",
    "@id": `${SITE}/#localbusiness`,
    name: "Kagōunga Head Office",
    url,
    image: LOGO,
    email: contact.email,
    telephone: contact.phoneLabel,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address[0],
      addressLocality: "Ternate",
      addressRegion: "North Maluku",
      postalCode: "97751",
      addressCountry: "ID",
    },
    parentOrganization: { "@id": `${SITE}/#organization` },
    sameAs: socialsOf(data),
  };
}

function pageJsonLd(route, url, data) {
  const nodes = [
    organizationNode(data),
    websiteNode(),
    webPageNode(route, url),
  ];
  if (route.key === "catalog") nodes.push(productListNode(route, url, data));
  if (route.key === "product" && route.product) nodes.push(productNode(route, url));
  if (route.key === "stockist" && route.points) nodes.push(stockistListNode(route, url));
  if (route.key === "contact") nodes.push(localBusinessNode(url, data));
  if (route.key === "music") nodes.push(musicGroupNode(url, data.tracks));
  if (route.key === "news" && !route.news) nodes.push(newsListNode(route, url));
  if (route.news) nodes.push(articleNode(route, url));
  if (route.crumbs) nodes.push(breadcrumbNode(route, url));
  return { "@context": "https://schema.org", "@graph": nodes };
}

function renderRoute(template, route, body = "") {
  const url = `${SITE}${route.path}`;
  const enPath = route.path.replace(/^\/id(?=\/|$)/, "") || "/";
  const enUrl = `${SITE}${enPath}`;
  const idUrl = `${SITE}${enPath === "/" ? "/id" : `/id${enPath}`}`;
  const img = route.image || OG_DEFAULT;
  const localeTag = route.locale === "id" ? "id_ID" : "en_US";
  const altTag = route.locale === "id" ? "en_US" : "id_ID";
  let html = template.replace(/<html\s+lang="[^"]*"/, `<html lang="${route.locale}"`);
  // Homepage-only: start the LCP hero download before the prerendered body is
  // scanned. Other routes must not pay for an image they never show.
  if (route.path === "/" || route.path === "/id") {
    html = html.replace(
      "</head>",
      () => `<link rel="preload" as="image" imagesrcset="${HERO_SRCSET}" imagesizes="100vw" fetchpriority="high" />\n</head>`,
    );
  }
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
  html = setMeta(html, "property", "og:image:width", route.imageWidth || "1200");
  html = setMeta(html, "property", "og:image:height", route.imageHeight || "630");
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
  const ld = `<script id="kga-jsonld-page" type="application/ld+json">${JSON.stringify(pageJsonLd(route, url, schemaData))}</script>`;
  html = html.replace("</head>", () => `${ld}\n</head>`);
  if (body) {
    html = html.replace(
      '<div id="root"></div>',
      () => `<div id="root">${body}</div>`,
    );
  }
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
    ...ROUTES.filter((r) => r.news && r.image).map(
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
  let body = "";
  if (renderRouteBody) {
    try {
      body = await renderRouteBody(route.path);
    } catch (error) {
      console.warn(`seo-build: body prerender failed ${route.path} (${error.message})`);
    }
  }
  const html = inlineStylesheets(renderRoute(template, route, body));
  const out = route.path === "/" ? join(DIST, "index.html") : join(DIST, route.path, "index.html");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
}
await ssrServer?.close();

// Vercel serves dist/404.html (status 404) for unmatched paths. It boots the
// SPA so the React catch-all still renders, but without canonical/hreflang.
function render404(templateHtml) {
  let html = templateHtml;
  html = setTitle(html, "Not Found | Kagōunga");
  html = setMeta(html, "name", "description", "The page you are looking for does not exist.");
  html = setMeta(html, "name", "robots", "noindex, nofollow");
  html = html.replace(/<link\s+rel="canonical"[^>]*>\n?/, "");
  html = html.replace(/<link\s+rel="alternate"[^>]*>\n?/g, "");
  html = html.replace(/<meta\s+property="og:url"[^>]*>\n?/, "");
  return html;
}

// The main CSS bundle is render-blocking (~600ms est on slow 4G). Inlining it
// into the 48 prerendered pages removes that request from the critical path;
// the file stays in dist/assets for SPA navigations and repeat full loads.
function inlineStylesheets(html) {
  return html.replace(
    /<link\s+rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>\n?/g,
    (match, href) => {
      const file = join(DIST, href.replace(/^\//, "").split("?")[0]);
      if (!existsSync(file)) {
        console.warn(`seo-build: css not inlined (missing): ${href}`);
        return match;
      }
      const css = readFileSync(file, "utf8").replace(/<\/style/gi, "<\\/style");
      return `<style>${css}</style>\n`;
    },
  );
}

writeFileSync(join(DIST, "404.html"), inlineStylesheets(render404(template)));
buildSitemaps();
console.log(
  `seo-build: ${ROUTES.length} pages + 404.html, sitemap + sitemap-images written (SITE=${SITE}, news=${newsSource})`,
);
