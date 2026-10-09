import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SITE_URL, useDocumentMeta } from "../hooks/useDocumentMeta";
import { breadcrumbLd, graphLd } from "../lib/seo";
import { CONTACT, SOCIALS } from "../data/site";
import { useLocale } from "../i18n";
import { FindUs } from "../features/contact/FindUs";
import { ContactForm } from "../features/contact/ContactForm";
import { Reveal } from "../components/Reveal";

export function ContactPage(): React.JSX.Element {
  const { t } = useTranslation(["contact", "seo", "common"]);
  const locale = useLocale();
  useDocumentMeta({
    title: t("contact.title", { ns: "seo" }),
    description: t("contact.description", { ns: "seo" }),
    canonical: locale === "id" ? "/id/contact" : "/contact",
    jsonLd: graphLd([
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/contact#business`,
        name: "Kagōunga",
        url: `${SITE_URL}/contact`,
        email: CONTACT.email,
        telephone: "+62 811-1538-111",
        address: {
          "@type": "PostalAddress",
          streetAddress: CONTACT.address[0],
          addressLocality: "Ternate",
          postalCode: "97751",
          addressCountry: "ID",
        },
        sameAs: SOCIALS.map((s) => s.href),
      },
      breadcrumbLd(
        [
          { name: t("home", { ns: "common" }), path: "/" },
          { name: t("contact", { ns: "common" }), path: "/contact" },
        ],
        SITE_URL,
      ),
    ]),
  });

  return (
    <main id="top">
      <FindUs />

      <section id="get-in-touch" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <h2 className="display text-5xl md:text-6xl">
              <span className="font-bold">{t("touch.titleBold")}</span>{" "}
              <span className="font-light">{t("touch.titleLight")}</span>
            </h2>
          </Reveal>
          <Reveal>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/70">
              {t("touch.lede")}
            </p>
          </Reveal>
          <div className="mt-8 border-t border-ink/10" />

          <div className="mt-8 grid gap-5 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
            <Reveal className="lg:col-span-2">
              <div className="flex h-full flex-col gap-4 rounded-3xl bg-ink p-7 text-cream md:p-10">
                <div className="flex gap-4">
                  <MapPin
                    className="size-6 shrink-0 text-lime"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-bold">{CONTACT.office}</p>
                    <p className="mt-1 text-[14px] leading-relaxed text-cream/70">
                      {CONTACT.address[0]}
                      <br />
                      {CONTACT.address[1]}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Mail
                    className="size-6 shrink-0 text-lime"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-bold">{t("email")}</p>
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="mt-1 block text-[14px] text-cream/70 hover:text-cream"
                    >
                      {CONTACT.email}
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone
                    className="size-6 shrink-0 text-lime"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-bold">{t("phone")}</p>
                    <a
                      href={CONTACT.phoneHref}
                      className="mt-1 block text-[14px] text-cream/70 hover:text-cream"
                    >
                      {CONTACT.phoneLabel}
                    </a>
                  </div>
                </div>
                <div className="mt-auto border-t border-cream/15 pt-6">
                  <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-lime">
                    {t("follow")}
                  </p>
                  <div className="mt-3 flex gap-2.5">
                    {SOCIALS.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        aria-label={s.label}
                        className="grid size-11 place-items-center rounded-full border border-cream/20 transition hover:border-lime hover:bg-lime"
                      >
                        <img
                          src={s.iconSrc}
                          alt=""
                          className={s.iconClass}
                          loading="lazy"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
