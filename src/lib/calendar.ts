import type {
  CalApiRow,
  CalEventItem,
  CalYear,
  MonthData,
  MonthIndex,
  YearBuckets,
} from "../types/calendar";
import { isMonthIndex } from "../types/calendar";

export const MONTHS_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const CAL_CACHE_TTL_MS = 30 * 60 * 1000;

export const FALLBACK_MILESTONES: Record<CalYear, YearBuckets> = {
  2025: {},
  2026: {
    9: {
      events: [
        { date: "14-18", text: "Indonesia Sharia Economic Festival, Jakarta" },
        { date: "14-18", text: "Trade Expo Indonesia, Tangerang" },
        { date: "16-17", text: "Wonderful Indonesia Gastronomy, Jakarta" },
        { date: "23-24", text: "Smesco Expo, Jakarta" },
      ],
    },
  },
  2027: {},
};

function calApiUrl(): string {
  return import.meta.env.VITE_CAL_API_URL as string;
}

/** Cross-month option A: event stays in its start-month card, label spans full range. */
export function dayLabel(start: string, end?: string | null): string {
  const sd = String(start).substring(8, 10).replace(/^0/, "");
  if (!end) return sd;
  const ed = String(end).substring(8, 10).replace(/^0/, "");
  const sameDay =
    String(start).substring(0, 7) === String(end).substring(0, 7) &&
    String(start).substring(8, 10) === String(end).substring(8, 10);
  return sameDay ? sd : `${sd}-${ed}`;
}

export function bucketEvents(rows: CalApiRow[]): YearBuckets {
  const byMonth: YearBuckets = {};
  rows
    .slice()
    .sort((a, b) => String(a.date_start).localeCompare(String(b.date_start)))
    .forEach((evt) => {
      const m = parseInt(String(evt.date_start).substring(5, 7), 10) - 1;
      if (!isMonthIndex(m)) return;
      const slot: MonthData = byMonth[m] ?? { events: [] };
      const events: CalEventItem[] = [
        ...slot.events,
        {
          date: dayLabel(evt.date_start, evt.date_end),
          text: evt.nama_event + (evt.lokasi ? `, ${evt.lokasi}` : ""),
        },
      ];
      byMonth[m] = { events };
    });
  return byMonth;
}

function isCalApiRow(value: unknown): value is CalApiRow {
  if (typeof value !== "object" || value === null) return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.date_start === "string" &&
    typeof row.nama_event === "string" &&
    (row.date_end === undefined ||
      row.date_end === null ||
      typeof row.date_end === "string") &&
    (row.lokasi === undefined ||
      row.lokasi === null ||
      typeof row.lokasi === "string")
  );
}

interface YearCache {
  savedAt: number;
  data: CalApiRow[];
}

function cacheKey(year: CalYear): string {
  return `kga-cal-v1-${year}`;
}

function readYearCache(year: CalYear): YearCache | null {
  try {
    const raw = localStorage.getItem(cacheKey(year));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const { savedAt, data } = parsed as {
      savedAt?: unknown;
      data?: unknown;
    };
    if (typeof savedAt !== "number" || !Array.isArray(data)) return null;
    if (!data.every(isCalApiRow)) return null;
    return { savedAt, data };
  } catch {
    return null;
  }
}

function writeYearCache(year: CalYear, data: CalApiRow[]): void {
  try {
    const payload: YearCache = { savedAt: Date.now(), data };
    localStorage.setItem(cacheKey(year), JSON.stringify(payload));
  } catch {
    // storage unavailable, remote data still renders in-memory
  }
}

export interface HydratedYear {
  buckets: YearBuckets | null;
  fresh: boolean;
}

/** Stale-while-revalidate: paint last-fetched instantly, refresh in background. */
export function hydrateYear(year: CalYear): HydratedYear {
  const cached = readYearCache(year);
  if (!cached) return { buckets: null, fresh: false };
  return {
    buckets: bucketEvents(cached.data),
    fresh: Date.now() - cached.savedAt < CAL_CACHE_TTL_MS,
  };
}

export async function fetchYear(
  year: CalYear,
  signal: AbortSignal,
): Promise<CalApiRow[] | null> {
  const base = calApiUrl();
  if (!base) return null;
  const res = await fetch(`${base}?action=getEvents&year=${year}`, { signal });
  if (!res.ok) return null;
  const body: unknown = await res.json();
  if (typeof body !== "object" || body === null) return null;
  const { success, data } = body as { success?: unknown; data?: unknown };
  if (success !== true || !Array.isArray(data)) return null;
  if (!data.every(isCalApiRow)) return null;
  writeYearCache(year, data);
  return data;
}

export function pageMonths(page: number, size: number): MonthIndex[] {
  const out: MonthIndex[] = [];
  for (let j = 0; j < size; j += 1) {
    const m = page * size + j;
    if (isMonthIndex(m)) out.push(m);
  }
  return out;
}

export function hasEvents(
  buckets: YearBuckets | undefined,
  month: MonthIndex,
): boolean {
  const d = buckets?.[month];
  return Boolean(d && d.events.length > 0);
}

export function isPastMonth(
  year: CalYear,
  month: MonthIndex,
  now: Date,
): boolean {
  return (
    year < now.getFullYear() ||
    (year === now.getFullYear() && month < now.getMonth())
  );
}

export function isCurrentMonth(
  year: CalYear,
  month: MonthIndex,
  now: Date,
): boolean {
  return year === now.getFullYear() && month === now.getMonth();
}

export type MonthKind = "done" | "idle" | "empty" | "now" | "later";

export function monthKind(
  year: CalYear,
  month: MonthIndex,
  buckets: YearBuckets | undefined,
  now: Date,
): MonthKind {
  const ev = hasEvents(buckets, month);
  if (isPastMonth(year, month, now)) return ev ? "done" : "idle";
  if (!ev) return "empty";
  return isCurrentMonth(year, month, now) ? "now" : "later";
}
