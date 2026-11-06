"use client";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";

export type HeroCover = { slug: string; href: string; image: string; alt: string; name: string; label: string };
type Text = { title: string; text: string; readMore: string; viewAll: string };

const EVERY_MS = 3200;

// The home hero: the cover in front changes every few seconds, the others turn
// around it in 3D, and the details on the left follow the cover in front.
// Pauses on hover/focus; stays still when the visitor prefers less motion.
export default function HeroCarousel({ covers, text, map }: { covers: HeroCover[]; text: Text; map: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = covers.length;

  useEffect(() => {
    if (paused || n < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % n), EVERY_MS);
    return () => window.clearInterval(id);
  }, [paused, n]);

  // swipe / drag sideways on the covers to slide to the next or previous one
  const swipe = useRef<{ x: number; moved: boolean } | null>(null);
  const go = (step: number) => setActive((a) => (a + step + n) % n);

  if (!n) return null;
  const current = covers[active];

  return (
    <div
      className="hero__grid"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="hero__info">
        <h1 className="hero__eyebrow" id="release-title">{text.title}</h1>
        {/* key: a new name replays the reveal; each word rises out of its own mask, as on the About page */}
        <div className="hero__now" key={current.slug} aria-live="polite">
          <p className="hero__name" aria-label={current.name}>
            {current.name.split(" ").map((w, i) => (
              <Fragment key={i}>
                <span className="hero__word" style={{ "--i": i } as CSSProperties} aria-hidden>
                  <span>{w}</span>
                </span>{" "}
              </Fragment>
            ))}
          </p>
        </div>
        <p className="hero__text">{text.text}</p>
        <div className="hero__actions">
          <Link href={current.href} className="btn btn-ink btn-sm">{text.readMore} <span aria-hidden>→</span></Link>
          <Link href="/magazines" className="btn btn-line btn-sm">{text.viewAll}</Link>
        </div>
        <div className="hero__dots" role="tablist" aria-label={text.title}>
          {covers.map((c, i) => (
            <button
              key={c.slug}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`${c.name}, ${c.label}`}
              className={i === active ? "is-active" : undefined}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>

      <div
        className="hero__stage"
        onPointerDown={(e) => { swipe.current = { x: e.clientX, moved: false }; }}
        onDragStart={(e) => e.preventDefault()}
        onPointerMove={(e) => {
          if (swipe.current && Math.abs(e.clientX - swipe.current.x) > 10) swipe.current.moved = true;
        }}
        onPointerUp={(e) => {
          const s = swipe.current;
          if (s && Math.abs(e.clientX - s.x) > 40) go(e.clientX < s.x ? 1 : -1);
        }}
      >
        <div className="hero__ring">
          {covers.map((c, i) => {
            // how far this cover is from the one in front: …, -2, -1, 0, 1, 2, …
            let o = (i - active + n) % n;
            if (o > n / 2) o -= n;
            const front = o === 0;
            return (
              <Link
                key={c.slug}
                href={c.href}
                className="hero__cover"
                data-front={front || undefined}
                style={{ "--o": o, "--a": Math.abs(o) } as CSSProperties}
                tabIndex={front ? 0 : -1}
                aria-hidden={!front}
                draggable={false}
                onClick={(e) => {
                  // a drag is a swipe, not a click; a side cover slides to the front
                  if (swipe.current?.moved || !front) e.preventDefault();
                  if (!swipe.current?.moved && !front) setActive(i);
                  swipe.current = null;
                }}
              >
                <Image src={c.image} alt={c.alt} width={713} height={1009} sizes="(max-width: 720px) 46vw, 240px" priority={Math.abs(o) < 2} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* the whole map in a column of its own, so no cover ever sits on top of it */}
      {map}
    </div>
  );
}
