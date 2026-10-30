import type { Collaborator } from "../types/content";
import type { Locale } from "../i18n";
import { cld } from "../lib/cloudinary";
import idAbout from "../locales/id/about.json";

export const COLLABORATORS: Collaborator[] = [
  {
    name: "Fadrié",
    role: "Visual Artist",
    image: cld("kak-iya2.webp", 800),
    alt: "Portrait of Fadrié",
    width: 800,
    height: 1000,
  },
  {
    name: "Andy",
    role: "Music Composer",
    image: cld("andi2.webp", 800),
    alt: "Portrait of Andy",
    width: 800,
    height: 1001,
  },
  {
    name: "Hylda",
    role: "Visual Artist",
    image: cld("hilda.webp", 800),
    alt: "Portrait of Hylda",
    width: 800,
    height: 1000,
  },
  {
    name: "Gilang",
    role: "Dancer",
    image: cld("gilang.webp", 800),
    alt: "Portrait of Gilang",
    width: 800,
    height: 1000,
  },
  {
    name: "Shahnaz",
    role: "Visual Artist",
    image: cld("syahnaz2.webp", 800),
    alt: "Portrait of Shahnaz",
    width: 800,
    height: 1001,
  },
  {
    name: "Jae",
    role: "Visual Artist",
    image: cld("joshua2.webp", 800),
    alt: "Portrait of Jae",
    width: 800,
    height: 1001,
  },
  {
    name: "Maryam",
    role: "Fisherman",
    image: cld("ci-maryam.webp", 800),
    alt: "Portrait of Maryam",
    width: 800,
    height: 1000,
  },
  {
    name: "Dayo",
    role: "Farmers",
    image: cld("om-dayo2.webp", 800),
    alt: "Portrait of Dayo",
    width: 800,
    height: 1000,
  },
  {
    name: "Arunika",
    role: "Photographer",
    image: cld("apin.webp", 800),
    alt: "Portrait of Arunika",
    width: 800,
    height: 1000,
  },
  {
    name: "Hydr",
    role: "Software Engineer",
    image: cld("darox.webp", 800),
    alt: "Portrait of Hydr",
    width: 800,
    height: 1001,
  },
];

const ID_ROLES = (
  idAbout as { roles?: Record<string, { role?: string; alt?: string }> }
).roles ?? {};

export function getCollaborators(locale: Locale): Collaborator[] {
  if (locale !== "id") return COLLABORATORS;
  return COLLABORATORS.map((c) => ({ ...c, ...(ID_ROLES[c.name] ?? {}) }));
}
