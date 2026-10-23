import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getPost,
  loadPostBySlug,
  loadPosts,
  localizePost,
  NEWS_POSTS,
  toLocalizedPost,
  type LocalizedPost,
} from "../../src/data/news";
import { mdToLexical } from "../../src/lib/lexical-markdown";
import type { CmsPost } from "../../src/lib/cms";
import type { NewsPost } from "../../src/types/content";

afterEach(() => {
  vi.unstubAllGlobals();
});

function staticPost(overrides: Partial<NewsPost> = {}): NewsPost {
  return {
    slug: "demo",
    title: "Demo",
    description: "Demo description",
    dateISO: "2026-01-10",
    dateLabel: "10 January 2026",
    cover: "https://res.cloudinary.com/x/cover.webp",
    coverAlt: "Cover",
    excerpt: "Excerpt",
    lede: "Lede",
    bodyMarkdown: "Body.",
    ...overrides,
  };
}

describe("NEWS_POSTS (static source)", () => {
  it("loads the seeded posts sorted newest first", () => {
    expect(NEWS_POSTS.length).toBeGreaterThanOrEqual(3);
    const dates = NEWS_POSTS.map((p) => p.dateISO);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("makes covers absolute (relative paths would 404 on nested routes)", () => {
    for (const post of NEWS_POSTS) {
      expect(post.cover).toMatch(/^(https?:\/\/|\/)/);
    }
  });
});

describe("getPost", () => {
  it("finds by slug case-insensitively, ignoring trailing slashes", () => {
    const first = NEWS_POSTS[0];
    expect(first).toBeDefined();
    expect(getPost(first.slug.toUpperCase())?.slug).toBe(first.slug);
    expect(getPost(`${first.slug}/`)?.slug).toBe(first.slug);
    expect(getPost("nope")).toBeUndefined();
    expect(getPost(undefined)).toBeUndefined();
  });
});

describe("localizePost", () => {
  it("keeps EN as-is", () => {
    expect(localizePost(staticPost(), "en")).toMatchObject({ title: "Demo", isFallback: false });
  });

  it("uses the ID overlay when complete (hasId wajib 6 field *Id)", () => {
    const post = staticPost({
      titleId: "Demo ID",
      descriptionId: "Deskripsi ID",
      coverAltId: "Alt ID",
      excerptId: "Kutipan ID",
      ledeId: "Lede ID",
      bodyMarkdownId: "Isi ID.",
    });
    expect(localizePost(post, "id")).toMatchObject({
      title: "Demo ID",
      bodyMarkdown: "Isi ID.",
      isFallback: false,
    });
  });

  it("falls back to EN with a flag when the overlay is partial", () => {
    const post = staticPost({ titleId: "Demo ID" });
    const localized = localizePost(post, "id");
    expect(localized.title).toBe("Demo");
    expect(localized.isFallback).toBe(true);
  });
});

describe("toLocalizedPost", () => {
  function cmsDoc(overrides: Partial<CmsPost> = {}): CmsPost {
    return {
      slug: "demo",
      title: { en: "Demo EN", id: "Demo ID" },
      metaDescription: { en: "Desc EN", id: "Desc ID" },
      excerpt: { en: "Ex EN" },
      lede: { en: "Lede EN" },
      coverAlt: { en: "Alt EN" },
      content: mdToLexical("Para one.\n\n- a\n- b"),
      publishedAt: "2026-01-10T00:00:00.000Z",
      updatedAt: "2026-02-01T00:00:00.000Z",
      featuredImage: { url: "/api/media/file/cover.jpg" },
      ...overrides,
    };
  }

  it("maps locale bags, the Lexical body and the cover", () => {
    const post = toLocalizedPost(
      cmsDoc({
        excerpt: { en: "Ex EN", id: "Ex ID" },
        lede: { en: "Lede EN", id: "Lede ID" },
        coverAlt: { en: "Alt EN", id: "Alt ID" },
      }),
      "id",
      "https://cms.test",
    );
    expect(post.title).toBe("Demo ID");
    expect(post.description).toBe("Desc ID");
    expect(post.excerpt).toBe("Ex ID");
    expect(post.isFallback).toBe(false);
    expect(post.bodyMarkdown).toBe("Para one.\n\n- a\n- b");
    expect(post.cover).toBe("https://cms.test/api/media/file/cover.jpg");
    expect(post.dateLabel).toContain("Januari");
    expect(post.updatedAt).toBe("2026-02-01T00:00:00.000Z");
  });

  it("flags fallback when any ID bag is missing", () => {
    const post = toLocalizedPost(cmsDoc(), "id", "https://cms.test");
    expect(post.isFallback).toBe(true);
    expect(post.excerpt).toBe("Ex EN");
  });

  it("keeps dateLabel and updatedAt empty without publishedAt", () => {
    const post = toLocalizedPost(
      cmsDoc({ publishedAt: null, updatedAt: null }),
      "en",
      "https://cms.test",
    );
    expect(post.dateISO).toBe("");
    expect(post.dateLabel).toBe("");
    expect(post.updatedAt).toBe("");
  });
});

describe("loadPosts", () => {
  const fallback: LocalizedPost[] = [{ ...staticPost(), isFallback: false }];

  it("returns the static fallback without a CMS URL", async () => {
    const res = await loadPosts("en", fallback, "");
    expect(res).toEqual({ items: fallback, source: "static", error: false });
  });

  it("maps CMS docs when the fetch succeeds", async () => {
    const doc: CmsPost = { slug: "cms-post", title: { en: "CMS Post" } };
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ docs: [doc] })));
    const res = await loadPosts("en", fallback, "https://cms.test");
    expect(res.source).toBe("cms");
    expect(res.error).toBe(false);
    expect(res.items[0]?.title).toBe("CMS Post");
  });

  it("falls back with error=true on transport failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("offline");
      }),
    );
    const res = await loadPosts("en", fallback, "https://cms.test");
    expect(res.source).toBe("static");
    expect(res.error).toBe(true);
  });

  it("falls back without error when CMS is reachable but empty/invalid (D-012)", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ docs: [42] })));
    const res = await loadPosts("en", fallback, "https://cms.test");
    expect(res.items).toEqual(fallback);
    expect(res.error).toBe(false);
  });
});

describe("loadPostBySlug", () => {
  it("prefers the CMS doc", async () => {
    const doc: CmsPost = { slug: "cms-post", title: { en: "CMS Post" } };
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ docs: [doc] })));
    const res = await loadPostBySlug("cms-post", "en", undefined, "https://cms.test");
    expect(res.source).toBe("cms");
    expect(res.post?.title).toBe("CMS Post");
  });

  it("uses the static fallback when transport fails", async () => {
    const fb: LocalizedPost = { ...staticPost(), isFallback: false };
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("offline");
      }),
    );
    const res = await loadPostBySlug("demo", "en", fb, "https://cms.test");
    expect(res.source).toBe("static");
    expect(res.post).toEqual(fb);
  });

  it("uses the static fallback when the slug is absent from the CMS", async () => {
    const fb: LocalizedPost = { ...staticPost(), isFallback: false };
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ docs: [] })));
    const res = await loadPostBySlug("missing", "en", fb, "https://cms.test");
    expect(res.source).toBe("static");
    expect(res.post).toEqual(fb);
  });
});
