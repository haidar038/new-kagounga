import type { LucideIcon } from "lucide-react";

export const signatureIds = ["popeda", "soap", "candle", "music", "artwork"] as const;
export type SignatureId = (typeof signatureIds)[number];

export interface SignatureProduct {
  id: SignatureId;
  category: string;
  title: string;
  image: string;
  alt: string;
  paragraphs: string[];
  meta: string;
}

export const productIds = [
  "popeda",
  "sago",
  "tuna",
  "seasoning",
  "kenari",
  "telang",
  "pala",
  "cengkeh",
] as const;
/** Slug seed statis. `ProductId` sengaja string terbuka untuk produk CMS baru. */
export type ProductId = string;

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductDetail {
  id: ProductId;
  name: string;
  image: string;
  alt: string;
  blurb: string;
  badges: string[];
  price: string;
  eyebrow: string;
  specs: ProductSpec[];
  insideTitle: string | null;
  inside: string[] | null;
  note: string;
  per: string;
  /** CMS copy flag. Absent = fall back to the static `hasProductPage` check. */
  hasPage?: boolean;
  /** Separate detail fields (all products, all optional). */
  packaging?: string | null;
  dimensions?: string | null;
  netWeight?: string | null;
  grossWeight?: string | null;
  origin?: string | null;
  shelfLife?: string | null;
  certification?: string | null;
  /** Wholesale tier (B2B). Null = retail only. */
  moq?: number | null;
  moqUnit?: string | null;
  wholesalePrice?: string | null;
  wholesalePer?: string | null;
  shipping?: string | null;
}

export interface NewsPost {
  slug: string;
  title: string;
  description: string;
  dateISO: string;
  dateLabel: string;
  cover: string;
  coverAlt: string;
  /** Intrinsic dimensions of the delivered cover; CMS posts may omit them. */
  coverWidth?: number;
  coverHeight?: number;
  excerpt: string;
  lede: string;
  /** Full article body as markdown (blank-line separated paragraphs, **bold** inline). */
  bodyMarkdown: string;
  /** Last content change (CMS `updatedAt`). Absent = fall back to `dateISO`. */
  updatedAt?: string;
  /** Indonesian overlay. Absent = render EN + fallback badge. */
  titleId?: string;
  descriptionId?: string;
  coverAltId?: string;
  excerptId?: string;
  ledeId?: string;
  bodyMarkdownId?: string;
}

export interface Collaborator {
  name: string;
  role: string;
  image: string;
  alt: string;
  width: number;
  height: number;
}

export interface Movement {
  index: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Partner {
  name: string;
  logo: string;
  /** Rendered image dimensions at the delivered w_320 URL, for aspect-ratio hints. */
  logoWidth: number;
  logoHeight: number;
}

export type TrackBrand = "spotify" | "apple" | "youtube" | "amazon" | "deezer";

export interface TrackLink {
  label: string;
  href: string;
  brand: TrackBrand;
}

export interface Track {
  title: string;
  artist: string;
  meta: string;
  cover: string;
  coverAlt: string;
  links: TrackLink[];
  playerSrc: string;
}

export interface Distributor {
  name: string;
  logo: string;
  logoWidth: number;
  logoHeight: number;
}

export interface NavLink {
  /** i18n key under `common:nav`. Absent = label is a proper noun, render as-is. */
  key?: string;
  label: string;
  to: string;
}

export type SocialBrand =
  | "instagram"
  | "tiktok"
  | "x"
  | "threads"
  | "youtube"
  | "linkedin";

export interface SocialLink {
  label: string;
  href: string;
  brand: SocialBrand;
  /** Tailwind size classes for the inline icon (color handled by the consumer). */
  iconClass: string;
}

/** Online-shop marketplace link; icon is a badge SVG under /icons/shop/. */
export interface ShopLink {
  label: string;
  href: string;
  icon: string;
}

export type LocationKind = "hub" | "retail" | "partner";

export interface DistributionPoint {
  id: string;
  name: string;
  area: string;
  city: string;
  kind: LocationKind;
  /** Longitude (x). */
  lng: number;
  /** Latitude (y). */
  lat: number;
  note: string | null;
}

export const contactSubjects = [
  "Business Inquiry",
  "Partnership",
  "Media & Press",
  "Other",
] as const;
export type ContactSubject = (typeof contactSubjects)[number];
