import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAdjacentWomenLeaders,
  getWomanLeaderBySlug,
  getWomenLeaders,
} from "@/lib/data";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const all = await getWomenLeaders();
  return all.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const leader = await getWomanLeaderBySlug(slug);
  if (!leader) return { title: "Leader not found — CIO Mogul India" };
  return {
    title: `${leader.name} — Women Spotlight · CIO Mogul India`,
    description: `${leader.role}${leader.organization ? ` · ${leader.organization}` : ""}`,
  };
}

async function LeaderProfilePageContent({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const leader = await getWomanLeaderBySlug(slug);
  if (!leader) notFound();

  const adjacent = await getAdjacentWomenLeaders(slug);

  return (
    <main>
      <div className="wrap">
        <Link href="/women-spotlight" className="back-link">
          Back to Women Spotlight
        </Link>
      </div>

      <article className="ws-profile">
        <div className="wrap">
          <header className="ws-profile__head">
            <h1 className="ws-profile__name">{leader.name}</h1>
            <p className="ws-profile__role">
              {leader.role}
              {leader.organization && <> · <span>{leader.organization}</span></>}
            </p>
            {leader.featuredOn && (
              <p className="ws-profile__meta">Featured · {leader.featuredOn}</p>
            )}
          </header>

          <div className="ws-profile__body">
            <div className="ws-profile__portrait">
              <Image
                src={leader.image}
                alt={leader.name}
                width={600}
                height={720}
                priority
                sizes="(max-width: 820px) 100vw, 420px"
              />
            </div>

            <div className="ws-profile__text">
              {leader.bio && leader.bio.length > 0 ? (
                leader.bio.map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p>Full feature coming soon.</p>
              )}
            </div>
          </div>
        </div>
      </article>

      <nav className="honoree-nav" aria-label="Spotlight navigation">
        <div className="wrap honoree-nav__inner">
          {adjacent.prev ? (
            <Link
              href={`/women-spotlight/${adjacent.prev.slug}`}
              className="honoree-nav__link honoree-nav__link--prev"
            >
              <span className="honoree-nav__dir">← Previous leader</span>
              <span className="honoree-nav__title">{adjacent.prev.name}</span>
            </Link>
          ) : (
            <span />
          )}

          {adjacent.next ? (
            <Link
              href={`/women-spotlight/${adjacent.next.slug}`}
              className="honoree-nav__link honoree-nav__link--next"
            >
              <span className="honoree-nav__dir">Next leader →</span>
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
export default function LeaderProfilePage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={null}>
      <LeaderProfilePageContent params={params} />
    </Suspense>
  );
}
