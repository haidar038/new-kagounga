import { useLocation } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export type Locale = "en" | "id";

export const LOCALES: Locale[] = ["en", "id"];
export const DEFAULT_LOCALE: Locale = "en";
export const LANG_KEY = "kga-lang";
const BANNER_KEY = "kga-lang-banner";

// Locale bundles are loaded on demand: a visit only downloads the JSON of the
// language it renders (~12 KB gzip), keeping both locales (~110 KB raw) out of
// the main bundle and off the critical path.
const localeChunks = {
  en: import.meta.glob<{ default: Record<string, unknown> }>("../locales/en/*.json"),
  id: import.meta.glob<{ default: Record<string, unknown> }>("../locales/id/*.json"),
} as const;

const loadedLocales = new Set<Locale>();

/** Fetch + register a locale's namespaces once. Safe to call repeatedly. */
export async function ensureLocale(locale: Locale): Promise<void> {
  if (loadedLocales.has(locale)) return;
  const entries = await Promise.all(
    Object.entries(localeChunks[locale]).map(async ([path, load]) => {
      const ns = (path.split("/").pop() ?? "").replace(/\.json$/, "");
      const mod = await load();
      return [ns, mod.default] as const;
    }),
  );
  for (const [ns, data] of entries) {
    i18n.addResourceBundle(locale, ns, data, true, true);
  }
  loadedLocales.add(locale);
}

let initPromise: Promise<void> | null = null;

/** Call once before render. Resources load async; awaited before hydration. */
export async function initI18n(locale?: Locale): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      await i18n.use(initReactI18next).init({
        lng: locale ?? getStoredLocale() ?? DEFAULT_LOCALE,
        fallbackLng: DEFAULT_LOCALE,
        defaultNS: "common",
        interpolation: { escapeValue: false },
        // Bundles are registered via ensureLocale right after init.
        partialBundledLanguages: true,
        resources: {},
      });
      await ensureLocale(i18n.language === "id" ? "id" : "en");
    })();
  }
  await initPromise;
  if (locale && i18n.language !== locale) {
    await ensureLocale(locale);
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
