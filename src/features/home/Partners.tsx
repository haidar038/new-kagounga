import { PARTNERS } from "../../data/partners";
import { Reveal } from "../../components/Reveal";

export function Partners(): React.JSX.Element {
  return (
    <section className="pb-16 md:pb-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <h2 className="display text-center text-4xl font-black md:text-5xl">
            <span className="font-bold">Stronger</span>{" "}
            <span className="font-light">Together.</span>
          </h2>
        </Reveal>
        <Reveal>
          <p className="mx-auto mt-4 max-w-4xl text-center text-[15px] leading-relaxed text-ink/70">
            A strategic convergence connecting visionary partners who build
            with us and the media platforms that amplify our journey. Together,
            these distinct networks form a unified ecosystem driving meaningful
            impact, innovation, and sustainable growth.
          </p>
        </Reveal>
        <Reveal>
          <div
            role="region"
            className="marquee mt-12 overflow-hidden"
            aria-label="Partner logos"
          >
            <div className="flex w-max animate-marquee items-center gap-14">
              {PARTNERS.map((p) => (
                <img
                  key={p.name}
                  src={p.logo}
                  alt={p.name}
                  className="partner-logo"
                  loading="lazy"
                />
              ))}
              {PARTNERS.map((p) => (
                <img
                  key={`dup-${p.name}`}
                  src={p.logo}
                  alt=""
                  aria-hidden="true"
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
