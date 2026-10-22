/**
 * Transport CMS (Payload) + tipe DTO cermin `kagounga-cms/src/payload-types.ts`.
 * Tanpa workspace: tipe dijaga sinkron manual (D-010). Tanpa throw —
 * semua fetch gagal -> `null`, loader -> fallback statis + flag `error`.
 */

const RAW_URL = (import.meta.env?.VITE_CMS_URL as string | undefined) ?? "";

/** Base URL CMS. Kosong = mode statis (fallback selalu). */
export const CMS_URL = RAW_URL.replace(/\/+$/, "");

export type CmsSource = "cms" | "static";

/** Hasil loader: `error=true` = fetch CMS gagal, UI tampil fallback + banner inline. */
export interface CmsResult<T> {
  items: T[];
  source: CmsSource;
  error: boolean;
}

export interface CmsMedia {
  url?: string | null;
}

export interface CmsProduct {
  slug: string;
  title: string;
  excerpt?: CmsLocaleValue<string>;
  note?: CmsLocaleValue<string>;
  intro?: CmsLocaleValue<string[]>;
  usage?: CmsLocaleValue<string>;
  sourcing?: CmsLocaleValue<string>;
  seoTitle?: CmsLocaleValue<string>;
  priceNumber: number;
  currency?: string | null;
  badges?: CmsLocaleValue<string[]> | null;
  eyebrow?: CmsLocaleValue<string>;
  specs?: CmsLocaleValue<Array<{ label: string; value: string }>> | null;
  insideTitle?: CmsLocaleValue<string>;
  inside?: CmsLocaleValue<string[]> | null;
  per?: CmsLocaleValue<string>;
  packaging?: CmsLocaleValue<string>;
  dimensions?: string | null;
  netWeight?: string | null;
  grossWeight?: string | null;
  origin?: CmsLocaleValue<string>;
  shelfLife?: CmsLocaleValue<string>;
  certification?: CmsLocaleValue<string>;
  moq?: number | null;
  moqUnit?: CmsLocaleValue<string>;
  wholesalePriceNumber?: number | null;
  wholesaleCurrency?: string | null;
  wholesalePer?: CmsLocaleValue<string>;
  shipping?: CmsLocaleValue<string>;
  alt?: string | null;
  image?: number | CmsMedia | null;
  imageUrl?: string | null;
}

export type CmsLocaleValue<T> = T | { en?: T | null; id?: T | null } | null | undefined;

export interface CmsPost {
  slug: string;
  title: CmsLocaleValue<string>;
  metaDescription?: CmsLocaleValue<string>;
  excerpt?: CmsLocaleValue<string>;
  lede?: CmsLocaleValue<string>;
  content?: CmsLocaleValue<import("./lexical-markdown").LexicalDocument>;
  coverAlt?: CmsLocaleValue<string>;
  featuredImage?: number | CmsMedia | null;
  coverUrl?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
}

export function isCmsProduct(value: unknown): value is CmsProduct {
  if (typeof value !== "object" || value === null) return false;
  const d = value as Record<string, unknown>;
  return typeof d.slug === "string" && typeof d.title === "string";
}

export function isCmsPost(value: unknown): value is CmsPost {
  if (typeof value !== "object" || value === null) return false;
  const d = value as Record<string, unknown>;
  return typeof d.slug === "string" && d.title !== undefined;
}

/** Pilih nilai locale dari `locale=all`. `fallback=true` bila ID jatuh ke EN. */
export function pickLocale<T>(value: CmsLocaleValue<T>, locale: "en" | "id"): {
  value: T | undefined;
  fallback: boolean;
} {
  if (value === null || value === undefined) return { value: undefined, fallback: false };
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return { value: value as T, fallback: false };
  }
  if (typeof value === "object" && !Array.isArray(value)) {
    // Dokumen Lexical langsung (fetch locale spesifik), bukan kantong locale.
    if ("root" in value) return { value: value as T, fallback: false };
    const bag = value as { en?: T | null; id?: T | null };
    if (locale === "id" && bag.id != null) return { value: bag.id, fallback: false };
    if (bag.en != null) return { value: bag.en, fallback: locale !== "en" };
    if (bag.id != null) return { value: bag.id, fallback: locale !== "id" };
    return { value: undefined, fallback: false };
  }
  return { value: value as T, fallback: false };
}

/** Absolutkan URL file CMS (media `url` relatif `/api/...`). */
export function absolutizeCmsUrl(url: string | null | undefined, baseUrl: string): string | null {
  if (!url) return null;
  if (/^https?:\/\//.test(url)) return url;
  if (!baseUrl) return url.startsWith("/") ? url : `/${url}`;
  return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
}

/** Gambar produk/cover: relasi populate dulu, lalu URL remote lama. */
export function resolveCmsImage(
  relation: number | CmsMedia | null | undefined,
  remoteUrl: string | null | undefined,
  baseUrl: string,
): string {
  const relUrl = typeof relation === "object" && relation !== null ? relation.url : null;
  return absolutizeCmsUrl(relUrl, baseUrl) ?? remoteUrl ?? "";
}

/** Harga angka CMS -> string gaya katalog ("$15", "$2.53", "Rp10.000"). */
export function formatPrice(priceNumber: number, currency?: string | null): string {
  const n = Number.isFinite(priceNumber) ? priceNumber : 0;
  const body = Number.isInteger(n)
    ? n.toLocaleString("en-US", { maximumFractionDigits: 0 })
    : n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return currency === "IDR" ? `Rp${body}` : `$${body}`;
}

async function fetchJson(url: string, timeoutMs = 8000): Promise<unknown> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => {
    ctrl.abort();
  }, timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) return null;
    return (await res.json()) as unknown;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function docsOf(body: unknown): unknown[] {
  if (typeof body !== "object" || body === null) return [];
  const docs = (body as { docs?: unknown }).docs;
  return Array.isArray(docs) ? docs : [];
}

export function productsUrl(baseUrl: string): string {
  return `${baseUrl}/api/products?where[status][equals]=published&sort=sortOrder&limit=100&depth=1&locale=all`;
}

export function productBySlugUrl(baseUrl: string, slug: string): string {
  return `${baseUrl}/api/products?where[slug][equals]=${encodeURIComponent(slug)}&where[status][equals]=published&limit=1&depth=1&locale=all`;
}

export function postsUrl(baseUrl: string): string {
  return `${baseUrl}/api/posts?where[status][equals]=published&sort=-publishedAt&limit=100&depth=1&locale=all`;
}

export function postBySlugUrl(baseUrl: string, slug: string): string {
  return `${baseUrl}/api/posts?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=1&locale=all`;
}

export async function fetchCmsDocs(url: string): Promise<unknown[]> {
  return (await fetchCmsResult(url)).docs;
}

/** Seperti `fetchCmsDocs` + flag transport gagal (timeout, offline, HTTP !ok). */
export async function fetchCmsResult(url: string): Promise<{ docs: unknown[]; error: boolean }> {
  try {
    const body = await fetchJson(url);
    if (body === null) return { docs: [], error: true };
    return { docs: docsOf(body), error: false };
  } catch {
    return { docs: [], error: false };
  }
}
