import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/content";

// Ranked trending list — big navy serial number, small thumbnail, title.
// Visually distinct from Latest so the two sections don't look the same.
export default function TrendingList({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="trending" aria-labelledby="trending-title">
      <header className="section-head">
        <h2 className="section-head__title" id="trending-title">Trending now</h2>
        <span className="section-head__rule" aria-hidden />
      </header>

      <ol className="trending__list">
        {articles.map((a, i) => (
          <li key={a.slug} className="trending__row">
            <span className="trending__rank" aria-hidden>
              {String(a.trendingRank ?? i + 1).padStart(2, "0")}
            </span>

            <Link href={`/articles/${a.slug}`} className="trending__img">
              <Image
                src={a.image}
                alt={a.alt ?? ""}
                width={320}
                height={200}
                sizes="(max-width: 640px) 140px, 180px"
              />
            </Link>

            <div className="trending__body">
              <p className="trending__kicker">{a.category}</p>
              <h3 className="trending__title">
                <Link href={`/articles/${a.slug}`}>{a.title}</Link>
              </h3>
              <p className="trending__meta">
                {a.date}
                {a.readTime && <> · {a.readTime}</>}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
