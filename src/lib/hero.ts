import { cld } from "./cloudinary";

/**
 * Single source of truth for the hero LCP image URLs. `scripts/seo-build.mjs`
 * loads this module through its Vite SSR server to emit the media-scoped
 * preloads, so the preloads can never drift from the <picture> srcSets below.
 * If you change the file, widths, or quality here, nothing else needs editing.
 */
const HERO_Q = "f_webp,q_30";
const MOBILE_FILE = "hero-bg-nature-4.webp"; // 3072x4320 master, portrait
const DESKTOP_FILE = "hero-bg-nature.webp"; // landscape master

function srcSet(file: string, widths: number[]): string {
  return widths.map((w) => `${cld(file, w, HERO_Q)} ${w}w`).join(", ");
}

export const HERO_MOBILE_WIDTHS = [480, 768];
export const HERO_DESKTOP_WIDTHS = [640, 960, 1280, 1920];

/** Mobile portrait source (< 768px). 768w ≈ 55 KB at q_30. */
export const HERO_MOBILE = {
  file: MOBILE_FILE,
  src: cld(MOBILE_FILE, 768, HERO_Q),
  srcSet: srcSet(MOBILE_FILE, HERO_MOBILE_WIDTHS),
  widths: HERO_MOBILE_WIDTHS,
};

/** Desktop landscape source (>= 768px), unchanged art direction. */
export const HERO_DESKTOP = {
  file: DESKTOP_FILE,
  src: cld(DESKTOP_FILE, 1280, HERO_Q),
  srcSet: srcSet(DESKTOP_FILE, HERO_DESKTOP_WIDTHS),
  widths: HERO_DESKTOP_WIDTHS,
};
