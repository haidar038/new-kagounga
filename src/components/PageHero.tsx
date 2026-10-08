import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface PageHeroProps {
  eyebrow: string;
  titleBold: string;
  titleLight: string;
  lede: string;
  children?: ReactNode;
}

/** Dark text-only hero shared by About / News / Music pages. */
export function PageHero({
  eyebrow,
  titleBold,
  titleLight,
  lede,
  children,
}: PageHeroProps): ReactNode {
  return (
    <section className="relative overflow-hidden bg-ink text-cream">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(31,44,34,1) 0%, rgba(31,44,34,.5) 38%, rgba(31,44,34,0) 68%),linear-gradient(180deg, rgba(31,44,34,.45) 0%, rgba(31,44,34,.15) 40%, rgba(31,44,34,.78) 100%)",
        }}
      />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <Reveal>
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-lime">
            {eyebrow}
          </p>
        </Reveal>
        <Reveal>
          <h1 className="display mt-3 max-w-3xl text-5xl sm:text-6xl md:text-8xl">
            <span className="font-bold">{titleBold}</span>
            <span className="font-light">{titleLight}</span>
          </h1>
        </Reveal>
        <Reveal>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-cream/85 md:text-lg">
            {lede}
          </p>
        </Reveal>
        <div className="mt-8 border-t border-cream/20" />
        {children}
      </div>
    </section>
  );
}
