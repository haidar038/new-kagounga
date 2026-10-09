import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  dismissSuggest,
  getStoredLocale,
  setStoredLocale,
  shouldSuggestId,
  toLocalePath,
  useLocale,
} from "../i18n";

/**
 * One-time Bahasa Indonesia suggestion. Shown only on EN routes to
 * ID-browser visitors without a stored preference. Never auto-redirects.
 */
export function LocaleBanner(): React.JSX.Element | null {
  const { t } = useTranslation("common");
  const locale = useLocale();
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState<boolean>(
    () => locale === "en" && getStoredLocale() === null && shouldSuggestId(),
  );

  if (!visible || locale !== "en") return null;

  return (
    <div
      role="region"
      aria-label={t("banner.text")}
      className="border-b border-ink/10 bg-lime/40"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 py-2.5 text-[13px] font-medium md:px-8">
        <p>{t("banner.text")}</p>
        <button
          type="button"
          onClick={() => {
            setStoredLocale("id");
            setVisible(false);
            navigate(`${toLocalePath(pathname, "id")}${search}${hash}`);
          }}
          className="rounded-full bg-ink px-4 py-1.5 text-[12px] font-bold text-cream"
        >
          {t("banner.cta")}
        </button>
        <button
          type="button"
          onClick={() => {
            dismissSuggest();
            setVisible(false);
          }}
          aria-label={t("banner.dismiss")}
          className="rounded-full border border-ink/15 px-4 py-1.5 text-[12px] font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
