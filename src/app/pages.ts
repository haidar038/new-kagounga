import { createElement, type ComponentType, type ReactElement } from "react";
import { stripLocalePrefix } from "../lib/seo";
import {
  ensureNamespaces,
  getLocaleFromPath,
  type Locale,
} from "../i18n";

interface PageModule {
  default: ComponentType;
}

/** Locale of the current browser navigation. SSR callers pass the locale
 *  explicitly to preload(); the thrown-promise path only runs in the browser. */
function navigationLocale(): Locale {
  if (typeof window !== "undefined") {
    return getLocaleFromPath(window.location.pathname);
  }
  return "en";
}

/**
 * Like React.lazy, but exposes a preload promise covering the route chunk AND
 * the i18n namespaces the page tree renders. Awaiting the current route before
 * hydration makes the first render resolve synchronously, so the prerendered
 * body matches instead of falling back to an empty Suspense (or raw i18n keys).
 */
function lazyPage(loader: () => Promise<PageModule>, namespaces: string[]) {
  let Loaded: ComponentType | null = null;
  let promise: Promise<void> | null = null;
  const preload = (locale?: Locale): Promise<void> => {
    promise ??= Promise.all([
      loader().then((mod) => {
        Loaded = mod.default;
      }),
      ensureNamespaces(locale ?? navigationLocale(), namespaces),
    ]).then(() => {});
    return promise;
  };
  function LazyPage(): ReactElement {
    if (Loaded) return createElement(Loaded);
    throw preload();
  }
  return { Component: LazyPage, preload };
}

const About = lazyPage(
  () => import("../pages/AboutPage").then((m) => ({ default: m.AboutPage })),
  ["about", "seo", "common"],
);
const Artworks = lazyPage(
  () => import("../pages/ArtworksPage").then((m) => ({ default: m.ArtworksPage })),
  ["artworks", "seo", "common"],
);
const News = lazyPage(
  () => import("../pages/NewsPage").then((m) => ({ default: m.NewsPage })),
  ["news", "seo", "common"],
);
const NewsDetail = lazyPage(
  () =>
    import("../pages/NewsDetailPage").then((m) => ({
      default: m.NewsDetailPage,
    })),
  ["news", "seo", "common"],
);
const Catalog = lazyPage(
  () => import("../pages/CatalogPage").then((m) => ({ default: m.CatalogPage })),
  ["catalog", "seo", "common"],
);
const Product = lazyPage(
  () => import("../pages/ProductPage").then((m) => ({ default: m.ProductPage })),
  // seo: the error boundary needs it even though ProductPage itself does not.
  ["productPage", "catalog", "seo", "common"],
);
const Stockist = lazyPage(
  () => import("../pages/StockistPage").then((m) => ({ default: m.StockistPage })),
  ["stockists", "contact", "seo", "common"],
);
const Music = lazyPage(
  () => import("../pages/MusicPage").then((m) => ({ default: m.MusicPage })),
  ["music", "seo", "common"],
);
const Contact = lazyPage(
  () => import("../pages/ContactPage").then((m) => ({ default: m.ContactPage })),
  ["contact", "seo", "common"],
);
const NotFound = lazyPage(
  () => import("../pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
  ["seo", "common"],
);
const Privacy = lazyPage(
  () => import("../pages/PrivacyPage").then((m) => ({ default: m.PrivacyPage })),
  ["legal", "seo", "common"],
);
const Editorial = lazyPage(
  () => import("../pages/EditorialPage").then((m) => ({ default: m.EditorialPage })),
  ["editorial", "seo", "common"],
);
const Terms = lazyPage(
  () => import("../pages/TermsPage").then((m) => ({ default: m.TermsPage })),
  ["legal", "seo", "common"],
);
const ThankYou = lazyPage(
  () => import("../pages/ThankYouPage").then((m) => ({ default: m.ThankYouPage })),
  ["thankYou", "seo", "common"],
);

export const AboutPage = About.Component;
export const ArtworksPage = Artworks.Component;
export const NewsPage = News.Component;
export const NewsDetailPage = NewsDetail.Component;
export const CatalogPage = Catalog.Component;
export const ProductPage = Product.Component;
export const StockistPage = Stockist.Component;
export const MusicPage = Music.Component;
export const ContactPage = Contact.Component;
export const NotFoundPage = NotFound.Component;
export const PrivacyPage = Privacy.Component;
export const EditorialPage = Editorial.Component;
export const TermsPage = Terms.Component;
export const ThankYouPage = ThankYou.Component;

/** Namespaces rendered by the eagerly-imported HomePage + SiteLayout. */
const HOME_NAMESPACES = ["common", "home", "seo"];

/** Load the chunk + i18n namespaces for the current URL before hydrating
 *  prerendered HTML. "/" ships HomePage inside the entry chunk, so only its
 *  namespaces are awaited here; unknown paths still need the error boundary's. */
export async function preloadPage(pathname: string): Promise<void> {
  const locale = getLocaleFromPath(pathname);
  const stripped = stripLocalePrefix(pathname);
  const path = stripped.length > 1 ? stripped.replace(/\/+$/, "") : stripped;
  if (path === "/" || path === "") return ensureNamespaces(locale, HOME_NAMESPACES);
  if (path === "/about") return About.preload(locale);
  if (path === "/artworks") return Artworks.preload(locale);
  if (path === "/news") return News.preload(locale);
  if (path.startsWith("/news/")) return NewsDetail.preload(locale);
  if (path === "/catalog") return Catalog.preload(locale);
  if (path.startsWith("/catalog/")) return Product.preload(locale);
  if (path.startsWith("/stockists/")) return Stockist.preload(locale);
  if (path === "/music") return Music.preload(locale);
  if (path === "/contact") return Contact.preload(locale);
  if (path === "/privacy") return Privacy.preload(locale);
  if (path === "/editorial") return Editorial.preload(locale);
  if (path === "/terms") return Terms.preload(locale);
  if (path === "/thank-you") return ThankYou.preload(locale);
  return ensureNamespaces(locale, ["seo", "common"]);
}
