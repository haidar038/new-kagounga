import { useTranslation } from "react-i18next";
import { useDocumentMeta, SITE_URL } from "../hooks/useDocumentMeta";
import { breadcrumbLd, graphLd } from "../lib/seo";
import { NEWS_POSTS, localizePost } from "../data/news";
import { useLocale } from "../i18n";
import { PageHero } from "../components/PageHero";
import { NewsCard } from "../components/NewsCard";

export function NewsPage(): React.JSX.Element {
  const { t } = useTranslation(["news", "seo", "common"]);
  const locale = useLocale();
  const posts = NEWS_POSTS.map((p) => localizePost(p, locale));
  useDocumentMeta({
    title: t("news.title", { ns: "seo" }),
    description: t("news.description", { ns: "seo" }),
    canonical: locale === "id" ? "/id/news" : "/news",
    jsonLd: graphLd([
      {
        "@type": "ItemList",
        itemListElement: posts.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}${locale === "id" ? "/id" : ""}/news/${p.slug}`,
          name: p.title,
        })),
      },
      breadcrumbLd(
        [
          { name: t("home", { ns: "common" }), path: "/" },
          { name: t("news", { ns: "common" }), path: "/news" },
        ],
        SITE_URL,
      ),
    ]),
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
