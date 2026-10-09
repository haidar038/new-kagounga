import { Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import { SiteLayout } from "./SiteLayout";
import { HomePage } from "../pages/HomePage";
import {
  AboutPage,
  CatalogPage,
  ContactPage,
  MusicPage,
  NewsDetailPage,
  NewsPage,
  NotFoundPage,
  PrivacyPage,
  TermsPage,
} from "./pages";

function susp(el: ReactNode): ReactNode {
  return <Suspense fallback={null}>{el}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: susp(<AboutPage />) },
      { path: "/news", element: susp(<NewsPage />) },
      { path: "/news/:slug", element: susp(<NewsDetailPage />) },
      { path: "/catalog", element: susp(<CatalogPage />) },
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
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: susp(<AboutPage />) },
      { path: "news", element: susp(<NewsPage />) },
      { path: "news/:slug", element: susp(<NewsDetailPage />) },
      { path: "catalog", element: susp(<CatalogPage />) },
      { path: "contact", element: susp(<ContactPage />) },
      { path: "music", element: susp(<MusicPage />) },
      { path: "privacy", element: susp(<PrivacyPage />) },
      { path: "terms", element: susp(<TermsPage />) },
      { path: "*", element: susp(<NotFoundPage />) },
    ],
  },
]);
