const CLOUD_NAME =
  (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined) ||
  "fal5otmd";

/**
 * Cloudinary delivery URL with automatic format + quality.
 * `publicId` includes extension as stored (e.g. `brand-music.webp`,
 * `logo-primary-horizontal.svg`). Versionless URLs always serve latest.
 */
export function cld(publicId: string, width?: number): string {
  const t = width ? `f_auto,q_auto,w_${width}` : "f_auto,q_auto";
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
