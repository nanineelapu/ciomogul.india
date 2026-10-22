import type { Metadata } from "next";
import { Suspense } from "react";
import PodcastCard from "@/components/podcasts/PodcastCard";
import PodcastFilters from "@/components/podcasts/PodcastFilters";
import PodcastPlayerModal from "@/components/podcasts/PodcastPlayerModal";
import Pagination from "@/components/shared/Pagination";
import {
  getPodcasts,
  searchPodcasts,
  type PodcastSort,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Podcasts — CIO Mogul India",
  description:
    "Conversations with India's technology and business leaders — long-form interviews, every month.",
};

export default async function PodcastsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // The lead block above the fold is static-safe. The archive section reads
  // searchParams, so it goes inside <Suspense> — same pattern as /magazines.
  const allPodcasts = await getPodcasts();
  const totalEpisodes = allPodcasts.length;

  return (
    <main>
      <section className="page-lead">
        <div className="wrap">
          <h1 className="page-lead__title">Podcasts</h1>
          <p className="page-lead__sub">
            Long-form interviews with CIOs, founders, operators and the
            thinkers whose work ends up in the magazine. Every episode is
            free, archived here, and lives on YouTube.
          </p>
          <dl className="page-lead__meta">
            <div>
              Episodes
              <b>{totalEpisodes} published</b>
            </div>
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Suspense fallback={<ArchiveSkeleton />}>
            <PodcastResults searchParams={searchParams} totalCount={totalEpisodes} />
          </Suspense>
        </div>
      </section>

      {/* Mounted at page level so any card on this page can open it. The modal
          itself reads ?watch=<slug> from the URL and renders when set. */}
      <Suspense fallback={null}>
        <PodcastPlayerModal podcasts={allPodcasts} />
      </Suspense>
    </main>
  );
}

function parseParams(sp: URLSearchParams) {
  const q = sp.get("q") ?? undefined;
  const yearRaw = sp.get("year");
  const year = yearRaw && /^\d{4}$/.test(yearRaw) ? Number(yearRaw) : undefined;
  const sortRaw = sp.get("sort");
  const sort: PodcastSort = sortRaw === "oldest" ? "oldest" : "newest";
  const pageRaw = sp.get("page");
  const page = pageRaw && /^\d+$/.test(pageRaw) ? Number(pageRaw) : 1;
  return { q, year, sort, page, perPage: 9 };
}

async function PodcastResults({
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
  const result = await searchPodcasts(query);

  return (
    <>
      <PodcastFilters
        years={result.years}
        resultCount={result.total}
        totalCount={totalCount}
      />

      {result.items.length === 0 ? (
        <div className="mag-empty">
          <b>No episodes match those filters.</b>
          <p>Try a different year or clear the search.</p>
        </div>
      ) : (
        <>
          <div className="pod-grid">
            {result.items.map((podcast, i) => (
              <PodcastCard
                key={podcast.slug}
                podcast={podcast}
                index={(result.page - 1) * result.perPage + i}
              />
            ))}
          </div>
          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            basePath="/podcasts"
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
      <p className="mag-filters__count">Loading episodes…</p>
    </div>
  );
}
