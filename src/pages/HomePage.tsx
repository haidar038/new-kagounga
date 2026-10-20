import { useTranslation } from "react-i18next";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useLocale } from "../i18n";
import { Hero } from "../features/home/Hero";
import { Milestones } from "../features/home/Milestones";
import { Signature } from "../features/home/Signature";
import { Movement } from "../features/home/Movement";
import { Partners } from "../features/home/Partners";

export function HomePage(): React.JSX.Element {
  const { t } = useTranslation("seo");
  const locale = useLocale();
  useDocumentMeta({
    title: t("home.title"),
    description: t("home.description"),
    canonical: locale === "id" ? "/id" : "/",
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
