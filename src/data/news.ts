import type { NewsPost } from "../types/content";
import newsJson from "./news.json";

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
    typeof p.bodyMarkdown === "string"
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
