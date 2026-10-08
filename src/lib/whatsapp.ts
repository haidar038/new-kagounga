const WA_NUMBER = "628111538111";

export function waLink(message: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function orderMessage(productName: string): string {
  return `Halo Kagōunga! Saya ingin memesan ${productName}.`;
}

export function inquiryMessage(title: string, category: string): string {
  return `Halo Kagōunga! Saya ingin business inquiry mengenai ${title} (${category}). Mohon info lebih lanjut.`;
}
