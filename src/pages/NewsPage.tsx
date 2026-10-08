import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { NEWS_POSTS } from "../data/news";
import { PageHero } from "../components/PageHero";
import { NewsCard } from "../components/NewsCard";

export function NewsPage(): React.JSX.Element {
  useDocumentMeta({
    title: "News & Stories | Kagōunga",
    description:
      "Stay updated with the latest news, events, and stories from Kagōunga: popeda, North Moluccan cuisine, and local culture.",
  });

  return (
    <main id="top">
      <PageHero
        eyebrow="Latest Updates"
        titleBold="News"
        titleLight=" & Stories."
        lede="Stay updated with the latest news, events, and stories from Kagōunga."
      />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {NEWS_POSTS.map((post) => (
              <NewsCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
