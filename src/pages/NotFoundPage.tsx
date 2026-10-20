import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { localeLink, useLocale } from "../i18n";
import { StatusPage } from "../components/StatusPage";

export function NotFoundPage(): React.JSX.Element {
  const { t } = useTranslation(["common", "seo"]);
  const locale = useLocale();
  useDocumentMeta({
    title: t("notFound.title", { ns: "seo" }),
    description: t("notFound.description", { ns: "seo" }),
    noindex: true,
  });

  return (
    <StatusPage
      code={t("notFound.eyebrow")}
      titleBold={t("notFound.titleBold")}
      titleLight={t("notFound.titleLight")}
      text={t("notFound.text")}
    >
      <Link
        to={localeLink("/", locale)}
        className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-cream hover:bg-black"
      >
        {t("notFound.back")}
      </Link>
    </StatusPage>
  );
}
