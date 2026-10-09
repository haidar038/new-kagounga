import { Link, useParams } from "react-router-dom";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { getPost } from "../data/news";
import { NewsArticle } from "../components/NewsArticle";

export function NewsDetailPage(): React.JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const post = getPost(slug);

  useDocumentMeta({
    title: post ? `${post.title} | Kagōunga News` : "Not Found | Kagōunga News",
    description: post?.description ?? "News article not found.",
  });

  if (!post) {
    return (
      <main id="top">
        <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
          <p aria-live="polite" className="text-lg font-bold">
            Article not found.
          </p>
          <p className="mt-2 text-[15px] text-ink/70">
            The story you are looking for does not exist or was moved.
          </p>
          <Link
            to="/news"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-sm font-bold hover:border-ink/40"
          >
            Back to News
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
