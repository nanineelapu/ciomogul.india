import Image from "next/image";
import Link from "next/link";
import { getPublishedProfiles, profileHref, SPOTLIGHT_COPY } from "@/data/womenSpotlightData";

// Opening block: title + intro on the left, a fanned hand of the published
// profiles on the right, and a navy ticker of names and sectors underneath.
export default function SpotlightHero({ title }: { title: string }) {
  const profiles = getPublishedProfiles();
  // Each card's offset from the centre of the fan; spread wider when few cards.
  const mid = (profiles.length - 1) / 2;
  const spread = profiles.length <= 2 ? 2 : 1;
  const ticker = [
    ...profiles.map((p) => ({ key: p.id, strong: p.name, rest: p.organization })),
    ...SPOTLIGHT_COPY.tickerThemes.map((t) => ({ key: t, strong: t, rest: "" })),
  ];

  return (
    <>
      <section className="spot-hero" aria-labelledby="spot-hero-title">
        <div className="wrap spot-hero__grid">
          <div className="spot-hero__text">
            <h1 className="spot-hero__title" id="spot-hero-title">{title}</h1>
            <span className="spot-hero__rule" aria-hidden />
            <div className="spot-hero__intro">
              {SPOTLIGHT_COPY.intro.map((p) => <p key={p}>{p}</p>)}
            </div>

            <div className="spot-hero__actions">
              <a href="#profile" className="btn btn-ink">Meet the Honorees <span aria-hidden>↓</span></a>
              <Link href="/contact" className="btn btn-line">Nominate a Leader</Link>
            </div>

            <dl className="spot-hero__meta">
              <div><dt>Featured profiles</dt><dd>{profiles.length}</dd></div>
            </dl>
          </div>

          <div className="spot-fan" aria-label="Featured profiles">
            {profiles.map((p, i) => (
              <Link
                key={p.id}
                href={profileHref(p.id)}
                className="spot-fan__card"
                style={{ "--i": i, "--o": (i - mid) * spread } as React.CSSProperties}
                aria-label={`Open the profile of ${p.name}`}
              >
                <Image
                  src={p.cover}
                  alt={`${p.name}, CIO Mogul India featured profile`}
                  width={428}
                  height={588}
                  priority
                  sizes="(max-width: 1080px) 200px, 260px"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="spot-ticker" aria-hidden>
        <div className="spot-ticker__track">
          {/* The loop moves by half the track, so it repeats internally to fill wide screens. */}
          {[0, 1, 2, 3].map((copy) =>
            ticker.map((t) => (
              <span key={`${copy}-${t.key}`} className="spot-ticker__item">
                <span className="spot-ticker__star">★</span>
                <b>{t.strong}</b> {t.rest}
              </span>
            )),
          )}
        </div>
      </div>
    </>
  );
}
