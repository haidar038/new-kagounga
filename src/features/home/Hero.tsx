import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HERO_DESKTOP, HERO_MOBILE } from "../../lib/hero";
import { cld } from "../../lib/cloudinary";
import { cn } from "../../lib/cn";

export function Hero(): React.JSX.Element {
  const { t } = useTranslation("home");
  const [tapped, setTapped] = useState(false);
  const stats = t("hero.stats", { returnObjects: true }) as string[];

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-ink text-cream">
      {/* Art direction: portrait nature-4 (3072x4320 master) below 768px — the
          landscape source would render a tiny center sliver at ~3.7x upscale —
          landscape from md up. Both pinned f_webp,q_30 behind the gradient
          scrim. URL source of truth: src/lib/hero.ts (seo-build preloads
          import the same module, so preloads cannot drift from this srcSet). */}
      <picture>
        <source
          media="(max-width: 767px)"
          srcSet={HERO_MOBILE.srcSet}
          sizes="100vw"
        />
        <img
          src={HERO_DESKTOP.src}
          srcSet={HERO_DESKTOP.srcSet}
          sizes="100vw"
          width={1920}
          height={1080}
          alt="Tropical forest landscape of North Maluku"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
      </picture>
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
          // Tablet: half the mascot slides past the right viewport edge;
          // desktop keeps the fully-visible right-[8%] composition.
          "absolute bottom-0 z-5 hidden h-[46%] animate-rise outline-none md:block md:right-[-15%] md:h-[65%] lg:right-[8%] lg:h-[85%]",
          tapped && "tapped",
        )}
      >
        <img
          src={cld("tisan-self.webp", 800)}
          srcSet={[480, 800]
            .map((width) => `${cld("tisan-self.webp", width)} ${width}w`)
            .join(", ")}
          sizes="(min-width: 768px) 40vw, 1px"
          alt="Tisan, the Kagōunga mascot, holding a sago basket"
          aria-hidden="true"
          width={800}
          height={1288}
          className="tisan-swap tisan-1 h-full w-auto object-contain"
          // Above the fold on desktop (audit flagged the lazy attribute).
          // fetchPriority low keeps it behind the LCP hero on mobile, where
          // the wrapper is hidden but an eager image still downloads.
          loading="eager"
          fetchPriority="low"
          decoding="async"
        />
        <img
          src={cld("tisan-self-2.webp", 800)}
          srcSet={[480, 800]
            .map((width) => `${cld("tisan-self-2.webp", width)} ${width}w`)
            .join(", ")}
          sizes="(min-width: 768px) 40vw, 1px"
          alt="Tisan, the Kagōunga mascot, smiling"
          aria-hidden="true"
          width={800}
          height={1315}
          className="tisan-swap tisan-2 absolute inset-0 h-full w-auto object-contain opacity-0"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="hero-gradient pointer-events-none absolute inset-0 z-6" />
      <div className="hero-content pointer-events-none relative z-10 mx-auto w-full max-w-7xl px-5 py-12 md:px-8 md:py-16">
        {/* Above-fold text animates via pure CSS (hero-rise), not Reveal:
            Reveal gates paint behind hydration, which pushed FCP/SI past the
            hero image on throttled mobile. Staggered delays stay short so the
            text is contentful well before the image finishes its bandwidth
            queue. Delays live in CSS (.hero-content > .hero-rise:nth-child). */}
        <div className="hero-rise">
          <h1 className="display max-w-3xl text-5xl sm:text-6xl md:text-8xl">
            <span className="font-semibold">Move,</span>
            <br />
            <span className="font-light">Moreover.</span>
          </h1>
        </div>
        <div className="hero-rise">
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-cream/85 md:text-lg">
            {t("hero.lede")}
          </p>
        </div>
        <div className="hero-rise">
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
        </div>
        <div className="hero-rise">
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
        </div>
      </div>
    </section>
  );
}
