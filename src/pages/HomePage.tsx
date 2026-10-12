import { useTranslation } from "react-i18next";
import { SITE_URL, useDocumentMeta } from "../hooks/useDocumentMeta";
import { graphLd } from "../lib/seo";
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
    jsonLd: graphLd([
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Kagōunga",
        url: `${SITE_URL}/`,
        logo: "https://res.cloudinary.com/fal5otmd/image/upload/f_auto,q_auto/logo-primary-emblem.svg",
        sameAs: [
          "https://www.instagram.com/kagounga.id/",
          "https://www.tiktok.com/@kagounga.id/",
          "https://x.com/kagounga/",
          "https://www.threads.com/@kagounga.id",
          "https://www.youtube.com/@Kagounga",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: "Kagōunga",
        inLanguage: locale,
      },
    ]),
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
