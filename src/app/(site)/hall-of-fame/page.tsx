import type { Metadata } from "next";
import { getSiteText } from "@/lib/data";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbLd, collectionLd, pageLd } from "@/lib/seo";
import { getPageContent } from "@/lib/data";
import { Suspense } from "react";
import HallFilters from "@/components/hallOfFame/HallFilters";
import HallStage from "@/components/hallOfFame/HallStage";
import { getHallOfFame, searchHallOfFame, type HallSort } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const page = (await getPageContent()).hallOfFame;
  return buildMetadata({
    title: page.title,
    description: page.intro,
    seo: page.seo,
    kicker: "Roll of honour",
    path: "/hall-of-fame",
    keywords: ["Hall of Fame","top technology leaders in India","India's best CIOs","cover story honorees","industry leaders hall of fame","leadership recognition India"],
  });
}

export default async function HallOfFamePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Lead block is static; the roll depends on searchParams and streams in.
  const all = await getHallOfFame();
  const totalInductees = all.length;

  const page = (await getPageContent()).hallOfFame;
  const t = await getSiteText();

  return (
    <main>
      <JsonLd data={[pageLd("CollectionPage", { name: page.title, description: page.intro, path: "/hall-of-fame" }), breadcrumbLd([{ name: page.title, path: "/hall-of-fame" }]), collectionLd({ name: page.title, path: "/hall-of-fame", items: all.map((e) => ({ name: e.name, url: `/hall-of-fame/${e.slug}`, image: e.portrait })) })]} />
      {/* the page heading, kept for search engines and screen readers only */}
      <h1 className="sr-only">{page.title}</h1>

      <section className="hof-roll">
        <Suspense fallback={<RollSkeleton />}>
          <HallRoll searchParams={searchParams} totalCount={totalInductees} />
        </Suspense>
      </section>
    </main>
  );
}

function parseParams(sp: URLSearchParams) {
  const q = sp.get("q") ?? undefined;
  const yearRaw = sp.get("year");
  const year = yearRaw && /^\d{4}$/.test(yearRaw) ? Number(yearRaw) : undefined;
  const sortRaw = sp.get("sort");
  const sort: HallSort = sortRaw === "oldest" ? "oldest" : "newest";
  // Carousel shows every match in one strip — no page slicing. A large perPage
  // keeps using the existing search helper without changing its signature.
  return { q, year, sort, page: 1, perPage: 500 };
}

async function HallRoll({
  searchParams,
  totalCount,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  totalCount: number;
}) {
  const sp = await searchParams;
  const urlParams = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") urlParams.set(k, v);
    else if (Array.isArray(v) && v[0]) urlParams.set(k, v[0]);
  }

  const query = parseParams(urlParams);
  const result = await searchHallOfFame(query);
  const t = await getSiteText();

  return (
    <>
      {totalCount > 8 && (
        <div className="wrap">
          <HallFilters
            years={result.years}
            resultCount={result.total}
            totalCount={totalCount}
            text={t.hallOfFame}
          />
        </div>
      )}

      {result.items.length === 0 ? (
        <div className="wrap">
          <div className="mag-empty">
            <b>{t.hallOfFame.noResultsTitle}</b>
            <p>{t.hallOfFame.noResultsText}</p>
          </div>
        </div>
      ) : (
        <HallStage
          entries={result.items}
          text={t.hallOfFame}
          digitalLabel={t.magazines.digitalLive}
          prevLabel={t.general.paginationPrev}
          nextLabel={t.general.paginationNext}
        />
      )}
    </>
  );
}

function RollSkeleton() {
  return (
    <div className="mag-filters">
      <div className="mag-filters__row" aria-hidden>
        <div className="mag-filters__search">
          <input type="search" placeholder="Loading…" disabled />
        </div>
      </div>
      <p className="mag-filters__count">Loading the roll…</p>
    </div>
  );
}
