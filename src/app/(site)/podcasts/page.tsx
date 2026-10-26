import type { Metadata } from "next";
import { Suspense } from "react";
import { getSiteText } from "@/lib/data";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbLd, collectionLd, pageLd } from "@/lib/seo";
import { getPageContent } from "@/lib/data";
import PodcastCard from "@/components/podcasts/PodcastCard";
import PodcastFilters from "@/components/podcasts/PodcastFilters";
import PodcastPlayerModal from "@/components/podcasts/PodcastPlayerModal";
import Pagination from "@/components/shared/Pagination";
import {
  getPodcasts,
  searchPodcasts,
  type PodcastSort,
} from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const page = (await getPageContent()).podcasts;
  return buildMetadata({
    title: page.title,
    description: page.intro,
    seo: page.seo,
    kicker: "Watch and listen",
    path: "/podcasts",
    keywords: ["technology podcast India","leadership podcast","CIO interviews podcast","business podcast India","founder interviews","watch podcast episodes"],
  });
}

export default async function PodcastsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // The lead block above the fold is static-safe. The archive section reads
  // searchParams, so it goes inside <Suspense> — same pattern as /magazines.
  const allPodcasts = await getPodcasts();
  const totalEpisodes = allPodcasts.length;
  const t = await getSiteText();

  const page = (await getPageContent()).podcasts;

  return (
    <main>
      <JsonLd data={[pageLd("CollectionPage", { name: page.title, description: page.intro, path: "/podcasts" }), breadcrumbLd([{ name: page.title, path: "/podcasts" }]), collectionLd({ name: page.title, path: "/podcasts", items: allPodcasts.map((p) => ({ name: p.title, url: p.youtubeUrl, image: p.thumbnail, description: p.description })) })]} />
      <section className="page-lead">
        <div className="wrap">
          <h1 className="page-lead__title">{page.title}</h1>
          <p className="page-lead__sub">{page.intro}</p>
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
        <PodcastPlayerModal podcasts={allPodcasts} text={t.podcasts} />
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
  const t = await getSiteText();

  return (
    <>
      {totalCount > 8 && (
        <PodcastFilters
          years={result.years}
          resultCount={result.total}
          totalCount={totalCount}
          text={t.podcasts}
        />
      )}

      {result.items.length === 0 ? (
        <div className="mag-empty">
          <b>{t.podcasts.noResultsTitle}</b>
          <p>{t.podcasts.noResultsText}</p>
        </div>
      ) : (
        <>
          <div className="pod-grid">
            {result.items.map((podcast, i) => (
              <PodcastCard
                key={podcast.slug}
                podcast={podcast}
                text={t.podcasts}
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
