import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useLocale } from "../i18n";
import { artworks } from "../data/artworks";
import { ArtworkCard } from "../features/artworks/ArtworkCard";
import { ArtworkCardSkeleton } from "../features/artworks/ArtworkCardSkeleton";
import { ArtworkFront } from "../features/artworks/ArtworkFaces";
import { ArtworkStack } from "../features/artworks/ArtworkStack";
import { cn } from "../lib/cn";

const pad2 = (n: number): string => String(n).padStart(2, "0");

/**
 * Desktop and tablet (md+): paginated grid - ten cards per page (5 × 2),
 * click to flip, prev/next buttons plus page dots. The short last page
 * gets skeleton fillers to complete the 5 × 2 layout. Mobile: a single
 * entry card that opens the layered stack carousel, so no in-flow
 * indicators are needed at all.
 */
export function ArtworksPage(): ReactNode {
  const { t } = useTranslation(["artworks", "seo"]);
  const locale = useLocale();
  useDocumentMeta({
    title: t("artworks.title", { ns: "seo" }),
    description: t("artworks.description", { ns: "seo" }),
    canonical: locale === "id" ? "/id/artworks" : "/artworks",
  });

  const isMd = useMediaQuery("(min-width: 512px)");
  const isXl = useMediaQuery("(min-width: 1280px)");

  // Desktop pagination state.
  const pageSize = isXl ? 10 : 6; // 5 × 2 or 5 × 1
  const pageCount = Math.ceil(artworks.length / pageSize);
  const [page, setPage] = useState(0);
  const current = Math.min(page, pageCount - 1);
  const anchorRef = useRef<HTMLDivElement>(null);

  const goTo = (next: number): void => {
    setPage(Math.max(0, Math.min(pageCount - 1, next)));
    anchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const items = artworks.slice(
    current * pageSize,
    current * pageSize + pageSize,
  );

  // Mobile stack state.
  const [stackOpen, setStackOpen] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);
  const entry = artworks[mobileIndex];

  // A shared deck position (#card=<slug>) restores the viewed card after a
  // refresh. Deferred a microtask, mirroring the useMediaQuery pattern.
  useEffect(() => {
    void Promise.resolve().then(() => {
      const slug = window.location.hash.match(/^#card=([\w-]+)$/)?.[1];
      if (!slug) return;
      const i = artworks.findIndex((a) => a.slug === slug);
      if (i >= 0) setMobileIndex(i);
    });
  }, []);

  return (
    <main id="top">
      <PageHero
        eyebrow={t("hero.eyebrow")}
        titleBold={t("hero.titleBold")}
        titleLight={t("hero.titleLight")}
        lede={t("hero.lede")}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          {isMd ? (
            <>
              <Reveal>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[13px] font-bold text-ink/70">
                    {t("pages.counter", {
                      current: pad2(current + 1),
                      total: pad2(pageCount),
                    })}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      aria-label={t("pages.prev")}
                      disabled={current === 0}
                      onClick={() => {
                        goTo(current - 1);
                      }}
                      className="grid size-11 place-items-center rounded-full border border-ink/10 bg-white transition hover:border-ink/30 disabled:pointer-events-none disabled:opacity-40"
                    >
                      <ArrowLeft className="size-5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label={t("pages.next")}
                      disabled={current === pageCount - 1}
                      onClick={() => {
                        goTo(current + 1);
                      }}
                      className="grid size-11 place-items-center rounded-full border border-ink/10 bg-white transition hover:border-ink/30 disabled:pointer-events-none disabled:opacity-40"
                    >
                      <ArrowRight className="size-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </Reveal>

              {/* Scroll anchor when switching pages (clears the sticky header). */}
              <div ref={anchorRef} className="scroll-mt-40" aria-hidden="true" />

              {/* key={current} replays the enter animation and resets flips. */}
              <div
                key={current}
                aria-live="polite"
                className="mt-6 grid animate-enter grid-cols-5 md:grid-cols-3 gap-5"
              >
                {items.map((artwork, i) => (
                  <ArtworkCard
                    key={artwork.slug}
                    artwork={artwork}
                    index={current * pageSize + i}
                  />
                ))}
                {/* Fill leftover slots on short last pages (e.g. 4 + 6 of 5 × 2). */}
                {Array.from({ length: pageSize - items.length }, (_, i) => (
                  <ArtworkCardSkeleton key={`skeleton-${i}`} />
                ))}
              </div>

              <div
                role="group"
                aria-label={t("pages.groupLabel")}
                className="mt-8 flex items-center justify-center gap-2.5"
              >
                {Array.from({ length: pageCount }, (_, p) => (
                  <button
                    key={p}
                    type="button"
                    className="cursor-pointer p-1"
                    aria-label={t("pages.pageOf", {
                      current: p + 1,
                      total: pageCount,
                    })}
                    aria-current={p === current}
                    onClick={() => {
                      goTo(p);
                    }}
                  >
                    <span
                      className={cn("page-dot", p === current && "active")}
                    />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <Reveal>
              <div className="mx-auto max-w-sm">
                <button
                  type="button"
                  onClick={() => {
                    setStackOpen(true);
                  }}
                  aria-label={t("card.openAria", { title: entry.title })}
                  className="group block w-full rounded-3xl text-left transition-shadow duration-300 hover:shadow-[0_24px_48px_-28px_rgba(31,44,34,0.35)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
                >
                  <ArtworkFront
                    artwork={entry}
                    index={mobileIndex}
                    badge={t("card.tapToExplore")}
                  />
                </button>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {stackOpen && (
        <ArtworkStack
          startIndex={mobileIndex}
          onClose={(i) => {
            setMobileIndex(i);
            setStackOpen(false);
          }}
        />
      )}
    </main>
  );
}
