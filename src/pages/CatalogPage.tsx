import { useEffect, useState } from "react";
import {
  BedDouble,
  Factory,
  Gift,
  Store,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDocumentMeta, SITE_URL } from "../hooks/useDocumentMeta";
import { breadcrumbLd, graphLd } from "../lib/seo";
import { getProducts, loadProducts } from "../data/products";
import { useLocale } from "../i18n";
import type { ProductId } from "../types/content";
import { ProductCard } from "../components/ProductCard";
import { ProductDialog } from "../components/ProductDialog";
import { Reveal } from "../components/Reveal";

const B2B_ICONS = [Store, UtensilsCrossed, Gift, BedDouble, Truck, Factory] as const;

export function CatalogPage(): React.JSX.Element {
  const { t } = useTranslation(["catalog", "seo", "common"]);
  const locale = useLocale();
  const [activeId, setActiveId] = useState<ProductId | null>(null);
  // Statis dulu (SEO/prerender utuh), upgrade ke CMS bila reachable.
  const [cached, setCached] = useState(() => ({ locale, products: getProducts(locale) }));
  if (cached.locale !== locale) {
    setCached({ locale, products: getProducts(locale) });
  }
  useEffect(() => {
    let on = true;
    loadProducts(locale, getProducts(locale)).then((r) => {
      if (on && r.source === "cms") setCached({ locale, products: r.items });
    });
    return () => {
      on = false;
    };
  }, [locale]);
  const products = cached.products;
  const active = products.find((p) => p.id === activeId) ?? null;
  const tiles = t("b2b.tiles", { returnObjects: true }) as string[];

  useDocumentMeta({
    title: t("catalog.title", { ns: "seo" }),
    description: t("catalog.description", { ns: "seo" }),
    canonical: locale === "id" ? "/id/catalog" : "/catalog",
    jsonLd: graphLd([
      {
        "@type": "ItemList",
        itemListElement: products.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Product",
            name: p.name,
            image: p.image,
            description: p.blurb,
            brand: { "@type": "Brand", name: "Kagōunga" },
          },
        })),
      },
      breadcrumbLd(
        [
          { name: t("home", { ns: "common" }), path: "/" },
          { name: t("catalog", { ns: "common" }), path: "/catalog" },
        ],
        SITE_URL,
      ),
    ]),
  });

  return (
    <main id="top">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <h1 className="display text-5xl md:text-6xl">
              <span className="font-bold">{t("hero.titleBold")}</span>{" "}
              <span className="font-light">{t("hero.titleLight")}</span>
            </h1>
          </Reveal>
          <Reveal>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/70">
              {t("hero.lede")}
            </p>
          </Reveal>
          <div className="mt-8 border-t border-ink/10" />

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
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
                <span className="font-bold">{t("b2b.titleBold")}</span>{" "}
                <span className="font-light">{t("b2b.titleLight")}</span>
              </h2>
            </Reveal>
            <Reveal>
              <p className="mt-4 max-w-2xl text-cream/70">
                {t("b2b.lede")}
              </p>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
              {tiles.map((label, i) => {
                const Icon = B2B_ICONS[i];
                return (
                  <Reveal key={label}>
                    <article className="rounded-2xl border border-cream/10 bg-white/6 p-3 text-center md:p-4">
                      <Icon
                        className="mx-auto size-8 text-lime md:size-10"
                        aria-hidden="true"
                      />
                      <h3 className="mt-2 text-[11px] font-bold leading-tight md:text-sm">
                        {label}
                      </h3>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
