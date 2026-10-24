import type { Partner } from "../types/content";
import { cld } from "../lib/cloudinary";

export const PARTNERS: Partner[] = [
  { name: "Bank Indonesia", logo: cld("bank-indonesia.webp", 320), logoWidth: 320, logoHeight: 59 },
  { name: "Cermat", logo: cld("cermat.webp", 320), logoWidth: 320, logoHeight: 124 },
  { name: "CNN Indonesia", logo: cld("cnn-indonesia.webp", 320), logoWidth: 320, logoHeight: 226 },
  { name: "Halmaheranesia", logo: cld("halmaheranesia.webp", 320), logoWidth: 320, logoHeight: 67 },
  { name: "Ikra", logo: cld("ikra.webp", 320), logoWidth: 320, logoHeight: 320 },
  { name: "ITB", logo: cld("ITB.webp", 320), logoWidth: 320, logoHeight: 320 },
  { name: "Javara", logo: cld("javara.webp", 320), logoWidth: 320, logoHeight: 276 },
  { name: "Nestle", logo: cld("nestle.webp", 320), logoWidth: 320, logoHeight: 331 },
  { name: "Kompas", logo: cld("kompas.webp", 320), logoWidth: 320, logoHeight: 90 },
  { name: "YBLL", logo: cld("YBLL.webp", 320), logoWidth: 320, logoHeight: 204 },
  { name: "Little Talks", logo: cld("littletalks.webp", 320), logoWidth: 320, logoHeight: 153 },
  { name: "Magazin", logo: cld("magazin.webp", 320), logoWidth: 320, logoHeight: 110 },
  { name: "Mayora", logo: cld("mayora-logo.webp", 320), logoWidth: 320, logoHeight: 66 },
  { name: "Netrilis", logo: cld("netrilis.webp", 320), logoWidth: 320, logoHeight: 128 },
  { name: "Puta Dino Kayangan", logo: cld("logo-puta-dino.webp", 320), logoWidth: 320, logoHeight: 144 },
  { name: "Radio Insania Ternate", logo: cld("radio-insania-ternate.webp", 320), logoWidth: 320, logoHeight: 94 },
  { name: "RRI", logo: cld("RRI.webp", 320), logoWidth: 320, logoHeight: 123 },
  { name: "Seniman Pangan", logo: cld("seniman-pangan.webp", 320), logoWidth: 320, logoHeight: 383 },
  { name: "Sketch EA", logo: cld("sketch_ea.webp", 320), logoWidth: 320, logoHeight: 489 },
  { name: "UFF", logo: cld("uff.webp", 320), logoWidth: 320, logoHeight: 360 },
];
