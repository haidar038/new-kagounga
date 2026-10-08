import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { NewsPost } from "../types/content";
import { Reveal } from "./Reveal";

export function NewsCard({ post }: { post: NewsPost }): React.JSX.Element {
  return (
    <Reveal className="h-full">
      <Link
        to={`/news/${post.slug}`}
        className="card-hover group flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white"
      >
        <div className="aspect-video overflow-hidden bg-ink/5">
          <img
            src={post.cover}
            alt={post.coverAlt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="flex flex-1 flex-col p-7 md:p-8">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink/50">
            <time dateTime={post.dateISO}>{post.dateLabel}</time>
          </p>
          <h2 className="mt-4 line-clamp-2 text-[22px] font-bold leading-tight">
            {post.title}
          </h2>
          <p className="mb-6 mt-3 line-clamp-2 text-[15px] leading-relaxed text-ink/70">
            {post.excerpt}
          </p>
          <span className="mt-auto flex items-center justify-between border-t border-ink/10 pt-5 text-sm font-bold">
            Read more
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
