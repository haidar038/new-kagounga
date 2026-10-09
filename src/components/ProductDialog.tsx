import { useEffect, useRef } from "react";
import { Check, MessageSquare, X } from "lucide-react";
import type { ProductDetail } from "../types/content";
import { orderHref } from "../data/products";

/** Single generic dialog fed by the selected product. */
export function ProductDialog({
  product,
  onClose,
}: {
  product: ProductDetail | null;
  onClose: () => void;
}): React.JSX.Element {
  const ref = useRef<HTMLDialogElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (product) {
      prevFocus.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
      prevFocus.current?.focus?.();
      prevFocus.current = null;
    }
  }, [product]);

  return (
    <dialog
      ref={ref}
      id="productDialog"
      aria-label={product ? `${product.name} details` : "Product details"}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="m-auto max-h-[90vh] w-[calc(100%-2.5rem)] max-w-lg overflow-y-auto rounded-3xl border border-ink/10 bg-white p-0 text-ink shadow-2xl"
    >
      {product && (
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-ink/50">
                {product.eyebrow}
              </p>
              <h3 className="mt-1 text-2xl font-bold">{product.name}</h3>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close details"
              autoFocus
              className="grid size-10 shrink-0 place-items-center rounded-full border border-ink/15 hover:border-ink/40"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {product.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-bold"
              >
                {badge}
              </span>
            ))}
          </div>
          <h4 className="mt-6 text-[12px] font-bold uppercase tracking-[0.18em] text-ink/50">
            Specifications
          </h4>
          <dl className="mt-3 grid gap-2 text-[13px]">
            {product.specs.map((spec, i) => (
              <div
                key={spec.label}
                className={`flex justify-between gap-4${i < product.specs.length - 1 ? " border-b border-ink/10 pb-2" : ""}`}
              >
                <dt className="text-ink/60">{spec.label}</dt>
                <dd className="text-right font-bold">{spec.value}</dd>
              </div>
            ))}
          </dl>
          {product.inside && (
            <>
              <h4 className="mt-6 text-[12px] font-bold uppercase tracking-[0.18em] text-ink/50">
                {product.insideTitle ?? "Contents"}
              </h4>
              <ul className="mt-3 grid gap-1.5 text-[13px] font-medium">
                {product.inside.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-4 shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className="mt-4 text-[13px] leading-relaxed text-ink/70">
            {product.note}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-5">
            <p className="text-lg font-black">
              {product.price}{" "}
              <span className="text-[13px] font-medium text-ink/60">
                {product.per}
              </span>
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => ref.current?.close()}
                className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-bold hover:border-ink/40"
              >
                Close
              </button>
              <a
                href={orderHref(product.name)}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-sm font-bold text-ink hover:brightness-95"
              >
                <MessageSquare className="size-4" aria-hidden="true" />
                Order
              </a>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
