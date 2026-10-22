import type { Metadata } from "next";
import { Suspense } from "react";
import MagazineCard from "@/components/magazines/MagazineCard";
import MagazineFilters from "@/components/magazines/MagazineFilters";
import Pagination from "@/components/shared/Pagination";
import {
  getMagazineEditions,
  searchMagazineEditions,
  type MagazineSort,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Magazines — CIO Mogul India",
  description:
    "Every edition of CIO Mogul India — cover stories and interviews with India's technology and business leaders.",
};

export default async function MagazinesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // The lead block above the fold doesn't depend on searchParams, so it
  // prerenders statically. The filterable grid is wrapped in <Suspense>
  // because cacheComponents refuses to prerender anything that reads
  // searchParams synchronously.
  const total = (await getMagazineEditions()).length;

  return (
    <main>
      <section className="page-lead">
        <div className="wrap">
          <h1 className="page-lead__title">Every edition, in one place.</h1>
          <p className="page-lead__sub">
            Each issue of CIO Mogul India features the people shaping how
            India&apos;s technology, business and industry work. Browse the
            archive, read a cover story, or revisit an edition.
          </p>
          <dl className="page-lead__meta">
            <div>
              Editions
              <b>{total} published</b>
            </div>
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Suspense fallback={<ArchiveSkeleton />}>
            <ArchiveResults searchParams={searchParams} totalCount={total} />
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
  const sort: MagazineSort = sortRaw === "oldest" ? "oldest" : "newest";
  const pageRaw = sp.get("page");
  const page = pageRaw && /^\d+$/.test(pageRaw) ? Number(pageRaw) : 1;
  return { q, year, sort, page, perPage: 12 };
}

async function ArchiveResults({
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
  const result = await searchMagazineEditions(query);

  return (
    <>
      <MagazineFilters
        years={result.years}
        resultCount={result.total}
        totalCount={totalCount}
      />

      {result.items.length === 0 ? (
        <div className="mag-empty">
          <b>No editions match those filters.</b>
          <p>Try a different year or clear the search.</p>
        </div>
      ) : (
        <>
          <div className="mag-grid">
            {result.items.map((edition, i) => (
              <MagazineCard
                key={edition.slug}
                edition={edition}
                index={(result.page - 1) * result.perPage + i}
              />
            ))}
          </div>
          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            basePath="/magazines"
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
      <p className="mag-filters__count">Loading editions…</p>
    </div>
  );
}
