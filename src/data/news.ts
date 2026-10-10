import type { NewsPost } from "../types/content";
import type { Locale } from "../i18n";
import { formatDateLabel } from "../lib/format";
import type { CmsPost, CmsSource } from "../lib/cms";
import {
  CMS_URL,
  fetchCmsDocs,
  isCmsPost,
  pickLocale,
  postBySlugUrl,
  postsUrl,
  resolveCmsImage,
} from "../lib/cms";
import { lexicalToMarkdown } from "../lib/lexical-markdown";
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

function loadStaticPosts(): NewsPost[] {
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
    return loadStaticPosts();
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

/** Dokumen CMS (`locale=all`) -> `LocalizedPost` + flag fallback eksplisit. */
export function toLocalizedPost(doc: CmsPost, locale: Locale, baseUrl: string): LocalizedPost {
  const title = pickLocale(doc.title, locale);
  const description = pickLocale(doc.metaDescription, locale);
  const excerpt = pickLocale(doc.excerpt, locale);
  const lede = pickLocale(doc.lede, locale);
  const coverAlt = pickLocale(doc.coverAlt, locale);
  const content = pickLocale(doc.content, locale);
  const dateISO = doc.publishedAt ?? "";
  return {
    slug: doc.slug,
    title: title.value ?? "",
    description: description.value ?? "",
    dateISO,
    dateLabel: dateISO ? formatDateLabel(dateISO, locale) : "",
    cover: resolveCmsImage(doc.featuredImage, doc.coverUrl, baseUrl),
    coverAlt: coverAlt.value ?? "",
    excerpt: excerpt.value ?? "",
    lede: lede.value ?? "",
    bodyMarkdown: content.value ? lexicalToMarkdown(content.value) : "",
    updatedAt: doc.updatedAt ?? doc.publishedAt ?? dateISO,
    isFallback:
      title.fallback ||
      description.fallback ||
      excerpt.fallback ||
      lede.fallback ||
      coverAlt.fallback ||
      content.fallback,
  };
}

/** Muat berita: CMS dulu, gagal/kosong/tanpa URL -> fallback statis. Tak pernah throw. */
export async function loadPosts(
  locale: Locale,
  fallback: LocalizedPost[],
  baseUrl: string = CMS_URL,
): Promise<{ items: LocalizedPost[]; source: CmsSource }> {
  if (!baseUrl) return { items: fallback, source: "static" };
  const docs = (await fetchCmsDocs(postsUrl(baseUrl))).filter(isCmsPost);
  if (docs.length === 0) return { items: fallback, source: "static" };
  return { items: docs.map((d) => toLocalizedPost(d, locale, baseUrl)), source: "cms" };
}

/** Satu artikel by slug: CMS dulu, lalu fallback statis. Tak pernah throw. */
export async function loadPostBySlug(
  slug: string,
  locale: Locale,
  fallback: LocalizedPost | undefined,
  baseUrl: string = CMS_URL,
): Promise<{ post: LocalizedPost | undefined; source: CmsSource }> {
  if (baseUrl) {
    const docs = (await fetchCmsDocs(postBySlugUrl(baseUrl, slug))).filter(isCmsPost);
    const found = docs.find((d) => d.slug.toLowerCase() === slug.trim().toLowerCase());
    if (found) return { post: toLocalizedPost(found, locale, baseUrl), source: "cms" };
  }
  return { post: fallback, source: "static" };
}
