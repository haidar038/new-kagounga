import { cld } from "../../lib/cloudinary";

// Artwork sources are stored rotated 90° CCW (landscape 1063×650); `a_90`
// delivers them upright at 650×1063, matching the card's aspect ratio.
export function artworkSrc(publicId: string, width: number): string {
  return cld(publicId, width, "a_90");
}
