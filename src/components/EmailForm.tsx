import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Send } from "lucide-react";
import { localeLink, useLocale } from "../i18n";
import { cn } from "../lib/cn";

type FormState = "idle" | "sending" | "error";

const fieldCls =
  "w-full rounded-xl border border-cream/20 bg-white/5 px-3.5 py-2.5 text-[14px] text-cream placeholder:text-cream/40 focus:border-lime focus:outline-none";

/**
 * Email contact form via Web3Forms (https://web3forms.com). Keeps the
 * recipient address out of the rendered page (SEOptimer "Email Privacy"):
 * submissions POST straight to the Web3Forms API, then land on /thank-you.
 * Requires VITE_WEB3FORMS_API_KEY at build time — renders nothing without it.
 */
export function EmailForm({ className }: { className?: string }): React.JSX.Element | null {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const locale = useLocale();
  const [state, setState] = useState<FormState>("idle");
  const accessKey = import.meta.env.VITE_WEB3FORMS_API_KEY as string | undefined;

  if (!accessKey) return null;

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (state === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    // Native honeypot: real visitors never tick it (hidden input).
    if (data.get("botcheck")) return;
    setState("sending");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          name: String(data.get("name") ?? "").trim(),
          email: String(data.get("email") ?? "").trim(),
          message: String(data.get("message") ?? "").trim(),
          from_name: "Kagōunga Website",
          subject: t("form.subject"),
        }),
      });
      const body = (await response.json()) as { success?: boolean };
      if (!response.ok || body.success !== true) throw new Error("web3forms error");
      form.reset();
      navigate(localeLink("/thank-you", locale));
    } catch {
      setState("error");
    }
  };

  return (
    <form onSubmit={onSubmit} className={cn("grid gap-2.5", className)}>
      {/* Honeypot — hidden from humans, caught by the Advanced Spam Filter. */}
      <input
        type="checkbox"
        name="botcheck"
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
        aria-label="botcheck"
      />
      <input
        type="text"
        name="name"
        required
        autoComplete="name"
        aria-label={t("form.name")}
        placeholder={t("form.name")}
        className={fieldCls}
      />
      <input
        type="email"
        name="email"
        required
        autoComplete="email"
        aria-label={t("form.email")}
        placeholder={t("form.email")}
        className={fieldCls}
      />
      <textarea
        name="message"
        required
        rows={3}
        aria-label={t("form.message")}
        placeholder={t("form.message")}
        className={cn(fieldCls, "resize-none")}
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-lime px-5 py-2.5 text-[13px] font-bold text-ink transition hover:brightness-95 disabled:opacity-60"
      >
        <Send className="size-4" aria-hidden="true" />
        {state === "sending" ? t("form.sending") : t("form.send")}
      </button>
      <p aria-live="polite" className="min-h-4 text-[12px] text-cream/60">
        {state === "error" ? t("form.error") : ""}
      </p>
    </form>
  );
}
