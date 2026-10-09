import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LOCALES,
  localeLink,
  setStoredLocale,
  toLocalePath,
  useLocale,
  type Locale,
} from "../i18n";
import { cn } from "../lib/cn";

/** EN | ID toggle. Mirrors the current path into the target locale. */
export function LanguageSwitcher({ dark = false }: { dark?: boolean }): React.JSX.Element {
  const { t } = useTranslation("common");
  const locale = useLocale();
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  const switchTo = (next: Locale): void => {
    if (next === locale) return;
    setStoredLocale(next);
    navigate(`${toLocalePath(pathname, next)}${search}${hash}`);
  };

  return (
    <div
      role="group"
      aria-label={t("footer.language")}
      className={cn(
        "flex items-center gap-1 text-[12px] font-bold",
        dark ? "border-l border-cream/15 pl-5" : "border-l border-ink/15 pl-3",
      )}
    >
      {LOCALES.map((l) => (
        <span key={l}>
          {l === locale ? (
            <span
              aria-current="true"
              className="rounded-md bg-lime px-2 py-1 text-ink"
            >
              {l.toUpperCase()}
            </span>
          ) : (
            <Link
              to={`${localeLink(pathname, l)}${search}${hash}`}
              onClick={(e) => {
                e.preventDefault();
                switchTo(l);
              }}
              aria-label={l === "id" ? "Bahasa Indonesia" : "English"}
              className={cn(
                "rounded-md px-2 py-1",
                dark
                  ? "text-cream/60 hover:text-cream"
                  : "text-ink/60 hover:text-ink",
              )}
            >
              {l.toUpperCase()}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
