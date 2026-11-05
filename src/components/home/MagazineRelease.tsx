import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { getMagazineEditions, getReleaseCovers, getSiteText } from "@/lib/data";
import { INDIA_CITIES, INDIA_PATH, INDIA_VIEWBOX } from "./indiaMap";

const COUNT = 7;

// The home page hero: title and intro, a fan of magazine covers (the first one
// in the middle, the rest alternating outwards and getting smaller), and a map
// of India with the cities our leaders work in.
export default async function MagazineRelease() {
  const [picked, editions, t] = await Promise.all([getReleaseCovers(), getMagazineEditions(), getSiteText()]);
  // The covers picked in Sanity first, topped up with the newest editions.
  const covers = [
    ...picked,
    ...editions
      .filter((e) => !picked.some((p) => p.slug === e.slug))
      .map((e) => ({ slug: e.slug, href: `/magazines/${e.slug}`, title: e.title, coverImage: e.coverImage, alt: e.coverAlt })),
  ].slice(0, COUNT);

  // 0 → middle, 1 → right of it, 2 → left of it, 3 → further right, …
  const fan = covers
    .map((c, i) => ({ c, d: i === 0 ? 0 : (i % 2 ? 1 : -1) * Math.ceil(i / 2) }))
    .sort((a, b) => a.d - b.d);

  return (
    <section className="section hero" aria-labelledby="release-title">
      <div className="wrap hero__grid">
        <div className="hero__main">
          <header className="hero__head">
            <h1 className="hero__title" id="release-title">{t.home.releaseTitle}</h1>
            <p className="hero__text">{t.home.releaseText}</p>
          </header>

          <div className="hero__fan">
            {fan.map(({ c, d }) => (
              <Link
                key={c.slug}
                href={c.href}
                className="hero__cover"
                data-far={Math.abs(d) > 2 || undefined}
                style={{ "--d": d, "--a": Math.abs(d) } as CSSProperties}
              >
                <Image
                  src={c.coverImage}
                  alt={c.alt}
                  width={713}
                  height={1009}
                  sizes="(max-width: 720px) 34vw, 230px"
                  priority={Math.abs(d) < 2}
                />
              </Link>
            ))}
          </div>

          <div className="hero__more">
            <Link href="/magazines" className="btn btn-ink">{t.home.releaseButton}</Link>
          </div>
        </div>

        <div className="hero__map" aria-hidden>
          <svg viewBox={INDIA_VIEWBOX} className="hero__map-svg">
            <defs>
              <linearGradient id="india-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#1B3A6B" />
                <stop offset="1" stopColor="#0B1F3A" />
              </linearGradient>
            </defs>
            <path d={INDIA_PATH} fill="url(#india-fill)" />
          </svg>
          {INDIA_CITIES.map((c, i) => (
            <span
              key={c.name}
              className="hero__city"
              data-left={c.left || undefined}
              style={{ left: `${c.x}%`, top: `${c.y}%`, "--i": i } as CSSProperties}
            >
              <i />
              <b>{c.name}</b>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
