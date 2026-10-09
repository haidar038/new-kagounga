import type { Locale } from "../i18n";

function bcp47(locale: Locale): string {
  return locale === "id" ? "id-ID" : "en-GB";
}

/** Localized long date from ISO source. Falls back to raw ISO on invalid input. */
export function formatDateLabel(dateISO: string, locale: Locale): string {
  const day = dateISO.length === 10 ? `${dateISO}T00:00:00` : dateISO;
  const d = new Date(day);
  if (Number.isNaN(d.getTime())) return dateISO;
  try {
    return new Intl.DateTimeFormat(bcp47(locale), {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return dateISO;
  }
}

/** Localized full month name for a 0-based month index. */
export function monthName(month: number, locale: Locale): string {
  const d = new Date(2026, month, 1);
  try {
    return new Intl.DateTimeFormat(bcp47(locale), { month: "long" }).format(d);
  } catch {
    return String(month + 1);
  }
}
