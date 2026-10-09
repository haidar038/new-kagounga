import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Reveal } from "../../components/Reveal";
import { cld } from "../../lib/cloudinary";
import { cn } from "../../lib/cn";

export function Hero(): React.JSX.Element {
  const { t } = useTranslation("home");
  const [tapped, setTapped] = useState(false);
  const stats = t("hero.stats", { returnObjects: true }) as string[];

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-ink text-cream">
      <img
        src={cld("hero-bg-nature.webp", 1920)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
        decoding="async"
      />
      <div
        id="tisanWrap"
        tabIndex={0}
        role="button"
        aria-label={t("hero.tisan")}
        onClick={() => {
          setTapped((v) => !v);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setTapped((v) => !v);
          }
        }}
        onMouseLeave={() => {
          setTapped(false);
        }}
        className={cn(
          "absolute bottom-0 right-[8%] z-5 hidden h-[46%] animate-rise outline-none md:block md:h-[85%]",
          tapped && "tapped",
        )}
      >
        <img
          src={cld("tisan-self.webp", 800)}
          alt="Woman in white kebaya holding sago on banana leaves in a woven tray"
          className="tisan-swap tisan-1 h-full w-auto object-contain"
          fetchPriority="high"
          decoding="async"
        />
        <img
          src={cld("tisan-self-2.webp", 800)}
          alt=""
          aria-hidden="true"
          className="tisan-swap tisan-2 absolute inset-0 h-full w-auto object-contain opacity-0"
          decoding="async"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-6"
        style={{
          background:
            "linear-gradient(90deg, rgba(31,44,34,1) 0%, rgba(31,44,34,.5) 38%, rgba(31,44,34,0) 68%),linear-gradient(180deg, rgba(31,44,34,.45) 0%, rgba(31,44,34,.15) 40%, rgba(31,44,34,.78) 100%)",
        }}
      />
      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <Reveal>
          <h1 className="display max-w-3xl text-5xl sm:text-6xl md:text-8xl">
            <span className="font-semibold">Move,</span>
            <br />
            <span className="font-light">Moreover.</span>
          </h1>
        </Reveal>
        <Reveal>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-cream/85 md:text-lg">
            {t("hero.lede")}
          </p>
        </Reveal>
        <Reveal>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#signature"
              className="pointer-events-auto rounded-full bg-lime px-7 py-3.5 text-sm font-bold text-ink hover:brightness-95"
            >
              {t("hero.explore")}
            </a>
            <a
              href="#milestones"
              className="pointer-events-auto rounded-full border border-cream/40 px-7 py-3.5 text-sm font-bold text-cream transition hover:bg-cream hover:text-ink"
            >
              {t("hero.events")}
            </a>
          </div>
        </Reveal>
        <Reveal>
          <dl className="mt-10 grid max-w-xl grid-cols-3 divide-x divide-cream/20 border-t border-cream/20 pt-6">
            {(["500+", "8+", "5"] as const).map((value, i) => (
              <div key={value} className={i === 0 ? "pr-5" : i === 1 ? "px-5" : "pl-5"}>
                <dt className="text-2xl font-bold sm:text-3xl md:text-4xl">{value}</dt>
                <dd className="mt-1 text-[12px] font-semibold uppercase tracking-wider text-cream/60">
                  {stats[i]}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
