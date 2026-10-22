import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/content";

// Top Stories: one big "lead" article on the left and up to two stacked
// smaller ones on the right. Editor flags isTopStory on the chosen articles;
// the first three in the result land here.
export default function TopStoriesBand({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;
  const [lead, ...rest] = articles;

  return (
    <section className="top-stories" aria-labelledby="top-title">
      <header className="section-head">
        <h2 className="section-head__title" id="top-title">Top Stories</h2>
        <span className="section-head__rule" aria-hidden />
      </header>

      <div className="top-stories__grid">
        <article className="top-lead">
          <Link href={`/articles/${lead.slug}`} className="top-lead__img">
            <Image
              src={lead.image}
              alt={lead.alt ?? ""}
              width={1280}
              height={720}
              priority
              sizes="(max-width: 820px) 100vw, 60vw"
            />
          </Link>
          <p className="top-lead__kicker">{lead.category}</p>
          <h3 className="top-lead__title">
            <Link href={`/articles/${lead.slug}`}>{lead.title}</Link>
          </h3>
          <p className="top-lead__excerpt">{lead.excerpt}</p>
          <p className="top-lead__meta">
            <span>{lead.date}</span>
            {lead.readTime && <span aria-hidden> · </span>}
            {lead.readTime && <span>{lead.readTime}</span>}
          </p>
        </article>

        <ul className="top-side">
          {rest.map((a) => (
            <li key={a.slug} className="top-side__item">
              <Link href={`/articles/${a.slug}`} className="top-side__img">
                <Image
                  src={a.image}
                  alt={a.alt ?? ""}
                  width={720}
                  height={480}
                  sizes="(max-width: 820px) 100vw, 25vw"
                />
              </Link>
              <div className="top-side__body">
                <p className="top-side__kicker">{a.category}</p>
                <h3 className="top-side__title">
                  <Link href={`/articles/${a.slug}`}>{a.title}</Link>
                </h3>
                <p className="top-side__meta">{a.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
