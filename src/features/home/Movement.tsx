import { MOVEMENTS } from "../../data/movements";
import { Reveal } from "../../components/Reveal";

export function Movement(): React.JSX.Element {
  return (
    <section id="movement" className="pb-16 md:pb-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="rounded-4xl bg-ink p-7 text-cream md:p-12">
          <Reveal>
            <h2 className="display text-5xl font-black md:text-6xl">
              <span className="font-bold">Four movements,</span>
              <br />
              <span className="font-light">One shared purpose.</span>
            </h2>
          </Reveal>
          <Reveal>
            <p className="mt-4 max-w-2xl text-cream/70">
              Everything Kagōunga creates grows from four connected movements:
              innovation, culture, collaboration, and global reach.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MOVEMENTS.map((m) => (
              <Reveal key={m.index} className="h-full">
                <article className="h-full rounded-3xl border border-cream/10 bg-white/6 p-6">
                  <m.icon
                    className="size-14 text-lime"
                    aria-hidden="true"
                  />
                  {/* <p className="mt-5 text-sm font-black text-cream/40">
                    {m.index}
                  </p> */}
                  <h3 className="mt-4 text-lg font-black">{m.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-cream/70">
                    {m.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
