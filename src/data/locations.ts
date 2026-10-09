import type { DistributionPoint } from "../types/content";

/**
 * Sebaran produk Kagōunga, sumber: docs/locations.md.
 * Koordinat disimpan sebagai [lng, lat] sesuai konvensi maplibre.
 */
export const LOCATIONS: DistributionPoint[] = [
  {
    id: "kagounga-north-hub",
    name: "Kagōunga North Hub",
    area: "Makassar Barat",
    city: "Ternate",
    kind: "hub",
    lng: 127.3815,
    lat: 0.7845,
    note: null,
  },
  {
    id: "kagounga-south-hub",
    name: "Kagōunga South Hub",
    area: "Tanah Tinggi",
    city: "Ternate",
    kind: "hub",
    lng: 127.382,
    lat: 0.784,
    note: null,
  },
  {
    id: "hypermart-ternate",
    name: "Hypermart",
    area: "Salero",
    city: "Ternate",
    kind: "hub",
    lng: 127.3825,
    lat: 0.7855,
    note: null,
  },
  {
    id: "sultan-baabullah-airport",
    name: "Sultan Baabullah Airport",
    area: "Departure: Outlet Gate 2, Food Stall Gate 4",
    city: "Ternate",
    kind: "retail",
    lng: 127.3803,
    lat: 0.8311,
    note: null,
  },
  {
    id: "bela-hotel",
    name: "Bela Hotel & Convention Center",
    area: "Local Corner",
    city: "Ternate",
    kind: "partner",
    lng: 127.3789,
    lat: 0.7712,
    note: null,
  },
  {
    id: "pakesang-kalumpang",
    name: "Pakesang - Pusat Oleh-oleh",
    area: "Kalumpang (Samping BI)",
    city: "Ternate",
    kind: "retail",
    lng: 127.3846,
    lat: 0.7876,
    note: null,
  },
  {
    id: "pakesang-soasio",
    name: "Pakesang - Pusat Oleh-oleh",
    area: "Soasio",
    city: "Ternate",
    kind: "retail",
    lng: 127.3862,
    lat: 0.7965,
    note: null,
  },
  {
    id: "tara-no-ate",
    name: "Tara No Ate - Pusat Oleh-oleh",
    area: "Gamalama",
    city: "Ternate",
    kind: "retail",
    lng: 127.3825,
    lat: 0.7892,
    note: null,
  },
  {
    id: "muhajirin-oleh-oleh",
    name: "Muhajirin - Pusat Oleh-oleh",
    area: "Muhajirin",
    city: "Ternate",
    kind: "retail",
    lng: 127.381,
    lat: 0.785,
    note: null,
  },
  {
    id: "muara-supermarket-ternate",
    name: "Muara Supermarket",
    area: "Gamalama",
    city: "Ternate",
    kind: "hub",
    lng: 127.383,
    lat: 0.786,
    note: null,
  },
  {
    id: "muhajirin-oleh-oleh-2",
    name: "Muhajirin - Pusat Oleh-oleh",
    area: "Muhajirin",
    city: "Ternate",
    kind: "retail",
    lng: 127.3805,
    lat: 0.7835,
    note: null,
  },
  {
    id: "nukila-dive",
    name: "Nukila Dive Center (Special Edition)",
    area: "Gamalama",
    city: "Ternate",
    kind: "partner",
    lng: 127.3838,
    lat: 0.7901,
    note: null,
  },
  {
    id: "okky-bakery",
    name: "Okky Bakery",
    area: "Muhajirin",
    city: "Ternate",
    kind: "retail",
    lng: 127.3821,
    lat: 0.7839,
    note: null,
  },
  {
    id: "ternate-post-office",
    name: "Ternate Post Office",
    area: "Gamalama",
    city: "Ternate",
    kind: "retail",
    lng: 127.3872,
    lat: 0.7891,
    note: null,
  },
  {
    id: "galeri-tenun-tidore",
    name: "Galeri Tenun Puta Dino Kayangan",
    area: "Soasio",
    city: "Tidore",
    kind: "retail",
    lng: 127.4431,
    lat: 0.6814,
    note: null,
  },
  {
    id: "hub-bali",
    name: "Kagōunga Hub Bali",
    area: "Renon",
    city: "Denpasar",
    kind: "hub",
    lng: 115.2341,
    lat: -8.6732,
    note: null,
  },
  {
    id: "javara-house-sanur",
    name: "JAVARA House Sanur",
    area: "Sanur",
    city: "Denpasar",
    kind: "partner",
    lng: 115.2572,
    lat: -8.6835,
    note: null,
  },
  {
    id: "rasta-bandung",
    name: "Rasta Timur Asli",
    area: "Bandung Wetan",
    city: "Bandung",
    kind: "partner",
    lng: 107.6184,
    lat: -6.9035,
    note: null,
  },
  {
    id: "javara-jakarta",
    name: "JAVARA Culture",
    area: "Kemang",
    city: "Jakarta",
    kind: "partner",
    lng: 106.8163,
    lat: -6.2621,
    note: null,
  },
];

export interface CityGroup {
  city: string;
  points: DistributionPoint[];
}

/** Group points by city, preserving first-seen order. */
export function groupByCity(points: DistributionPoint[]): CityGroup[] {
  const groups: CityGroup[] = [];
  for (const p of points) {
    const existing = groups.find((g) => g.city === p.city);
    if (existing) existing.points.push(p);
    else groups.push({ city: p.city, points: [p] });
  }
  return groups;
}
