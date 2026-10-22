import Image from "next/image";
import Link from "next/link";
import { getFeaturedArticles } from "@/lib/data";

export default async function FeaturedArticles() {
  const rows = await getFeaturedArticles();

  return (
    <section className="section" id="articles" aria-labelledby="art-title">
      <div className="wrap">
        <header className="s-head">
          <h2 className="s-title" id="art-title">Featured articles</h2>
          <span className="s-rule" aria-hidden />
        </header>
        <div className="articles">
          {rows.map((r) => (
            <article key={r.slug} className="row-card">
              <Link href="/news" className="row-card__img">
                <Image src={r.image} alt={r.alt} width={600} height={500} sizes="(max-width: 1080px) 50vw, 25vw" />
              </Link>
              <div className="row-card__text">
                <h3><Link href="/news">{r.title}</Link></h3>
                <p>{r.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
