import { useState } from "react";
import {
  BedDouble,
  Factory,
  Gift,
  Store,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { PRODUCTS } from "../data/products";
import type { ProductId } from "../types/content";
import { ProductCard } from "../components/ProductCard";
import { ProductDialog } from "../components/ProductDialog";
import { Reveal } from "../components/Reveal";

const B2B_TILES = [
  { icon: Store, label: "Retail / Store" },
  { icon: UtensilsCrossed, label: "Cafe / Resto" },
  { icon: Gift, label: "Corporate Gift" },
  { icon: BedDouble, label: "Hotel / Lounge" },
  { icon: Truck, label: "Distributor" },
  { icon: Factory, label: "Manufacturing" },
] as const;

export function CatalogPage(): React.JSX.Element {
  const [activeId, setActiveId] = useState<ProductId | null>(null);
  const active = PRODUCTS.find((p) => p.id === activeId) ?? null;

  useDocumentMeta({
    title: "Our Catalog | Kagōunga",
    description:
      "Shop Kagōunga products: instant popeda, sago starch, and single-origin North Moluccan spices. B2B partnership for retail, cafe, corporate, hotel, distributor, and manufacturing.",
  });

  return (
    <main id="top">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <h2 className="display text-5xl md:text-6xl">
              <span className="font-bold">Our</span>{" "}
              <span className="font-light">Products.</span>
            </h2>
          </Reveal>
          <Reveal>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/70">
              Eight staples from the Spice Islands - ready to order directly
              via WhatsApp.
            </p>
          </Reveal>
          <div className="mt-8 border-t border-ink/10" />

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDetails={setActiveId}
              />
            ))}
          </div>
          <ProductDialog
            product={active}
            onClose={() => {
              setActiveId(null);
            }}
          />
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="rounded-4xl bg-ink p-7 text-cream md:p-12">
            <Reveal>
              <h2 className="display text-5xl md:text-6xl">
                <span className="font-bold">B2B</span>{" "}
                <span className="font-light">Partnership.</span>
              </h2>
            </Reveal>
            <Reveal>
              <p className="mt-4 max-w-2xl text-cream/70">
                We supply businesses of every scale, from neighborhood stores
                to large manufacturers, with consistent quality and reliable
                sourcing.
              </p>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
              {B2B_TILES.map((tile) => (
                <Reveal key={tile.label}>
                  <article className="rounded-2xl border border-cream/10 bg-white/6 p-3 text-center md:p-4">
                    <tile.icon
                      className="mx-auto size-8 text-lime md:size-10"
                      aria-hidden="true"
                    />
                    <h3 className="mt-2 text-[11px] font-bold leading-tight md:text-sm">
                      {tile.label}
                    </h3>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
