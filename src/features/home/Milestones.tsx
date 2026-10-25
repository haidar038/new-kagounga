import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type {
  CalEventItem,
  CalYear,
  MonthIndex,
  YearBuckets,
} from "../../types/calendar";
import { calYears, isCalYear } from "../../types/calendar";
import {
  FALLBACK_MILESTONES,
  hasEvents,
  monthKind,
  pageMonths,
} from "../../lib/calendar";
import { monthName } from "../../lib/format";
import { useLocale } from "../../i18n";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useMilestonesYear } from "../../hooks/useMilestones";
import { Reveal } from "../../components/Reveal";
import { cn } from "../../lib/cn";

const FIXED_NOW = new Date(2026, 0, 1);

/** Jumlah agenda yang tampil per halaman kartu bulan sebelum daftar bisa digulir. */
const EVENTS_PER_PAGE = 4;

/**
 * Kolom tanggal (lebar tetap) + deskripsi rata seperti tabel:
 *   12-13  Indonesia Sharia Economic Festival, Jakarta
 *   14     Trade Expo Indonesia, Tangerang
 *
 * > EVENTS_PER_PAGE: kotak dapat digulir vertikal tanpa scrollbar, snap per
 *   item (setiap awal halaman - item ke-1 - memakai snap-always agar geseran
 *   tidak melompati batas halaman), gaya scroll mengikuti container utama.
 */
function EventRows({
  events,
  label,
  tone,
}: {
  events: CalEventItem[];
  label: string;
  tone: "dark" | "light";
}): React.JSX.Element {
  const { t } = useTranslation("home");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
  const scrollable = events.length > EVENTS_PER_PAGE;
  const pageCount = Math.ceil(events.length / EVENTS_PER_PAGE);

  // Proportional mapping: a partial last page still reaches its own dot.
  // Native listener: React's synthetic onScroll is unreliable for non-bubbling
  // scroll events on this list.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !scrollable || pageCount < 2) return;
    const onScroll = (): void => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      const page =
        maxScroll > 0
          ? Math.round((el.scrollTop / maxScroll) * (pageCount - 1))
          : 0;
      setActivePage((prev) => (prev === page ? prev : page));
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
    };
  }, [scrollable, pageCount]);

  const goToPage = (page: number): void => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    el.scrollTo({
      top: Math.min(page * el.clientHeight, maxScroll),
      behavior: reduced ? "auto" : "smooth",
    });
  };

  const rows = (
    <div
      ref={scrollerRef}
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-2.5 text-xs",
        scrollable &&
        "no-scrollbar max-h-[6.875rem] snap-y snap-mandatory overflow-y-auto overscroll-contain",
      )}
      role="list"
      aria-label={label}
      tabIndex={scrollable ? 0 : undefined}
    >
      {events.map((e, i) => (
        <div
          key={`${e.date}-${e.text}-${i}`}
          role="listitem"
          className={cn(
            "flex snap-start items-start gap-2",
            scrollable && i % EVENTS_PER_PAGE === 0 && "snap-always",
          )}
        >
          <span className="w-11 shrink-0 font-bold leading-5">{e.date}</span>
          <span className="min-w-0 flex-1 leading-5">{e.text}</span>
        </div>
      ))}
    </div>
  );

  if (!scrollable || pageCount < 2) return rows;

  return (
    <div className="flex items-stretch gap-3">
      {rows}
      <div
        role="group"
        aria-label={t("milestones.pages")}
        className="flex flex-col justify-center gap-2"
      >
        {Array.from({ length: pageCount }, (_, p) => (
          <button
            key={p}
            type="button"
            className="cursor-pointer p-0.5"
            aria-label={t("milestones.pageOf", { current: p + 1, total: pageCount })}
            aria-current={p === activePage}
            onClick={() => {
              goToPage(p);
            }}
          >
            <span
              className={cn(
                "event-dot",
                tone === "dark" && "on-dark",
                p === activePage && "active",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function MonthCard({
  year,
  month,
  buckets,
  now,
}: {
  year: CalYear;
  month: MonthIndex;
  buckets: YearBuckets | undefined;
  now: Date;
}): React.JSX.Element {
  const data = buckets?.[month];
  const kind = monthKind(year, month, buckets, now);
  const ev = hasEvents(buckets, month);
  const { t } = useTranslation("home");
  const locale = useLocale();

  const card = cn(
    "flex min-h-fit-content flex-col rounded-[20px] p-6 md:min-h-fit-content md:p-8",
    kind === "done" && "bg-ink text-cream",
    kind === "now" && "bg-lime",
    kind === "later" && "bg-lime/35",
    (kind === "idle" || kind === "empty") && "border border-ink/10 bg-white",
  );
  const badge =
    kind === "done" ? (
      <span className="text-[13px] font-bold text-lime">{t("milestones.status.done")}</span>
    ) : kind === "idle" ? (
      <span className="text-[13px] font-bold">{t("milestones.status.idle")}</span>
    ) : ev ? (
      <span className="rounded-full bg-white/50 px-4 py-2 text-[12px] font-bold">
        {t("milestones.status.scheduled")}
      </span>
    ) : (
      <span className="text-[13px] font-bold">{t("milestones.status.tba")}</span>
    );
  const divider = kind === "done" ? "border-cream/20" : "border-ink/15";

  return (
    <article className={card}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-[20px] font-bold tracking-tight md:text-[24px]">
            {monthName(month, locale)}
          </h3>
          <p className="mt-0.5 text-xs">{year}</p>
        </div>
        {badge}
      </div>
      <div className={cn("my-4 border-t", divider)} />
      {ev && data ? (
        <EventRows
          events={data.events}
          label={t("milestones.events")}
          tone={kind === "done" ? "dark" : "light"}
        />
      ) : kind === "idle" ? (
        <p className="mt-auto pt-8 text-[12px] font-medium tracking-wide">
          {t("milestones.status.noAgenda")}
        </p>
      ) : (
        <p className="mt-auto pt-8 text-[12px] font-medium tracking-wide">
          {t("milestones.status.announced")}
        </p>
      )}
    </article>
  );
}

export function Milestones(): React.JSX.Element {
  const { t } = useTranslation("home");
  const locale = useLocale();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px)");
  // Fixed during SSR/hydration; switches to the client date after hydration.
  const [now, setNow] = useState(FIXED_NOW);
  useEffect(() => {
    void Promise.resolve().then(() => {
      setNow(new Date());
    });
  }, []);
  const [selectedYear, setSelectedYear] = useState<CalYear | null>(null);
  const currentYear = now.getFullYear();
  const calYear =
    selectedYear ??
    (isCalYear(currentYear) ? currentYear : calYears[calYears.length - 1]);
  const [anchorMonth, setAnchorMonth] = useState<number | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const { buckets: remote } = useMilestonesYear(calYear);

  // Segmen halaman per breakpoint: desktop 3, tablet 2, mobile 1 — sinkron
  // dengan grid-cols di bawah (md:grid-cols-2 lg:grid-cols-3).
  const size = isDesktop ? 3 : isTablet ? 2 : 1;
  const pages = 12 / size;
  const anchor = anchorMonth ?? now.getMonth();
  const calPage = Math.floor(anchor / size);
  const buckets = remote ?? FALLBACK_MILESTONES[calYear];
  const months = pageMonths(calPage, size);
  const moveMonth = (direction: number): void => {
    setAnchorMonth((prev) => {
      const from = prev ?? now.getMonth();
      return (from + direction * size + 12) % 12;
    });
  };
  const selectYear = (year: CalYear): void => {
    setSelectedYear(year);
    setAnchorMonth(year === now.getFullYear() ? now.getMonth() : 0);
  };

  return (
    <section id="milestones" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <h2 className="display text-5xl md:text-6xl">
            <span className="font-bold">{t("milestones.titleBold")}</span>
            <br />
            <span className="font-light">{t("milestones.titleLight")}</span>
          </h2>
        </Reveal>
        <Reveal>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink/70">
            {t("milestones.lede")}
          </p>
        </Reveal>
        <div className="mt-8 border-t border-ink/10" />

        <div className="mt-6 flex items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label={t("milestones.yearLabel")}
            className="flex max-w-full snap-x gap-1 overflow-x-auto rounded-full border border-ink/10 bg-white p-1.5 md:inline-flex md:flex-wrap md:overflow-visible"
          >
            {calYears.map((year) => (
              <button
                key={year}
                type="button"
                role="tab"
                aria-selected={calYear === year}
                onClick={() => {
                  selectYear(year);
                }}
                className={cn(
                  "shrink-0 rounded-full px-7 py-2.5 text-[15px] font-bold text-ink md:px-9",
                  calYear === year ? "bg-lime" : "hover:bg-ink/5",
                )}
              >
                {year}
              </button>
            ))}
          </div>
          <div className="hidden shrink-0 gap-2 md:flex">
            <button
              type="button"
              aria-label={t("milestones.prev")}
              onClick={() => {
                moveMonth(-1);
              }}
              className="grid size-11 place-items-center rounded-full border border-ink/10 bg-white transition hover:border-ink/30"
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={t("milestones.next")}
              onClick={() => {
                moveMonth(1);
              }}
              className="grid size-11 place-items-center rounded-full border border-ink/10 bg-white transition hover:border-ink/30"
            >
              <ArrowRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          key={`${calYear}-${calPage}`}
          aria-live="polite"
          onTouchStart={(e) => {
            const t = e.touches[0];
            touch.current = { x: t.clientX, y: t.clientY };
          }}
          onTouchEnd={(e) => {
            const start = touch.current;
            touch.current = null;
            if (!start || size === 3) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - start.x;
            const dy = t.clientY - start.y;
            if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
            moveMonth(dx < 0 ? 1 : -1);
          }}
          className="mt-6 grid animate-enter gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {months.map((m) => (
            <MonthCard
              key={m}
              year={calYear}
              month={m}
              buckets={buckets}
              now={now}
            />
          ))}
        </div>

        {!isTablet ? (
          <div
            role="group"
            aria-label={`${monthName(Math.min(11, calPage * size), locale)} ${calYear}`}
            className="mt-8 flex items-center justify-center gap-2.5"
          >
            <div className="w-full max-w-xs">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                <div
                  className="h-full w-full origin-left rounded-full bg-lime transition-transform duration-300"
                  style={{
                    transform: `scaleX(${(Math.min(11, calPage * size) + 1) / 12})`,
                  }}
                />
              </div>
              <p className="mt-2 text-center text-[12px] font-bold text-ink/70">
                {monthName(Math.min(11, calPage * size), locale)} {calYear}
              </p>
            </div>
          </div>
        ) : (
          <div
            role="group"
            aria-label={t("milestones.pages")}
            className="mt-8 flex items-center justify-center gap-2.5"
          >
            {Array.from({ length: pages }, (_, p) => (
              <button
                key={p}
                type="button"
                className="cursor-pointer p-1"
                aria-label={t("milestones.pageOf", { current: p + 1, total: pages })}
                aria-current={p === calPage}
                onClick={() => {
                  setAnchorMonth(p * size);
                }}
              >
                <span
                  className={cn("page-dot", p === calPage && "active")}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
