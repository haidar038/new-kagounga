import type { ReactNode } from "react";

export function StatusPage({
  code,
  titleBold,
  titleLight,
  text,
  children,
}: {
  code: string;
  titleBold: string;
  titleLight?: string;
  text: string;
  children?: ReactNode;
}): React.JSX.Element {
  return (
    <main id="top">
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-ink/70">
          {code}
        </p>
        <h1 className="display mt-3 text-5xl md:text-6xl">
          <span className="font-bold">{titleBold}</span>
          {titleLight ? (
            <>
              {" "}
              <span className="font-light">{titleLight}</span>
            </>
          ) : null}
        </h1>
        <p aria-live="polite" className="mt-4 text-[15px] text-ink/70">
          {text}
        </p>
        {children ? <div className="mt-6 flex flex-wrap gap-3">{children}</div> : null}
      </div>
    </main>
  );
}
