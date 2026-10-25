"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { HallOfFameEntry } from "@/types/content";
import type { SiteText } from "@/data/siteText";
import "./hallCarousel.css";

// Large, one-at-a-time hero carousel. The track scrolls natively (trackpad /
// swipe) and snaps on each slide. Arrows and the dot row drive it too, and
// the active dot is kept in sync with whatever the user actually sees.

type Props = {
  entries: HallOfFameEntry[];
  text: SiteText["hallOfFame"];
  prevLabel: string;    // "← Prev"
  nextLabel: string;    // "Next →"
};

// Fills {name}, {when}, {count}… in text that editors can change in Studio.
const fill = (tpl: string, vars: Record<string, string | number>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));

export default function HallCarousel({ entries, text, prevLabel, nextLabel }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(entries.length - 1, i));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  };

  const total = entries.length;
  const canPrev = index > 0;
  const canNext = index < total - 1;

  return (
    <div className="hall-car" id="hall-carousel" aria-roledescription="carousel">
      {total > 1 && (
        <p className="hall-car__hint">
          <span aria-hidden>←</span>
          {fill(text.carouselHint, { count: total })}
          <span aria-hidden>→</span>
        </p>
      )}

      <ol ref={trackRef} className="hall-car__track" aria-label="Hall of Fame inductees">
        {entries.map((entry, i) => {
          const vars = {
            name: entry.name,
            when: entry.inductedOn,
            role: entry.role,
            organization: entry.organization,
          };
          const citation = entry.inductedOn ? text.citation : text.citationNoDate;
          return (
            <li
              key={entry.slug}
              className="hall-car__slide"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${total}`}
            >
              <article className="hall-car__hero">
                <Link
                  href={`/hall-of-fame/${entry.slug}`}
                  className="hall-car__cover"
                  aria-label={`Open ${entry.name}'s profile`}
                >
                  <Image
                    src={entry.portrait}
                    alt={entry.name}
                    width={820}
                    height={1030}
                    priority={i === 0}
                    sizes="(max-width: 820px) 100vw, 380px"
                  />
                </Link>

                <div className="hall-car__body">
                  <p className="hall-car__eyebrow">
                    <span>{text.carouselEyebrow}</span>
                    <span aria-hidden>·</span>
                    <span>{fill(text.carouselPosition, { n: i + 1, total })}</span>
                  </p>

                  <h2 className="hall-car__name">{entry.name}</h2>

                  {(entry.role || entry.organization) && (
                    <p className="hall-car__meta">
                      {entry.role}
                      {entry.role && entry.organization && " · "}
                      {entry.organization}
                    </p>
                  )}

                  <p className="hall-car__citation">{fill(citation, vars)}</p>
                  <div className="hall-car__actions">
                    <Link href={`/hall-of-fame/${entry.slug}`} className="btn btn-ink btn-sm">
                      {text.viewProfile}
                    </Link>
                    {entry.editionSlug && (
                      <Link href={`/magazines/${entry.editionSlug}`} className="btn btn-line btn-sm">
                        {text.readEdition}
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ol>

      <div className="hall-car__nav">
        <button
          type="button"
          className="hall-car__btn"
          onClick={() => goTo(index - 1)}
          disabled={!canPrev}
          aria-label={prevLabel}
        >
          ←
        </button>

        <div className="hall-car__dots" role="tablist" aria-label="Choose an inductee">
          {entries.map((e, i) => (
            <button
              key={e.slug}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to ${e.name}`}
              className={`hall-car__dot${i === index ? " is-active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <button
          type="button"
          className="hall-car__btn"
          onClick={() => goTo(index + 1)}
          disabled={!canNext}
          aria-label={nextLabel}
        >
          →
        </button>
      </div>
    </div>
  );
}
