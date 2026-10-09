import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Send } from "lucide-react";
import { contactSubjects } from "../../types/content";
import { contactMessage, waLink } from "../../lib/whatsapp";
import { useLocale } from "../../i18n";
import idContact from "../../locales/id/contact.json";
import { Reveal } from "../../components/Reveal";
import { cn } from "../../lib/cn";

interface FormState {
  name: string;
  contact: string;
  subject: string;
  message: string;
}

type FieldErrors = Partial<Record<"name" | "contact" | "message", string>>;

const ID_SUBJECTS = (idContact as { subjects?: string[] }).subjects ?? [];

function subjectList(locale: string): string[] {
  if (locale === "id" && ID_SUBJECTS.length === contactSubjects.length) {
    return ID_SUBJECTS;
  }
  return [...contactSubjects];
}

const inputCls =
  "w-full rounded-2xl border border-ink/15 bg-white px-5 py-3.5 text-[15px] outline-none transition placeholder:text-ink/40 focus:border-ink/50";
const labelCls = "mb-2 block text-[13px] font-bold";

export function ContactForm(): React.JSX.Element {
  const { t } = useTranslation("contact");
  const locale = useLocale();
  const subjects = subjectList(locale);
  const [form, setForm] = useState<FormState>(() => ({
    name: "",
    contact: "",
    subject: subjects[0],
    message: "",
  }));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sent, setSent] = useState(false);
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const validate = (f: FormState): FieldErrors => {
    const found: FieldErrors = {};
    if (f.name.trim().length < 2) found.name = t("form.errName");
    const c = f.contact.trim();
    if (c.length < 3) {
      found.contact = t("form.errContact");
    } else if (c.includes("@") && !/^\S+@\S+\.\S+$/.test(c)) {
      found.contact = t("form.errContactEmail");
    }
    if (f.message.trim().length < 10) found.message = t("form.errMessage");
    return found;
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSent(false);
    setSentUrl(null);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    const url = waLink(
      contactMessage(
        form.name.trim(),
        form.contact.trim(),
        form.subject,
        form.message.trim(),
        locale,
      ),
    );
    setSentUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <Reveal className="h-full">
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex h-full flex-col gap-5 rounded-3xl border border-ink/10 bg-white p-7 md:p-10"
      >
        <div>
          <label htmlFor="cf-name" className={labelCls}>
            {t("form.name")}
          </label>
          <input
            id="cf-name"
            type="text"
            autoComplete="name"
            placeholder={t("form.namePh")}
            value={form.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "cf-name-error" : undefined}
            onChange={(e) => {
              set("name", e.target.value);
            }}
            className={cn(inputCls, errors.name && "border-red-500")}
          />
          {errors.name && (
            <p id="cf-name-error" className="mt-1.5 text-[13px] font-medium text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="cf-contact" className={labelCls}>
            {t("form.contact")}
          </label>
          <input
            id="cf-contact"
            type="text"
            autoComplete="email"
            placeholder={t("form.contactPh")}
            value={form.contact}
            aria-invalid={Boolean(errors.contact)}
            aria-describedby={errors.contact ? "cf-contact-error" : undefined}
            onChange={(e) => {
              set("contact", e.target.value);
            }}
            className={cn(inputCls, errors.contact && "border-red-500")}
          />
          {errors.contact && (
            <p id="cf-contact-error" className="mt-1.5 text-[13px] font-medium text-red-600">
              {errors.contact}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="cf-subject" className={labelCls}>
            {t("form.subject")}
          </label>
          <select
            id="cf-subject"
            value={form.subject}
            onChange={(e) => {
              set("subject", e.target.value);
            }}
            className={cn(inputCls, "appearance-none")}
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-1 flex-col">
          <label htmlFor="cf-message" className={labelCls}>
            {t("form.message")}
          </label>
          <textarea
            id="cf-message"
            rows={5}
            placeholder={t("form.messagePh")}
            value={form.message}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "cf-message-error" : undefined}
            onChange={(e) => {
              set("message", e.target.value);
            }}
            className={cn(inputCls, "flex-1 resize-y", errors.message && "border-red-500")}
          />
          {errors.message && (
            <p id="cf-message-error" className="mt-1.5 text-[13px] font-medium text-red-600">
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-bold text-cream hover:bg-black"
        >
          <Send className="size-4" aria-hidden="true" />
          {t("form.send")}
        </button>
        {sent && (
          <p aria-live="polite" className="text-center text-[13px] font-medium text-ink/60">
            {t("form.opening")}{" "}
            {sentUrl && (
              <a
                href={sentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline"
              >
                {t("form.continue")}
              </a>
            )}
          </p>
        )}
      </form>
    </Reveal>
  );
}
