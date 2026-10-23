import { describe, expect, it } from "vitest";
import { absUrl, getLocaleFromPath, stripLocalePrefix, toLocalePath } from "../../src/lib/seo";

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
