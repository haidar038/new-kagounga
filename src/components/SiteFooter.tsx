import { Link } from "react-router-dom";
import {
  CONTACT,
  FOOTER_NAVIGATE,
  FOOTER_SIGNATURES,
  SOCIALS,
} from "../data/site";
import { cld } from "../lib/cloudinary";

const YEAR = new Date().getFullYear();

export function SiteFooter(): React.JSX.Element {
  return (
    <footer id="reach" className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <img
              src={cld("logo-primary-white.svg", 320)}
              alt="Kagounga"
              className="h-16 w-auto"
              width={160}
              height={64}
              decoding="async"
            />
            <p className="display mt-6 text-lg font-light md:text-4xl">
              <span className="font-bold">Move,</span> Moreover.
            </p>
            <div className="mt-6 flex gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid size-11 place-items-center rounded-full border border-cream/20 transition hover:border-lime hover:bg-lime"
                >
                  <img
                    src={s.iconSrc}
                    alt=""
                    className={s.iconClass}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
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
          <p>© {YEAR} Kagōunga. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <p className="flex gap-5">
              <span className="text-cream/40">Privacy soon</span>
              <span className="text-cream/40">Terms soon</span>
            </p>
            <div
              className="flex items-center gap-1 border-l border-cream/15 pl-5 text-[12px] font-bold"
              role="group"
              aria-label="Language"
            >
              <span className="rounded-md bg-lime px-2 py-1 text-ink">EN</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
