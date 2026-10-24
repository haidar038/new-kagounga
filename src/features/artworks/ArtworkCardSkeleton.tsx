import type { ReactNode } from "react";
import { ARTWORK_LOGO_ASSETS } from "../../data/artworks";
import { cld } from "../../lib/cloudinary";

/**
 * Non-interactive placeholder that fills leftover grid slots on short last
 * pages (e.g. 2 real cards + 2 skeletons on a 4-column desktop page).
 */
export function ArtworkCardSkeleton(): ReactNode {
  const monogram = ARTWORK_LOGO_ASSETS["ō_monogram"];
  return (
    <div className="aspect-650/1063 h-full w-full" aria-hidden="true">
      <div className="flex h-full w-full items-center justify-center rounded-3xl border border-dashed border-ink/15 bg-white/40">
        <img
          src={cld(monogram.publicId, 96)}
          alt=""
          width={monogram.width}
          height={monogram.height}
          loading="lazy"
          decoding="async"
          className="h-12 w-auto opacity-15"
        />
      </div>
    </div>
  );
}
