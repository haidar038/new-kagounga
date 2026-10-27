import { createElement, type ComponentType, type ReactElement } from "react";
import { stripLocalePrefix } from "../lib/seo";

interface PageModule {
  default: ComponentType;
}

/**
 * Like React.lazy, but exposes a preload promise. Awaiting the current route
 * before hydration makes the first render resolve synchronously, so the
 * prerendered body matches instead of falling back to an empty Suspense.
 */
function lazyPage(loader: () => Promise<PageModule>) {
  let Loaded: ComponentType | null = null;
  let promise: Promise<void> | null = null;
  const preload = (): Promise<void> => {
    promise ??= loader().then((mod) => {
      Loaded = mod.default;
    });
    return promise;
  };
  function LazyPage(): ReactElement {
    if (Loaded) return createElement(Loaded);
    throw preload();
  }
  return { Component: LazyPage, preload };
}

const About = lazyPage(() =>
  import("../pages/AboutPage").then((m) => ({ default: m.AboutPage })),
);
const Artworks = lazyPage(() =>
  import("../pages/ArtworksPage").then((m) => ({ default: m.ArtworksPage })),
);
const News = lazyPage(() =>
  import("../pages/NewsPage").then((m) => ({ default: m.NewsPage })),
);
const NewsDetail = lazyPage(() =>
  import("../pages/NewsDetailPage").then((m) => ({
    default: m.NewsDetailPage,
  })),
);
const Catalog = lazyPage(() =>
  import("../pages/CatalogPage").then((m) => ({ default: m.CatalogPage })),
);
const Product = lazyPage(() =>
  import("../pages/ProductPage").then((m) => ({ default: m.ProductPage })),
);
const Stockist = lazyPage(() =>
  import("../pages/StockistPage").then((m) => ({ default: m.StockistPage })),
);
const Music = lazyPage(() =>
  import("../pages/MusicPage").then((m) => ({ default: m.MusicPage })),
);
const Contact = lazyPage(() =>
  import("../pages/ContactPage").then((m) => ({ default: m.ContactPage })),
);
const NotFound = lazyPage(() =>
  import("../pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);
const Privacy = lazyPage(() =>
  import("../pages/PrivacyPage").then((m) => ({ default: m.PrivacyPage })),
);
const Terms = lazyPage(() =>
  import("../pages/TermsPage").then((m) => ({ default: m.TermsPage })),
);
const ThankYou = lazyPage(() =>
  import("../pages/ThankYouPage").then((m) => ({ default: m.ThankYouPage })),
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
export const TermsPage = Terms.Component;
export const ThankYouPage = ThankYou.Component;

/** Load the chunk for the current URL before hydrating prerendered HTML. */
export async function preloadPage(pathname: string): Promise<void> {
  const stripped = stripLocalePrefix(pathname);
  const path = stripped.length > 1 ? stripped.replace(/\/+$/, "") : stripped;
  if (path === "/about") return About.preload();
  if (path === "/artworks") return Artworks.preload();
  if (path === "/news") return News.preload();
  if (path.startsWith("/news/")) return NewsDetail.preload();
  if (path === "/catalog") return Catalog.preload();
  if (path.startsWith("/catalog/")) return Product.preload();
  if (path.startsWith("/stockists/")) return Stockist.preload();
  if (path === "/music") return Music.preload();
  if (path === "/contact") return Contact.preload();
  if (path === "/privacy") return Privacy.preload();
  if (path === "/terms") return Terms.preload();
  if (path === "/thank-you") return ThankYou.preload();
}
