import type { Metadata } from "next";
import { Suspense } from "react";
import { getSiteText } from "@/lib/data";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbLd, buildMetadata, mergeKeywords, profileLd } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import HallCard from "@/components/hallOfFame/HallCard";
import MoreBlock from "@/components/shared/MoreBlock";
import {
  getHallEntryBySlug,
  getHallOfFame,
  getOtherHallEntries,
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
  if (!entry) return { title: "Not found | CIO Mogul India", robots: { index: false } };
  const about = [entry.role, entry.organization].filter(Boolean).join(", ");
  return buildMetadata({
    title: entry.seo?.title || `${entry.name}, Hall of Fame`,
    description: entry.seo?.description || entry.pullQuote || `${entry.name}${about ? `, ${about}` : ""}, inducted into the CIO Mogul India Hall of Fame.`,
    path: `/hall-of-fame/${entry.slug}`,
    image: entry.portrait,
    imageAlt: entry.name,
    keywords: mergeKeywords(entry.seo?.keywords, [
      entry.name,
      `${entry.name} profile`,
      entry.organization,
      entry.role,
      "Hall of Fame",
    ]),
    type: "profile",
  });
}

async function HallProfileContent({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const entry = await getHallEntryBySlug(slug);
  if (!entry) notFound();
  const t = await getSiteText();

  const others = await getOtherHallEntries(slug, 4);

  return (
    <main>
      <JsonLd
        data={[
          profileLd({
            name: entry.name,
            role: entry.role,
            organization: entry.organization,
            description: entry.seo?.description || entry.pullQuote || entry.name,
            path: `/hall-of-fame/${entry.slug}`,
            image: entry.portrait,
          }),
          breadcrumbLd([
            { name: "Hall of Fame", path: "/hall-of-fame" },
            { name: entry.name, path: `/hall-of-fame/${entry.slug}` },
          ]),
        ]}
      />
      <div className="wrap">
        <Link href="/hall-of-fame" className="back-link">
          {t.hallOfFame.backLink}
        </Link>
      </div>

      <article className="ws-profile">
        <div className="wrap">
          <header className="ws-profile__head">
            <h1 className="ws-profile__name">{entry.name}</h1>
            <p className="ws-profile__role">
              {entry.role}
              {entry.organization && <> · <span>{entry.organization}</span></>}
            </p>
            <p className="ws-profile__meta">{t.hallOfFame.inducted} · {entry.inductedOn}</p>
          </header>

          <div className="ws-profile__body">
            <div className="ws-profile__portrait ws-profile__portrait--cover">
              <Image
                src={entry.portrait}
                alt={entry.name}
                width={713}
                height={1009}
                priority
                sizes="(max-width: 900px) 100vw, 420px"
              />
            </div>

            <div className="ws-profile__text">
              {entry.pullQuote && <p className="ws-profile__quote">{entry.pullQuote}</p>}
              {entry.profileBody.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {entry.editionSlug && (
                <Link href={`/magazines/${entry.editionSlug}`} className="hall-entry__cta">
                  {t.hallOfFame.readEdition}
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>

      {others.length > 0 && (
        <MoreBlock title={t.hallOfFame.moreTitle} viewAll={{ label: t.hallOfFame.viewAll, href: "/hall-of-fame" }}>
          {others.map((o) => (
            <HallCard key={o.slug} entry={o} />
          ))}
        </MoreBlock>
      )}
    </main>
  );
}

// Awaiting params suspends, so the page body runs inside a Suspense boundary.
export default function HallHonoreePage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={null}>
      <HallProfileContent params={params} />
    </Suspense>
  );
}
