import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getSiteText } from "@/lib/data";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbLd, pageLd } from "@/lib/seo";
import { getPageContent } from "@/lib/data";
import MagazineCard from "@/components/magazines/MagazineCard";
import MagazineFilters from "@/components/magazines/MagazineFilters";
import Pagination from "@/components/shared/Pagination";
import {
  getMagazineEditions,
  searchMagazineEditions,
  type MagazineSort,
} from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const page = (await getPageContent()).magazines;
  return buildMetadata({
    title: page.title,
    description: page.intro,
    path: "/magazines",
    keywords: ["CIO Mogul India magazine editions","magazine archive","cover stories","digital magazine editions","read magazine online","monthly business magazine India"],
  });
}

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

  const page = (await getPageContent()).magazines;

  return (
    <main>
      <JsonLd data={[pageLd("CollectionPage", { name: page.title, description: page.intro, path: "/magazines" }), breadcrumbLd([{ name: page.title, path: "/magazines" }])]} />
      <section className="page-lead">
        <div className="wrap">
          <h1 className="page-lead__title">{page.title}</h1>
          <p className="page-lead__sub">{page.intro}</p>
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

      {/* Simple closing block: one line of copy and two theme buttons.
          Uses the site's existing .btn / .btn-ink / .btn-line classes so it
          follows the theme automatically. */}
      <section
        aria-label="End of the magazine archive"
        className="pt-6 pb-10"
        style={{ borderTop: "1px solid var(--color-rule-soft)" }}
      >
        <div
          className="wrap"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 14,
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-ui)",
              fontSize: 15,
              color: "var(--color-ink-2)",
            }}
          >
            That is the full archive. A new edition releases every week.
          </p>
          <div
            style={{
              display: "inline-flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <Link href="/podcasts" className="btn btn-ink btn-sm">
              Listen on the podcast
            </Link>
            <Link href="/contact" className="btn btn-line btn-sm">
              Nominate a leader
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
  const t = await getSiteText();

  return (
    <>
      {totalCount > 8 && (
        <MagazineFilters
          years={result.years}
          resultCount={result.total}
          totalCount={totalCount}
          text={t.magazines}
        />
      )}

      {result.items.length === 0 ? (
        <div className="mag-empty">
          <b>{t.magazines.noResultsTitle}</b>
          <p>{t.magazines.noResultsText}</p>
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
