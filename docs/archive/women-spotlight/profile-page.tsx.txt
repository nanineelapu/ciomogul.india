import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import LeaderCard from "@/components/womenSpotlight/LeaderCard";
import MoreBlock from "@/components/shared/MoreBlock";
import {
  getOtherWomenLeaders,
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
  if (!leader) return { title: "Not found — CIO Mogul India" };
  return {
    title: `${leader.name} — Women Spotlight · CIO Mogul India`,
    description: `${leader.role}${leader.organization ? ` · ${leader.organization}` : ""}`,
  };
}

async function LeaderProfileContent({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const leader = await getWomanLeaderBySlug(slug);
  if (!leader) notFound();

  const others = await getOtherWomenLeaders(slug, 4);

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
                sizes="(max-width: 900px) 100vw, 420px"
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

      {others.length > 0 && (
        <MoreBlock title="More leaders" viewAll={{ label: "View all", href: "/women-spotlight" }}>
          {others.map((o) => (
            <LeaderCard key={o.slug} leader={o} />
          ))}
        </MoreBlock>
      )}
    </main>
  );
}

// Awaiting params suspends, so the page body runs inside a Suspense boundary.
export default function LeaderProfilePage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={null}>
      <LeaderProfileContent params={params} />
    </Suspense>
  );
}
