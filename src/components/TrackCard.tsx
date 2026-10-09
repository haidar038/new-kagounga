import { useState } from "react";
import { ExternalLink, Music2, Play } from "lucide-react";
import type { Track } from "../types/content";
import { Reveal } from "./Reveal";
import { TrackBrandIcon } from "./BrandIcons";
import { cld } from "../lib/cloudinary";
import { cn } from "../lib/cn";

const BRAND_HOVER: Record<string, string> = {
  spotify: "hover:border-[#1DB954] hover:text-[#1DB954]",
  apple: "hover:border-[#FA243C] hover:text-[#FA243C]",
  youtube: "hover:border-[#FF0000] hover:text-[#FF0000]",
  amazon: "hover:border-[#FF9900] hover:text-[#FF9900]",
  deezer: "hover:border-[#FEAA2D] hover:text-[#b97a1a]",
};

export function TrackCard({ track }: { track: Track }): React.JSX.Element {
  const [showPlayer, setShowPlayer] = useState(false);
  return (
    <Reveal>
      <article className="card-hover flex flex-col gap-6 rounded-3xl border border-ink/10 bg-white p-6 sm:flex-row">
        <img
          src={track.cover}
          alt={track.coverAlt}
          className="h-32 w-full shrink-0 rounded-2xl object-cover sm:w-32"
          loading="lazy"
          decoding="async"
          width={128}
          height={128}
          onError={(e) => {
            const img = e.currentTarget;
            if (!img.src.includes("brand-music.webp")) {
              img.src = cld("brand-music.webp", 600);
            }
          }}
        />
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <h3 className="flex items-center gap-2 text-xl font-bold">
            <Music2 className="size-5" aria-hidden="true" />
            {track.title}
          </h3>
          <p className="mt-1 text-ink/70">{track.artist}</p>
          <p className="mt-1 text-sm text-ink/50">{track.meta}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {track.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-bold",
                  BRAND_HOVER[link.brand],
                )}
              >
                <TrackBrandIcon brand={link.brand} className="size-4" />
                {link.label}
                <ExternalLink
                  className="size-3 opacity-50"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        </div>
        <div className="hidden w-80 shrink-0 self-center lg:block">
          {showPlayer ? (
            <iframe
              title={`${track.title} mini player`}
              className="w-full rounded-xl"
              src={track.playerSrc}
              width="100%"
              height="80"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setShowPlayer(true);
              }}
              aria-label={`Load preview player for ${track.title}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink/15 px-4 py-6 text-sm font-bold hover:border-ink/40"
            >
              <Play className="size-4" aria-hidden="true" />
              Play preview
            </button>
          )}
        </div>
      </article>
    </Reveal>
  );
}
