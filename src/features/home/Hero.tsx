import { useState } from "react";
import { Reveal } from "../../components/Reveal";
import { cn } from "../../lib/cn";

const STATS = [
  { value: "500+", label: "Shipped Products" },
  { value: "8+", label: "Shipped Country" },
  { value: "5", label: "Signatures" },
] as const;

export function Hero(): React.JSX.Element {
  const [tapped, setTapped] = useState(false);

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-ink text-cream">
      <img
        src="/img/hero-bg-nature.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
        decoding="async"
      />
      <div
        id="tisanWrap"
        tabIndex={0}
        role="button"
        aria-label="Tisan holding sago. Hover to see her face"
        onClick={() => {
          setTapped((v) => !v);
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
          src="/img/tisan-self.png"
          alt="Woman in white kebaya holding sago on banana leaves in a woven tray"
          className="tisan-swap tisan-1 h-full w-auto object-contain"
          fetchPriority="high"
          decoding="async"
        />
        <img
          src="/img/tisan-self-2.png"
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
            We transcend all boundaries, imaginable.
          </p>
        </Reveal>
        <Reveal>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#signature"
              className="pointer-events-auto rounded-full bg-lime px-7 py-3.5 text-sm font-bold text-ink hover:brightness-95"
            >
              Explore Our World
            </a>
            <a
              href="#milestones"
              className="pointer-events-auto rounded-full border border-cream/40 px-7 py-3.5 text-sm font-bold text-cream transition hover:bg-cream hover:text-ink"
            >
              View Events
            </a>
          </div>
        </Reveal>
        <Reveal>
          <dl className="mt-10 grid max-w-xl grid-cols-3 divide-x divide-cream/20 border-t border-cream/20 pt-6">
            {STATS.map((s, i) => (
              <div key={s.label} className={i === 0 ? "pr-5" : i === 1 ? "px-5" : "pl-5"}>
                <dt className="text-2xl font-bold sm:text-3xl md:text-4xl">{s.value}</dt>
                <dd className="mt-1 text-[12px] font-semibold uppercase tracking-wider text-cream/60">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
