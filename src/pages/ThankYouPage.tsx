import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { localeLink, useLocale } from "../i18n";
import { Reveal } from "../components/Reveal";

/** Landing for Web3Forms email submissions (Redirect URL / SPA navigation). */
export function ThankYouPage(): React.JSX.Element {
  const { t } = useTranslation(["thankYou", "seo", "common"]);
  const locale = useLocale();
  useDocumentMeta({
    title: t("thank-you.title", { ns: "seo" }),
    description: t("thank-you.description", { ns: "seo" }),
    canonical: locale === "id" ? "/id/thank-you" : "/thank-you",
    noindex: true,
  });

  return (
    <main id="top" className="flex min-h-[70vh] items-center">
      <div className="mx-auto max-w-2xl px-5 py-16 text-center md:px-8">
        <Reveal>
          <h1 className="display text-5xl md:text-6xl">
            <span className="font-bold">{t("titleBold")}</span>
            <br />
            <span className="font-light">{t("titleLight")}</span>
          </h1>
          <p className="mt-6 leading-relaxed text-ink/70">{t("lede")}</p>
          <Link
            to={localeLink("/", locale)}
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-ink/15 px-7 py-3 text-sm font-bold transition hover:border-ink/40"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t("back")}
          </Link>
        </Reveal>
      </div>
    </main>
  );
}
