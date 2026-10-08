import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import type { NewsPost } from "../types/content";
import { useShareLink } from "../hooks/useShare";
import { renderMarkdownBody } from "../lib/markdown";
import { Reveal } from "./Reveal";

/** Reusable article UI for every news detail page (`/news/:slug`). */
export function NewsArticle({ post }: { post: NewsPost }): React.JSX.Element {
  const { copied, share } = useShareLink();

  return (
    <article className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <Reveal>
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to News
          </Link>
        </Reveal>

        <Reveal>
          <header className="mt-6">
            <h1 className="display text-3xl font-bold leading-tight md:text-5xl">
              {post.title}
            </h1>
            <div className="mt-6 flex items-center gap-4 text-ink/60">
              <p className="flex items-center gap-2 text-sm">
                <Calendar className="size-4" aria-hidden="true" />
                <time dateTime={post.dateISO}>{post.dateLabel}</time>
              </p>
              <button
                type="button"
                onClick={() => {
                  share({
                    title: post.title,
                    text: post.title,
                    url: window.location.href,
                  });
                }}
                className="ml-auto inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-[13px] font-bold hover:border-ink/40"
              >
                <Share2 className="size-4" aria-hidden="true" />
                {copied ? "Link copied" : "Share"}
              </button>
            </div>
          </header>
        </Reveal>

        <Reveal>
          <div className="mt-8 overflow-hidden rounded-3xl border border-ink/10">
            <img
              src={post.cover}
              alt={post.coverAlt}
              className="aspect-video w-full object-cover"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-8 grid gap-5 text-[15px] leading-relaxed text-ink/80 md:text-base">
            <p className="text-lg font-medium leading-relaxed text-ink/70 md:text-xl">
              {post.lede}
            </p>
            {renderMarkdownBody(post.bodyMarkdown)}
          </div>
        </Reveal>

        <Reveal>
          <footer className="mt-12 border-t border-ink/10 pt-8">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-sm font-bold hover:border-ink/40"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              More News
            </Link>
          </footer>
        </Reveal>
      </div>
    </article>
  );
}
