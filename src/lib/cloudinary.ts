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
