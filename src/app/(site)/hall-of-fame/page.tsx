import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbLd, pageLd } from "@/lib/seo";
import { getPageContent } from "@/lib/data";
import { Suspense } from "react";
import HallEntry from "@/components/hallOfFame/HallEntry";
import HallFilters from "@/components/hallOfFame/HallFilters";
import Pagination from "@/components/shared/Pagination";
import { getHallOfFame, searchHallOfFame, type HallSort } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const page = (await getPageContent()).hallOfFame;
  return buildMetadata({
    title: page.title,
    description: page.intro,
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

  return (
    <main>
      <JsonLd data={[pageLd("CollectionPage", { name: page.title, description: page.intro, path: "/hall-of-fame" }), breadcrumbLd([{ name: page.title, path: "/hall-of-fame" }])]} />
      <section className="page-lead">
        <div className="wrap">
          <h1 className="page-lead__title">{page.title}</h1>
          <p className="page-lead__sub">{page.intro}</p>
          <dl className="page-lead__meta">
            <div>
              Inductees
              <b>{totalInductees} on the roll</b>
            </div>
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Suspense fallback={<RollSkeleton />}>
            <HallRoll searchParams={searchParams} totalCount={totalInductees} />
          </Suspense>
        </div>
      </section>

      <section className="hall-apply" aria-labelledby="apply-title">
        <div className="wrap hall-apply__inner">
          <div className="hall-apply__text">
            <span className="page-lead__eyebrow" style={{ color: "#fff", borderColor: "#fff" }}>
              Apply
            </span>
            <h2 className="hall-apply__title" id="apply-title">
              Think you belong on the roll?
            </h2>
            <p>
              We add new inductees with every edition. If your work meets the
              editorial bar, our team will be in touch within a week.
            </p>
          </div>
          <div className="hall-apply__actions">
            <Link href="/contact" className="btn btn-paper">
              Nominate yourself
            </Link>
            <Link href="/about" className="hall-apply__link">
              Editorial guidelines →
            </Link>
          </div>
        </div>
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
  const pageRaw = sp.get("page");
  const page = pageRaw && /^\d+$/.test(pageRaw) ? Number(pageRaw) : 1;
  return { q, year, sort, page, perPage: 10 };
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

  return (
    <>
      {totalCount > 8 && (
        <HallFilters
          years={result.years}
          resultCount={result.total}
          totalCount={totalCount}
        />
      )}

      {result.items.length === 0 ? (
        <div className="mag-empty">
          <b>No inductees match those filters.</b>
          <p>Try a different year or clear the search.</p>
        </div>
      ) : (
        <>
          <ol className="hall-roll">
            {result.items.map((entry, i) => (
              <li key={entry.slug}>
                <HallEntry entry={entry} side={i % 2 === 0 ? "left" : "right"} />
              </li>
            ))}
          </ol>
          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            basePath="/hall-of-fame"
            params={urlParams}
          />
        </>
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
