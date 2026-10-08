import { MessageSquare, Package } from "lucide-react";
import type { ProductDetail, ProductId } from "../types/content";
import { orderHref } from "../data/products";
import { Reveal } from "./Reveal";

export function ProductCard({
  product,
  onDetails,
}: {
  product: ProductDetail;
  onDetails: (id: ProductId) => void;
}): React.JSX.Element {
  return (
    <Reveal className="h-full">
      <article className="card-hover flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white">
        <img
          src={product.image}
          alt={product.alt}
          className="aspect-square w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-xl font-bold">{product.name}</h3>
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
              href={orderHref(product.name)}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-center gap-2 rounded-full bg-lime px-6 py-3 text-sm font-bold text-ink hover:brightness-95"
            >
              <MessageSquare className="size-4" aria-hidden="true" />
              Order or Inquiry
            </a>
            <button
              type="button"
              onClick={() => {
                onDetails(product.id);
              }}
              className="flex items-center justify-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-sm font-bold hover:border-ink/40"
            >
              <Package className="size-4" aria-hidden="true" />
              View details
            </button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
