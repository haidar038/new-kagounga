import { Link } from "react-router-dom";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

export function NotFoundPage(): React.JSX.Element {
  useDocumentMeta({
    title: "Not Found | Kagōunga",
    description: "The page you are looking for does not exist.",
  });

  return (
    <main id="top">
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-ink/50">
          404
        </p>
        <h1 className="display mt-3 text-5xl md:text-6xl">
          <span className="font-bold">Lost</span>{" "}
          <span className="font-light">at sea.</span>
        </h1>
        <p aria-live="polite" className="mt-4 text-[15px] text-ink/70">
          The page you are looking for does not exist or was moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-cream hover:bg-black"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
