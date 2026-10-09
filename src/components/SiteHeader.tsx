import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";
import { useScrolled } from "../hooks/useScrolled";
import { NAV_LINKS } from "../data/site";
import { localeLink, useLocale } from "../i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cld } from "../lib/cloudinary";
import { cn } from "../lib/cn";

export function SiteHeader(): React.JSX.Element {
  const { t } = useTranslation("common");
  const locale = useLocale();
  const scrolled = useScrolled(8);
  const [open, setOpen] = useState(false);

  return (
    <header
      id="siteHeader"
      className={cn(
        "sticky top-0 z-50 border-b border-ink/10 bg-cream/90 backdrop-blur",
        scrolled && "scrolled",
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <Link
          to={localeLink("/", locale)}
          className="flex shrink-0 items-center gap-3"
          aria-label={t("home")}
          onClick={() => {
            setOpen(false);
          }}
        >
          <img
            src={cld("logo-primary-horizontal.svg", 320)}
            alt="Kagōunga"
            className="h-8 w-auto"
            width={160}
            height={32}
            decoding="async"
          />
        </Link>
        <nav className="hidden items-center gap-8 text-[14px] font-medium lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={localeLink(link.to, locale)}
              className={({ isActive }) =>
                isActive
                  ? "rounded-full bg-lime px-4 py-1.5 text-ink"
                  : "hover:opacity-60"
              }
            >
              {link.key ? t(`nav.${link.key}`) : link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to={localeLink("/contact", locale)}
            className="hidden rounded-full bg-ink px-5 py-2.5 text-[13px] font-bold text-cream hover:bg-black lg:inline-block"
          >
            {t("findUs")}
          </Link>
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>
          <button
            type="button"
            aria-label={t("menu")}
            aria-expanded={open}
            onClick={() => {
              setOpen((v) => !v);
            }}
            className="grid size-10 place-items-center rounded-full border border-ink/15 lg:hidden"
          >
            <Menu className="size-4.5" aria-hidden="true" />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-ink/10 bg-cream px-5 py-3 lg:hidden">
          <nav className="grid gap-1 text-[15px] font-medium">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={localeLink(link.to, locale)}
                onClick={() => {
                  setOpen(false);
                }}
                className={({ isActive }) =>
                  cn(
                    "rounded-xl px-3 py-2.5 hover:bg-ink/5",
                    isActive && "bg-ink text-cream",
                  )
                }
              >
                {link.key ? t(`nav.${link.key}`) : link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-2 flex items-center justify-between gap-3">
            <Link
              to={localeLink("/contact", locale)}
              onClick={() => {
                setOpen(false);
              }}
              className="block flex-1 rounded-full bg-ink px-5 py-3 text-center text-[15px] font-bold text-cream"
            >
              {t("findUs")}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
