/** Shared SEO helpers. No React. Single source for absolute URLs + JSON-LD shapes. */

export const SEO_LOCALE = "en_US";
export const SEO_LANG = "en";

export type SEOLocale = "en" | "id";

export function absUrl(path: string, site: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${site.replace(/\/+$/, "")}${clean}`;
}

/** `/id/about` -> id, everything else -> en. */
export function getLocaleFromPath(pathname: string): SEOLocale {
  return pathname === "/id" || pathname.startsWith("/id/") ? "id" : "en";
}

/** Add or strip the `/id` prefix. Keeps the rest of the path untouched. */
export function toLocalePath(pathname: string, locale: SEOLocale): string {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (locale === "id") {
    if (clean === "/id" || clean.startsWith("/id/")) return clean;
    return clean === "/" ? "/id" : `/id${clean}`;
  }
  if (clean === "/id") return "/";
  return clean.startsWith("/id/") ? clean.slice(3) : clean;
}

/** Strip the `/id` prefix, `/id` -> `/`. */
export function stripLocalePrefix(pathname: string): string {
  return toLocalePath(pathname, "en");
}

/** BreadcrumbList node. Pass page trail, e.g. [{name:"News",path:"/news"}]. */
export function breadcrumbLd(
  trail: Array<{ name: string; path: string }>,
  site: string,
): unknown {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: absUrl(t.path, site),
    })),
  };
}

/** Wrap nodes in a single @graph envelope so one <script> holds page schemas. */
export function graphLd(nodes: unknown[]): unknown {
  return { "@context": "https://schema.org", "@graph": nodes };
}
