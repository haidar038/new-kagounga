import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type {
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

function initialYear(): CalYear {
  const y = new Date().getFullYear();
  return isCalYear(y) ? y : 2026;
}

function initialPage(isDesktop: boolean): number {
  const now = new Date();
  const anchor = isCalYear(now.getFullYear()) ? now.getMonth() : 9;
  return Math.floor(anchor / (isDesktop ? 3 : 1));
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
        <div>
          <h5 className="text-[20px] font-bold tracking-tight md:text-[24px]">
            {monthName(month, locale)}
          </h5>
          <p className="mt-0.5 text-xs">{year}</p>
        </div>
        {badge}
      </div>
      <div className={cn("my-4 border-t", divider)} />
      {ev && data ? (
        <ul className="grid gap-2.5 text-xs">
          {data.events.map((e, i) => (
            <li key={`${e.date}-${e.text}-${i}`} className="flex gap-2">
              <span className="shrink-0 font-bold">{e.date}</span>
              <span>{e.text}</span>
            </li>
          ))}
        </ul>
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
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [now] = useState(() => new Date());
  const [calYear, setCalYear] = useState<CalYear>(initialYear);
  const [calPage, setCalPage] = useState<number>(() =>
    initialPage(
      typeof window === "undefined"
        ? false
        : window.matchMedia("(min-width: 768px)").matches,
    ),
  );
  const anchorRef = useRef<number>(9);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const { buckets: remote } = useMilestonesYear(calYear);

  const size = isDesktop ? 3 : 1;
  const pages = 12 / size;
  const buckets = remote ?? FALLBACK_MILESTONES[calYear];
  const months = pageMonths(calPage, size);

  // Keep anchor month across breakpoint changes (3/page <-> 1/page).
  useEffect(() => {
    setCalPage(Math.floor(anchorRef.current / size));
  }, [size]);
  useEffect(() => {
    anchorRef.current = Math.min(11, calPage * size);
  }, [calPage, size]);

  const selectYear = (year: CalYear): void => {
    setCalYear(year);
    const anchor =
      year === now.getFullYear() ? now.getMonth() : 0;
    anchorRef.current = anchor;
    setCalPage(Math.floor(anchor / size));
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
                setCalPage((p) => (p - 1 + pages) % pages);
              }}
              className="grid size-11 place-items-center rounded-full border border-ink/10 bg-white transition hover:border-ink/30"
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={t("milestones.next")}
              onClick={() => {
                setCalPage((p) => (p + 1) % pages);
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
            if (!start || isDesktop) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - start.x;
            const dy = t.clientY - start.y;
            if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
            setCalPage((p) => (p + (dx < 0 ? 1 : -1) + pages) % pages);
          }}
          className="mt-6 grid animate-enter gap-5 md:grid-cols-3"
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

        {!isDesktop ? (
          <div
            role="group"
            aria-label={`${monthName(Math.min(11, calPage * size), locale)} ${calYear}`}
            className="mt-8 flex items-center justify-center gap-2.5"
          >
            <div className="w-full max-w-xs">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                <div
                  className="h-full rounded-full bg-lime transition-all"
                  style={{
                    width: `${Math.round((((Math.min(11, calPage * size)) + 1) / 12) * 100)}%`,
                  }}
                />
              </div>
              <p className="mt-2 text-center text-[12px] font-bold text-ink/50">
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
                  setCalPage(p);
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
