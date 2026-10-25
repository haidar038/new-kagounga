declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = "kga-consent-v1";

export function hasAnalyticsConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

export function setAnalyticsConsent(granted: boolean): void {
  try {
    localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
  } catch {
    // storage unavailable, consent stays denied
  }
  // Lets the inline gtag loader (index.html) fetch gtag.js once consent is
  // granted mid-session.
  window.dispatchEvent(
    new CustomEvent("kga-consent", { detail: granted ? "granted" : "denied" }),
  );
}

export function trackPageView(path: string): void {
  if (!hasAnalyticsConsent()) return;
  const clean = path.split(/[?#]/)[0] || "/";
  window.gtag?.("event", "page_view", {
    page_path: clean,
    page_title: document.title,
  });
}
