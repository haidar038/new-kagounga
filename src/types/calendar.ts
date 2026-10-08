export const calYears = [2025, 2026, 2027] as const;
export type CalYear = (typeof calYears)[number];

export type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface CalEventItem {
  date: string;
  text: string;
}

export interface MonthData {
  events: CalEventItem[];
}

/** Sparse map: month index -> month data. Presence of a year key means remote won (even when empty). */
export type YearBuckets = Partial<Record<MonthIndex, MonthData>>;

export interface CalApiRow {
  date_start: string;
  date_end?: string | null;
  nama_event: string;
  lokasi?: string | null;
}

export type YearFetchState =
  | "idle"
  | "pending"
  | "live"
  | "failed"
  | "cached-fresh"
  | "cached-stale";

export function isCalYear(value: unknown): value is CalYear {
  return (
    typeof value === "number" &&
    (calYears as readonly number[]).includes(value)
  );
}

export function isMonthIndex(value: unknown): value is MonthIndex {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 11
  );
}
