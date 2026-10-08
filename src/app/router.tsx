import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { SiteLayout } from "./SiteLayout";
import { HomePage } from "../pages/HomePage";
import { AboutPage } from "../pages/AboutPage";
import { NewsPage } from "../pages/NewsPage";
import { NewsDetailPage } from "../pages/NewsDetailPage";
import { CatalogPage } from "../pages/CatalogPage";
import { MusicPage } from "../pages/MusicPage";

const ContactPage = lazy(() =>
  import("../pages/ContactPage").then((m) => ({ default: m.ContactPage })),
);

export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/news", element: <NewsPage /> },
      { path: "/news/:slug", element: <NewsDetailPage /> },
      { path: "/catalog", element: <CatalogPage /> },
      {
        path: "/contact",
        element: (
          <Suspense fallback={null}>
            <ContactPage />
          </Suspense>
        ),
      },
      { path: "/music", element: <MusicPage /> },
      { path: "*", element: <HomePage /> },
    ],
  },
]);
