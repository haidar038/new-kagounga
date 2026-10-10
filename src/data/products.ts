import type { ProductDetail } from "../types/content";
import type { Locale } from "../i18n";
import { cld } from "../lib/cloudinary";
import { orderMessage, waLink } from "../lib/whatsapp";
import type { CmsProduct, CmsSource } from "../lib/cms";
import {
  CMS_URL,
  fetchCmsDocs,
  formatPrice,
  isCmsProduct,
  productsUrl,
  resolveCmsImage,
} from "../lib/cms";
import idCatalog from "../locales/id/catalog.json";

function order(productName: string, locale: Locale = "en"): string {
  return waLink(orderMessage(productName, locale));
}

export const PRODUCTS: ProductDetail[] = [
  {
    id: "popeda",
    name: "Popeda Soup",
    image: cld("popeda-soup.webp", 800),
    alt: "Popeda Soup",
    blurb:
      "Silky instant sago with savory turmeric fish soup. Ready in 5 minutes.",
    badges: ["Net 50 g", "Halal certified", "12-month shelf life"],
    price: "$2.53",
    eyebrow: "Popeda Instant · 50 g per box",
    specs: [
      { label: "Dimensions", value: "10 × 4 × 6.5 cm" },
      { label: "Packaging", value: "Ivory 350 g, matte laminated, tuck-top" },
      { label: "Net weight", value: "50 g" },
      { label: "Gross weight", value: "60 g" },
      { label: "Origin", value: "Ternate, North Maluku, Indonesia" },
      { label: "HS Code", value: "1901.90.99" },
      {
        label: "Certification",
        value: "Halal Indonesia (ID82410021232450325)",
      },
    ],
    insideTitle: "Inside the box",
    inside: [
      "Sago starch",
      "Turmeric fish soup pasta",
      "Dry fish",
      "Dry vegetables",
      "Serving suggestions",
      "1 pcs collectible artwork",
    ],
    note: "100% natural ingredients, no preservatives, shelf life up to 12 months post-production.",
    per: "/ box",
  },
  {
    id: "sago",
    name: "Sago Starch",
    image: cld("sagu-starch.webp", 800),
    alt: "Sago Starch",
    blurb:
      "Pure sago starch from North Moluccan palms. The base of every popeda.",
    badges: ["Net 1 kg", "Halal certified", "24-month shelf life"],
    price: "$0.84",
    eyebrow: "Sago Starch · 1 kg per pouch",
    specs: [
      { label: "Dimensions", value: "16 × 24 cm" },
      { label: "Packaging", value: "PE pouch, food grade" },
      { label: "Net weight", value: "1.000 g (1 kg)" },
      { label: "Gross weight", value: "1.010 g" },
      { label: "Origin", value: "Ternate, North Maluku, Indonesia" },
      { label: "HS Code", value: "1108.19.10" },
      {
        label: "Certification",
        value: "Halal Indonesia (ID82410021232450325)",
      },
    ],
    insideTitle: null,
    inside: null,
    note: "100% natural ingredients, no preservatives, shelf life up to 24 months post-production.",
    per: "/ pouch",
  },
  {
    id: "tuna",
    name: "Dried Tuna",
    image: cld("driedtuna.webp", 800),
    alt: "Dried Tuna",
    blurb: "Premium dried tuna with intense flavor for cooking and beverages.",
    badges: ["Net 100 g", "Wild-caught", "12-month shelf life"],
    price: "$15",
    eyebrow: "Dried Tuna · 100 g per pouch",
    specs: [
      { label: "Dimensions", value: "14 × 20 cm" },
      { label: "Packaging", value: "Resealable pouch, food grade" },
      { label: "Net weight", value: "100 g" },
      { label: "Gross weight", value: "110 g" },
      { label: "Origin", value: "Ternate, North Maluku, Indonesia" },
    ],
    insideTitle: null,
    inside: null,
    note: "Wild-caught tuna, cleaned and sun-dried. No preservatives. Ready for soups and sambal.",
    per: "/ pouch",
  },
  {
    id: "seasoning",
    name: "Turmeric Fish Seasoning",
    image: cld("kunyit.webp", 800),
    alt: "Turmeric Fish Seasoning",
    blurb:
      "A vibrant blend of turmeric and other spices, perfect for adding a burst of flavor to your fish dishes.",
    badges: ["Net 50 g", "Small-batch", "12-month shelf life"],
    price: "$20",
    eyebrow: "Turmeric Fish Seasoning · 50 g per pack",
    specs: [
      { label: "Packaging", value: "Sealed pack, food grade" },
      { label: "Net weight", value: "50 g" },
      { label: "Gross weight", value: "60 g" },
      { label: "Origin", value: "Ternate, North Maluku, Indonesia" },
    ],
    insideTitle: "Blended with",
    inside: ["Turmeric", "Dried fish powder", "Sea salt", "Mixed spices"],
    note: "Stir into hot water or broth for an instant turmeric fish soup base.",
    per: "/ pack",
  },
  {
    id: "kenari",
    name: "Kenari Nut",
    image: cld("kenari-nut.webp", 800),
    alt: "Kenari Nut",
    blurb:
      "Buttery native kenari nuts, rich in flavor and harvested locally.",
    badges: ["Net 200 g", "Roasted", "12-month shelf life"],
    price: "$10",
    eyebrow: "Kenari Nut · 200 g per pouch",
    specs: [
      { label: "Packaging", value: "Resealable pouch, food grade" },
      { label: "Net weight", value: "200 g" },
      { label: "Gross weight", value: "210 g" },
      { label: "Origin", value: "Ternate, North Maluku, Indonesia" },
    ],
    insideTitle: "Roasted with",
    inside: ["Roasted kenari nuts", "Sea salt"],
    note: "Buttery native nuts, roasted and lightly salted. Ready to snack.",
    per: "/ pouch",
  },
  {
    id: "telang",
    name: "Butterfly Pea Flower",
    image: cld("bungatelang.webp", 800),
    alt: "Butterfly Pea Flower",
    blurb:
      "Dried butterfly pea flowers for vibrant blue teas and natural coloring.",
    badges: ["Net 50 g", "Sun-dried", "12-month shelf life"],
    price: "$10",
    eyebrow: "Butterfly Pea Flower · 50 g per pouch",
    specs: [
      { label: "Packaging", value: "Resealable pouch, food grade" },
      { label: "Net weight", value: "50 g" },
      { label: "Gross weight", value: "60 g" },
      { label: "Origin", value: "Ternate, North Maluku, Indonesia" },
    ],
    insideTitle: "Contents",
    inside: ["Dried butterfly pea flowers"],
    note: "Steep for natural blue tea. Turns purple with a splash of calamansi.",
    per: "/ pouch",
  },
  {
    id: "pala",
    name: "Nutmeg / Mace",
    image: cld("palafuli.webp", 800),
    alt: "Nutmeg / Mace",
    blurb: "Aromatic nutmeg and mace, the legendary spice of the Moluccas.",
    badges: ["Net 100 g", "Single-origin", "24-month shelf life"],
    price: "$10",
    eyebrow: "Nutmeg / Mace · 100 g per pouch",
    specs: [
      { label: "Packaging", value: "Resealable pouch, food grade" },
      { label: "Net weight", value: "100 g" },
      { label: "Gross weight", value: "110 g" },
      { label: "Origin", value: "Ternate, North Maluku, Indonesia" },
    ],
    insideTitle: "Contents",
    inside: ["Whole nutmeg", "Mace (fuli)"],
    note: "Sun-dried whole spices from Moluccan groves. The legendary Spice Islands pair.",
    per: "/ pouch",
  },
  {
    id: "cengkeh",
    name: "Clove",
    image: cld("cengkih.webp", 800),
    alt: "Clove",
    blurb:
      "Premium dried cloves with intense aroma for cooking and beverages.",
    badges: ["Net 100 g", "Sun-dried", "24-month shelf life"],
    price: "$10",
    eyebrow: "Clove · 100 g per pouch",
    specs: [
      { label: "Packaging", value: "Resealable pouch, food grade" },
      { label: "Net weight", value: "100 g" },
      { label: "Gross weight", value: "110 g" },
      { label: "Origin", value: "Ternate, North Maluku, Indonesia" },
    ],
    insideTitle: "Contents",
    inside: ["Whole dried cloves"],
    note: "Hand-picked buds, sun-dried for intense aroma. For cooking and beverages.",
    per: "/ pouch",
  },
];

export function orderHref(productName: string, locale: Locale = "en"): string {
  return order(productName, locale);
}

type ProductOverlay = {
  blurb?: string;
  eyebrow?: string;
  badges?: string[];
  specs?: Array<{ label: string; value: string }>;
  insideTitle?: string | null;
  inside?: string[] | null;
  note?: string;
  per?: string;
};

const ID_OVERLAYS = (idCatalog as { products?: Record<string, ProductOverlay> })
  .products ?? {};

/** EN base from TS + ID overlay from locales. Unknown keys fall back to EN. */
export function getProducts(locale: Locale): ProductDetail[] {
  if (locale !== "id") return PRODUCTS;
  return PRODUCTS.map(withIdOverlay);
}

/** Terapkan overlay ID ke satu produk (dipakai juga adapter CMS, transisi sampai Products dilokalkan). */
export function withIdOverlay(p: ProductDetail): ProductDetail {
  return { ...p, ...(ID_OVERLAYS[p.id] ?? {}) };
}

/** Dokumen CMS -> `ProductDetail`. Locale ID pakai overlay statis (CMS EN-master, transisi). */
export function toProductDetail(doc: CmsProduct, locale: Locale, baseUrl: string): ProductDetail {
  const base: ProductDetail = {
    id: doc.slug,
    name: doc.title,
    image: resolveCmsImage(doc.image, doc.imageUrl, baseUrl),
    alt: doc.alt || doc.title,
    blurb: doc.excerpt ?? "",
    badges: doc.badges ?? [],
    price: formatPrice(doc.priceNumber, doc.currency),
    eyebrow: doc.eyebrow ?? "",
    specs: (doc.specs ?? []).map((s) => ({ label: s.label, value: s.value })),
    insideTitle: doc.insideTitle ?? null,
    inside: doc.inside ?? null,
    note: doc.note ?? "",
    per: doc.per ?? "",
  };
  return locale === "id" ? withIdOverlay(base) : base;
}

/**
 * Muat katalog: CMS dulu, gagal/kosong/tanpa URL -> fallback statis. Tak pernah throw.
 */
export async function loadProducts(
  locale: Locale,
  fallback: ProductDetail[],
  baseUrl: string = CMS_URL,
): Promise<{ items: ProductDetail[]; source: CmsSource }> {
  if (!baseUrl) return { items: fallback, source: "static" };
  const docs = (await fetchCmsDocs(productsUrl(baseUrl))).filter(isCmsProduct);
  if (docs.length === 0) return { items: fallback, source: "static" };
  return { items: docs.map((d) => toProductDetail(d, locale, baseUrl)), source: "cms" };
}
