import { useTranslation } from "react-i18next";
import { BadgeCheck, Handshake, Leaf, MapPin } from "lucide-react";
import { cn } from "../lib/cn";

interface TrustBadgesProps {
  tone?: "dark" | "light";
  className?: string;
}

const ICONS = {
  halal: BadgeCheck,
  natural: Leaf,
  partners: Handshake,
  made: MapPin,
} as const;

/**
 * Trust strip for Authority & Trust audits (SEOptimer). Every claim is lifted
 * from existing product/brand copy — nothing invented: Halal-certified F&B,
 * 100% natural ingredients, 20 partner organizations, made in Ternate.
 */
export function TrustBadges({
  tone = "light",
  className,
}: TrustBadgesProps): React.JSX.Element {
  const { t } = useTranslation("common");
  const keys = ["halal", "natural", "partners", "made"] as const;
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-5 gap-y-2",
        className,
      )}
    >
      {keys.map((key) => {
        const Icon = ICONS[key];
        return (
          <li
            key={key}
            className={cn(
              "flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide",
              tone === "dark" ? "text-cream/80" : "text-ink/70",
            )}
          >
            <Icon className="size-4 text-lime" aria-hidden="true" />
            {t(`trust.${key}`)}
          </li>
        );
      })}
    </ul>
  );
}
