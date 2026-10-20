import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { NEWS_POSTS, loadPosts, localizePost } from "../data/news";
import { useLocale } from "../i18n";
import { PageHero } from "../components/PageHero";
import { NewsCard } from "../components/NewsCard";

export function NewsPage(): React.JSX.Element {
  const { t } = useTranslation(["news", "seo", "common"]);
  const locale = useLocale();
  // Statis dulu (SEO/prerender utuh), upgrade ke CMS bila reachable.
  // CMS gagal -> tetap tampil fallback + banner inline di dalam container grid.
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [cached, setCached] = useState(() => ({
    locale,
    posts: NEWS_POSTS.map((p) => localizePost(p, locale)),
  }));
  if (cached.locale !== locale) {
    setCached({ locale, posts: NEWS_POSTS.map((p) => localizePost(p, locale)) });
  }
  useEffect(() => {
    const fallback = NEWS_POSTS.map((p) => localizePost(p, locale));
    let on = true;
    loadPosts(locale, fallback).then((r) => {
      if (!on) return;
      if (r.source === "cms") setCached({ locale, posts: r.items });
      setFailed(r.error);
    });
    return () => {
      on = false;
    };
  }, [locale, attempt]);
  const posts = cached.posts;
  useDocumentMeta({
    title: t("news.title", { ns: "seo" }),
    description: t("news.description", { ns: "seo" }),
    canonical: locale === "id" ? "/id/news" : "/news",
  });

  return (
    <main id="top">
      <PageHero
        eyebrow={t("hero.eyebrow")}
        titleBold={t("hero.titleBold")}
        titleLight={t("hero.titleLight")}
        lede={t("hero.lede")}
      />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          {failed && (
            <div
              role="alert"
              className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/15 bg-cream px-5 py-4 text-sm"
            >
              <p aria-live="polite" className="font-medium text-ink/80">
                {t("data.loadError", { ns: "common" })}
              </p>
              <button
                type="button"
                onClick={() => {
                  setAttempt((a) => a + 1);
                }}
                className="rounded-full border border-ink/15 px-5 py-2 text-sm font-bold hover:border-ink/40"
              >
                {t("data.retry", { ns: "common" })}
              </button>
            </div>
          )}
          {posts.length === 0 ? (
            <p aria-live="polite" className="text-[15px] text-ink/70">
              {t("empty")}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {posts.map((post) => (
                <NewsCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
