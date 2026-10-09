import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import {
  setAnalyticsConsent,
  trackPageView,
} from "../lib/analytics";

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

function ConsentBanner(): React.JSX.Element | null {
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
      aria-label="Analytics consent"
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-xl rounded-2xl border border-ink/10 bg-white p-4 shadow-2xl"
    >
      <p className="text-[13px] leading-relaxed text-ink/80">
        We use privacy-friendly analytics without query data. Allow anonymous
        page views?
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => {
            decide(true);
          }}
          className="rounded-full bg-ink px-5 py-2 text-[13px] font-bold text-cream"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => {
            decide(false);
          }}
          className="rounded-full border border-ink/15 px-5 py-2 text-[13px] font-bold"
        >
          Decline
        </button>
      </div>
    </div>
  );
}

export function SiteLayout(): React.JSX.Element {
  return (
    <>
      <ScrollManager />
      <PageViewTracker />
      <SiteHeader />
      <Outlet />
      <SiteFooter />
      <ConsentBanner />
    </>
  );
}
