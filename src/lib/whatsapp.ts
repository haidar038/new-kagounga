import type { Locale } from "../i18n";

const WA_NUMBER = "628111538111";

export function waLink(message: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function orderMessage(productName: string, locale: Locale = "en"): string {
  if (locale === "id") return `Halo Kagōunga! Saya ingin memesan ${productName}.`;
  return `Hi Kagōunga! I'd like to order ${productName}.`;
}

export function inquiryMessage(
  title: string,
  category: string,
  locale: Locale = "en",
): string {
  if (locale === "id") {
    return `Halo Kagōunga! Saya ingin business inquiry mengenai ${title} (${category}). Mohon info lebih lanjut.`;
  }
  return `Hi Kagōunga! I have a business inquiry about ${title} (${category}). Please share more info.`;
}

/** Contact-form body, localized. Subject must already be the displayed text. */
export function contactMessage(
  name: string,
  contact: string,
  subject: string,
  message: string,
  locale: Locale = "en",
): string {
  if (locale === "id") {
    return (
      `Halo Kagōunga! Saya ${name} (${contact}).\n` +
      `Subjek: ${subject}\n${message}`
    );
  }
  return (
    `Hello Kagōunga! I'm ${name} (${contact}).\n` +
    `Subject: ${subject}\n${message}`
  );
}
