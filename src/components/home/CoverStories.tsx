import Image from "next/image";
import Link from "next/link";
import { getCoverStories, getSiteText } from "@/lib/data";

export default async function CoverStories() {
  const [stories, t] = await Promise.all([getCoverStories(), getSiteText()]);
  return (
    <section className="section" id="hall-of-fame" aria-labelledby="cs-title">
      <div className="wrap">
        <header className="s-head">
          <h2 className="s-title" id="cs-title">{t.home.coverStoriesTitle}</h2>
          <span className="s-rule" aria-hidden />
        </header>
        <div className="stories">
          {stories.map((s) => (
            <Link key={s.slug} href={s.href} className="story">
              <span className="story__img"><Image src={s.image} alt={s.name} width={713} height={1009} sizes="(max-width: 720px) 50vw, 25vw" /></span>
              <span className="story__text">
                <span className="story__label">{t.home.coverStoryLabel}</span>
                <span className="story__name">{s.name}</span>
                <span className="story__role">{s.role}</span>
                <span className="story__tag">{s.tag}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
