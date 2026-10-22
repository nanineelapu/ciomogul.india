import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAdjacentHallEntries,
  getHallEntryBySlug,
  getHallOfFame,
  getMagazineEditionBySlug,
} from "@/lib/data";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const roll = await getHallOfFame();
  return roll.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getHallEntryBySlug(slug);
  if (!entry) return { title: "Honoree not found — CIO Mogul India" };
  return {
    title: `${entry.name} — Hall of Fame · CIO Mogul India`,
    description: entry.pullQuote,
  };
}

async function HallHonoreePageContent({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const entry = await getHallEntryBySlug(slug);
  if (!entry) notFound();

  // Pull the linked magazine edition in parallel with the prev/next lookup
  // so the page assembles in one round of awaits.
  const [edition, adjacent] = await Promise.all([
    getMagazineEditionBySlug(entry.editionSlug),
    getAdjacentHallEntries(slug),
  ]);

  return (
    <main>
      <div className="wrap">
        <Link href="/hall-of-fame" className="back-link">
          Back to Hall of Fame
        </Link>
      </div>

      <article className="honoree">
        <div className="wrap">
          <header className="honoree__head">
            <span className="honoree__chip">
              <span>N° {String(entry.serial).padStart(3, "0")}</span>
              <span className="honoree__chip-sep" aria-hidden>·</span>
              <span>Inducted {entry.inductedOn}</span>
            </span>

            <h1 className="honoree__name">{entry.name}</h1>
            <p className="honoree__role">
              {entry.role}
              {entry.organization && <> · <span>{entry.organization}</span></>}
            </p>
          </header>

          <div className="honoree__body">
            <div className="honoree__portrait">
              <Image
                src={entry.portrait}
                alt={entry.name}
                width={713}
                height={1009}
                priority
                sizes="(max-width: 820px) 100vw, 440px"
              />
            </div>

            <div className="honoree__text">
              <blockquote className="honoree__quote">
                {entry.pullQuote}
              </blockquote>

              <section
                className="honoree__about"
                aria-labelledby="about-induction"
              >
                <h2 id="about-induction" className="honoree__h2">
                  About the induction
                  <span aria-hidden />
                </h2>
                {entry.profileBody.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </section>
            </div>
          </div>

          {edition && (
            <section
              className="honoree__edition"
              aria-labelledby="their-edition"
            >
              <h2 id="their-edition" className="honoree__h2">
                Their cover edition
                <span aria-hidden />
              </h2>

              <Link
                href={`/magazines/${edition.slug}`}
                className="honoree__ed-card"
              >
                <span className="honoree__ed-cover">
                  <Image
                    src={edition.coverImage}
                    alt={edition.coverAlt}
                    width={713}
                    height={1009}
                    sizes="(max-width: 820px) 40vw, 180px"
                  />
                </span>
                <span className="honoree__ed-meta">
                  <span className="honoree__ed-kicker">
                    {edition.editionLabel}
                  </span>
                  <span className="honoree__ed-title">{edition.title}</span>
                  <span className="honoree__ed-sub">{edition.subtitle}</span>
                  <span className="honoree__ed-cta">Read the edition</span>
                </span>
              </Link>
            </section>
          )}
        </div>
      </article>

      <nav className="honoree-nav" aria-label="Roll navigation">
        <div className="wrap honoree-nav__inner">
          {adjacent.prev ? (
            <Link
              href={`/hall-of-fame/${adjacent.prev.slug}`}
              className="honoree-nav__link honoree-nav__link--prev"
            >
              <span className="honoree-nav__dir">← Previous inductee</span>
              <span className="honoree-nav__title">{adjacent.prev.name}</span>
            </Link>
          ) : (
            <span />
          )}

          {adjacent.next ? (
            <Link
              href={`/hall-of-fame/${adjacent.next.slug}`}
              className="honoree-nav__link honoree-nav__link--next"
            >
              <span className="honoree-nav__dir">Next inductee →</span>
              <span className="honoree-nav__title">{adjacent.next.name}</span>
            </Link>
          ) : (
            <span />
          )}
        </div>
      </nav>
    </main>
  );
}

// Awaiting params suspends, so it runs inside a Suspense boundary. The page
// shell renders immediately and the profile streams in.
export default function HallHonoreePage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={null}>
      <HallHonoreePageContent params={params} />
    </Suspense>
  );
}
