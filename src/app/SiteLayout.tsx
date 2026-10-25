import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { LocaleBanner } from "../components/LocaleBanner";
import { ensureLocale, localeLink, setStoredLocale, useLocale } from "../i18n";
import {
  setAnalyticsConsent,
  trackPageView,
} from "../lib/analytics";
import { useHydrated } from "../hooks/useHydrated";

function ScrollManager(): null {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Only plain id anchors (#movement) are scroll targets. State hashes
    // like #card=<slug> belong to a component and would throw as selectors.
    if (hash && /^#[\w-]+$/.test(hash)) {
      const el = document.querySelector(hash);
      if (el) {
        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function PageViewTracker(): null {
  const { pathname } = useLocation();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return null;
}

function ConsentBanner(): React.JSX.Element | null {
  const { t } = useTranslation("common");
  const locale = useLocale();
  const hydrated = useHydrated();
  const [decided, setDecided] = useState(false);
  // Storage is client-only; useHydrated keeps SSR HTML identical.
  let visible = false;
  if (hydrated) {
    try {
      visible = localStorage.getItem("kga-consent-v1") === null;
    } catch {
      visible = false;
    }
  }

  if (!visible || decided) return null;

  const decide = (granted: boolean): void => {
    setAnalyticsConsent(granted);
    setDecided(true);
  };

  return (
    <div
      role="region"
      aria-label={t("consent.region")}
      className="fixed inset-x-4 bottom-4 z-60 mx-auto max-w-xl rounded-2xl border border-ink/10 bg-white p-4 shadow-2xl"
    >
      <p className="text-[13px] leading-relaxed text-ink/80">
        {t("consent.pre")}
        <Link
          to={localeLink("/privacy", locale)}
          className="font-bold underline"
        >
          {t("consent.link")}
        </Link>
        {t("consent.post")}
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => {
            decide(true);
          }}
          className="rounded-full bg-ink px-5 py-2 text-[13px] font-bold text-cream"
        >
          {t("consent.accept")}
        </button>
        <button
          type="button"
          onClick={() => {
            decide(false);
          }}
          className="rounded-full border border-ink/15 px-5 py-2 text-[13px] font-bold"
        >
          {t("consent.decline")}
        </button>
      </div>
    </div>
  );
}

/** Keep <html lang> + i18next in sync with the /id route prefix. */
function LocaleSync(): null {
  const locale = useLocale();
  useEffect(() => {
    document.documentElement.lang = locale;
    setStoredLocale(locale);
    if (i18n.language !== locale) {
      void (async () => {
        // Load the target bundle first so the switch never flashes raw keys.
        await ensureLocale(locale);
        if (i18n.language !== locale) await i18n.changeLanguage(locale);
      })();
    }
  }, [locale]);
  return null;
}

export function SiteLayout(): React.JSX.Element {
  const { t } = useTranslation("common");
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main-content"
        className="sr-only z-70 rounded-full bg-lime px-5 py-3 text-sm font-bold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t("skipToContent")}
      </a>
      <ScrollManager />
      <PageViewTracker />
      <LocaleSync />
      <SiteHeader />
      <LocaleBanner />
      <div id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </div>
      <SiteFooter />
      <ConsentBanner />
    </div>
  );
}
