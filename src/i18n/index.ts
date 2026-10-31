import { useLocation } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export type Locale = "en" | "id";

export const LOCALES: Locale[] = ["en", "id"];
export const DEFAULT_LOCALE: Locale = "en";
export const LANG_KEY = "kga-lang";
const BANNER_KEY = "kga-lang-banner";

// Locale bundles are loaded on demand, per namespace: a visit only downloads
// the JSON namespaces its route renders (~4 KB gzip for "/"), keeping both
// locales (~110 KB raw) and the unused namespaces off the hydration critical
// path. What the route skips backfills when idle (scheduleNamespaceBackfill)
// so later navigations never wait on i18n chunks.
const localeChunks = {
  en: import.meta.glob<{ default: Record<string, unknown> }>("../locales/en/*.json"),
  id: import.meta.glob<{ default: Record<string, unknown> }>("../locales/id/*.json"),
} as const;

const nsOf = (path: string): string =>
  (path.split("/").pop() ?? "").replace(/\.json$/, "");

export function listNamespaces(locale: Locale): string[] {
  return Object.keys(localeChunks[locale]).map(nsOf);
}

const loadedNamespaces = new Set<string>(); // `${locale}:${ns}`

let initPromise: Promise<void> | null = null;

/** i18next must be initialized before bundles register; chain onto it. */
async function whenReady(): Promise<void> {
  if (!initPromise) await initI18n();
  await initPromise;
}

/** Fetch + register specific namespaces once. Safe to call repeatedly. */
export async function ensureNamespaces(
  locale: Locale,
  namespaces: string[],
): Promise<void> {
  await whenReady();
  const pending = Object.entries(localeChunks[locale]).filter(
    ([path]) =>
      namespaces.includes(nsOf(path)) &&
      !loadedNamespaces.has(`${locale}:${nsOf(path)}`),
  );
  await Promise.all(
    pending.map(async ([path, load]) => {
      const ns = nsOf(path);
      const mod = await load();
      i18n.addResourceBundle(locale, ns, mod.default, true, true);
      loadedNamespaces.add(`${locale}:${ns}`);
    }),
  );
}

/** Every namespace of a locale. Used on explicit language switches. */
export async function ensureLocale(locale: Locale): Promise<void> {
  await ensureNamespaces(locale, listNamespaces(locale));
}

/** Load the namespaces the active route did not need. */
export async function ensureRemainingNamespaces(locale: Locale): Promise<void> {
  const missing = listNamespaces(locale).filter(
    (ns) => !loadedNamespaces.has(`${locale}:${ns}`),
  );
  await ensureNamespaces(locale, missing);
}

/** Backfill the rest of the locale once the main thread is idle. */
export function scheduleNamespaceBackfill(locale: Locale): void {
  if (typeof window === "undefined") return;
  const run = () => {
    void ensureRemainingNamespaces(locale).catch(() => {});
  };
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(run, { timeout: 3000 });
  } else {
    setTimeout(run, 1200);
  }
}

/** Call once before render. Route namespaces register via preloadPage; the
 *  whole set is awaited there before hydration, never inside init. */
export async function initI18n(locale?: Locale): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      await i18n.use(initReactI18next).init({
        lng: locale ?? getStoredLocale() ?? DEFAULT_LOCALE,
        fallbackLng: DEFAULT_LOCALE,
        defaultNS: "common",
        interpolation: { escapeValue: false },
        // Bundles register via ensureNamespaces after init resolves.
        partialBundledLanguages: true,
        resources: {},
      });
    })();
  }
  await initPromise;
  if (locale && i18n.language !== locale) {
    await i18n.changeLanguage(locale);
  }
}

export function getStoredLocale(): Locale | null {
  try {
    const v = localStorage.getItem(LANG_KEY);
    return v === "id" || v === "en" ? v : null;
  } catch {
    return null;
  }
}

export function setStoredLocale(locale: Locale): void {
  try {
    localStorage.setItem(LANG_KEY, locale);
  } catch {
    // storage unavailable, locale still applies in-memory via route
  }
}

export function shouldSuggestId(): boolean {
  try {
    if (sessionStorage.getItem(BANNER_KEY) === "seen") return false;
  } catch {
    return false;
  }
  return (
    typeof navigator !== "undefined" &&
    navigator.language.toLowerCase().startsWith("id")
  );
}

export function dismissSuggest(): void {
  try {
    sessionStorage.setItem(BANNER_KEY, "seen");
  } catch {
    // ignore
  }
}

import {
  getLocaleFromPath,
  stripLocalePrefix,
  toLocalePath,
} from "../lib/seo";

export { getLocaleFromPath, stripLocalePrefix, toLocalePath };

/** Prefix an internal link target for the given locale (query + hash preserved). */
export function localeLink(to: string, locale: Locale): string {
  if (!to.startsWith("/")) return to;
  const hash = to.indexOf("#");
  const query = to.indexOf("?");
  let cut = to.length;
  if (query !== -1) cut = Math.min(cut, query);
  if (hash !== -1) cut = Math.min(cut, hash);
  return `${toLocalePath(to.slice(0, cut), locale)}${to.slice(cut)}`;
}

/** Current locale derived from the route. Use inside Router context. */
export function useLocale(): Locale {
  const { pathname } = useLocation();
  return getLocaleFromPath(pathname);
}
