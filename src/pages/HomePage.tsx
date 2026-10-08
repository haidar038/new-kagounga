import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { Hero } from "../features/home/Hero";
import { Milestones } from "../features/home/Milestones";
import { Signature } from "../features/home/Signature";
import { Movement } from "../features/home/Movement";
import { Partners } from "../features/home/Partners";

export function HomePage(): React.JSX.Element {
  useDocumentMeta({
    title: "Move, Moreover | Kagōunga",
    description:
      "Kagōunga. Five distinct forms of expression bound by one identity. Gastronomy, personal care, home fragrance, sonic identity, and fine art from North Moluccas.",
  });

  return (
    <main id="top">
      <Hero />
      <Milestones />
      <Signature />
      <Movement />
      <Partners />
    </main>
  );
}
