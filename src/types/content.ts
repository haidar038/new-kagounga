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
export type ProductId = (typeof productIds)[number];

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
}

export interface NewsPost {
  slug: string;
  title: string;
  description: string;
  dateISO: string;
  dateLabel: string;
  cover: string;
  coverAlt: string;
  excerpt: string;
  lede: string;
  /** Full article body as markdown (blank-line separated paragraphs, **bold** inline). */
  bodyMarkdown: string;
}

export interface Collaborator {
  name: string;
  role: string;
  image: string;
  alt: string;
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
}

export interface NavLink {
  label: string;
  to: string;
}

export interface SocialLink {
  label: string;
  href: string;
  iconSrc: string;
  iconClass: string;
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
