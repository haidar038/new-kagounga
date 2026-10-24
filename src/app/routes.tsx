import { Suspense, type ReactNode } from "react";
import type { RouteObject } from "react-router-dom";
import { SiteLayout } from "./SiteLayout";
import { HomePage } from "../pages/HomePage";
import { ErrorPage } from "../pages/ErrorPage";
import {
  AboutPage,
  ArtworksPage,
  CatalogPage,
  ContactPage,
  MusicPage,
  NewsDetailPage,
  NewsPage,
  NotFoundPage,
  PrivacyPage,
  ProductPage,
  StockistPage,
  TermsPage,
} from "./pages";

function susp(el: ReactNode): ReactNode {
  return <Suspense fallback={null}>{el}</Suspense>;
}

/** Shared route tree: browser router (client) + memory router (prerender). */
export const routes: RouteObject[] = [
  {
    element: <SiteLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: susp(<AboutPage />) },
      { path: "/news", element: susp(<NewsPage />) },
      { path: "/news/:slug", element: susp(<NewsDetailPage />) },
      { path: "/catalog", element: susp(<CatalogPage />) },
      { path: "/catalog/:slug", element: susp(<ProductPage />) },
      { path: "/artworks", element: susp(<ArtworksPage />) },
      { path: "/stockists/:city", element: susp(<StockistPage />) },
      { path: "/contact", element: susp(<ContactPage />) },
      { path: "/music", element: susp(<MusicPage />) },
      { path: "/privacy", element: susp(<PrivacyPage />) },
      { path: "/terms", element: susp(<TermsPage />) },
      { path: "*", element: susp(<NotFoundPage />) },
    ],
  },
  {
    // Indonesian locale. Same components, locale from path prefix.
    path: "/id",
    element: <SiteLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: susp(<AboutPage />) },
      { path: "news", element: susp(<NewsPage />) },
      { path: "news/:slug", element: susp(<NewsDetailPage />) },
      { path: "catalog", element: susp(<CatalogPage />) },
      { path: "catalog/:slug", element: susp(<ProductPage />) },
      { path: "artworks", element: susp(<ArtworksPage />) },
      { path: "stockists/:city", element: susp(<StockistPage />) },
      { path: "contact", element: susp(<ContactPage />) },
      { path: "music", element: susp(<MusicPage />) },
      { path: "privacy", element: susp(<PrivacyPage />) },
      { path: "terms", element: susp(<TermsPage />) },
      { path: "*", element: susp(<NotFoundPage />) },
    ],
  },
];
