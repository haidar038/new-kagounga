const CLOUD_NAME =
  (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined) ||
  "fal5otmd";

/**
 * Cloudinary delivery URL with automatic format + quality.
 * `publicId` includes extension as stored (e.g. `brand-music.webp`,
 * `logo-primary-horizontal.svg`). Versionless URLs always serve latest.
 * `transform` prepends extra chained transformations (e.g. `a_90`).
 */
export function cld(publicId: string, width?: number, transform?: string): string {
  const base = transform ? `${transform},f_auto,q_auto` : "f_auto,q_auto";
  const t = width ? `${base},w_${width}` : base;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${t}/${publicId}`;
}

/**
 * Build a responsive srcset from an existing Cloudinary URL by swapping its
 * width transformation. Non-Cloudinary or untransformed URLs return undefined.
 */
export function cldSrcSet(
  url: string,
  widths: number[],
): string | undefined {
  if (!/res\.cloudinary\.com\/.+\/image\/upload\//.test(url)) return undefined;
  if (!/w_\d+/.test(url)) return undefined;
  return widths
    .map((width) => `${url.replace(/w_\d+/, `w_${width}`)} ${width}w`)
    .join(", ");
}

/**
 * Tiny blurred placeholder URL (~300 bytes) for blur-up loading: keep
 * geometry/rotation/crop transforms (a_90, c_, g_, dpr_), drop delivery
 * hints (w_/q_/f_) and inject the blur chain. Non-Cloudinary or versioned
 * URLs (…/upload/v123/…) return undefined so callers can fall back.
 */
export function cldBlurSrc(url: string): string | undefined {
  const m = url.match(
    /res\.cloudinary\.com\/([^/]+)\/image\/upload\/([^/]+)\/(.+)$/,
  );
  if (!m) return undefined;
  const [, cloud, transforms, publicId] = m;
  if (/^v\d+/.test(transforms)) return undefined;
  const kept = transforms.split(",").filter((t) => /^(a_|c_|g_|dpr_)/.test(t));
  return `https://res.cloudinary.com/${cloud}/image/upload/${[...kept, "w_32", "q_auto:low", "e_blur:1000", "f_auto"].join(",")}/${publicId}`;
}
