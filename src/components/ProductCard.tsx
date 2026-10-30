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
}: {
  product: ProductDetail;
  onDetails: (id: ProductId) => void;
}): React.JSX.Element {
  const { t } = useTranslation("catalog");
  const locale = useLocale();
  const hasPage = product.hasPage ?? hasProductPage(product.id);
  const productHref = localeLink(`/catalog/${product.id}`, locale);
  const image = (
    <BlurImage
      src={product.image}
      srcSet={cldSrcSet(product.image, [400, 800])}
      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, (min-width: 640px) 100vw, 50vw"
      alt={product.alt}
      width={800}
      height={800}
      className="aspect-square w-full"
    />
  );

  return (
    <Reveal className="h-full">
      <article className="card-hover flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white max-sm:rounded-none max-sm:border-0 max-sm:bg-transparent">
        {hasPage ? (
          <Link to={productHref} className="block" aria-label={product.name}>
            {image}
            <span className="sr-only">{product.name}</span>
          </Link>
        ) : (
          image
        )}
        <div className="flex flex-1 flex-col p-6 max-sm:p-0">
          <h3 className="text-xl font-bold max-sm:text-base">
            {hasPage ? (
              <Link to={productHref} className="hover:underline">
                {product.name}
              </Link>
            ) : (
              product.name
            )}
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-ink/70 max-sm:hidden">
            {product.blurb}
          </p>
          {product.badges.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5 max-sm:hidden">
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
          <p className="mt-auto pt-3 text-lg font-black max-sm:mt-1 max-sm:pt-0">{product.price}</p>
          <div className="mt-4 grid gap-2 max-sm:mt-1.5">
            <a
              href={orderHref(product.name, locale)}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-center gap-2 rounded-full bg-lime px-6 py-3 text-sm font-bold text-ink hover:brightness-95 max-sm:hidden"
            >
              <MessageSquare className="size-4" aria-hidden="true" />
              {t("card.order")}
            </a>
            {hasPage && (
              <Link
                to={productHref}
                className="flex items-center justify-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-sm font-bold hover:border-ink/40 max-sm:hidden"
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
              className="flex items-center justify-center gap-2 rounded-full px-6 py-2 text-[13px] font-bold text-ink/70 hover:text-ink max-sm:justify-start max-sm:px-0 max-sm:py-1 max-sm:font-bold max-sm:text-ink max-sm:underline max-sm:decoration-lime max-sm:decoration-2 max-sm:underline-offset-4 max-sm:hover:opacity-80"
            >
              <Eye className="size-4 max-sm:hidden" aria-hidden="true" />
              {t(hasPage ? "card.quickView" : "card.details")}
            </button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
