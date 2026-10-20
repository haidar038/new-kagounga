import { useTranslation } from "react-i18next";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { getLocaleFromPath, localeLink } from "../i18n";
import { StatusPage } from "../components/StatusPage";

/** Client-side fallback for 500/503. Server outages still use Vercel's edge error. */
export function ErrorPage({
  code = "500",
  maintenance = false,
}: {
  code?: string;
  maintenance?: boolean;
}): React.JSX.Element {
  const { t } = useTranslation(["common", "seo"]);
  const locale = getLocaleFromPath(window.location.pathname);
  const prefix = maintenance ? "error.maintenance" : "error";
  useDocumentMeta({
    title: t(maintenance ? "maintenance.title" : "error.title", { ns: "seo" }),
    description: t(maintenance ? "maintenance.description" : "error.description", {
      ns: "seo",
    }),
    noindex: true,
  });

  return (
    <StatusPage
      code={code}
      titleBold={t(`${prefix}.titleBold`)}
      titleLight={t(`${prefix}.titleLight`)}
      text={t(`${prefix}.text`)}
    >
      <button
        type="button"
        onClick={() => {
          window.location.reload();
        }}
        className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-cream hover:bg-black"
      >
        {t("error.retry")}
      </button>
      <a
        href={localeLink("/", locale)}
        className="rounded-full border border-ink/15 px-6 py-3 text-sm font-bold hover:border-ink/40"
      >
        {t("error.back")}
      </a>
    </StatusPage>
  );
}
