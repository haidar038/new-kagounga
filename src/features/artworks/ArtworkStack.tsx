import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { artworks } from "../../data/artworks";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { cn } from "../../lib/cn";
import { ArtworkBack, ArtworkFront } from "./ArtworkFaces";
import { artworkSrc } from "./artworkSrc";

const pad2 = (n: number): string => String(n).padStart(2, "0");
const HASH_PREFIX = "#card=";
const TOTAL = artworks.length;
/** The deck renders the slide list three times; the user always lives in
 *  the middle copy, so a swipe past either end loops seamlessly. */
const COPIES = 3;

interface ArtworkStackProps {
  /** Index the stack opens on. The component mounts only while open. */
  startIndex: number;
  /** Called with the index the user was on when the stack closed. */
  onClose: (index: number) => void;
}

/**
 * Infinite layered deck for mobile built on CSS scroll snap along the
 * horizontal axis: each artwork is a full-width snap slide, so momentum,
 * flick, and the tap-vs-swipe call are the browser's, not hand-rolled
 * pointer handling — a swipe is consumed as scrolling and never fires the
 * flip. Rendered as a native modal dialog, the page behind is inert.
 * Swipe left moves to the next artwork, right to the previous; the deck
 * loops past both ends. Tapping a card flips it to its caption. The
 * position is kept in the URL hash (`#card=<slug>`) so a viewed card
 * survives refresh.
 */
export function ArtworkStack({
  startIndex,
  onClose,
}: ArtworkStackProps): ReactNode {
  const { t } = useTranslation("artworks");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const dlgRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Position in the tripled slide list (middle copy = TOTAL..TOTAL*2-1).
  const [pos, setPos] = useState(TOTAL + startIndex);
  const [flipped, setFlipped] = useState(false);
  // Latest values for native callbacks (refs are sync-safe there).
  const posRef = useRef(pos);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    posRef.current = pos;
  });
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Open the native dialog and lock page scroll while the layer is up.
  // Closure is detected via the `open` attribute itself (MutationObserver),
  // so every close path — Escape, ✕, programmatic — reports back reliably.
  useEffect(() => {
    const dlg = dlgRef.current;
    if (!dlg) return;
    const handleClose = (): void => {
      onCloseRef.current(posRef.current % TOTAL);
    };
    const mo = new MutationObserver(() => {
      if (!dlg.open) handleClose();
    });
    mo.observe(dlg, { attributes: true, attributeFilter: ["open"] });
    if (!dlg.open) dlg.showModal();
    // Position after showModal: a closed dialog is display:none, so any
    // earlier layout read would see a 0-width scroller.
    const scroller = scrollRef.current;
    if (scroller) {
      scroller.scrollLeft = (TOTAL + startIndex) * scroller.clientWidth;
    }
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      mo.disconnect();
      document.documentElement.style.overflow = prevOverflow;
      if (dlg.open) dlg.close();
      // Strip our own hash as it stands NOW — StrictMode's first cleanup
      // already cleared the value captured at mount.
      const { pathname, search, hash } = window.location;
      if (hash.startsWith(HASH_PREFIX)) {
        window.history.replaceState(null, "", pathname + search);
      }
    };
    // startIndex is fixed for the lifetime of an open stack (the parent
    // only changes it while closed), so the open dance runs once.
  }, [startIndex]);

  // Track the settled slide: only one slide can cover ≥55% of the viewport.
  // Resetting the flip here keeps every arriving card face-up.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.55) continue;
          const g = Number((entry.target as HTMLElement).dataset.index);
          if (g !== posRef.current) {
            posRef.current = g;
            setPos(g);
            setFlipped(false);
          }
        }
      },
      { root: el, threshold: [0.55] },
    );
    for (const slide of slideRefs.current) {
      if (slide) io.observe(slide);
    }
    return () => {
      io.disconnect();
    };
  }, []);

  // Loop the deck: once a swipe settles in a clone copy, teleport (no
  // animation) to the identical slide of the middle copy. scrollend where
  // supported, an idle fallback everywhere else.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const settle = (): void => {
      const slideW = Math.max(1, el.clientWidth);
      const g = Math.round(el.scrollLeft / slideW);
      if (g < TOTAL || g >= TOTAL * 2) {
        el.scrollLeft = ((g % TOTAL) + TOTAL) * slideW;
      }
    };
    let idle = 0;
    const onScroll = (): void => {
      window.clearTimeout(idle);
      idle = window.setTimeout(settle, 120);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("scrollend", settle);
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("scrollend", settle);
      window.clearTimeout(idle);
    };
  }, []);

  // Deck depth while scrolling: the settled card sits at full scale, the
  // one arriving rises from the plane behind it. Direct style mutation
  // keeps scroll off the React render path.
  useEffect(() => {
    if (reduced) return;
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    const apply = (): void => {
      raf = 0;
      const slideW = Math.max(1, el.clientWidth);
      const p = el.scrollLeft / slideW;
      slideRefs.current.forEach((slide, i) => {
        const deck = slide?.firstElementChild as HTMLElement | null;
        if (!deck) return;
        const dist = Math.min(1, Math.abs(p - i));
        if (dist >= 1) {
          deck.style.opacity = "0";
          deck.style.transform = "";
          return;
        }
        deck.style.opacity = String(1 - 0.45 * dist);
        deck.style.transform = `scale(${(1 - 0.06 * dist).toFixed(4)})`;
      });
    };
    const onScroll = (): void => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    apply();
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  // Keep the deck position shareable: #card=<slug>.
  useEffect(() => {
    const { pathname, search } = window.location;
    window.history.replaceState(
      null,
      "",
      `${pathname}${search}${HASH_PREFIX}${artworks[pos % TOTAL].slug}`,
    );
  }, [pos]);

  // Warm the cache for the cards adjacent to the current one.
  useEffect(() => {
    [1, 2].forEach((d) => {
      const next = artworks[(pos % TOTAL) + d];
      if (!next) return;
      const img = new Image();
      img.src = artworkSrc(next.publicId, 650);
    });
  }, [pos]);

  const scrollToSlide = (g: number): void => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      left: g * el.clientWidth,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  const logical = pos % TOTAL;

  return (
    <dialog
      ref={dlgRef}
      id="artworkStackDialog"
      aria-label={t("overlay.label")}
      className="m-0 h-full max-h-full w-full max-w-full overflow-hidden border-0 bg-transparent p-0"
    >
      <div className="flex h-full flex-col pt-16">
        <button
          type="button"
          autoFocus
          onClick={() => {
            dlgRef.current?.close();
          }}
          aria-label={t("overlay.close")}
          className="absolute top-4 right-4 z-30 grid size-10 place-items-center rounded-full border border-cream/30 text-cream transition hover:bg-cream/10"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <div
          ref={scrollRef}
          role="group"
          aria-roledescription={t("overlay.carouselLabel")}
          aria-label={t("overlay.label")}
          className="no-scrollbar flex min-h-0 w-full flex-1 snap-x snap-mandatory overflow-x-auto overscroll-contain"
        >
          {Array.from({ length: COPIES }, (_, c) =>
            artworks.map((artwork, i) => {
              const g = c * TOTAL + i;
              return (
                <div
                  key={`${c}-${artwork.slug}`}
                  data-index={g}
                  ref={(el) => {
                    slideRefs.current[g] = el;
                  }}
                  aria-roledescription={t("overlay.slideLabel")}
                  aria-label={artwork.title}
                  className="flex h-full w-full shrink-0 snap-center snap-always items-center justify-center py-1"
                >
                  <div className="group relative w-[min(84vw,41.5vh)] perspective-distant">
                    {/* Resting deck planes peeking behind the card */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 scale-[0.95] translate-y-3.5 rounded-3xl border border-cream/15 bg-cream/10"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 scale-[0.90] translate-y-7 rounded-3xl border border-cream/10 bg-cream/5"
                    />
                    <div
                      role="button"
                      tabIndex={0}
                      aria-pressed={flipped && g === pos}
                      aria-label={t("card.flipAria", { title: artwork.title })}
                      onClick={() => {
                        setFlipped((v) => !v);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setFlipped((v) => !v);
                        } else if (e.key === "ArrowLeft") {
                          e.preventDefault();
                          scrollToSlide(pos - 1);
                        } else if (e.key === "ArrowRight") {
                          e.preventDefault();
                          scrollToSlide(pos + 1);
                        }
                      }}
                      className={cn(
                        "relative grid transform-3d transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                        flipped && g === pos && "transform-[rotateY(180deg)]",
                      )}
                    >
                      <ArtworkFront
                        artwork={artwork}
                        index={i}
                        badge={t("card.flip")}
                      />
                      <ArtworkBack artwork={artwork} index={i} />
                    </div>
                  </div>
                </div>
              );
            }),
          )}
        </div>

        {/* Scrolling is never the only way through: buttons + live counter */}
        <div className="flex flex-col items-center gap-3 pt-2 pb-6">
          <div className="flex items-center gap-5">
            <button
              type="button"
              aria-label={t("pages.prev")}
              onClick={() => {
                scrollToSlide(pos - 1);
              }}
              className="grid size-11 place-items-center rounded-full border border-cream/30 text-cream transition hover:bg-cream/10"
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
            </button>
            <p
              aria-live="polite"
              className="min-w-14 text-center text-[13px] font-bold text-cream tabular-nums"
            >
              {t("pages.counter", {
                current: pad2(logical + 1),
                total: pad2(TOTAL),
              })}
            </p>
            <button
              type="button"
              aria-label={t("pages.next")}
              onClick={() => {
                scrollToSlide(pos + 1);
              }}
              className="grid size-11 place-items-center rounded-full border border-cream/30 text-cream transition hover:bg-cream/10"
            >
              <ArrowRight className="size-5" aria-hidden="true" />
            </button>
          </div>
          <p className="text-[11px] font-medium text-cream/60">
            {t("overlay.swipeHint")}
          </p>
        </div>
      </div>
    </dialog>
  );
}
