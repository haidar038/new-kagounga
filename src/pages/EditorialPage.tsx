import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { CONTENT_UPDATED } from "../data/site";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { localeLink, useLocale } from "../i18n";
import { formatDateLabel } from "../lib/format";

interface EditorialSection {
  h: string;
  p: string[];
}

export function EditorialPage(): React.JSX.Element {
  const { t } = useTranslation(["editorial", "seo", "common"]);
  const locale = useLocale();
  useDocumentMeta({
    title: t("editorial.title", { ns: "seo" }),
    description: t("editorial.description", { ns: "seo" }),
    canonical: locale === "id" ? "/id/editorial" : "/editorial",
  });
  const sections = t("sections", { returnObjects: true }) as EditorialSection[];

  return (
    <main id="top">
      <PageHero
        eyebrow={t("hero.eyebrow")}
        titleBold={t("hero.titleBold")}
        titleLight={t("hero.titleLight")}
        lede={t("hero.lede")}
      />
      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-3xl gap-10 px-5 md:px-8">
          <Reveal>
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink/70">
              {t("updated", {
                date: formatDateLabel(CONTENT_UPDATED, locale),
              })}
            </p>
          </Reveal>
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
                  {text}
                </p>
              ))}
            </Reveal>
          ))}
          <Reveal>
            <Link
              to={localeLink("/contact", locale)}
              className="inline-block rounded-full bg-ink px-5 py-2.5 text-[13px] font-bold text-cream hover:bg-black"
            >
              {t("cta")}
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
