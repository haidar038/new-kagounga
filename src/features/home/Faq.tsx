import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MarkdownText } from "../../components/MarkdownText";
import { Reveal } from "../../components/Reveal";
import { CONTENT_UPDATED } from "../../data/site";
import { localeLink, useLocale } from "../../i18n";
import { formatDateLabel } from "../../lib/format";

interface FaqItem {
  q: string;
  a: string;
}

/**
 * Native <details>/<summary>: accessible, keyboard-operable, and fully
 * present in the prerendered HTML without JS (GEO/crawler-friendly).
 */
export function Faq(): React.JSX.Element {
  const { t } = useTranslation("home");
  const locale = useLocale();
  const items = t("faq.items", { returnObjects: true }) as FaqItem[];

  return (
    <section id="faq" className="pb-16 md:pb-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <h2 className="display text-center text-4xl font-black md:text-5xl">
            <span className="font-bold">{t("faq.titleBold")}</span>{" "}
            <span className="font-light">{t("faq.titleLight")}</span>
          </h2>
        </Reveal>
        <Reveal>
          <div className="mx-auto mt-10 divide-y divide-ink/10 border-y border-ink/10">
            {items.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-bold [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-lg text-ink/40 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
                  <MarkdownText text={item.a} />
                </p>
              </details>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <p className="mx-auto mt-5 text-center text-[12px] leading-relaxed text-ink/60">
            {t("faq.updated", {
              date: formatDateLabel(CONTENT_UPDATED, locale),
            })}{" "}
            <Link
              to={localeLink("/editorial", locale)}
              className="underline underline-offset-2 hover:text-ink"
            >
              {t("faq.readPolicy")}
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
