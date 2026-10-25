import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Truck,
} from "lucide-react";
import type { ProductDetail } from "../types/content";
import type { ProductPageData } from "../data/products";
import { getProducts, loadProductPage, orderHref } from "../data/products";
import {
  getProductPageCopy,
  getProductSeoDescription,
  getProductSeoTitle,
} from "../data/productContent";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { ShopLinks } from "../components/ShopLinks";
import { localeLink, useLocale, type Locale } from "../i18n";
import { cldSrcSet } from "../lib/cloudinary";
import { NotFoundPage } from "./NotFoundPage";
import { Reveal } from "../components/Reveal";

const DETAIL_KEYS = [
  "packaging",
  "dimensions",
  "netWeight",
  "grossWeight",
  "origin",
  "shelfLife",
  "certification",
] as const;

const SPEC_TO_DETAIL: Record<string, (typeof DETAIL_KEYS)[number]> = {
  packaging: "packaging",
  kemasan: "packaging",
  dimensions: "dimensions",
  dimensi: "dimensions",
  "net weight": "netWeight",
  "berat bersih": "netWeight",
  "gross weight": "grossWeight",
  "berat kotor": "grossWeight",
  origin: "origin",
  "country of origin": "origin",
  asal: "origin",
  "negara asal": "origin",
  "shelf life": "shelfLife",
  "masa simpan": "shelfLife",
  certification: "certification",
  sertifikasi: "certification",
};

function details(product: ProductDetail): Array<{ key: string; value: string }> {
  return DETAIL_KEYS.flatMap((key) => {
    const value = product[key];
    return value ? [{ key, value }] : [];
  });
}

function staticPageData(
  slug: string | undefined,
  locale: Locale,
): ProductPageData | null {
  if (!slug) return null;
  const product = getProducts(locale).find((item) => item.id === slug);
  const copy = getProductPageCopy(slug, locale);
  if (!product || !copy) return null;
  return { product, copy, seoTitle: getProductSeoTitle(slug, locale) };
}

function ProductGallery({
  product,
}: {
  product: ProductDetail;
}): React.JSX.Element {
  return (
    <img
      src={product.image}
      srcSet={cldSrcSet(product.image, [400, 800, 1200])}
      sizes="(min-width: 1024px) 44rem, 100vw"
      alt={product.alt}
      width={800}
      height={800}
      fetchPriority="high"
      decoding="async"
      className="aspect-square w-full rounded-4xl object-cover"
    />
  );
}

export function ProductPage(): React.JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation(["productPage", "catalog", "common"]);
  const locale = useLocale();
  const cacheKey = `${locale}|${slug ?? ""}`;
  // Statis/snapshot dulu (SEO + hydration), lalu upgrade ke CMS bila reachable.
  const [cached, setCached] = useState(() => ({
    key: cacheKey,
    data: staticPageData(slug, locale),
  }));
  const data =
    cached.key === cacheKey ? cached.data : staticPageData(slug, locale);

  useEffect(() => {
    if (!slug) return;
    let on = true;
    loadProductPage(slug, locale, staticPageData(slug, locale)).then((r) => {
      if (on && (r.source === "cms" || r.data === null)) {
        setCached({ key: cacheKey, data: r.data });
      }
    });
    return () => {
      on = false;
    };
  }, [slug, locale, cacheKey]);

  const products = getProducts(locale);
  const product = data?.product ?? null;
  const copy = data?.copy ?? null;
  const seoTitle = data?.seoTitle ?? (slug ? getProductSeoTitle(slug, locale) : null);
  const canonical = `/catalog/${slug ?? ""}`;
  const valid = Boolean(product && copy);

  useDocumentMeta({
    title:
      seoTitle ??
      (product ? `${product.name} | Kagōunga` : t("notFound.title", { ns: "seo" })),
    description: product
      ? (getProductSeoDescription(product.id, locale) ?? product.blurb)
      : t("notFound.description", { ns: "seo" }),
    canonical: locale === "id" ? `/id${canonical}` : canonical,
    image: product?.image,
    imageAlt: product?.alt,
    imageWidth: "800",
    imageHeight: "800",
    noindex: !valid,
  });

  if (!product || !copy) return <NotFoundPage />;

  const related = products.filter((p) => p.id !== product.id).slice(0, 3);
  const detailRows = details(product);
  const specs = product.specs.filter((spec) => {
    const key = SPEC_TO_DETAIL[spec.label.trim().toLowerCase()];
    return !key || !product[key];
  });
  const hasWholesale =
    product.moq != null ||
    product.wholesalePrice != null ||
    product.shipping != null;
  const href = (path: string): string => localeLink(path, locale);

  return (
    <main id="top">
      <section className="relative overflow-hidden bg-ink text-cream">
        <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-16">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-[13px] text-cream/70"
          >
            <Link to={href("/")} className="hover:text-cream">
              {t("crumbs.home", { ns: "common" })}
            </Link>
            <span aria-hidden="true">/</span>
            <Link to={href("/catalog")} className="hover:text-cream">
              {t("crumbs.catalog", { ns: "common" })}
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-cream">
              {product.name}
            </span>
          </nav>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-lime">
                {product.eyebrow}
              </p>
              <h1 className="display mt-3 text-5xl md:text-7xl">
                {product.name}
              </h1>
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-cream/80 md:text-lg">
                {product.blurb}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {product.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-cream/20 px-3 py-1 text-[12px] font-bold"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap items-end gap-5">
                <p className="text-3xl font-black text-lime">
                  {product.price}
                  <span className="ml-1 text-[14px] font-medium text-cream/70">
                    / {product.per}
                  </span>
                </p>
                <a
                  href={orderHref(product.name, locale)}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3 text-sm font-bold text-ink hover:brightness-95"
                >
                  <MessageSquare className="size-4" aria-hidden="true" />
                  {t("order", { ns: "productPage" })}
                </a>
              </div>
            </div>
            <ProductGallery product={product} />
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <article>
            <Reveal>
              <h2 className="display text-4xl md:text-5xl">
                {t("about", { ns: "productPage", name: product.name })}
              </h2>
              <div className="mt-5 grid gap-4 text-[15px] leading-relaxed text-ink/70">
                {copy.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <h2 className="mt-12 text-2xl font-bold">
                {t("howToUse", { ns: "productPage" })}
              </h2>
              <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink/70">
                {copy.usage}
              </p>
            </Reveal>

            <Reveal>
              <h2 className="mt-12 text-2xl font-bold">
                {t("sourcing", { ns: "productPage" })}
              </h2>
              <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink/70">
                {copy.sourcing}
              </p>
            </Reveal>

            <Reveal>
              <h2 className="mt-12 text-2xl font-bold">
                {t("details", { ns: "productPage" })}
              </h2>
              <dl className="mt-4 grid gap-x-10 gap-y-0 sm:grid-cols-2">
                {detailRows.map((row) => (
                  <div
                    key={row.key}
                    className="flex justify-between gap-4 border-b border-ink/10 py-3 text-[14px]"
                  >
                    <dt className="text-ink/70">
                      {t(`dialog.${row.key}`, { ns: "catalog" })}
                    </dt>
                    <dd className="text-right font-bold">{row.value}</dd>
                  </div>
                ))}
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex justify-between gap-4 border-b border-ink/10 py-3 text-[14px]"
                  >
                    <dt className="text-ink/70">{spec.label}</dt>
                    <dd className="text-right font-bold">{spec.value}</dd>
                  </div>
                ))}
              </dl>
              {product.inside && (
                <>
                  <h3 className="mt-8 text-[12px] font-bold uppercase tracking-[0.18em] text-ink/70">
                    {product.insideTitle ?? t("dialog.contents", { ns: "catalog" })}
                  </h3>
                  <ul className="mt-3 grid gap-1.5 text-[14px] font-medium sm:grid-cols-2">
                    {product.inside.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="size-4 shrink-0" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <p className="mt-6 rounded-2xl bg-cream p-5 text-[14px] leading-relaxed text-ink/70">
                {product.note}
              </p>
              <Link
                to={href("/catalog")}
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold underline decoration-lime decoration-2 underline-offset-4"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                {t("back", { ns: "productPage" })}
              </Link>
            </Reveal>
          </article>

          <aside className="grid content-start gap-5">
            {hasWholesale && (
              <Reveal>
                <div className="rounded-3xl bg-ink p-7 text-cream">
                  <h2 className="text-2xl font-bold">
                    {t("wholesale", { ns: "productPage" })}
                  </h2>
                  <dl className="mt-5 grid gap-3 text-[14px]">
                    {product.moq != null && (
                      <div className="flex justify-between gap-4 border-b border-cream/15 pb-3">
                        <dt className="text-cream/70">
                          {t("moq", { ns: "productPage" })}
                        </dt>
                        <dd className="text-right font-bold">
                          {product.moq}
                          {product.moqUnit ? ` ${product.moqUnit}` : ""}
                        </dd>
                      </div>
                    )}
                    {product.wholesalePrice && (
                      <div className="flex justify-between gap-4 border-b border-cream/15 pb-3">
                        <dt className="text-cream/70">
                          {t("wholesalePrice", { ns: "productPage" })}
                        </dt>
                        <dd className="text-right font-bold">
                          {product.wholesalePrice}
                          {product.wholesalePer ? ` / ${product.wholesalePer}` : ""}
                        </dd>
                      </div>
                    )}
                    {product.shipping && (
                      <div className="flex justify-between gap-4">
                        <dt className="text-cream/70">
                          {t("shipping", { ns: "productPage" })}
                        </dt>
                        <dd className="text-right font-bold">{product.shipping}</dd>
                      </div>
                    )}
                  </dl>
                  <Link
                    to={href("/contact")}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-sm font-bold text-ink hover:brightness-95"
                  >
                    {t("stockists", { ns: "productPage" })}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            )}

            <Reveal>
              <div className="rounded-3xl border border-ink/10 bg-white p-7">
                <MapPin className="size-6 text-ink/70" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-bold">
                  {t("stockists", { ns: "productPage" })}
                </h2>
                <p className="mt-2 text-[14px] leading-relaxed text-ink/70">
                  {t("stockistText", { ns: "productPage" })}
                </p>
                <Link
                  to={href("/contact")}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold underline decoration-lime decoration-2 underline-offset-4"
                >
                  {t("contactCta", { ns: "stockists" })}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>

            {product.certification && (
              <Reveal>
                <div className="rounded-3xl border border-ink/10 bg-white p-7">
                  <div className="flex gap-3">
                    <ShieldCheck
                      className="size-6 shrink-0 text-ink/70"
                      aria-hidden="true"
                    />
                    <div>
                      <h2 className="text-xl font-bold">
                        {t("dialog.certification", { ns: "catalog" })}
                      </h2>
                      <p className="mt-2 text-[14px] leading-relaxed text-ink/70">
                        {product.certification}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}

            {product.shipping && (
              <Reveal>
                <div className="rounded-3xl border border-ink/10 bg-white p-7">
                  <Truck className="size-6 text-ink/70" aria-hidden="true" />
                  <h2 className="mt-4 text-xl font-bold">
                    {t("shipping", { ns: "productPage" })}
                  </h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink/70">
                    {product.shipping}
                  </p>
                </div>
              </Reveal>
            )}
          </aside>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <h2 className="display text-4xl md:text-5xl">
              {t("related", { ns: "productPage" })}
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <Reveal key={item.id}>
                <Link
                  to={href(`/catalog/${item.id}`)}
                  className="group flex h-full gap-4 rounded-3xl border border-ink/10 bg-white p-4 transition hover:border-ink/40"
                >
                  <img
                    src={item.image}
                    srcSet={cldSrcSet(item.image, [200, 400])}
                    sizes="96px"
                    alt={item.alt}
                    width={96}
                    height={96}
                    loading="lazy"
                    decoding="async"
                    className="size-24 shrink-0 rounded-2xl object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-bold">{item.name}</p>
                    <p className="mt-1 text-[13px] text-ink/70">{item.blurb}</p>
                    <p className="mt-2 text-sm font-black">{item.price}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-14 flex justify-center border-t border-ink/10 pt-10">
              <ShopLinks tone="light" size="md" className="justify-center" />
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
