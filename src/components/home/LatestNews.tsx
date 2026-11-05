import Image from "next/image";
import Link from "next/link";
import { getNewsCards, getSiteText } from "@/lib/data";

export default async function LatestNews() {
  const [cards, t] = await Promise.all([getNewsCards(), getSiteText()]);
  return (
    <section className="section" id="news" aria-labelledby="news-title">
      <div className="wrap news">
        <div className="news__main">
          <header className="s-head">
            <h2 className="s-title" id="news-title">{t.home.newsTitle}</h2>
            <span className="s-rule" aria-hidden />
          </header>
          <div className="news__grid">
            {cards.map((c) => (
              <article key={c.slug} className="news-card">
                {c.image ? (
                  <Link href={c.href} className="news-card__img">
                    <Image src={c.image} alt={c.alt ?? ""} width={800} height={400} sizes="(max-width: 1080px) 100vw, 40vw" />
                  </Link>
                ) : (
                  <span className="news-card__img news-card__img--tile" aria-hidden>{c.category || t.home.newsTitle}</span>
                )}
                <h3 className="news-card__title"><Link href={c.href}>{c.title}</Link></h3>
                <p className="news-card__date">{c.date}</p>
                <Link href={c.href} className="read-more">{t.home.readMore}</Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
