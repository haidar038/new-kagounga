import { useEffect } from "react";
import {
  SEO_LOCALE,
  absUrl,
  getLocaleFromPath,
  stripLocalePrefix,
  toLocalePath,
} from "../lib/seo";

export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, "") ||
  "https://kagounga.com";

export const DEFAULT_OG_IMAGE =
  "https://res.cloudinary.com/fal5otmd/image/upload/v1791556121/OpenGraph.webp";

/** Fallback OG dimensions for the default 1200x630 static image. */
const DEFAULT_OG_WIDTH = "1200";
const DEFAULT_OG_HEIGHT = "630";

export interface DocumentMeta {
  title: string;
  description: string;
  /** Path like `/about` or `/news/slug`. Defaults to current pathname (query + hash stripped). */
  canonical?: string;
  /** Absolute image URL. Defaults to DEFAULT_OG_IMAGE. */
  image?: string;
  imageAlt?: string;
  imageWidth?: string;
  imageHeight?: string;
  type?: "website" | "article";
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  /** JSON-LD object injected as page script. Removed on unmount. */
  jsonLd?: unknown;
}

function upsertMeta(attr: "name" | "property", key: string, content: string): void {
  const sel = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(sel);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string, hreflang?: string): void {
  const sel = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`;
  let el = document.head.querySelector<HTMLLinkElement>(sel);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    if (hreflang) el.setAttribute("hreflang", hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function removeMeta(attr: "name" | "property", key: string): void {
  document.head.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

export function useDocumentMeta({
  title,
  description,
  canonical,
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  type = "website",
  noindex = false,
  publishedTime,
  modifiedTime,
  author,
  jsonLd,
}: DocumentMeta): void {
  const jsonKey = jsonLd === undefined ? "" : JSON.stringify(jsonLd);
  useEffect(() => {
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    // Strip query + hash: ?sig= / ?utm_ variants must never become canonical.
    const raw = canonical ?? window.location.pathname;
    const cleanPath = raw.split(/[?#]/)[0] || "/";
    const locale = getLocaleFromPath(cleanPath);
    document.documentElement.lang = locale;
    const url = absUrl(cleanPath, SITE_URL);
    const enPath = stripLocalePrefix(cleanPath);
    const enUrl = absUrl(enPath === "" ? "/" : enPath, SITE_URL);
    const idUrl = absUrl(toLocalePath(enPath === "" ? "/" : enPath, "id"), SITE_URL);
    const img = image ?? DEFAULT_OG_IMAGE;
    const imgAlt = imageAlt ?? title;
    upsertLink("canonical", url);
    upsertLink("alternate", enUrl, "en");
    upsertLink("alternate", idUrl, "id");
    upsertLink("alternate", enUrl, "x-default");

    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:site_name", "Kagōunga");
    upsertMeta("property", "og:locale", locale === "id" ? "id_ID" : SEO_LOCALE);
    upsertMeta(
      "property",
      "og:locale:alternate",
      locale === "id" ? SEO_LOCALE : "id_ID",
    );
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", img);
    upsertMeta("property", "og:image:width", imageWidth ?? DEFAULT_OG_WIDTH);
    upsertMeta("property", "og:image:height", imageHeight ?? DEFAULT_OG_HEIGHT);
    upsertMeta("property", "og:image:alt", imgAlt);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", img);
    upsertMeta("name", "twitter:image:alt", imgAlt);
    if (publishedTime) {
      upsertMeta("property", "article:published_time", publishedTime);
    } else {
      removeMeta("property", "article:published_time");
    }
    if (modifiedTime) {
      upsertMeta("property", "article:modified_time", modifiedTime);
    } else {
      removeMeta("property", "article:modified_time");
    }
    if (author) {
      upsertMeta("property", "article:author", author);
    } else {
      removeMeta("property", "article:author");
    }
    const googleVerify = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION as
      | string
      | undefined;
    if (googleVerify) upsertMeta("name", "google-site-verification", googleVerify);
    const bingVerify = import.meta.env.VITE_BING_SITE_VERIFICATION as
      | string
      | undefined;
    if (bingVerify) upsertMeta("name", "msvalidate.01", bingVerify);

    const scriptId = "kga-jsonld-page";
    document.getElementById(scriptId)?.remove();
    if (jsonKey) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.type = "application/ld+json";
      s.textContent = jsonKey;
      document.head.appendChild(s);
    }
    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [title, description, canonical, image, imageAlt, imageWidth, imageHeight, type, noindex, publishedTime, modifiedTime, author, jsonKey]);
}
