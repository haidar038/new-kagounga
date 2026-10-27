import { useTranslation } from "react-i18next";
import { PARTNERS } from "../../data/partners";
import { Reveal } from "../../components/Reveal";

export function Partners(): React.JSX.Element {
  const { t } = useTranslation("home");
  return (
    <section className="pb-16 md:pb-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          {/* Authority signal for trust audits: names the network explicitly. */}
          <p className="text-center text-[12px] font-bold uppercase tracking-[0.18em] text-ink/50">
            {t("partners.eyebrow")}
          </p>
          <h2 className="display mt-3 text-center text-4xl font-black md:text-5xl">
            <span className="font-bold">{t("partners.titleBold")}</span>{" "}
            <span className="font-light">{t("partners.titleLight")}</span>
          </h2>
        </Reveal>
        <Reveal>
          <p className="mx-auto mt-4 max-w-4xl text-center text-[15px] leading-relaxed text-ink/70">
            {t("partners.lede")}
          </p>
        </Reveal>
        <Reveal>
          <div
            role="region"
            className="marquee mt-12 overflow-hidden"
            aria-label={t("partners.region")}
          >
            <div className="flex w-max animate-marquee items-center gap-14">
              {PARTNERS.map((p) => (
                <img
                  key={p.name}
                  src={p.logo}
                  alt={p.name}
                  width={p.logoWidth}
                  height={p.logoHeight}
                  className="partner-logo"
                  loading="lazy"
                />
              ))}
              {PARTNERS.map((p) => (
                <img
                  key={`dup-${p.name}`}
                  src={p.logo}
                  // Duplicated marquee copy: alt still names the partner, while
                  // aria-hidden keeps it out of the screen-reader stream.
                  alt={p.name}
                  aria-hidden="true"
                  width={p.logoWidth}
                  height={p.logoHeight}
                  className="partner-logo"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
