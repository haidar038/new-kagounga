import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { useScrolled } from "../hooks/useScrolled";
import { NAV_LINKS } from "../data/site";
import { cn } from "../lib/cn";

export function SiteHeader(): React.JSX.Element {
  const scrolled = useScrolled(8);
  const [open, setOpen] = useState(false);

  return (
    <header
      id="siteHeader"
      className={cn(
        "sticky top-0 z-50 border-b border-ink/10 bg-cream/90 backdrop-blur",
        scrolled && "scrolled",
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="Kagōunga home"
          onClick={() => {
            setOpen(false);
          }}
        >
          <img
            src="/img/logo-primary-horizontal.svg"
            alt="Kagōunga"
            className="h-8 w-auto"
          />
        </Link>
        <nav className="hidden items-center gap-8 text-[14px] font-medium lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? "rounded-full bg-lime px-4 py-1.5 text-ink"
                  : "hover:opacity-60"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden rounded-full bg-ink px-5 py-2.5 text-[13px] font-bold text-cream hover:bg-black lg:inline-block"
          >
            Find Us
          </Link>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => {
              setOpen((v) => !v);
            }}
            className="grid size-10 place-items-center rounded-full border border-ink/15 lg:hidden"
          >
            <Menu className="size-4.5" aria-hidden="true" />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-ink/10 bg-cream px-5 py-3 lg:hidden">
          <nav className="grid gap-1 text-[15px] font-medium">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => {
                  setOpen(false);
                }}
                className={({ isActive }) =>
                  cn(
                    "rounded-xl px-3 py-2.5 hover:bg-ink/5",
                    isActive && "bg-ink text-cream",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <Link
            to="/contact"
            onClick={() => {
              setOpen(false);
            }}
            className="mt-2 block rounded-full bg-ink px-5 py-3 text-center text-[15px] font-bold text-cream"
          >
            Find Us
          </Link>
        </div>
      )}
    </header>
  );
}
