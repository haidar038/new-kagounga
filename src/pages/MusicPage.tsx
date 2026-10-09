import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SITE_URL, useDocumentMeta } from "../hooks/useDocumentMeta";
import { breadcrumbLd, graphLd } from "../lib/seo";
import {
  ARTIST_PLAYER_SRC,
  DISTRIBUTORS,
  SPOTIFY_FOLLOW_URL,
  TRACKS,
} from "../data/tracks";
import { useLocale } from "../i18n";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { TrackCard } from "../components/TrackCard";
import { TrackBrandIcon } from "../components/BrandIcons";

export function MusicPage(): React.JSX.Element {
  const { t } = useTranslation(["music", "seo", "common"]);
  const locale = useLocale();
  useDocumentMeta({
    title: t("music.title", { ns: "seo" }),
    description: t("music.description", { ns: "seo" }),
    canonical: locale === "id" ? "/id/music" : "/music",
    jsonLd: graphLd([
      {
        "@type": "MusicGroup",
        name: "Kagōunga",
        url: `${SITE_URL}/music`,
        track: TRACKS.map((track) => ({
          "@type": "MusicRecording",
          name: track.title,
          byArtist: { "@type": "MusicGroup", name: track.artist },
        })),
      },
      breadcrumbLd(
        [
          { name: t("home", { ns: "common" }), path: "/" },
          { name: t("music", { ns: "common" }), path: "/music" },
        ],
        SITE_URL,
      ),
    ]),
  });

  return (
    <main id="top">
      <PageHero
        eyebrow={t("hero.eyebrow")}
        titleBold={t("hero.titleBold")}
        titleLight={t("hero.titleLight")}
        lede={t("hero.lede")}
      >
        <div className="mt-8 grid max-w-3xl gap-6 text-[15px] leading-relaxed text-cream/80 md:text-base">
          <Reveal>
            <p>{t("hero.body")}</p>
          </Reveal>
        </div>
      </PageHero>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-ink/10 shadow-lg">
              <iframe
                title={t("hero.playerTitle")}
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
              <span className="font-bold">{t("latest.titleBold")}</span>{" "}
              <span className="font-light">{t("latest.titleLight")}</span>
            </h2>
          </Reveal>
          <Reveal>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/70">
              {t("latest.lede")}
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
              {t("distributors.available")}
            </p>
          </Reveal>
          <Reveal>
            <h2 className="display mt-3 text-center text-4xl md:text-5xl">
              <span className="font-bold">{t("distributors.titleBold")}</span>{" "}
              <span className="font-light">{t("distributors.titleLight")}</span>
            </h2>
          </Reveal>
          <Reveal>
            <p className="mx-auto mt-4 max-w-2xl text-center text-[15px] leading-relaxed text-ink/70">
              {t("distributors.lede")}
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
                <span className="font-bold">{t("follow.titleBold")}</span>{" "}
                <span className="font-light">{t("follow.titleLight")}</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-cream/70">
                {t("follow.lede")}
              </p>
              <a
                href={SPOTIFY_FOLLOW_URL}
                target="_blank"
                rel="noopener"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-lime px-8 py-4 text-sm font-bold text-ink hover:brightness-95"
              >
                <TrackBrandIcon brand="spotify" className="size-5" />
                {t("follow.cta")}
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
