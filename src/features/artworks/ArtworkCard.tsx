import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { Artwork } from "../../data/artworks";
import { cn } from "../../lib/cn";
import { ArtworkBack, ArtworkFront } from "./ArtworkFaces";

interface ArtworkCardProps {
  artwork: Artwork;
  /** Zero-based position in the whole collection, for the index label. */
  index: number;
}

/**
 * Studio Matte flip card for the desktop grid: fixed vertical frame,
 * artwork in front, full-text caption behind. Flips on click and keyboard
 * (native button) - no hover flip.
 */
export function ArtworkCard({
  artwork,
  index,
}: ArtworkCardProps): ReactNode {
  const { t } = useTranslation("artworks");
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="h-full">
      <button
        type="button"
        onClick={() => {
          setFlipped((v) => !v);
        }}
        aria-pressed={flipped}
        aria-label={t("card.flipAria", { title: artwork.title })}
        className="group block h-full w-full rounded-3xl text-left transition-shadow duration-300 perspective-distant hover:shadow-[0_24px_48px_-28px_rgba(31,44,34,0.35)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
      >
        <span
          className={cn(
            // grid-rows-1: the single row fills the stretched card, so a
            // long caption elsewhere in the row grows every face (the
            // artwork crops via object-cover) instead of leaving a gap.
            "relative grid h-full w-full grid-rows-1 transform-3d transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-[0ms]",
            flipped && "transform-[rotateY(180deg)]",
          )}
        >
          <ArtworkFront artwork={artwork} index={index} badge={t("card.flip")} />
          <ArtworkBack artwork={artwork} index={index} />
        </span>
      </button>
    </div>
  );
}
