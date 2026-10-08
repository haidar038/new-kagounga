import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "../lib/cn";

interface RevealProps {
  children: ReactNode;
  className?: string;
}

/** Adds `.in` once the element scrolls into view (legacy `.reveal` behavior). */
export function Reveal({ children, className }: RevealProps): ReactNode {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={cn("reveal", className)}>
      {children}
    </div>
  );
}
