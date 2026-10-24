import Image from "next/image";
import Link from "next/link";
import { getNewsCards, getSiteText, getVitalUpdates } from "@/lib/data";

export default async function LatestNews() {
  const [cards, updates, t] = await Promise.all([getNewsCards(), getVitalUpdates(), getSiteText()]);
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
                  <Link href="/articles" className="news-card__img">
                    <Image src={c.image} alt={c.alt ?? ""} width={800} height={400} sizes="(max-width: 1080px) 100vw, 40vw" />
                  </Link>
                ) : (
                  <span className="news-card__img news-card__img--tile" aria-hidden>Aadhaar</span>
                )}
                <h3 className="news-card__title"><Link href="/articles">{c.title}</Link></h3>
                <p className="news-card__date">{c.date}</p>
                <Link href="/articles" className="read-more">{t.home.readMore}</Link>
              </article>
            ))}
          </div>
        </div>
        <aside className="updates" aria-labelledby="updates-title">
          <header className="s-head">
            <h2 className="s-title" id="updates-title">{t.home.updatesTitle}</h2>
            <span className="s-rule" aria-hidden />
          </header>
          <ul className="updates__list">
            {updates.map((u) => (
              <li key={u.slug}>
                <h3><Link href="/articles">{u.title}</Link></h3>
                {u.description && <p>{u.description}</p>}
                <Link href="/articles" className="read-more">{t.home.readMore}</Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
