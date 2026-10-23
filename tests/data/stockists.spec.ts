import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getStockistCities,
  getStockistCity,
  loadStockistCities,
  loadStockistCity,
} from "../../src/data/stockists";
import { STOCKIST_PAGES } from "../../src/data/stockistContent";
import cmsSnapshot from "../../src/data/cms-stockists.generated.json";
import type { CmsStockistCity } from "../../src/lib/cms";

afterEach(() => {
  vi.unstubAllGlobals();
});

const SNAPSHOT_MODE =
  Array.isArray(cmsSnapshot) &&
  Array.isArray((cmsSnapshot as { cities?: unknown }).cities) &&
  ((cmsSnapshot as { cities?: unknown[] }).cities?.length ?? 0) > 0;

function cmsCity(overrides: Partial<CmsStockistCity> = {}): CmsStockistCity {
  return {
    slug: "ternate",
    city: "Ternate",
    region: "North Maluku",
    sortOrder: 1,
    status: "published",
    seoTitle: { en: "Stockists Ternate" },
    metaDescription: { en: "Desc" },
    title: { en: "Find us in Ternate" },
    lede: { en: "Lede" },
    paragraphs: { en: ["Para."] },
    points: [
      {
        pointId: "hub-north",
        name: "North Hub",
        area: "Sula",
        kind: "hub",
        lng: 127.38,
        lat: 0.79,
        active: true,
      },
    ],
    ...overrides,
  };
}

describe("getStockistCities (static/snapshot path)", () => {
  it.skipIf(SNAPSHOT_MODE)(
    "serves the static cities in insertion order while the snapshot is empty",
    () => {
      expect(getStockistCities("en").map((c) => c.slug)).toEqual(Object.keys(STOCKIST_PAGES));
    },
  );

  it.skipIf(SNAPSHOT_MODE)("serves static copy with points for each city", () => {
    const city = getStockistCity("ternate", "en");
    expect(city?.slug).toBe("ternate");
    expect(city?.city).toBe("Ternate");
    expect(city?.copy.title).toBeTruthy();
    expect(city?.points.length).toBeGreaterThan(0);
  });

  it("returns null for an unknown slug", () => {
    expect(getStockistCity("atlantis", "en")).toBeNull();
  });
});

describe("loadStockistCities", () => {
  const fallback = getStockistCities("en");

  it("returns the static fallback on transport failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("offline");
      }),
    );
    const res = await loadStockistCities("en", fallback, "https://cms.test");
    expect(res).toEqual({ items: fallback, source: "static", error: true });
  });

  // Sengaja berbeda dari products/news (D-029): snapshot CMS bersifat
  // otoritatif — CMS kosong = daftar kosong, BUKAN fallback statis.
  it("serves an empty list, not the fallback, when CMS is reachable but empty", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ docs: [] })));
    const res = await loadStockistCities("en", fallback, "https://cms.test");
    expect(res.source).toBe("cms");
    expect(res.error).toBe(false);
    expect(res.items).toEqual([]);
  });

  it("maps valid docs, drops invalid copy, sorts by sortOrder", async () => {
    const second = cmsCity({ slug: "bandung", city: "Bandung", sortOrder: 2 });
    const first = cmsCity({ sortOrder: 1 });
    const broken = cmsCity({
      slug: "broken",
      city: "Broken",
      sortOrder: 0,
      lede: { en: "" },
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ docs: [second, broken, first] })),
    );
    const res = await loadStockistCities("en", fallback, "https://cms.test");
    expect(res.source).toBe("cms");
    expect(res.error).toBe(false);
    expect(res.items.map((c) => c.slug)).toEqual(["ternate", "bandung"]);
  });
});

describe("loadStockistCity", () => {
  it("uses the static fallback on transport failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("offline");
      }),
    );
    const res = await loadStockistCity("ternate", "en", null, "https://cms.test");
    expect(res).toEqual({ city: null, source: "static", error: true });
  });

  it("returns null (404) when CMS is reachable but the city is absent/invalid (D-029)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          docs: [cmsCity({ status: "draft", lede: { en: "" } })],
        }),
      ),
    );
    const res = await loadStockistCity("ternate", "en", null, "https://cms.test");
    expect(res.source).toBe("cms");
    expect(res.error).toBe(false);
    expect(res.city).toBeNull();
  });

  it("maps an active CMS city, dropping inactive and duplicate points", async () => {
    const doc = cmsCity({
      points: [
        { pointId: "a", name: "A", area: "", kind: "weird", lng: 1, lat: 2, active: true },
        { pointId: "a", name: "A duplicate", area: "", kind: "retail", lng: 1, lat: 2, active: true },
        { pointId: "b", name: "B", area: "", kind: "retail", lng: 1, lat: 2, active: false },
      ],
    });
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ docs: [doc] })));
    const res = await loadStockistCity("ternate", "en", null, "https://cms.test");
    expect(res.city?.points.map((p) => p.id)).toEqual(["a"]);
    expect(res.city?.points[0]?.kind).toBe("retail");
    expect(res.city?.region).toBe("North Maluku");
  });
});
