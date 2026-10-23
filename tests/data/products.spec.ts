import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getProducts,
  loadProductPage,
  loadProducts,
  orderHref,
  PRODUCTS,
  toProductDetail,
  withIdOverlay,
} from "../../src/data/products";
import cmsSnapshot from "../../src/data/cms-products.generated.json";
import type { CmsProduct } from "../../src/lib/cms";

afterEach(() => {
  vi.unstubAllGlobals();
});

const SNAPSHOT_EMPTY =
  !Array.isArray(cmsSnapshot) || (cmsSnapshot as CmsProduct[]).length === 0;

function cmsDoc(overrides: Partial<CmsProduct> = {}): CmsProduct {
  return {
    slug: "test-product",
    title: "Test Product",
    priceNumber: 2.53,
    currency: "USD",
    imageUrl: "https://res.cloudinary.com/fal5otmd/image/upload/f_auto,q_auto,w_800/test.webp",
    ...overrides,
  };
}

describe("getProducts (static fallback path)", () => {
  it.skipIf(!SNAPSHOT_EMPTY)(
    "returns the static catalogue for EN when the snapshot is empty",
    () => {
      const en = getProducts("en");
      expect(en).toEqual(PRODUCTS);
      expect(en.map((p) => p.id)).toEqual([
        "popeda",
        "sago",
        "tuna",
        "seasoning",
        "kenari",
        "telang",
        "pala",
        "cengkeh",
      ]);
    },
  );

  it.skipIf(!SNAPSHOT_EMPTY)("applies the Indonesian overlay for ID", () => {
    const popeda = getProducts("id").find((p) => p.id === "popeda");
    expect(popeda?.blurb).not.toBe(PRODUCTS[0]?.blurb);
    expect(popeda?.blurb.startsWith("Sagu instan lembut")).toBe(true);
  });

  it("keeps the ID overlay additive: price stays the EN/base value (D-018)", () => {
    const base = PRODUCTS[0];
    const overlaid = withIdOverlay(base);
    expect(overlaid.id).toBe("popeda");
    expect(overlaid.blurb).not.toBe(base.blurb);
    expect(overlaid.price).toBe(base.price);
  });
});

describe("toProductDetail", () => {
  it("maps identity, price and the legacy Cloudinary image", () => {
    const p = toProductDetail(cmsDoc(), "en", "https://cms.test");
    expect(p.id).toBe("test-product");
    expect(p.name).toBe("Test Product");
    expect(p.price).toBe("$2.53");
    expect(p.image).toBe(
      "https://res.cloudinary.com/fal5otmd/image/upload/f_auto,q_auto,w_800/test.webp",
    );
    expect(p.alt).toBe("Test Product");
  });

  it("prefers a populated media relation over the legacy URL", () => {
    const p = toProductDetail(
      cmsDoc({ image: { url: "/api/media/file/a.jpg" } }),
      "en",
      "https://cms.test",
    );
    expect(p.image).toBe("https://cms.test/api/media/file/a.jpg");
  });

  it("picks locale bags and formats the wholesale price", () => {
    const p = toProductDetail(
      cmsDoc({
        excerpt: { en: "EN blurb", id: "ID blurb" },
        badges: { en: ["Net 50 g"], id: ["Isi bersih 50 g"] },
        specs: { en: [{ label: "HS Code", value: "1901.90" }] },
        insideTitle: { en: "Inside", id: null },
        inside: { en: ["A", "B"], id: null },
        wholesalePriceNumber: 1.9,
        wholesaleCurrency: "USD",
        wholesalePer: { en: "unit" },
      }),
      "id",
      "https://cms.test",
    );
    expect(p.blurb).toBe("ID blurb");
    expect(p.badges).toEqual(["Isi bersih 50 g"]);
    expect(p.specs).toEqual([{ label: "HS Code", value: "1901.90" }]);
    // Bag ID null -> EN dipakai (fallback:true di pickLocale, D-009).
    expect(p.insideTitle).toBe("Inside");
    expect(p.inside).toEqual(["A", "B"]);
    expect(p.wholesalePrice).toBe("$1.90");
    expect(p.wholesalePer).toBe("unit");
  });

  it("maps absent fields to null", () => {
    const p = toProductDetail(cmsDoc(), "en", "https://cms.test");
    expect(p.badges).toEqual([]);
    expect(p.specs).toEqual([]);
    expect(p.insideTitle).toBeNull();
    expect(p.inside).toBeNull();
    expect(p.wholesalePrice).toBeNull();
  });

  it("marks hasPage from CMS page copy, false otherwise", () => {
    const withCopy = toProductDetail(
      cmsDoc({
        intro: { en: ["Para."] },
        usage: { en: "Use it." },
        sourcing: { en: "From Ternate." },
      }),
      "en",
      "https://cms.test",
    );
    expect(withCopy.hasPage).toBe(true);
    const without = toProductDetail(cmsDoc({ slug: "no-copy" }), "en", "https://cms.test");
    expect(without.hasPage).toBe(false);
  });
});

describe("loadProducts", () => {
  const fallback = PRODUCTS;

  it("returns the static fallback without a CMS URL", async () => {
    const res = await loadProducts("en", fallback, "");
    expect(res).toEqual({ items: fallback, source: "static", error: false });
  });

  it("maps CMS docs when the fetch succeeds", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ docs: [cmsDoc()] })));
    const res = await loadProducts("en", fallback, "https://cms.test");
    expect(res.source).toBe("cms");
    expect(res.error).toBe(false);
    expect(res.items).toHaveLength(1);
    expect(res.items[0]?.price).toBe("$2.53");
  });

  it("falls back with error=true when transport fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("offline");
      }),
    );
    const res = await loadProducts("en", fallback, "https://cms.test");
    expect(res.source).toBe("static");
    expect(res.error).toBe(true);
    expect(res.items).toEqual(fallback);
  });

  it("falls back without error when CMS is reachable but empty/invalid (D-012)", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ docs: [{}] })));
    const res = await loadProducts("en", fallback, "https://cms.test");
    expect(res.source).toBe("static");
    expect(res.error).toBe(false);
    expect(res.items).toEqual(fallback);
  });
});

describe("loadProductPage", () => {
  it("maps product + copy + SEO title when page copy exists", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          docs: [
            cmsDoc({
              intro: { en: ["Para."] },
              usage: { en: "Use it." },
              sourcing: { en: "From Ternate." },
              seoTitle: { en: "SEO | Kagōunga" },
            }),
          ],
        }),
      ),
    );
    const res = await loadProductPage("test-product", "en", null, "https://cms.test");
    expect(res.source).toBe("cms");
    expect(res.data?.product.id).toBe("test-product");
    expect(res.data?.copy.intro).toEqual(["Para."]);
    expect(res.data?.seoTitle).toBe("SEO | Kagōunga");
  });

  it("falls back when the slug is absent from the CMS", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ docs: [] })));
    const res = await loadProductPage("missing", "en", null, "https://cms.test");
    expect(res.data).toBeNull();
    expect(res.source).toBe("static");
  });

  it("falls back when the doc lacks page copy", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ docs: [cmsDoc()] })));
    const res = await loadProductPage("test-product", "en", null, "https://cms.test");
    expect(res.data).toBeNull();
    expect(res.source).toBe("static");
  });
});

describe("orderHref", () => {
  it("builds the WhatsApp order link", () => {
    const href = orderHref("Popeda Soup", "en");
    expect(href.startsWith("https://wa.me/628111538111?text=")).toBe(true);
    expect(decodeURIComponent(href)).toContain("Popeda Soup");
  });
});
