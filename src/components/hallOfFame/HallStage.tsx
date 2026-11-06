"use client";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useRef, useState, type CSSProperties } from "react";
import type { HallOfFameEntry } from "@/types/content";
import type { SiteText } from "@/data/siteText";

type Props = {
  entries: HallOfFameEntry[];
  text: SiteText["hallOfFame"];
  digitalLabel: string;
  prevLabel: string;
  nextLabel: string;
};

// Fills {name}, {when}… in text that editors can change in Studio.
const fill = (tpl: string, vars: Record<string, string | number>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));

// The Hall of Fame showcase: the inductee in front is big and centred, the others
// tilt away on either side. The name, role, quote and buttons follow whoever is in
// front. It turns on its own (a thin line fills, then the next one steps forward),
// pauses on hover, and can be swiped, clicked, or moved with the arrow keys.
export default function HallStage({ entries, text, digitalLabel, prevLabel, nextLabel }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const swipe = useRef<{ x: number; moved: boolean } | null>(null);
  const n = entries.length;
  const go = (step: number) => setActive((a) => (a + step + n) % n);
  if (!n) return null;

  const e = entries[active];
  const vars = { name: e.name, when: e.inductedOn, role: e.role, organization: e.organization };
  const quote = e.pullQuote || fill(e.inductedOn ? text.citation : text.citationNoDate, vars);
  const meta = [e.role, e.organization].filter(Boolean).join(" · ");

  return (
    <div
      className="hs"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(ev) => {
        if (ev.key === "ArrowRight") go(1);
        if (ev.key === "ArrowLeft") go(-1);
      }}
    >
      <header className="hs__head">
        <p className="hs__eyebrow">{text.carouselEyebrow}</p>
      </header>

      <div
        className="hs__stage"
        onPointerDown={(ev) => { swipe.current = { x: ev.clientX, moved: false }; }}
        onPointerMove={(ev) => {
          if (swipe.current && Math.abs(ev.clientX - swipe.current.x) > 10) swipe.current.moved = true;
        }}
        onPointerUp={(ev) => {
          const s = swipe.current;
          if (s && Math.abs(ev.clientX - s.x) > 40) go(ev.clientX < s.x ? 1 : -1);
        }}
        onDragStart={(ev) => ev.preventDefault()}
      >
        {n > 1 && (
          <button type="button" className="hs__arrow hs__arrow--prev" onClick={() => go(-1)} aria-label={prevLabel}>←</button>
        )}

        <div className="hs__ring" role="group" aria-roledescription="carousel" aria-label={text.carouselEyebrow}>
          {entries.map((c, i) => {
            // how far this one is from the inductee in front: …, -2, -1, 0, 1, 2, …
            let o = (i - active + n) % n;
            if (o > n / 2) o -= n;
            const front = o === 0;
            return (
              <Link
                key={c.slug}
                href={`/hall-of-fame/${c.slug}`}
                className="hs__cover"
                data-front={front || undefined}
                data-far={Math.abs(o) > 3 || undefined}
                style={{ "--o": o, "--a": Math.abs(o) } as CSSProperties}
                tabIndex={front ? 0 : -1}
                aria-hidden={!front}
                draggable={false}
                onClick={(ev) => {
                  // a drag is a swipe, not a click; a side cover steps to the front
                  if (swipe.current?.moved || !front) ev.preventDefault();
                  if (!swipe.current?.moved && !front) setActive(i);
                  swipe.current = null;
                }}
              >
                <Image src={c.portrait} alt={c.name} width={713} height={1009} sizes="(max-width: 720px) 52vw, 290px" priority={Math.abs(o) < 2} />
              </Link>
            );
          })}
        </div>

        {n > 1 && (
          <button type="button" className="hs__arrow hs__arrow--next" onClick={() => go(1)} aria-label={nextLabel}>→</button>
        )}
        <span className="hs__floor" aria-hidden />
      </div>

      {/* key: a new inductee replays the reveal; each word of the name rises out of its own mask */}
      <div className="hs__detail" key={e.slug} aria-live="polite">
        <p className="hs__label">{e.inductedOn ? `${text.inducted} · ${e.inductedOn}` : text.carouselEyebrow}</p>
        <h2 className="hs__name" aria-label={e.name}>
          {e.name.split(" ").map((w, i) => (
            <Fragment key={i}>
              <span className="hs__word" style={{ "--i": i } as CSSProperties} aria-hidden>
                <span>{w}</span>
              </span>{" "}
            </Fragment>
          ))}
        </h2>
        {meta && <p className="hs__meta">{meta}</p>}
        <blockquote className="hs__quote">{quote}</blockquote>
        <div className="hs__actions">
          <Link href={`/hall-of-fame/${e.slug}`} className="btn btn-ink">
            {text.viewProfile} <span aria-hidden>→</span>
          </Link>
          {e.editionSlug && (
            <a href={`/magazines/${e.editionSlug}/digital`} target="_blank" rel="noopener" className="btn btn-line">
              {digitalLabel} <span aria-hidden>↗</span>
            </a>
          )}
        </div>
      </div>

      {n > 1 && (
        <>
          {/* the line fills while this inductee is in front; when it ends the next one steps forward */}
          <div className="hs__progress" data-paused={paused || undefined} aria-hidden>
            <i key={active} onAnimationEnd={() => go(1)} />
          </div>

          <div className="hs__rail" role="tablist" aria-label={text.carouselEyebrow}>
            {entries.map((c, i) => (
              <button
                key={c.slug}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={c.name}
                className={i === active ? "is-active" : undefined}
                onClick={() => setActive(i)}
              >
                <Image src={c.portrait} alt="" width={54} height={76} sizes="54px" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
