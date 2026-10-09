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
      { path: "*", element: susp(<NotFoundPage />) },
    ],
  },
]);
