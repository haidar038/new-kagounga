import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { LocaleBanner } from "../components/LocaleBanner";
import { localeLink, setStoredLocale, useLocale } from "../i18n";
import {
  setAnalyticsConsent,
  trackPageView,
} from "../lib/analytics";

import { SITE_URL } from "../hooks/useDocumentMeta";

function ScrollManager(): null {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
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

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Kagōunga",
      url: `${SITE_URL}/`,
      logo: "https://res.cloudinary.com/fal5otmd/image/upload/f_auto,q_auto/logo-primary-emblem.svg",
      email: "hello@kagounga.com",
      telephone: "+62 811-1538-111",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Raya Pertamina, No.800, Jambula",
        addressLocality: "Ternate",
        postalCode: "97751",
        addressCountry: "ID",
      },
      sameAs: [
        "https://www.instagram.com/kagounga.id/",
        "https://www.tiktok.com/@kagounga.id/",
        "https://x.com/kagounga/",
        "https://www.threads.com/@kagounga.id",
        "https://www.youtube.com/@Kagounga",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Kagōunga",
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

function OrgJsonLd(): null {
  useEffect(() => {
    const id = "kga-jsonld-org";
    if (document.getElementById(id)) return;
    const s = document.createElement("script");
    s.id = id;
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(ORG_JSONLD);
    document.head.appendChild(s);
  }, []);
  return null;
}

function ConsentBanner(): React.JSX.Element | null {
  const { t } = useTranslation("common");
  const locale = useLocale();
  const [visible, setVisible] = useState<boolean>(() => {
    try {
      return localStorage.getItem("kga-consent-v1") === null;
    } catch {
      return false;
    }
  });

  if (!visible) return null;

  const decide = (granted: boolean): void => {
    setAnalyticsConsent(granted);
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label={t("consent.region")}
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-xl rounded-2xl border border-ink/10 bg-white p-4 shadow-2xl"
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
    if (i18n.language !== locale) void i18n.changeLanguage(locale);
  }, [locale]);
  return null;
}

export function SiteLayout(): React.JSX.Element {
  return (
    <>
      <ScrollManager />
      <PageViewTracker />
      <LocaleSync />
      <OrgJsonLd />
      <SiteHeader />
      <LocaleBanner />
      <Outlet />
      <SiteFooter />
      <ConsentBanner />
    </>
  );
}
