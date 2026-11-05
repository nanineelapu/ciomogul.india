import type { CSSProperties } from "react";
import { getMagazineEditions, getReleaseCovers, getSiteText } from "@/lib/data";
import HeroCarousel, { type HeroCover } from "./HeroCarousel";
import { INDIA_CITIES, INDIA_PATH, INDIA_VIEWBOX } from "./indiaMap";

const COUNT = 7;

// The home page hero: the details of the magazine in front on the left, and a
// turning carousel of covers in front of a map of India on the right.
export default async function MagazineRelease() {
  const [picked, editions, t] = await Promise.all([getReleaseCovers(), getMagazineEditions(), getSiteText()]);
  const bySlug = new Map(editions.map((e) => [e.slug, e]));
  // The covers picked in Sanity, topped up with the newest editions, then shown
  // newest first so the hero opens on the latest magazine.
  const order = new Map(editions.map((e, i) => [e.slug, i]));
  const slugs = [...picked.map((p) => p.slug), ...editions.map((e) => e.slug)]
    .filter((s, i, all) => all.indexOf(s) === i)
    .slice(0, COUNT)
    .sort((a, b) => (order.get(a) ?? 99) - (order.get(b) ?? 99));
  const covers: HeroCover[] = slugs.flatMap((slug) => {
    const e = bySlug.get(slug);
    const p = picked.find((x) => x.slug === slug);
    if (!e && !p) return [];
    return [{
      slug,
      href: `/magazines/${slug}`,
      image: p?.coverImage || e!.coverImage,
      alt: p?.alt || e?.coverAlt || "",
      name: e?.featuredPersonName ?? p?.title ?? "",
      label: e?.editionLabel ?? "",
    }];
  });

  const map = (
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
  );

  return (
    <section className="section hero" aria-labelledby="release-title">
      <div className="wrap">
        <HeroCarousel
          covers={covers}
          map={map}
          text={{
            title: t.home.releaseTitle,
            text: t.home.releaseText,
            readMore: t.magazines.readEdition,
            viewAll: t.home.releaseButton,
          }}
        />
      </div>
    </section>
  );
}
