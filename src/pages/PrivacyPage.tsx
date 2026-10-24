import { useTranslation } from "react-i18next";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { useLocale } from "../i18n";
import { CONTACT } from "../data/site";

interface LegalSubSection {
  h: string;
  p: string[];
}

interface LegalSection {
  h: string;
  p: string[];
  sub?: LegalSubSection[];
}

function LegalParagraphs({ p }: { p: string[] }): React.JSX.Element {
  return (
    <>
      {p.map((text) => (
        <p
          key={text.slice(0, 24)}
          className="mt-3 text-[15px] leading-relaxed text-ink/80"
        >
          {text
            .replace("{{email}}", CONTACT.email)
            .replace("{{phone}}", CONTACT.phoneLabel)}
        </p>
      ))}
    </>
  );
}

export function PrivacyPage(): React.JSX.Element {
  const { t } = useTranslation(["legal", "seo", "common"]);
  const locale = useLocale();
  useDocumentMeta({
    title: t("privacy.title", { ns: "seo" }),
    description: t("privacy.description", { ns: "seo" }),
    canonical: locale === "id" ? "/id/privacy" : "/privacy",
  });
  const sections = t("privacy.sections", { returnObjects: true }) as LegalSection[];

  return (
    <main id="top">
      <PageHero
        eyebrow={t("privacy.hero.eyebrow")}
        titleBold={t("privacy.hero.titleBold")}
        titleLight={t("privacy.hero.titleLight")}
        lede={t("privacy.hero.lede")}
      />
      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8">
          {sections.map((s) => (
            <Reveal key={s.h}>
              <h2 className="display text-3xl md:text-4xl">
                <span className="font-bold">{s.h}</span>
              </h2>
              {s.p.length > 0 && <LegalParagraphs p={s.p} />}
              {s.sub?.map((sub) => (
                <div key={sub.h} className="mt-6">
                  <h3 className="text-xl font-bold">{sub.h}</h3>
                  <LegalParagraphs p={sub.p} />
                </div>
              ))}
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
