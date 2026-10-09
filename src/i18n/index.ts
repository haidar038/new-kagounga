import { useLocation } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enAbout from "../locales/en/about.json";
import enCatalog from "../locales/en/catalog.json";
import enCommon from "../locales/en/common.json";
import enContact from "../locales/en/contact.json";
import enHome from "../locales/en/home.json";
import enLegal from "../locales/en/legal.json";
import enMusic from "../locales/en/music.json";
import enNews from "../locales/en/news.json";
import enSeo from "../locales/en/seo.json";
import idAbout from "../locales/id/about.json";
import idCatalog from "../locales/id/catalog.json";
import idCommon from "../locales/id/common.json";
import idContact from "../locales/id/contact.json";
import idHome from "../locales/id/home.json";
import idLegal from "../locales/id/legal.json";
import idMusic from "../locales/id/music.json";
import idNews from "../locales/id/news.json";
import idSeo from "../locales/id/seo.json";

export type Locale = "en" | "id";

export const LOCALES: Locale[] = ["en", "id"];
export const DEFAULT_LOCALE: Locale = "en";
export const LANG_KEY = "kga-lang";
const BANNER_KEY = "kga-lang-banner";

const resources = {
  en: {
    about: enAbout,
    catalog: enCatalog,
    common: enCommon,
    contact: enContact,
    home: enHome,
    legal: enLegal,
    music: enMusic,
    news: enNews,
    seo: enSeo,
  },
  id: {
    about: idAbout,
    catalog: idCatalog,
    common: idCommon,
    contact: idContact,
    home: idHome,
    legal: idLegal,
    music: idMusic,
    news: idNews,
    seo: idSeo,
  },
} as const;

let started = false;

/** Call once in main.tsx before render. Static resources: no extra dep, tiny bundle. */
export function initI18n(): void {
  if (started) return;
  started = true;
  void i18n.use(initReactI18next).init({
    resources,
    lng: getStoredLocale() ?? DEFAULT_LOCALE,
    fallbackLng: DEFAULT_LOCALE,
    defaultNS: "common",
    interpolation: { escapeValue: false },
  });
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
