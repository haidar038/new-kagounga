import { useTranslation } from "react-i18next";
import { useDocumentMeta, SITE_URL } from "../hooks/useDocumentMeta";
import { breadcrumbLd, graphLd } from "../lib/seo";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { useLocale } from "../i18n";
import { CONTACT } from "../data/site";

interface LegalSection {
  h: string;
  p: string[];
}

export function TermsPage(): React.JSX.Element {
  const { t } = useTranslation(["legal", "seo", "common"]);
  const locale = useLocale();
  useDocumentMeta({
    title: t("terms.title", { ns: "seo" }),
    description: t("terms.description", { ns: "seo" }),
    canonical: locale === "id" ? "/id/terms" : "/terms",
    jsonLd: graphLd([
      breadcrumbLd(
        [
          { name: t("home", { ns: "common" }), path: "/" },
          { name: t("terms", { ns: "common" }), path: "/terms" },
        ],
        SITE_URL,
      ),
    ]),
  });
  const sections = t("terms.sections", { returnObjects: true }) as LegalSection[];

  return (
    <main id="top">
      <PageHero
        eyebrow={t("terms.hero.eyebrow")}
        titleBold={t("terms.hero.titleBold")}
        titleLight={t("terms.hero.titleLight")}
        lede={t("terms.hero.lede")}
      />
      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8">
          {sections.map((s) => (
            <Reveal key={s.h}>
              <h2 className="display text-3xl md:text-4xl">
                <span className="font-bold">{s.h}</span>
              </h2>
              {s.p.map((text) => (
                <p
                  key={text.slice(0, 24)}
                  className="mt-3 text-[15px] leading-relaxed text-ink/80"
                >
                  {text
                    .replace("{{email}}", CONTACT.email)
                    .replace("{{phone}}", CONTACT.phoneLabel)}
                </p>
              ))}
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
