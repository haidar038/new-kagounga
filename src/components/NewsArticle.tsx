import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import { NEWS_POSTS, localizePost, type LocalizedPost } from "../data/news";
import { formatDateLabel } from "../lib/format";
import { localeLink, useLocale } from "../i18n";
import { useShareLink } from "../hooks/useShare";
import { renderMarkdownBody } from "../lib/markdown";
import { Reveal } from "./Reveal";

/** Reusable article UI for every news detail page (`/news/:slug`). */
export function NewsArticle({ post }: { post: LocalizedPost }): React.JSX.Element {
  const { t } = useTranslation("common");
  const locale = useLocale();
  const { copied, share } = useShareLink();
  const related = NEWS_POSTS.filter((p) => p.slug !== post.slug)
    .slice(0, 3)
    .map((p) => localizePost(p, locale));

  return (
    <article className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <Reveal>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-ink/60">
              <li>
                <Link to={localeLink("/", locale)} className="hover:text-ink">
                  {t("crumbs.home")}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link to={localeLink("/news", locale)} className="hover:text-ink">
                  {t("crumbs.news")}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="max-w-55 truncate text-ink">
                {post.title}
              </li>
            </ol>
          </nav>
          <Link
            to={localeLink("/news", locale)}
            className="mt-4 inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t("article.backToNews")}
          </Link>
        </Reveal>

        <Reveal>
          <header className="mt-6">
            <h1 className="display text-3xl font-bold leading-tight md:text-5xl">
              {post.title}
            </h1>
            {post.isFallback && (
              <p className="mt-3 inline-block rounded-full bg-cream px-3 py-1 text-[12px] font-bold text-ink/70">
                {t("article.fallbackBadge")}
              </p>
            )}
            <div className="mt-6 flex items-center gap-4 text-ink/60">
              <p className="flex items-center gap-2 text-sm">
                <Calendar className="size-4" aria-hidden="true" />
                <time dateTime={post.dateISO}>{formatDateLabel(post.dateISO, locale)}</time>
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
                {copied ? t("article.copied") : t("article.share")}
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
            {related.length > 0 && (
              <div className="mb-8">
                <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-ink/50">
                  {t("article.related")}
                </h2>
                <ul className="mt-4 grid gap-3">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        to={localeLink(`/news/${r.slug}`, locale)}
                        className="group block rounded-2xl border border-ink/10 p-4 hover:border-ink/40"
                      >
                        <p className="font-bold group-hover:underline">{r.title}</p>
                        <p className="mt-1 text-[13px] text-ink/60">
                          <time dateTime={r.dateISO}>{formatDateLabel(r.dateISO, locale)}</time>
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Link
              to={localeLink("/news", locale)}
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-sm font-bold hover:border-ink/40"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              {t("article.moreNews")}
            </Link>
          </footer>
        </Reveal>
      </div>
    </article>
  );
}
