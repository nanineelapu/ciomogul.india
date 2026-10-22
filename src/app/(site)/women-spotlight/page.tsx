import type { Metadata } from "next";
import { Suspense } from "react";
import LeaderCard from "@/components/womenSpotlight/LeaderCard";
import LeaderFilters from "@/components/womenSpotlight/LeaderFilters";
import Pagination from "@/components/shared/Pagination";
import {
  getWomenLeaders,
  searchWomenLeaders,
  type WomenSort,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Women Spotlight — CIO Mogul India",
  description:
    "The women leaders CIO Mogul India has featured — a continuing editorial record.",
};

export default async function WomenSpotlightPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const total = (await getWomenLeaders()).length;

  return (
    <main>
      <section className="page-lead page-lead--light">
        <div className="wrap">
          <h1 className="page-lead__title">Women Spotlight</h1>
          <p className="page-lead__sub">
            The women leaders we have featured in CIO Mogul India.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Suspense fallback={<ArchiveSkeleton />}>
            <LeadersGrid searchParams={searchParams} totalCount={total} />
          </Suspense>
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
  const sort: WomenSort = sortRaw === "oldest" ? "oldest" : "newest";
  const pageRaw = sp.get("page");
  const page = pageRaw && /^\d+$/.test(pageRaw) ? Number(pageRaw) : 1;
  return { q, year, sort, page, perPage: 12 };
}

async function LeadersGrid({
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
  const result = await searchWomenLeaders(query);

  return (
    <>
      {totalCount > 8 && (
        <LeaderFilters
          years={result.years}
          resultCount={result.total}
          totalCount={totalCount}
        />
      )}

      {result.items.length === 0 ? (
        <div className="mag-empty">
          <b>No leaders match those filters.</b>
          <p>Try a different year or clear the search.</p>
        </div>
      ) : (
        <>
          <div className="ws-grid">
            {result.items.map((leader) => (
              <LeaderCard key={leader.slug} leader={leader} />
            ))}
          </div>
          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            basePath="/women-spotlight"
            params={urlParams}
          />
        </>
      )}
    </>
  );
}

function ArchiveSkeleton() {
  return (
    <div className="mag-filters">
      <div className="mag-filters__row" aria-hidden>
        <div className="mag-filters__search">
          <input type="search" placeholder="Loading…" disabled />
        </div>
      </div>
      <p className="mag-filters__count">Loading leaders…</p>
    </div>
  );
}
