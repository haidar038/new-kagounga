import { useTranslation } from "react-i18next";
import { useDocumentMeta, SITE_URL } from "../hooks/useDocumentMeta";
import { breadcrumbLd, graphLd } from "../lib/seo";
import { getCollaborators } from "../data/collaborators";
import { useLocale } from "../i18n";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";

export function AboutPage(): React.JSX.Element {
  const { t } = useTranslation(["about", "seo", "common"]);
  const locale = useLocale();
  useDocumentMeta({
    title: t("about.title", { ns: "seo" }),
    description: t("about.description", { ns: "seo" }),
    canonical: locale === "id" ? "/id/about" : "/about",
    jsonLd: graphLd([
      breadcrumbLd(
        [
          { name: t("home", { ns: "common" }), path: "/" },
          { name: t("about", { ns: "common" }), path: "/about" },
        ],
        SITE_URL,
      ),
    ]),
  });
  const items = getCollaborators(locale);

  return (
    <main id="top">
      <PageHero
        eyebrow={t("hero.eyebrow")}
        titleBold={t("hero.titleBold")}
        titleLight={t("hero.titleLight")}
        lede={t("hero.lede")}
      >
        <div className="mt-8 grid max-w-3xl gap-6 text-[15px] leading-relaxed text-cream/80 md:text-base">
          <Reveal>
            <p>
              {t("intro.p1a")}
              <strong>{t("intro.founder")}</strong> {t("intro.and")}{" "}
              <strong>{t("intro.cofounder")}</strong>
              {t("intro.p1b")}
            </p>
          </Reveal>
          <Reveal>
            <p>
              {t("intro.p2a")}
              <strong>{t("intro.movement")}</strong>
              {t("intro.p2b")}
            </p>
          </Reveal>
        </div>
      </PageHero>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <h2 className="display text-5xl md:text-6xl">
              <span className="font-bold">{t("copilot.titleBold")}</span>{" "}
              <span className="font-light">{t("copilot.titleLight")}</span>
            </h2>
          </Reveal>
          <Reveal>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/70">
              {t("copilot.lede")}
            </p>
          </Reveal>
          <div className="mt-8 border-t border-ink/10" />

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-5">
            {items.map((c) => (
              <Reveal key={c.name}>
                <article className="card-hover relative overflow-hidden rounded-3xl border border-ink/10 bg-white">
                  <img
                    src={c.image}
                    alt={c.alt}
                    className="aspect-3/4 w-full object-cover object-top md:aspect-square"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-ink via-ink/35 to-transparent p-4 md:p-5">
                    <h3 className="font-bold text-cream">{c.name}</h3>
                    <p className="mt-0.5 text-[13px] text-cream/70">{c.role}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
