import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { RotateCw } from "lucide-react";
import type { Artwork, ArtworkLogoId } from "../../data/artworks";
import {
  ARTWORK_LOGO_ASSETS,
  ARTWORK_LOGOS,
  SKETCH_EA_CREDIT,
} from "../../data/artworks";
import { useLocale } from "../../i18n";
import { cld, cldSrcSet } from "../../lib/cloudinary";
import { cn } from "../../lib/cn";
import { CaptionText } from "./CaptionText";
import { artworkSrc } from "./artworkSrc";

const NO_LOGOS: { left: ArtworkLogoId[]; right: ArtworkLogoId[] } = {
  left: [],
  right: ["ō_monogram"],
};

interface ArtworkFrontProps {
  artwork: Artwork;
  index: number;
  /** Label for the corner chip; omit to hide it (stack ghosts). */
  badge?: string;
  className?: string;
}

/**
 * Front face: the upright artwork with a title scrim and optional chip.
 * Carries the flip-face 3D classes so consumers only stack the two faces.
 */
export function ArtworkFront({
  artwork,
  index,
  badge,
  className,
}: ArtworkFrontProps): ReactNode {
  const { t } = useTranslation("artworks");
  const locale = useLocale();
  const indexLabel = String(index + 1).padStart(2, "0");
  const src = artworkSrc(artwork.publicId, 650);

  return (
    <span
      className={cn(
        // w-full + h-full fill the grid track exactly; without w-full the
        // aspect ratio transfers the filled height into an overflowing width.
        "relative block aspect-650/1063 h-full w-full overflow-hidden rounded-3xl bg-ink backface-hidden [-webkit-backface-visibility:hidden] [grid-area:1/1]",
        className,
      )}
    >
      <img
        src={src}
        srcSet={cldSrcSet(src, [400, 650, 900])}
        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
        alt={artwork.alt[locale]}
        width={650}
        height={1063}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-ink/90 via-ink/40 to-transparent"
      />
      {badge != null && (
        <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-cream/90 px-3 py-1.5 text-[11px] font-bold text-ink shadow-sm">
          <RotateCw className="size-3.5" aria-hidden="true" />
          {badge}
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 block p-5">
        <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-lime">
          {t("card.artworkLabel")} · {indexLabel}
        </span>
        <span className="mt-1 block text-xl font-bold text-cream">
          {artwork.title}
        </span>
      </span>
    </span>
  );
}

/**
 * Back face: full-text caption with the source brand marks. Pre-rotated
 * 180° so stacking it behind the front face completes the flip.
 */
export function ArtworkBack({
  artwork,
  index,
  className,
}: {
  artwork: Artwork;
  index: number;
  className?: string;
}): ReactNode {
  const { t } = useTranslation("artworks");
  const locale = useLocale();
  const indexLabel = String(index + 1).padStart(2, "0");
  const logos = ARTWORK_LOGOS[artwork.slug] ?? NO_LOGOS;

  const logoImg = (id: ArtworkLogoId): ReactNode => {
    const asset = ARTWORK_LOGO_ASSETS[id];
    return (
      <img
        key={id}
        src={cld(asset.publicId, 96)}
        alt=""
        width={asset.width}
        height={asset.height}
        loading="lazy"
        decoding="async"
        className="h-7 w-auto"
      />
    );
  };

  return (
    <span
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white p-5 backface-hidden [-webkit-backface-visibility:hidden] [grid-area:1/1] transform-[rotateY(180deg)] md:p-6",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-2 right-4 text-[72px] leading-none font-bold text-ink/5 select-none"
      >
        {indexLabel}
      </span>
      {/* Corner marks, mirroring the original caption card layout */}
      {(logos.left.length > 0 || logos.right.length > 0) && (
        <span className="flex items-start justify-between gap-3">
          <span className="flex items-center gap-2">
            {logos.left.map(logoImg)}
          </span>
          <span className="flex items-center gap-2">
            {logos.right.map(logoImg)}
          </span>
        </span>
      )}
      <span className="mt-3 block text-[11px] font-bold uppercase tracking-[0.18em] text-ink/60">
        {t("card.captionLabel")}
      </span>
      <span className="mt-1 block text-xl font-bold">{artwork.title}</span>
      <CaptionText
        lines={artwork.caption[locale]}
        className="mt-3 text-[13px] leading-relaxed text-ink/75"
      />
      <span className="mt-auto pt-4 text-[11px] italic text-ink/50">
        {/* Byline for artworks carrying the Fadrié × Sketch EA mark */}
        {(logos.left.includes("ea_sketch") ||
          logos.right.includes("ea_sketch_kanan")) &&
          t("card.credit", { name: SKETCH_EA_CREDIT })}
      </span>
    </span>
  );
}
