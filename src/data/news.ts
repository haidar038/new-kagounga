import type { NewsPost } from "../types/content";
import type { Locale } from "../i18n";
import newsJson from "./news.json";

function isOptionalString(value: unknown): boolean {
  return value === undefined || typeof value === "string";
}

function isNewsPost(value: unknown): value is NewsPost {
  if (typeof value !== "object" || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.slug === "string" &&
    typeof p.title === "string" &&
    typeof p.description === "string" &&
    typeof p.dateISO === "string" &&
    typeof p.dateLabel === "string" &&
    typeof p.cover === "string" &&
    typeof p.coverAlt === "string" &&
    typeof p.excerpt === "string" &&
    typeof p.lede === "string" &&
    typeof p.bodyMarkdown === "string" &&
    isOptionalString(p.titleId) &&
    isOptionalString(p.descriptionId) &&
    isOptionalString(p.coverAltId) &&
    isOptionalString(p.excerptId) &&
    isOptionalString(p.ledeId) &&
    isOptionalString(p.bodyMarkdownId)
  );
}

function loadPosts(): NewsPost[] {
  const raw: unknown = newsJson;
  if (!Array.isArray(raw) || !raw.every(isNewsPost)) {
    throw new Error("src/data/news.json has invalid shape");
  }
  return [...raw]
    .map((post) => ({
      ...post,
      // Covers must be absolute: relative paths resolve against the
      // current route (e.g. /news/:slug) and 404 on nested pages.
      // Remote http(s) URLs pass through untouched.
      cover:
        post.cover.startsWith("/") || /^https?:\/\//.test(post.cover)
          ? post.cover
          : `/${post.cover}`,
    }))
    .sort((a, b) => b.dateISO.localeCompare(a.dateISO));
}

export const NEWS_POSTS: NewsPost[] = (() => {
  try {
    return loadPosts();
  } catch {
    return [];
  }
})();

export function getPost(slug: string | undefined): NewsPost | undefined {
  if (!slug) return undefined;
  const clean = slug.trim().toLowerCase().replace(/\/+$/, "");
  return NEWS_POSTS.find((p) => p.slug.toLowerCase() === clean);
}

export type LocalizedPost = NewsPost & { isFallback: boolean };

function hasId(post: NewsPost): boolean {
  return Boolean(
    post.titleId &&
      post.descriptionId &&
      post.coverAltId &&
      post.excerptId &&
      post.ledeId &&
      post.bodyMarkdownId,
  );
}

/** Resolve display fields for a locale. Missing ID = EN + fallback flag. */
export function localizePost(post: NewsPost, locale: Locale): LocalizedPost {
  if (locale === "en" || !hasId(post)) {
    return { ...post, isFallback: locale !== "en" };
  }
  return {
    ...post,
    title: post.titleId as string,
    description: post.descriptionId as string,
    coverAlt: post.coverAltId as string,
    excerpt: post.excerptId as string,
    lede: post.ledeId as string,
    bodyMarkdown: post.bodyMarkdownId as string,
    isFallback: false,
  };
}
