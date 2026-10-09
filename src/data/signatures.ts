import type { SignatureProduct } from "../types/content";
import type { Locale } from "../i18n";
import { cld } from "../lib/cloudinary";
import idHome from "../locales/id/home.json";

export const SIGNATURES: SignatureProduct[] = [
  {
    id: "popeda",
    category: "Gastronomy",
    title: "Popeda Soup",
    image: cld("popeda-soup.webp", 1200),
    alt: "Kagōunga Popeda Soup box with silken sago in turmeric fish soup",
    paragraphs: [
      "Authentic, silky sago served with savory turmeric fish soup, fresh aromatic spices, and a refreshing splash of calamansi. Packed with generous chunks of tuna and dehydrated vegetables. Made using 100% natural ingredients with no preservatives, offering a 12-month shelf life and certified Halal.",
      "In North Maluku, locals process the trunk of the sago palm into starch, which is then cooked into a thick, gelatinous staple carbohydrate. Sago palms thrive along riverbanks and marshlands, requiring at least seven years of growth before reaching maturity for harvest.",
    ],
    meta: "Ready in 5 minutes · Net 50 g · Halal certified · Pride of Ternate Island",
  },
  {
    id: "soap",
    category: "Personal Care",
    title: "Botanical Soap",
    image: cld("product-3-soap.webp", 1200),
    alt: "Gosora and Bualawa organic essential oil soaps",
    paragraphs: [
      "Natural soap formulated with pure local spices, bridging centuries of island heritage with modern skincare. Crafted with pure spice extracts harvested directly from Ternate's rich soil, it deeply nourishes and reinforces the skin barrier against environmental stressors.",
      "Every lather releases an authentic, exotic island scent that transforms daily washing into a soothing luxury spa experience. Crafted completely natural with zero preservatives, boosting skin health and certified Halal.",
    ],
    meta: "100% Authentic Spices · Antioxidant Rich · Signature Scent · Pure Formula · Ethically Sourced",
  },
  {
    id: "candle",
    category: "Home Fragrance",
    title: "Sensory Candle",
    image: cld("candle.webp", 1200),
    alt: "Sensory candle surrounded by cloves, cinnamon and nutmeg",
    paragraphs: [
      "Aromatherapy candles infused with native spices of North Maluku. Crafted with pure essential oils derived from clove, nutmeg, and regional botanical flora, it slowly fills your space with an authentic, grounding warmth.",
      "Designed to evoke serenity, deep relaxation, and inner peace through the rich, historical aromatic essence of the Spice Islands. Poured with premium natural wax for a clean, non-toxic, and long-lasting burn.",
    ],
    meta: "100% Native Spices · Pure Essential Oils · Clean Wax Burn · Mindful Relaxation · Ethically Crafted",
  },
  {
    id: "music",
    category: "Sonic Identity",
    title: "Brand Music",
    image: cld("brand-music.webp", 1200),
    alt: "Man listening to a sea shell: Kagōunga sonic identity",
    paragraphs: [
      "A bespoke audio experience crafted far beyond conventional stock soundscapes, bringing universal musical elements into harmony with indigenous roots. Created in close collaboration with local musicians and composers, every score, arrangement, and harmonic layer is thoughtfully engineered to embody authentic regional soul.",
      "The poetic lyricism serves as a deeply moving narrative of home, honoring ancestral wisdom, cultural heritage, and lineage. It transcends ordinary background music into an evocative sonic identity that binds legacy, place, and tradition.",
    ],
    meta: "Collaborative Compositions · Local Master Artistry · Ancestral Narrative · Cultural Heritage · Bespoke Soundscape",
  },
  {
    id: "artwork",
    category: "Fine Art",
    title: "Visual Artwork",
    image: cld("visual-vivid.webp", 1200),
    alt: "Three Maluku-inspired paintings of sea, palms and harvest",
    paragraphs: [
      "An exclusive collection of 9x12 cm collectible art cards created in collaborative partnership with talented local North Malukan artists. Each original piece illustrates intimate visual stories of identity, cultural heritage, and everyday life surrounding the Spice Islands through the unique signature style of its creator.",
      "Included inside every Popeda Soup package, these high-value art pieces rotate with each production batch, offering an authentic canvas of regional narrative to collect. A thoughtful bridge connecting gastronomy with local artistic expression.",
    ],
    meta: "9x12 cm Collectible Size · Local Artist Collaboration · Cultural Storytelling · Rotating Batch Editions · Included in Every Pack",
  },
];

export function getSignature(id: string): SignatureProduct {
  return SIGNATURES.find((s) => s.id === id) ?? SIGNATURES[0];
}

type SignatureOverlay = {
  category?: string;
  title?: string;
  alt?: string;
  paragraphs?: string[];
  meta?: string;
};

const ID_OVERLAYS = (idHome as { signatures?: Record<string, SignatureOverlay> })
  .signatures ?? {};

export function getSignatures(locale: Locale): SignatureProduct[] {
  if (locale !== "id") return SIGNATURES;
  return SIGNATURES.map((s) => ({ ...s, ...(ID_OVERLAYS[s.id] ?? {}) }));
}
