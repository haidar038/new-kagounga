import { Link } from "react-router-dom";
import { Eye, MessageSquare, Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ProductDetail, ProductId } from "../types/content";
import { orderHref } from "../data/products";
import { hasProductPage } from "../data/productContent";
import { localeLink, useLocale } from "../i18n";
import { cldSrcSet } from "../lib/cloudinary";
import { BlurImage } from "./BlurImage";
import { Reveal } from "./Reveal";

export function ProductCard({
  product,
  onDetails,
  compact = false,
}: {
  product: ProductDetail;
  onDetails: (id: ProductId) => void;
  compact?: boolean;
}): React.JSX.Element {
  const { t } = useTranslation("catalog");
  const locale = useLocale();
  const hasPage = product.hasPage ?? hasProductPage(product.id);
  const productHref = localeLink(`/catalog/${product.id}`, locale);
  const image = (
    <BlurImage
      src={product.image}
      srcSet={cldSrcSet(product.image, [400, 800])}
      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
      alt={product.alt}
      width={800}
      height={800}
      className="aspect-square w-full"
    />
  );

  if (compact) {
    return (
      <Reveal className="h-full">
        <article className="flex flex-col gap-2">
          {hasPage ? (
            <Link to={productHref} className="block" aria-label={product.name}>
              {image}
              <span className="sr-only">{product.name}</span>
            </Link>
          ) : (
            image
          )}
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-bold text-ink">
              {hasPage ? (
                <Link to={productHref} className="hover:underline">
                  {product.name}
                </Link>
              ) : (
                product.name
              )}
            </h3>
            <p className="text-lg font-black text-ink">{product.price}</p>
          </div>
          <button
            type="button"
            onClick={() => onDetails(product.id)}
            className="flex items-center justify-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-bold text-ink hover:border-ink/40"
          >
            <Eye className="size-4" aria-hidden="true" />
            {t("card.quickView")}
          </button>
        </article>
      </Reveal>
    );
  }
  return (
    <Reveal className="h-full">
      <article className="card-hover flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white">
        {hasPage ? (
          <Link to={productHref} className="block" aria-label={product.name}>
            {image}
            <span className="sr-only">{product.name}</span>
          </Link>
        ) : (
          image
        )}
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-xl font-bold">
            {hasPage ? (
              <Link to={productHref} className="hover:underline">
                {product.name}
              </Link>
            ) : (
              product.name
            )}
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-ink/70">
            {product.blurb}
          </p>
          {product.badges.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-bold"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
          <p className="mt-auto pt-3 text-lg font-black">{product.price}</p>
          <div className="mt-4 grid gap-2">
            <a
              href={orderHref(product.name, locale)}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-center gap-2 rounded-full bg-lime px-6 py-3 text-sm font-bold text-ink hover:brightness-95"
            >
              <MessageSquare className="size-4" aria-hidden="true" />
              {t("card.order")}
            </a>
            {hasPage && (
              <Link
                to={productHref}
                className="flex items-center justify-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-sm font-bold hover:border-ink/40"
              >
                <Package className="size-4" aria-hidden="true" />
                {t("card.details")}
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                onDetails(product.id);
              }}
              className="flex items-center justify-center gap-2 rounded-full px-6 py-2 text-[13px] font-bold text-ink/70 hover:text-ink"
            >
              <Eye className="size-4" aria-hidden="true" />
              {t(hasPage ? "card.quickView" : "card.details")}
            </button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
