import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SITE_URL, useDocumentMeta } from "../hooks/useDocumentMeta";
import { breadcrumbLd, graphLd } from "../lib/seo";
import { getPost, localizePost } from "../data/news";
import { localeLink, useLocale } from "../i18n";
import { NewsArticle } from "../components/NewsArticle";

export function NewsDetailPage(): React.JSX.Element {
  const { t } = useTranslation(["news", "seo", "common"]);
  const locale = useLocale();
  const { slug } = useParams<{ slug: string }>();
  const base = getPost(slug);
  const post = base ? localizePost(base, locale) : undefined;
  const prefix = locale === "id" ? "/id" : "";

  useDocumentMeta({
    title: post
      ? `${post.title}${t("suffix")}`
      : t("article.notFoundTitle", { ns: "common" }),
    description: post?.description ?? t("article.notFoundText", { ns: "common" }),
    canonical: post ? `${prefix}/news/${post.slug}` : undefined,
    image: post?.cover,
    imageAlt: post?.coverAlt,
    type: post ? "article" : "website",
    noindex: !post,
    publishedTime: post ? new Date(post.dateISO).toISOString() : undefined,
    modifiedTime: post ? new Date(post.dateISO).toISOString() : undefined,
    author: post ? "Kagōunga" : undefined,
    jsonLd: post
      ? graphLd([
          {
            "@type": "NewsArticle",
            headline: post.title,
            description: post.description,
            image: [post.cover],
            inLanguage: locale,
            datePublished: new Date(post.dateISO).toISOString(),
            dateModified: new Date(post.dateISO).toISOString(),
            author: { "@type": "Organization", name: "Kagōunga", url: `${SITE_URL}/` },
            publisher: {
              "@type": "Organization",
              name: "Kagōunga",
              logo: {
                "@type": "ImageObject",
                url: "https://res.cloudinary.com/fal5otmd/image/upload/f_auto,q_auto/logo-primary-emblem.svg",
              },
            },
            mainEntityOfPage: `${SITE_URL}${prefix}/news/${post.slug}`,
          },
          breadcrumbLd(
            [
              { name: t("home", { ns: "common" }), path: "/" },
              { name: t("news", { ns: "common" }), path: "/news" },
              { name: post.title, path: `/news/${post.slug}` },
            ],
            SITE_URL,
          ),
        ])
      : undefined,
  });

  if (!post) {
    return (
      <main id="top">
        <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
          <p aria-live="polite" className="text-lg font-bold">
            {t("article.notFoundTitle", { ns: "common" })}
          </p>
          <p className="mt-2 text-[15px] text-ink/70">
            {t("article.notFoundText", { ns: "common" })}
          </p>
          <Link
            to={localeLink("/news", locale)}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-sm font-bold hover:border-ink/40"
          >
            {t("article.backToNews", { ns: "common" })}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="top">
      <NewsArticle post={post} />
    </main>
  );
}
