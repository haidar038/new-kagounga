import type { NavLink, SocialLink } from "../types/content";

export const SITE_NAME = "Kagōunga";

export const NAV_LINKS: NavLink[] = [
  { key: "about", label: "About", to: "/about" },
  { key: "news", label: "News", to: "/news" },
  { key: "catalog", label: "Catalog", to: "/catalog" },
  { key: "music", label: "Music", to: "/music" },
];

export const FOOTER_NAVIGATE: NavLink[] = [
  { key: "about", label: "About", to: "/about" },
  { key: "news", label: "News", to: "/news" },
  { key: "catalog", label: "Catalog", to: "/catalog" },
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
    iconSrc:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/instagram/mono.svg",
    iconClass: "size-5 invert",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@kagounga.id/",
    iconSrc:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/tiktok/mono.svg",
    iconClass: "size-5 invert",
  },
  {
    label: "X",
    href: "https://x.com/kagounga/",
    iconSrc:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/x-formerly-twitter/dark.svg",
    iconClass: "size-4",
  },
  {
    label: "Threads",
    href: "https://www.threads.com/@kagounga.id",
    iconSrc:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/threads/dark.svg",
    iconClass: "size-5",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@Kagounga",
    iconSrc:
      "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/youtube/mono.svg",
    iconClass: "size-5 invert",
  },
];

export const WHATSAPP_ICON =
  "https://thesvg.org/icons/whatsapp/mono.svg";
