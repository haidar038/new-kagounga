import { useState } from "react";
import { useLocation } from "react-router-dom";
import type { SignatureId } from "../../types/content";
import { SIGNATURES } from "../../data/signatures";
import { WHATSAPP_ICON } from "../../data/site";
import { inquiryMessage, waLink } from "../../lib/whatsapp";
import { Reveal } from "../../components/Reveal";
import { cn } from "../../lib/cn";

function TwoToneTitle({ title }: { title: string }): React.JSX.Element {
  const [first, ...rest] = title.trim().split(/\s+/);
  return (
    <>
      <span className="font-bold">{first}</span>
      {rest.length > 0 && (
        <>
          {" "}
          <span className="font-light">{rest.join(" ")}</span>
        </>
      )}
    </>
  );
}

export function Signature(): React.JSX.Element {
  const { search } = useLocation();
  const [prevSearch, setPrevSearch] = useState(search);
  const [sigId, setSigId] = useState<SignatureId>(() => {
    const sig = new URLSearchParams(search).get("sig");
    return (
      (sig && SIGNATURES.some((s) => s.id === sig) ? sig : "popeda") as SignatureId
    );
  });
  const [expanded, setExpanded] = useState(false);
  const main = SIGNATURES.find((s) => s.id === sigId) ?? SIGNATURES[0];
  const thumbs = SIGNATURES.filter((s) => s.id !== sigId);

  if (prevSearch !== search) {
    setPrevSearch(search);
    const sig = new URLSearchParams(search).get("sig");
    if (sig && SIGNATURES.some((s) => s.id === sig)) {
      setSigId(sig as SignatureId);
      setExpanded(false);
    }
  }

  return (
    <section id="signature" className="pb-16 md:pb-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <h2 className="display text-5xl md:text-6xl">
            <span className="font-bold">Our</span>
            <span className="font-light"> Signature.</span>
          </h2>
        </Reveal>
        <Reveal>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/70">
            Five distinct forms of expression bound by one identity:
            gastronomy, personal care, home fragrance, sonic identity, and fine
            art. Each piece remains deeply rooted in the cultural heritage of
            North Moluccas.
          </p>
        </Reveal>
        <div className="mt-8 border-t border-ink/10" />

        <Reveal>
          <article
            key={main.id}
            aria-live="polite"
            className="mt-8 grid animate-enter overflow-hidden rounded-3xl bg-ink text-cream lg:grid-cols-2"
          >
            <img
              src={main.image}
              alt={main.alt}
              className="aspect-square w-full self-start object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="p-7 md:p-10">
              <p className="text-[13px] font-bold text-lime">
                {main.category}
              </p>
              <h3 className="display mt-2 text-4xl">
                <TwoToneTitle title={main.title} />
              </h3>
              <div className={cn("sig-desc", !expanded && "collapsed")}>
                {main.paragraphs.map((paragraph, i) => (
                  <p
                    key={i}
                    className="mt-4 text-[15px] leading-relaxed text-cream/80"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <p className="mt-5 text-[13px] font-semibold text-cream/60">
                {main.meta}
              </p>
              <div className="mt-7 flex items-center justify-between gap-3 md:justify-start">
                <a
                  href={waLink(inquiryMessage(main.title, main.category))}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3 text-sm font-bold text-ink hover:brightness-95"
                >
                  <img
                    src={WHATSAPP_ICON}
                    alt=""
                    className="size-4"
                    loading="lazy"
                  />
                  Business Inquiry
                </a>
                <button
                  id="sigToggle"
                  type="button"
                  aria-expanded={expanded}
                  aria-label={
                    expanded
                      ? "Sembunyikan deskripsi"
                      : "Tampilkan deskripsi lengkap"
                  }
                  onClick={() => {
                    setExpanded((v) => !v);
                  }}
                  className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-ink transition hover:brightness-95 md:hidden"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </Reveal>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-4">
          {thumbs.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-label={`Show ${p.title}`}
              onClick={() => {
                setSigId(p.id);
                setExpanded(false);
              }}
              className="card-hover overflow-hidden rounded-3xl border border-ink/10 bg-white text-left"
            >
              <div className="flex items-center gap-4 p-4 lg:block lg:p-0">
                <img
                  src={p.image}
                  alt={p.alt}
                  className="aspect-square w-24 shrink-0 rounded-2xl object-cover lg:w-full lg:rounded-none"
                  loading="lazy"
                  decoding="async"
                />
                <div className="min-w-0 lg:p-5">
                  <p className="text-[12px] font-bold text-ink/50">
                    {p.category}
                  </p>
                  <p className="mt-1 text-lg font-bold">
                    <TwoToneTitle title={p.title} />
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
