import { Link } from "react-router-dom";
import {
  CONTACT,
  FOOTER_NAVIGATE,
  FOOTER_SIGNATURES,
  SOCIALS,
} from "../data/site";

export function SiteFooter(): React.JSX.Element {
  return (
    <footer id="reach" className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <img
              src="/img/logo-primary-white.svg"
              alt="Kagounga"
              className="h-16 w-auto"
            />
            <p className="display mt-6 text-lg font-light md:text-4xl">
              <span className="font-bold">Move,</span> Moreover.
            </p>
            <div className="mt-6 flex gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid size-11 place-items-center rounded-full border border-cream/20 transition hover:border-lime hover:bg-lime"
                >
                  <img src={s.iconSrc} alt="" className={s.iconClass} loading="lazy" />
                </a>
              ))}
            </div>
          </div>
          <nav className="grid content-start gap-3 text-[14px] lg:col-span-2">
            <p className="text-[12px] font-bold tracking-[0.18em] text-lime">
              NAVIGATE
            </p>
            {FOOTER_NAVIGATE.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="opacity-80 hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <nav className="grid content-start gap-3 text-[14px] lg:col-span-2">
            <p className="text-[12px] font-bold tracking-[0.18em] text-lime">
              SIGNATURES
            </p>
            {FOOTER_SIGNATURES.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="opacity-80 hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="grid content-start gap-3 text-[14px] lg:col-span-3">
            <p className="text-[12px] font-bold tracking-[0.18em] text-lime">
              REACH US
            </p>
            <p className="font-bold">
              {CONTACT.office}
              <br />
              <span className="font-normal opacity-70">
                {CONTACT.address[0]}
                <br />
                {CONTACT.address[1]}
              </span>
            </p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="opacity-80 decoration-lime decoration-2 hover:opacity-100"
            >
              {CONTACT.email}
            </a>
            <a
              href={CONTACT.phoneHref}
              className="opacity-80 hover:opacity-100"
            >
              {CONTACT.phoneLabel}
            </a>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-cream/15 pt-6 text-[13px] text-cream/60">
          <p>© 2026 Kagōunga. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <p className="flex gap-5">
              <a href="#" className="hover:text-cream">
                Privacy
              </a>
              <a href="#" className="hover:text-cream">
                Terms
              </a>
            </p>
            <div
              className="flex items-center gap-1 border-l border-cream/15 pl-5 text-[12px] font-bold"
              role="group"
              aria-label="Language"
            >
              <span className="rounded-md bg-lime px-2 py-1 text-ink">EN</span>
              <a href="#" className="px-1 text-cream/50 hover:text-cream">
                ID
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
