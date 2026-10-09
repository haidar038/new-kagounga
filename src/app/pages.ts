import { lazy } from "react";

export const AboutPage = lazy(() =>
  import("../pages/AboutPage").then((m) => ({ default: m.AboutPage })),
);
export const NewsPage = lazy(() =>
  import("../pages/NewsPage").then((m) => ({ default: m.NewsPage })),
);
export const NewsDetailPage = lazy(() =>
  import("../pages/NewsDetailPage").then((m) => ({
    default: m.NewsDetailPage,
  })),
);
export const CatalogPage = lazy(() =>
  import("../pages/CatalogPage").then((m) => ({ default: m.CatalogPage })),
);
export const MusicPage = lazy(() =>
  import("../pages/MusicPage").then((m) => ({ default: m.MusicPage })),
);
export const ContactPage = lazy(() =>
  import("../pages/ContactPage").then((m) => ({ default: m.ContactPage })),
);
export const NotFoundPage = lazy(() =>
  import("../pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);
