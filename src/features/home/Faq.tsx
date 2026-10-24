import { useTranslation } from "react-i18next";
import { Reveal } from "../../components/Reveal";

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
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-ink/10 border-y border-ink/10">
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
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/70">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
