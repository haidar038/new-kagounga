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

export const AboutPage = About.Component;
export const NewsPage = News.Component;
export const NewsDetailPage = NewsDetail.Component;
export const CatalogPage = Catalog.Component;
export const MusicPage = Music.Component;
export const ContactPage = Contact.Component;
export const NotFoundPage = NotFound.Component;
export const PrivacyPage = Privacy.Component;
export const TermsPage = Terms.Component;

/** Load the chunk for the current URL before hydrating prerendered HTML. */
export async function preloadPage(pathname: string): Promise<void> {
  const stripped = stripLocalePrefix(pathname);
  const path = stripped.length > 1 ? stripped.replace(/\/+$/, "") : stripped;
  if (path === "/about") return About.preload();
  if (path === "/news") return News.preload();
  if (path.startsWith("/news/")) return NewsDetail.preload();
  if (path === "/catalog") return Catalog.preload();
  if (path === "/music") return Music.preload();
  if (path === "/contact") return Contact.preload();
  if (path === "/privacy") return Privacy.preload();
  if (path === "/terms") return Terms.preload();
}
