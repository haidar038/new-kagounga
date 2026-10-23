import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, MapPin } from "lucide-react";
import { getStockistCity, loadStockistCity } from "../data/stockists";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { localeLink, useLocale } from "../i18n";
import { NotFoundPage } from "./NotFoundPage";
import { Reveal } from "../components/Reveal";

export function StockistPage(): React.JSX.Element {
  const { city: slug } = useParams<{ city: string }>();
  const { t } = useTranslation(["stockists", "contact", "common"]);
  const locale = useLocale();
  const cacheKey = `${locale}|${slug ?? ""}`;
  // Statis/snapshot dulu (SEO + hydration), lalu upgrade ke CMS bila reachable.
  // CMS reachable tapi kota tidak ada/draft -> 404; transport gagal -> fallback.
  const fallbackCity = useMemo(
    () => (slug ? getStockistCity(slug, locale) : null),
    [slug, locale],
  );
  const [cached, setCached] = useState(() => ({ key: cacheKey, city: fallbackCity }));
  const city = cached.key === cacheKey ? cached.city : fallbackCity;
  const copy = city?.copy ?? null;
  const points = city?.points ?? [];
  const valid = Boolean(city && copy);
  const canonical = `/stockists/${slug ?? ""}`;

  useEffect(() => {
    if (!slug) return;
    let on = true;
    loadStockistCity(slug, locale, fallbackCity).then((result) => {
      if (on && result.source === "cms") {
        setCached({ key: cacheKey, city: result.city });
      }
    });
    return () => {
      on = false;
    };
  }, [slug, locale, cacheKey, fallbackCity]);

  useDocumentMeta({
    title: copy?.seoTitle ?? t("notFound.title", { ns: "seo" }),
    description: copy?.description ?? t("notFound.description", { ns: "seo" }),
    canonical: locale === "id" ? `/id${canonical}` : canonical,
    noindex: !valid,
  });

  if (!city || !copy) return <NotFoundPage />;

  const href = (path: string): string => localeLink(path, locale);

  return (
    <main id="top">
      <section className="relative overflow-hidden bg-ink text-cream">
        <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-16">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-[13px] text-cream/70"
          >
            <Link to={href("/")} className="hover:text-cream">
              {t("crumbs.home", { ns: "common" })}
            </Link>
            <span aria-hidden="true">/</span>
            <Link to={href("/contact")} className="hover:text-cream">
              {t("crumbs.contact", { ns: "common" })}
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-cream">
              {city.city}
            </span>
          </nav>

          <p className="mt-10 text-[12px] font-bold uppercase tracking-[0.18em] text-lime">
            {t("eyebrow")}
          </p>
          <h1 className="display mt-3 max-w-4xl text-5xl md:text-7xl">
            {copy.title}
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-cream/80 md:text-lg">
            {copy.lede}
          </p>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-cream/15 pt-5 text-[13px]">
            <p className="font-bold text-lime">
              {t("pointsCount", { count: points.length })}
            </p>
            <p className="text-cream/70">
              {[...new Set(points.map((point) => point.kind))]
                .map((kind) => t(`kinds.${kind}`, { ns: "contact" }))
                .join(" · ")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <article>
            <Reveal>
              <div className="grid gap-4 text-[15px] leading-relaxed text-ink/70">
                {copy.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <h2 className="mt-12 text-2xl font-bold">
                {t("pointsTitle")}
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {points.map((point) => {
                  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`;
                  return (
                    <article
                      key={point.id}
                      className="flex h-full flex-col rounded-3xl border border-ink/10 bg-white p-5"
                    >
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/70">
                        {t(`kinds.${point.kind}`, { ns: "contact" })}
                      </p>
                      <h3 className="mt-1 text-lg font-bold">{point.name}</h3>
                      <p className="mt-1 text-[14px] text-ink/70">{point.area}</p>
                      <p className="mt-2 text-[13px] text-ink/70">{city.city}</p>
                      <a
                        href={mapsHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex items-center gap-2 pt-4 text-[13px] font-bold underline decoration-lime decoration-2 underline-offset-4"
                      >
                        <MapPin className="size-4" aria-hidden="true" />
                        {t("directions")}
                      </a>
                    </article>
                  );
                })}
              </div>
            </Reveal>
          </article>

          <aside className="grid content-start gap-5">
            <Reveal>
              <div className="rounded-3xl bg-ink p-7 text-cream">
                <h2 className="text-2xl font-bold">{t("contactTitle")}</h2>
                <p className="mt-3 text-[14px] leading-relaxed text-cream/70">
                  {t("contactText")}
                </p>
                <Link
                  to={href("/contact")}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-sm font-bold text-ink hover:brightness-95"
                >
                  {t("contactCta")}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>

            <Reveal>
              <div className="rounded-3xl border border-ink/10 bg-white p-7">
                <h2 className="text-xl font-bold">
                  {t("nav.catalog", { ns: "common" })}
                </h2>
                <p className="mt-2 text-[14px] leading-relaxed text-ink/70">
                  {t("catalogText")}
                </p>
                <Link
                  to={href("/catalog")}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold underline decoration-lime decoration-2 underline-offset-4"
                >
                  {t("nav.catalog", { ns: "common" })}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    </main>
  );
}
