import { Earth, Handshake, Landmark, Soup } from "lucide-react";
import type { Movement } from "../types/content";
import type { Locale } from "../i18n";
import idHome from "../locales/id/home.json";

export const MOVEMENTS: Movement[] = [
  {
    index: "01",
    icon: Soup,
    title: "Food Innovation",
    description:
      "We bring traditional food into modern life while staying true to its original taste, ingredients, and identity.",
  },
  {
    index: "02",
    icon: Landmark,
    title: "Cultural Preservation",
    description:
      "We keep the knowledge, traditions, and stories of Maluku Utara alive and relevant for generations to come.",
  },
  {
    index: "03",
    icon: Handshake,
    title: "Creative Collab",
    description:
      "We work with artists, musicians, designers, and communities to explore new ways of expressing our culture.",
  },
  {
    index: "04",
    icon: Earth,
    title: "Global Reach",
    description:
      "We share the stories, flavors, and perspectives of the islands with people beyond Maluku Utara.",
  },
];

const ID_OVERLAYS = (
  idHome as { movements?: Record<string, { title?: string; description?: string }> }
).movements ?? {};

export function getMovements(locale: Locale): Movement[] {
  if (locale !== "id") return MOVEMENTS;
  return MOVEMENTS.map((m) => ({ ...m, ...(ID_OVERLAYS[m.title] ?? {}) }));
}
