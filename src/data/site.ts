import type { NavLink, ShopLink, SocialLink } from "../types/content";

export const SITE_NAME = "Kagōunga";

export const NAV_LINKS: NavLink[] = [
  { key: "about", label: "About", to: "/about" },
  { key: "news", label: "News", to: "/news" },
  { key: "catalog", label: "Catalog", to: "/catalog" },
  { key: "artworks", label: "Artworks", to: "/artworks" },
  { key: "music", label: "Music", to: "/music" },
];

export const FOOTER_NAVIGATE: NavLink[] = [
  { key: "about", label: "About", to: "/about" },
  { key: "news", label: "News", to: "/news" },
  { key: "catalog", label: "Catalog", to: "/catalog" },
  { key: "artworks", label: "Artworks", to: "/artworks" },
  { key: "music", label: "Music", to: "/music" },
  { key: "movement", label: "Movement", to: "/#movement" },
  { key: "events", label: "Events", to: "/#milestones" },
  { key: "signature", label: "Our Signature", to: "/#signature" },
];

export const FOOTER_SIGNATURES: NavLink[] = [
  { label: "Popeda Soup", to: "/?sig=popeda#signature" },
  { label: "Botanical Soap", to: "/?sig=soap#signature" },
  { label: "Sensory Candle", to: "/?sig=candle#signature" },
  { label: "Brand Music", to: "/?sig=music#signature" },
  { label: "Visual Artwork", to: "/?sig=artwork#signature" },
];

export const CONTACT = {
  office: "Kagōunga Head Office",
  address: ["Jl. Raya Pertamina, No.800, Jambula", "Ternate, Indonesia, 97751"],
  email: "hello@kagounga.com",
  phoneLabel: "+62 811-1538-111",
  phoneHref: "tel:+628111538111",
} as const;

export const SOCIALS: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/kagounga.id/",
    brand: "instagram",
    iconClass: "size-4",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@kagounga.id/",
    brand: "tiktok",
    iconClass: "size-4",
  },
  {
    label: "X",
    href: "https://x.com/kagounga/",
    brand: "x",
    iconClass: "size-3",
  },
  {
    label: "Threads",
    href: "https://www.threads.com/@kagounga.id",
    brand: "threads",
    iconClass: "size-4",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@Kagounga",
    brand: "youtube",
    iconClass: "size-4",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/kagounga",
    brand: "linkedin",
    iconClass: "size-4",
  }
];

export const WHATSAPP_ICON = "/icons/social/whatsapp.svg";

/**
 * Google Business Profile listing URL (share/Maps link). Used for Local SEO:
 * it lands in the JSON-LD `sameAs` arrays and a footer link once filled.
 * Petunjuk pengisian: docs/RUNBOOK-MANUAL-SEO.md §5.2.
 */
export const GBP_URL = "https://share.google/n6AcokfpQVM3IfxSP";

export const SHOP_LINKS: ShopLink[] = [
  {
    label: "Tokopedia",
    href: "https://www.tokopedia.com/kagounga",
    icon: "/icons/shop/tokopedia.svg",
  },
  {
    label: "Shopee",
    href: "https://shopee.co.id/kagounga",
    icon: "/icons/shop/shopee.svg",
  },
  {
    label: "TikTok Shop",
    href: "https://vt.tiktok.com/ZS9UoDrLPouRw-3NVgC/",
    icon: "/icons/shop/tiktok.svg",
  },
];
