import { afterEach, describe, expect, it, vi } from "vitest";
import {
  absolutizeCmsUrl,
  fetchCmsResult,
  formatPrice,
  isCmsPost,
  isCmsProduct,
  isCmsStockistCity,
  isCmsStockistPoint,
  pickLocale,
  postBySlugUrl,
  postsUrl,
  productBySlugUrl,
  productsUrl,
  resolveCmsImage,
  stockistBySlugUrl,
  stockistsUrl,
} from "../../src/lib/cms";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("pickLocale", () => {
  it("passes primitives through without a fallback flag", () => {
    expect(pickLocale("x", "en")).toEqual({ value: "x", fallback: false });
    expect(pickLocale(5, "en")).toEqual({ value: 5, fallback: false });
    expect(pickLocale(true, "id")).toEqual({ value: true, fallback: false });
  });

  it("returns undefined for null/undefined", () => {
    expect(pickLocale(null, "en").value).toBeUndefined();
    expect(pickLocale(undefined, "id").value).toBeUndefined();
  });

  it("picks the requested locale from a bag", () => {
    expect(pickLocale({ en: "EN", id: "ID" }, "id")).toEqual({ value: "ID", fallback: false });
    expect(pickLocale({ en: "EN", id: "ID" }, "en")).toEqual({ value: "EN", fallback: false });
  });

  it("falls back to EN for id and flags it", () => {
    expect(pickLocale({ en: "EN" }, "id")).toEqual({ value: "EN", fallback: true });
  });

  it("flags both cross-locale fallbacks (EN->ID juga true)", () => {
    expect(pickLocale({ id: "ID" }, "en")).toEqual({ value: "ID", fallback: true });
  });

  it("treats a Lexical document as a plain value, not a locale bag", () => {
    const doc = { root: { type: "root", children: [] } };
    expect(pickLocale(doc, "id")).toEqual({ value: doc, fallback: false });
  });

  it("returns undefined for an empty bag", () => {
    expect(pickLocale({}, "en").value).toBeUndefined();
  });

  it("passes arrays through untouched", () => {
    expect(pickLocale(["a", "b"], "id")).toEqual({ value: ["a", "b"], fallback: false });
  });
});

describe("formatPrice", () => {
  it("formats USD integers without decimals", () => {
    expect(formatPrice(15)).toBe("$15");
  });

  it("formats USD decimals with two places", () => {
    expect(formatPrice(2.53)).toBe("$2.53");
    expect(formatPrice(1.9)).toBe("$1.90");
  });

  it("formats IDR with thousands separators", () => {
    expect(formatPrice(15000, "IDR")).toBe("Rp15,000");
  });

  it("treats non-finite input as zero", () => {
    expect(formatPrice(Number.NaN)).toBe("$0");
  });
});

describe("absolutizeCmsUrl", () => {
  it("keeps absolute URLs untouched", () => {
    expect(absolutizeCmsUrl("https://x.com/a.jpg", "https://cms.test")).toBe("https://x.com/a.jpg");
  });

  it("prefixes the base for relative paths", () => {
    expect(absolutizeCmsUrl("/api/media/file/a.jpg", "https://cms.test")).toBe(
      "https://cms.test/api/media/file/a.jpg",
    );
  });

  it("adds the missing slash", () => {
    expect(absolutizeCmsUrl("api/a.jpg", "https://cms.test")).toBe("https://cms.test/api/a.jpg");
  });

  it("returns null for empty input", () => {
    expect(absolutizeCmsUrl(null, "https://cms.test")).toBeNull();
    expect(absolutizeCmsUrl("", "https://cms.test")).toBeNull();
  });
});

describe("resolveCmsImage", () => {
  it("prefers a populated media relation", () => {
    expect(
      resolveCmsImage({ url: "/api/media/file/a.jpg" }, "https://legacy/a.jpg", "https://cms.test"),
    ).toBe("https://cms.test/api/media/file/a.jpg");
  });

  it("falls back to the legacy remote URL", () => {
    expect(resolveCmsImage(7, "https://legacy/a.jpg", "https://cms.test")).toBe(
      "https://legacy/a.jpg",
    );
    expect(resolveCmsImage(null, "https://legacy/a.jpg", "https://cms.test")).toBe(
      "https://legacy/a.jpg",
    );
  });

  it("returns an empty string without any source", () => {
    expect(resolveCmsImage(null, null, "https://cms.test")).toBe("");
  });
});

describe("Payload URL builders", () => {
  it("lists published products sorted by sortOrder with locale=all", () => {
    const url = productsUrl("https://cms.test");
    expect(url.startsWith("https://cms.test/api/products?")).toBe(true);
    expect(url).toContain("where[status][equals]=published");
    expect(url).toContain("sort=sortOrder");
    expect(url).toContain("limit=100");
    expect(url).toContain("depth=1");
    expect(url).toContain("locale=all");
  });

  it("filters one product by slug + published", () => {
    const url = productBySlugUrl("https://cms.test", "sago starch");
    expect(url).toContain("/api/products?");
    expect(url).toContain(`where[slug][equals]=${encodeURIComponent("sago starch")}`);
    expect(url).toContain("where[status][equals]=published");
    expect(url).toContain("limit=1");
  });

  it("lists posts newest first", () => {
    const url = postsUrl("https://cms.test");
    expect(url.startsWith("https://cms.test/api/posts?")).toBe(true);
    expect(url).toContain("where[status][equals]=published");
    expect(url).toContain("sort=-publishedAt");
    expect(url).toContain("depth=1");
    expect(url).toContain("locale=all");
  });

  it("filters one post by slug", () => {
    const url = postBySlugUrl("https://cms.test", "demo-post");
    expect(url).toContain("/api/posts?");
    expect(url).toContain("where[slug][equals]=demo-post");
    expect(url).toContain("limit=1");
    expect(url).toContain("depth=1");
  });

  it("lists stockist cities flat (depth=0)", () => {
    const url = stockistsUrl("https://cms.test");
    expect(url.startsWith("https://cms.test/api/stockist-cities?")).toBe(true);
    expect(url).toContain("where[status][equals]=published");
    expect(url).toContain("sort=sortOrder");
    expect(url).toContain("depth=0");
    expect(url).toContain("locale=all");
  });

  it("filters one stockist city by slug + published", () => {
    const url = stockistBySlugUrl("https://cms.test", "ternate");
    expect(url).toContain("/api/stockist-cities?");
    expect(url).toContain("where[slug][equals]=ternate");
    expect(url).toContain("where[status][equals]=published");
    expect(url).toContain("depth=0");
  });
});

describe("type guards", () => {
  it("isCmsProduct requires slug + title strings", () => {
    expect(isCmsProduct({ slug: "a", title: "b" })).toBe(true);
    expect(isCmsProduct({ slug: "a" })).toBe(false);
    expect(isCmsProduct(null)).toBe(false);
    expect(isCmsProduct("x")).toBe(false);
  });

  it("isCmsPost requires slug + any title", () => {
    expect(isCmsPost({ slug: "a", title: { en: "t" } })).toBe(true);
    expect(isCmsPost({ slug: "a" })).toBe(false);
    expect(isCmsPost(undefined)).toBe(false);
  });

  it("isCmsStockistCity requires slug + city", () => {
    expect(isCmsStockistCity({ slug: "a", city: "b" })).toBe(true);
    expect(isCmsStockistCity({ slug: "a" })).toBe(false);
  });

  it("isCmsStockistPoint requires pointId + name", () => {
    expect(isCmsStockistPoint({ pointId: "a", name: "b" })).toBe(true);
    expect(isCmsStockistPoint({ pointId: "a" })).toBe(false);
  });
});

describe("fetchCmsResult", () => {
  it("returns docs on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify({ docs: [{ slug: "a" }], totalDocs: 1 }), { status: 200 }),
      ),
    );
    const { docs, error } = await fetchCmsResult("https://cms.test/api/products");
    expect(error).toBe(false);
    expect(docs).toEqual([{ slug: "a" }]);
  });

  it("returns an empty docs array when the body has no docs key", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ totalDocs: 0 }))));
    const { docs, error } = await fetchCmsResult("https://cms.test/x");
    expect(error).toBe(false);
    expect(docs).toEqual([]);
  });

  it("flags a transport error on HTTP failure", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 500 })));
    expect(await fetchCmsResult("https://cms.test/x")).toEqual({ docs: [], error: true });
  });

  it("flags a transport error on network failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("offline");
      }),
    );
    expect(await fetchCmsResult("https://cms.test/x")).toEqual({ docs: [], error: true });
  });

  it("flags a transport error on an invalid JSON body", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("not json", { status: 200 })));
    expect(await fetchCmsResult("https://cms.test/x")).toEqual({ docs: [], error: true });
  });

  it("aborts a slow response after the default 8s timeout", async () => {
    vi.useFakeTimers();
    try {
      vi.stubGlobal(
        "fetch",
        vi.fn((_url: string, init?: { signal?: AbortSignal }) =>
          new Promise((_resolve, reject) => {
            init?.signal?.addEventListener("abort", () =>
              reject(new DOMException("The operation was aborted.", "AbortError")),
            );
          }),
        ),
      );
      const pending = fetchCmsResult("https://cms.test/x");
      await vi.advanceTimersByTimeAsync(8000);
      await expect(pending).resolves.toEqual({ docs: [], error: true });
    } finally {
      vi.useRealTimers();
      vi.unstubAllGlobals();
    }
  });
});
