import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { COLLABORATORS } from "../data/collaborators";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";

export function AboutPage(): React.JSX.Element {
  useDocumentMeta({
    title: "Our Story | Kagōunga",
    description:
      "Kagōunga: Our Story and In Collaboration. The journey from North Moluccas and the people behind it.",
  });

  return (
    <main id="top">
      <PageHero
        eyebrow="About Kagōunga"
        titleBold="Our"
        titleLight=" Story."
        lede="Rooted in Ternate, growing beyond boundaries."
      >
        <div className="mt-8 grid max-w-3xl gap-6 text-[15px] leading-relaxed text-cream/80 md:text-base">
          <Reveal>
            <p>
              <strong>
                Kagōunga is a North Maluku company that turns the
                region&apos;s heritage of flavors, materials, and local wisdom
                into products, experiences, and creative expressions.
              </strong>{" "}
              Founded by <strong>Heri Susanto (Founder)</strong> and{" "}
              <strong>Aiya Lee (Co-Founder)</strong>, Kagōunga creates Popeda
              Soup, Sensory Candles, Botanical Soaps, Visual Artworks, and
              Brand Music. Everything is grounded in authenticity, quality,
              sustainability, and a supply chain rooted in local communities.
            </p>
          </Reveal>
          <Reveal>
            <p>
              <strong>
                Kagōunga is also a cultural movement, built with the people
                who make North Maluku what it is:
              </strong>{" "}
              farmers, fishers, nature enthusiasts, hikers, dive clubs,
              artisans, artists, composers, singers, dancers, photographers,
              writers, journalists, lighting designers, models, architects,
              software engineers, and young people of the region. Through{" "}
              <strong>Move, Moreover!</strong>, we move together, carrying
              North Maluku&apos;s spirit wherever we go.
            </p>
          </Reveal>
        </div>
      </PageHero>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <h2 className="display text-5xl md:text-6xl">
              <span className="font-bold">Our</span>{" "}
              <span className="font-light">Co-Pilot.</span>
            </h2>
          </Reveal>
          <Reveal>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/70">
              Kagōunga is shaped together with farmers, artists, musicians,
              and makers from North Moluccas and beyond. Eight of the many
              hands behind the movement.
            </p>
          </Reveal>
          <div className="mt-8 border-t border-ink/10" />

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-5">
            {COLLABORATORS.map((c) => (
              <Reveal key={c.name}>
                <article className="card-hover relative overflow-hidden rounded-3xl border border-ink/10 bg-white">
                  <img
                    src={c.image}
                    alt={c.alt}
                    className="aspect-3/4 w-full object-cover object-top md:aspect-square"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-ink via-ink/35 to-transparent p-4 md:p-5">
                    <h3 className="font-bold text-cream">{c.name}</h3>
                    <p className="mt-0.5 text-[13px] text-cream/70">{c.role}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
