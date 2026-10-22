import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/content";

// Standard article card used by Latest + Explore grids. Minimal — image,
// category kicker, title, date · read-time footer. No decoration.
export default function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="article-card">
      <Link href={`/articles/${article.slug}`} className="article-card__img">
        <Image
          src={article.image}
          alt={article.alt ?? ""}
          width={960}
          height={540}
          sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 33vw"
        />
      </Link>
      <p className="article-card__kicker">{article.category}</p>
      <h3 className="article-card__title">
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </h3>
      <p className="article-card__excerpt">{article.excerpt}</p>
      <p className="article-card__meta">
        <span>{article.date}</span>
        {article.readTime && <span className="article-card__dot" aria-hidden>·</span>}
        {article.readTime && <span>{article.readTime}</span>}
      </p>
    </article>
  );
}
