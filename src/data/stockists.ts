import type { CityGroup } from "./locations";
import type { CmsResult, CmsSource, CmsStockistCity, CmsStockistPoint } from "../lib/cms";
import type { DistributionPoint, LocationKind } from "../types/content";
import type { Locale } from "../i18n";
import {
  CMS_URL,
  fetchCmsResult,
  isCmsStockistCity,
  isCmsStockistPoint,
  pickLocale,
  stockistBySlugUrl,
  stockistsUrl,
} from "../lib/cms";
import { CITY_REGIONS, LOCATIONS, cityFromSlug, citySlug } from "./locations";
import { STOCKIST_PAGES, getStockistPageCopy, type StockistPageCopy } from "./stockistContent";
import cmsSnapshot from "./cms-stockists.generated.json";

const STATIC_SLUGS = Object.keys(STOCKIST_PAGES);
const SNAPSHOT_CITIES = (() => {
  const raw = cmsSnapshot as { cities?: unknown };
  return Array.isArray(raw.cities) ? raw.cities.filter(isCmsStockistCity) : [];
})();

const SNAPSHOT_MODE = SNAPSHOT_CITIES.length > 0;

export interface StockistCity {
  slug: string;
  city: string;
  region: string;
  sortOrder: number;
  copy: StockistPageCopy;
  points: DistributionPoint[];
}

export interface StockistCityGroup extends CityGroup {
  slug: string;
}

export interface StockistCityResult {
  city: StockistCity | null;
  source: CmsSource;
  error: boolean;
}

const KINDS: readonly LocationKind[] = ["hub", "retail", "partner"];

function asKind(value: unknown): LocationKind {
  return KINDS.includes(value as LocationKind) ? (value as LocationKind) : "retail";
}

function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function staticCopy(slug: string, locale: Locale): StockistPageCopy | null {
  return getStockistPageCopy(slug, locale) ?? getStockistPageCopy(slug, "en");
}

function staticCity(slug: string, locale: Locale, sortOrder: number): StockistCity | null {
  const city = cityFromSlug(slug);
  const copy = staticCopy(slug, locale);
  if (!city || !copy) return null;
  const points = LOCATIONS.filter((point) => citySlug(point.city) === slug);
  if (points.length === 0) return null;
  return {
    slug,
    city,
    region: CITY_REGIONS[city] ?? "",
    sortOrder,
    copy,
    points,
  };
}

function staticCities(locale: Locale): StockistCity[] {
  return STATIC_SLUGS.flatMap((slug, index) => {
    const city = staticCity(slug, locale, index);
    return city ? [city] : [];
  });
}

function toPoint(point: CmsStockistPoint, city: string): DistributionPoint | null {
  if (!isCmsStockistPoint(point) || point.active === false) return null;
  if (!finite(point.lng) || !finite(point.lat)) return null;
  return {
    id: point.pointId,
    name: point.name,
    area: typeof point.area === "string" ? point.area : "",
    city,
    kind: asKind(point.kind),
    lng: point.lng,
    lat: point.lat,
    note: null,
  };
}

function toPoints(points: CmsStockistCity["points"], city: string): DistributionPoint[] {
  if (!Array.isArray(points)) return [];
  const seen = new Set<string>();
  return points.flatMap((point) => {
    const normalized = toPoint(point, city);
    if (!normalized || seen.has(normalized.id)) return [];
    seen.add(normalized.id);
    return [normalized];
  });
}

function toCopy(doc: CmsStockistCity, locale: Locale): StockistPageCopy | null {
  const seoTitle = pickLocale(doc.seoTitle, locale).value;
  const description = pickLocale(doc.metaDescription, locale).value;
  const title = pickLocale(doc.title, locale).value;
  const lede = pickLocale(doc.lede, locale).value;
  const paragraphs = pickLocale(doc.paragraphs, locale).value;
  if (!seoTitle || !title || !lede) return null;
  return {
    seoTitle,
    description: description ?? "",
    title,
    lede,
    paragraphs: paragraphs ?? [],
  };
}

function toStockistCity(doc: CmsStockistCity, locale: Locale): StockistCity | null {
  const copy = toCopy(doc, locale);
  const points = toPoints(doc.points, doc.city);
  if (!copy || points.length === 0) return null;
  return {
    slug: doc.slug,
    city: doc.city,
    region: doc.region?.trim() || CITY_REGIONS[doc.city] || "",
    sortOrder: finite(doc.sortOrder) ? doc.sortOrder : 0,
    copy,
    points,
  };
}

function sortCities(cities: StockistCity[]): StockistCity[] {
  return [...cities].sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Build-time snapshot dulu; kosong = fallback statis. */
export function getStockistCities(locale: Locale): StockistCity[] {
  if (!SNAPSHOT_MODE) return staticCities(locale);
  return sortCities(
    SNAPSHOT_CITIES.flatMap((doc) => {
      const city = toStockistCity(doc, locale);
      return city ? [city] : [];
    }),
  );
}

/** Satu kota dari snapshot/static. Snapshot non-kosong dianggap otoritatif. */
export function getStockistCity(slug: string, locale: Locale): StockistCity | null {
  if (SNAPSHOT_MODE) {
    return getStockistCities(locale).find((city) => city.slug === slug) ?? null;
  }
  const index = STATIC_SLUGS.indexOf(slug);
  return index < 0 ? null : staticCity(slug, locale, index);
}

/**
 * Muat daftar kota: CMS dulu; transport gagal -> fallback.
 * CMS reachable tapi kosong = daftar kosong (bukan fallback statis).
 */
export async function loadStockistCities(
  locale: Locale,
  fallback: StockistCity[],
  baseUrl: string = CMS_URL,
): Promise<CmsResult<StockistCity>> {
  if (!baseUrl) return { items: fallback, source: "static", error: false };
  const { docs, error } = await fetchCmsResult(stockistsUrl(baseUrl));
  if (error) return { items: fallback, source: "static", error: true };
  const items = sortCities(
    docs.flatMap((doc) => {
      if (!isCmsStockistCity(doc)) return [];
      const city = toStockistCity(doc, locale);
      return city ? [city] : [];
    }),
  );
  return { items, source: "cms", error: false };
}

/**
 * Satu kota: transport gagal -> fallback; CMS reachable tapi kota
 * tidak ada/draft/invalid -> null (halaman 404).
 */
export async function loadStockistCity(
  slug: string,
  locale: Locale,
  fallback: StockistCity | null,
  baseUrl: string = CMS_URL,
): Promise<StockistCityResult> {
  if (!baseUrl) return { city: fallback, source: "static", error: false };
  const { docs, error } = await fetchCmsResult(stockistBySlugUrl(baseUrl, slug));
  if (error) return { city: fallback, source: "static", error: true };
  const doc = docs.filter(isCmsStockistCity).find((item) => item.slug === slug);
  return {
    city: doc ? toStockistCity(doc, locale) : null,
    source: "cms",
    error: false,
  };
}
