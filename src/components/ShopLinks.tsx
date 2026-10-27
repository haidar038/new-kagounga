import { useTranslation } from "react-i18next";
import { SHOP_LINKS } from "../data/site";
import { cn } from "../lib/cn";

interface ShopLinksProps {
  /**
   * Badge icons are fixed white-circle/dark-glyph SVGs: they pop on dark
   * backgrounds as-is; on light ones they get a thin ink ring to stay defined.
   */
  tone?: "dark" | "light";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const BADGE_SIZE = {
  sm: "size-7",
  md: "size-9",
  lg: "size-12",
  xl: "size-16",
} as const;

export function ShopLinks({
  tone = "light",
  size = "sm",
  className,
}: ShopLinksProps): React.JSX.Element {
  const { t } = useTranslation("common");
  return (
    <div className={cn("flex flex-wrap items-center gap-2.5", className)}>
      <span
        className={cn(
          "text-[14px] font-semibold",
          tone === "dark" ? "text-cream/70" : "text-ink/70",
        )}
      >
        {t("availableOn")}
      </span>
      {SHOP_LINKS.map((shop) => (
        <a
          key={shop.label}
          href={shop.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={shop.label}
          title={shop.label}
          className={cn(
            "rounded-full transition-transform duration-300 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime",
            tone === "light" && "ring-1 ring-ink/15",
            tone === "dark" && "ring-1 ring-cream/10",
          )}
        >
          <img
            src={shop.icon}
            alt={shop.label}
            width={36}
            height={36}
            loading="lazy"
            decoding="async"
            className={cn(BADGE_SIZE[size], "block")}
          />
        </a>
      ))}
    </div>
  );
}
