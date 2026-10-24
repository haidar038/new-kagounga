import type { Locale } from "../i18n";
import type { CmsProduct } from "../lib/cms";
import { isCmsProduct, pickLocale } from "../lib/cms";
import raw from "./productPageCopy.json";
import cmsSnapshot from "./cms-products.generated.json";

export interface ProductPageCopy {
  intro: string[];
  usage: string;
  sourcing: string;
}

/**
 * Long-form copy stays in JSON so the CMS seed and the static fallback read the
 * same source. The shape mirrors the old `ProductPageCopy` and SEO title maps.
 */
const STATIC_COPY = raw.pages as Record<string, Record<Locale, ProductPageCopy>>;
const STATIC_SEO_TITLES = raw.seoTitles as Record<string, Record<Locale, string>>;
const CMS_PRODUCTS = (Array.isArray(cmsSnapshot) ? cmsSnapshot : []).filter(
  isCmsProduct,
) as CmsProduct[];

/** Unique search-facing titles; product names alone are too thin for ID SERP. */
export const PRODUCT_SEO_TITLES = STATIC_SEO_TITLES;
/** Search-facing meta descriptions; one-line blurbs alone are too thin (120-160 chars). */
const STATIC_SEO_DESCRIPTIONS = raw.seoDescriptions as Record<
  string,
  Record<Locale, string>
>;
export const PRODUCT_SEO_DESCRIPTIONS = STATIC_SEO_DESCRIPTIONS;
export const PRODUCT_PAGE_COPY = STATIC_COPY;

function findCmsProduct(id: string): CmsProduct | undefined {
  return CMS_PRODUCTS.find((doc) => doc.slug === id);
}

/** CMS product page fields -> the exact shape consumed by ProductPage. */
export function toProductPageCopy(
  doc: CmsProduct,
  locale: Locale,
): ProductPageCopy | null {
  const intro = pickLocale(doc.intro, locale).value;
  const usage = pickLocale(doc.usage, locale).value;
  const sourcing = pickLocale(doc.sourcing, locale).value;
  if (!Array.isArray(intro) || intro.length === 0) return null;
  if (typeof usage !== "string" || !usage.trim()) return null;
  if (typeof sourcing !== "string" || !sourcing.trim()) return null;
  const paragraphs = intro.filter(
    (paragraph): paragraph is string =>
      typeof paragraph === "string" && paragraph.trim().length > 0,
  );
  if (paragraphs.length === 0) return null;
  return { intro: paragraphs, usage, sourcing };
}

export function toProductSeoTitle(
  doc: CmsProduct,
  locale: Locale,
): string | null {
  const title = pickLocale(doc.seoTitle, locale).value;
  return typeof title === "string" && title.trim() ? title : null;
}

export function getProductPageCopy(
  id: string,
  locale: Locale,
): ProductPageCopy | null {
  const doc = findCmsProduct(id);
  if (doc) {
    const copy = toProductPageCopy(doc, locale);
    if (copy) return copy;
  }
  return STATIC_COPY[id]?.[locale] ?? null;
}

export function getProductSeoTitle(
  id: string,
  locale: Locale,
): string | null {
  const doc = findCmsProduct(id);
  if (doc) {
    const title = toProductSeoTitle(doc, locale);
    if (title) return title;
  }
  return STATIC_SEO_TITLES[id]?.[locale] ?? null;
}

/** CMS `seoDescription` -> string, or null when absent. */
export function toProductSeoDescription(
  doc: CmsProduct,
  locale: Locale,
): string | null {
  const desc = pickLocale(doc.seoDescription, locale).value;
  return typeof desc === "string" && desc.trim() ? desc : null;
}

export function getProductSeoDescription(
  id: string,
  locale: Locale,
): string | null {
  const doc = findCmsProduct(id);
  if (doc) {
    const desc = toProductSeoDescription(doc, locale);
    if (desc) return desc;
  }
  return STATIC_SEO_DESCRIPTIONS[id]?.[locale] ?? null;
}

/** Map export for the SEO build; includes CMS products, falls back to static. */
export function getProductSeoDescriptions(): Record<
  string,
  Record<Locale, string>
> {
  const ids = new Set([
    ...Object.keys(STATIC_SEO_DESCRIPTIONS),
    ...CMS_PRODUCTS.map((doc) => doc.slug),
  ]);
  const descriptions: Record<string, Record<Locale, string>> = {};
  for (const id of ids) {
    const en = getProductSeoDescription(id, "en");
    const localized = getProductSeoDescription(id, "id");
    if (en && localized) descriptions[id] = { en, id: localized };
  }
  return descriptions;
}

/** Map export for the SEO build; includes CMS products, falls back to static. */
export function getProductSeoTitles(): Record<string, Record<Locale, string>> {
  const ids = new Set([
    ...Object.keys(STATIC_SEO_TITLES),
    ...CMS_PRODUCTS.map((doc) => doc.slug),
  ]);
  const titles: Record<string, Record<Locale, string>> = {};
  for (const id of ids) {
    const en = getProductSeoTitle(id, "en");
    const localized = getProductSeoTitle(id, "id");
    if (en && localized) titles[id] = { en, id: localized };
  }
  return titles;
}

/** True when a detail page can render for this product id. */
export function hasProductPage(id: string): boolean {
  const doc = findCmsProduct(id);
  if (doc && (toProductPageCopy(doc, "en") || toProductPageCopy(doc, "id"))) {
    return true;
  }
  return Boolean(STATIC_COPY[id]);
}
