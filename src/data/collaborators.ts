import type { Collaborator } from "../types/content";
import { cld } from "../lib/cloudinary";

export const COLLABORATORS: Collaborator[] = [
  {
    name: "Fadrié",
    role: "Visual Artist",
    image: cld("kak-iya2.webp", 800),
    alt: "Portrait of Fadrié",
  },
  {
    name: "Andy",
    role: "Music Composer",
    image: cld("andi2.webp", 800),
    alt: "Portrait of Andy",
  },
  {
    name: "Hylda",
    role: "Visual Artist",
    image: cld("hilda.webp", 800),
    alt: "Portrait of Hylda",
  },
  {
    name: "Gilang",
    role: "Dancer",
    image: cld("gilang.webp", 800),
    alt: "Portrait of Gilang",
  },
  {
    name: "Shahnaz",
    role: "Visual Artist",
    image: cld("syahnaz2.webp", 800),
    alt: "Portrait of Shahnaz",
  },
  {
    name: "Joshua",
    role: "Visual Artist",
    image: cld("joshua2.webp", 800),
    alt: "Portrait of Joshua",
  },
  {
    name: "Maryam",
    role: "Fisherman",
    image: cld("ci-maryam.webp", 800),
    alt: "Portrait of Maryam",
  },
  {
    name: "Dayo",
    role: "Farmers",
    image: cld("om-dayo2.webp", 800),
    alt: "Portrait of Dayo",
  },
  {
    name: "Arunika",
    role: "Photographer",
    image: cld("apin.webp", 800),
    alt: "Portrait of Arunika",
  },
  {
    name: "Hydr",
    role: "Software Engineer",
    image: cld("darox.webp", 800),
    alt: "Portrait of Hydr",
  },
];
