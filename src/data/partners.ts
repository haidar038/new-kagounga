import type { Partner } from "../types/content";
import { cld } from "../lib/cloudinary";

export const PARTNERS: Partner[] = [
  { name: "Bank Indonesia", logo: cld("bank-indonesia.webp", 320) },
  { name: "Cermat", logo: cld("cermat.webp", 320) },
  { name: "CNN Indonesia", logo: cld("cnn-indonesia.webp", 320) },
  { name: "Halmaheranesia", logo: cld("halmaheranesia.webp", 320) },
  { name: "Ikra", logo: cld("ikra.webp", 320) },
  { name: "ITB", logo: cld("ITB.webp", 320) },
  { name: "Javara", logo: cld("javara.webp", 320) },
  { name: "Nestle", logo: cld("nestle.webp", 320) },
  { name: "Kompas", logo: cld("kompas.webp", 320) },
  { name: "YBLL", logo: cld("YBLL.webp", 320) },
  { name: "Little Talks", logo: cld("littletalks.webp", 320) },
  { name: "Magazin", logo: cld("magazin.webp", 320) },
  { name: "Netrilis", logo: cld("netrilis.webp", 320) },
  { name: "Radio Insania Ternate", logo: cld("radio-insania-ternate.webp", 320) },
  { name: "RRI", logo: cld("RRI.webp", 320) },
  { name: "Seniman Pangan", logo: cld("seniman-pangan.webp", 320) },
  { name: "Sketch EA", logo: cld("sketch_ea.webp", 320) },
  { name: "UFF", logo: cld("uff.webp", 320) },
];
