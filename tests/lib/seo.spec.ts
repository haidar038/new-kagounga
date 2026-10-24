import { describe, expect, it } from "vitest";
import { absUrl, getLocaleFromPath, stripLocalePrefix, toLocalePath } from "../../src/lib/seo";
import seoEn from "../../src/locales/en/seo.json";
import seoId from "../../src/locales/id/seo.json";
import productCopy from "../../src/data/productPageCopy.json";
import { STOCKIST_PAGES } from "../../src/data/stockistContent";

describe("absUrl", () => {
  it("keeps absolute URLs and joins relative ones", () => {
    expect(absUrl("https://x.com/a", "https://site.com")).toBe("https://x.com/a");
    expect(absUrl("/catalog", "https://site.com")).toBe("https://site.com/catalog");
    expect(absUrl("catalog", "https://site.com/")).toBe("https://site.com/catalog");
  });
});

describe("getLocaleFromPath", () => {
  it("detects the locale from the pathname", () => {
    expect(getLocaleFromPath("/")).toBe("en");
    expect(getLocaleFromPath("/catalog")).toBe("en");
    expect(getLocaleFromPath("/id")).toBe("id");
    expect(getLocaleFromPath("/id/news/a")).toBe("id");
    expect(getLocaleFromPath("/idiomatic")).toBe("en");
  });
});

describe("toLocalePath", () => {
  it("adds the /id prefix symmetrically", () => {
    expect(toLocalePath("/", "id")).toBe("/id");
    expect(toLocalePath("/catalog", "id")).toBe("/id/catalog");
    expect(toLocalePath("/id/catalog", "id")).toBe("/id/catalog");
  });

  it("strips the /id prefix", () => {
    expect(toLocalePath("/id", "en")).toBe("/");
    expect(toLocalePath("/id/catalog", "en")).toBe("/catalog");
    expect(stripLocalePrefix("/id/catalog")).toBe("/catalog");
    expect(stripLocalePrefix("/catalog")).toBe("/catalog");
  });
});

/** Grapheme-aware length so "ō" counts as one character, like SERP tools. */
const charLen = (s: string): number => [...s].length;

const PAGE_KEYS = ["about", "catalog", "contact", "music", "news", "privacy", "terms"] as const;

describe("seo.json length guards", () => {
  for (const [locale, seo] of [
    ["en", seoEn],
    ["id", seoId],
  ] as const) {
    it(`page titles (${locale}) are 50-60 characters`, () => {
      for (const key of PAGE_KEYS) {
        const len = charLen(seo[key].title);
        expect(len, `${locale}.${key}.title (${len})`).toBeGreaterThanOrEqual(50);
        expect(len, `${locale}.${key}.title (${len})`).toBeLessThanOrEqual(60);
      }
    });

    it(`page descriptions (${locale}) are 120-160 characters`, () => {
      for (const key of [...PAGE_KEYS, "home"] as const) {
        const len = charLen(seo[key].description);
        expect(len, `${locale}.${key}.description (${len})`).toBeGreaterThanOrEqual(120);
        expect(len, `${locale}.${key}.description (${len})`).toBeLessThanOrEqual(160);
      }
    });
  }
});

describe("product SEO length guards", () => {
  it("product titles are 50-60 characters in both locales", () => {
    for (const [id, locales] of Object.entries(productCopy.seoTitles)) {
      for (const locale of ["en", "id"] as const) {
        const len = charLen(locales[locale]);
        expect(len, `seoTitles.${id}.${locale} (${len})`).toBeGreaterThanOrEqual(50);
        expect(len, `seoTitles.${id}.${locale} (${len})`).toBeLessThanOrEqual(60);
      }
    }
  });

  it("product descriptions are 120-160 characters in both locales", () => {
    for (const [id, locales] of Object.entries(productCopy.seoDescriptions)) {
      for (const locale of ["en", "id"] as const) {
        const len = charLen(locales[locale]);
        expect(len, `seoDescriptions.${id}.${locale} (${len})`).toBeGreaterThanOrEqual(120);
        expect(len, `seoDescriptions.${id}.${locale} (${len})`).toBeLessThanOrEqual(160);
      }
    }
  });

  it("every product with a title also has a description", () => {
    expect(Object.keys(productCopy.seoDescriptions).sort()).toEqual(
      Object.keys(productCopy.seoTitles).sort(),
    );
  });
});

describe("stockist SEO length guards", () => {
  it("city titles are 50-60 characters in both locales", () => {
    for (const [slug, locales] of Object.entries(STOCKIST_PAGES)) {
      for (const locale of ["en", "id"] as const) {
        const len = charLen(locales[locale].seoTitle);
        expect(len, `${slug}.${locale}.seoTitle (${len})`).toBeGreaterThanOrEqual(50);
        expect(len, `${slug}.${locale}.seoTitle (${len})`).toBeLessThanOrEqual(60);
      }
    }
  });

  it("city descriptions are 120-160 characters in both locales", () => {
    for (const [slug, locales] of Object.entries(STOCKIST_PAGES)) {
      for (const locale of ["en", "id"] as const) {
        const len = charLen(locales[locale].description);
        expect(len, `${slug}.${locale}.description (${len})`).toBeGreaterThanOrEqual(120);
        expect(len, `${slug}.${locale}.description (${len})`).toBeLessThanOrEqual(160);
      }
    }
  });
});
