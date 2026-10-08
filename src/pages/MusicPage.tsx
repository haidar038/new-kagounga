import { ExternalLink } from "lucide-react";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import {
  ARTIST_PLAYER_SRC,
  DISTRIBUTORS,
  SPOTIFY_FOLLOW_URL,
  TRACKS,
} from "../data/tracks";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { TrackCard } from "../components/TrackCard";
import { TrackBrandIcon } from "../components/BrandIcons";

export function MusicPage(): React.JSX.Element {
  useDocumentMeta({
    title: "Our Music | Kagōunga",
    description:
      "Listen to original music by Kagōunga. Discover our brand songs on Spotify, Apple Music, YouTube Music, and more.",
  });

  return (
    <main id="top">
      <PageHero
        eyebrow="Sound of Kagōunga"
        titleBold="Our"
        titleLight=" Music."
        lede="Experience the rhythm of Maluku Utara through our original compositions and collaborations."
      >
        <div className="mt-8 grid max-w-3xl gap-6 text-[15px] leading-relaxed text-cream/80 md:text-base">
          <Reveal>
            <p>
              <strong>
                A bespoke audio experience far beyond conventional stock
                soundscapes
              </strong>
              , bringing universal musical elements into harmony with
              indigenous roots. Created with local musicians and composers,
              every score and harmonic layer embodies authentic regional soul.
            </p>
          </Reveal>
        </div>
      </PageHero>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-ink/10 shadow-lg">
              <iframe
                title="Kagōunga on Spotify"
                className="w-full"
                src={ARTIST_PLAYER_SRC}
                width="100%"
                height="352"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <h2 className="display text-5xl md:text-6xl">
              <span className="font-bold">Latest</span>{" "}
              <span className="font-light">Added.</span>
            </h2>
          </Reveal>
          <Reveal>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/70">
              Browse our complete collection and listen on your favorite
              platform.
            </p>
          </Reveal>
          <div className="mt-8 border-t border-ink/10" />

          <div className="mt-8 grid gap-5">
            {TRACKS.map((track) => (
              <TrackCard key={track.title} track={track} />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <p className="text-center text-[12px] font-bold uppercase tracking-[0.18em] text-ink/50">
              Available On
            </p>
          </Reveal>
          <Reveal>
            <h2 className="display mt-3 text-center text-4xl md:text-5xl">
              <span className="font-bold">Music</span>{" "}
              <span className="font-light">Distributors.</span>
            </h2>
          </Reveal>
          <Reveal>
            <p className="mx-auto mt-4 max-w-2xl text-center text-[15px] leading-relaxed text-ink/70">
              Listen to our music on all major streaming platforms worldwide.
            </p>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 items-center justify-items-center gap-x-6 gap-y-8 sm:grid-cols-5">
            {DISTRIBUTORS.slice(0, 10).map((d) => (
              <img
                key={d.name}
                src={d.logo}
                alt={d.name}
                className="partner-logo"
                loading="lazy"
              />
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 items-center justify-items-center gap-x-6 gap-y-8 sm:grid-cols-6">
            {DISTRIBUTORS.slice(10).map((d) => (
              <img
                key={d.name}
                src={d.logo}
                alt={d.name}
                className="partner-logo"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <div className="rounded-[32px] bg-ink p-7 text-center text-cream md:p-12">
              <h2 className="display text-4xl md:text-5xl">
                <span className="font-bold">Follow Us</span>{" "}
                <span className="font-light">on Spotify.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-cream/70">
                Stay updated with our latest releases and exclusive content.
              </p>
              <a
                href={SPOTIFY_FOLLOW_URL}
                target="_blank"
                rel="noopener"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-lime px-8 py-4 text-sm font-bold text-ink hover:brightness-95"
              >
                <TrackBrandIcon brand="spotify" className="size-5" />
                Follow on Spotify
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
