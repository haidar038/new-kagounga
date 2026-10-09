import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { localeLink, useLocale } from "../i18n";

export function NotFoundPage(): React.JSX.Element {
  const { t } = useTranslation(["common", "seo"]);
  const locale = useLocale();
  useDocumentMeta({
    title: t("notFound.title", { ns: "seo" }),
    description: t("notFound.description", { ns: "seo" }),
    noindex: true,
  });

  return (
    <main id="top">
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-ink/50">
          {t("notFound.eyebrow")}
        </p>
        <h1 className="display mt-3 text-5xl md:text-6xl">
          <span className="font-bold">{t("notFound.titleBold")}</span>{" "}
          <span className="font-light">{t("notFound.titleLight")}</span>
        </h1>
        <p aria-live="polite" className="mt-4 text-[15px] text-ink/70">
          {t("notFound.text")}
        </p>
        <Link
          to={localeLink("/", locale)}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-cream hover:bg-black"
        >
          {t("notFound.back")}
        </Link>
      </div>
    </main>
  );
}
