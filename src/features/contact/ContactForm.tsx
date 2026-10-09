import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { contactSubjects, type ContactSubject } from "../../types/content";
import { waLink } from "../../lib/whatsapp";
import { Reveal } from "../../components/Reveal";
import { cn } from "../../lib/cn";

interface FormState {
  name: string;
  contact: string;
  subject: ContactSubject;
  message: string;
}

type FieldErrors = Partial<Record<"name" | "contact" | "message", string>>;

const INITIAL: FormState = {
  name: "",
  contact: "",
  subject: "Business Inquiry",
  message: "",
};

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (form.name.trim().length < 2) errors.name = "Enter a name with at least 2 characters.";
  const contact = form.contact.trim();
  if (contact.length < 3) {
    errors.contact = "Enter your email or WhatsApp number.";
  } else if (contact.includes("@") && !/^\S+@\S+\.\S+$/.test(contact)) {
    errors.contact = "Invalid email format.";
  }
  if (form.message.trim().length < 10) {
    errors.message = "Describe your needs in at least 10 characters.";
  }
  return errors;
}

const inputCls =
  "w-full rounded-2xl border border-ink/15 bg-white px-5 py-3.5 text-[15px] outline-none transition placeholder:text-ink/40 focus:border-ink/50";
const labelCls = "mb-2 block text-[13px] font-bold";

export function ContactForm(): React.JSX.Element {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sent, setSent] = useState(false);
  const [sentUrl, setSentUrl] = useState<string | null>(null);

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
    const text =
      `Hello Kagōunga! I'm ${form.name.trim()} (${form.contact.trim()}).\n` +
      `Subject: ${form.subject}\n${form.message.trim()}`;
    const url = waLink(text);
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
            Name
          </label>
          <input
            id="cf-name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
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
            Email / WhatsApp
          </label>
          <input
            id="cf-contact"
            type="text"
            autoComplete="email"
            placeholder="email@example.com or 08xxxxxxxxxx"
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
            Subject
          </label>
          <select
            id="cf-subject"
            value={form.subject}
            onChange={(e) => {
              set("subject", e.target.value as ContactSubject);
            }}
            className={cn(inputCls, "appearance-none")}
          >
            {contactSubjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-1 flex-col">
          <label htmlFor="cf-message" className={labelCls}>
            Message
          </label>
          <textarea
            id="cf-message"
            rows={5}
            placeholder="Describe your needs: order, partnership, media, or other."
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
          Send via WhatsApp
        </button>
        {sent && (
          <p aria-live="polite" className="text-center text-[13px] font-medium text-ink/60">
            Opening WhatsApp.{" "}
            {sentUrl && (
              <a
                href={sentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline"
              >
                Continue here if blocked.
              </a>
            )}
          </p>
        )}
      </form>
    </Reveal>
  );
}
