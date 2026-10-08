import { Navigate, useParams } from "react-router-dom";
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

  if (!post) return <Navigate to="/news" replace />;

  return (
    <main id="top">
      <NewsArticle post={post} />
    </main>
  );
}
