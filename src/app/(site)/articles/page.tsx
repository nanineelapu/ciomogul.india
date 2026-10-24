import type { Metadata } from "next";
import { Suspense } from "react";
import { getPageContent } from "@/lib/data";
import ArticleCard from "@/components/articles/ArticleCard";
import ArticleSearch from "@/components/articles/ArticleSearch";
import CategoryTabs from "@/components/articles/CategoryTabs";
import Pagination from "@/components/shared/Pagination";
import {
  getCategoriesWithCounts,
  getLatestArticles,
  getTopStoryArticles,
  searchArticles,
  type ArticleSort,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Articles — CIO Mogul India",
  description:
    "Top stories, the latest news, and the full article archive by category.",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Three editor-curated sections above the fold are static-safe — fetched
  // in parallel. The Explore block reads searchParams so it goes inside
  // <Suspense> for the same reason as /magazines.
  const [topStories, latest, categories] = await Promise.all([
    getTopStoryArticles(3),
    getLatestArticles(6),
    getCategoriesWithCounts(),
  ]);

  const page = (await getPageContent()).articles;

  return (
    <main>
      <section className="page-lead page-lead--light">
        <div className="wrap">
          <h1 className="page-lead__title">{page.title}</h1>
          <p className="page-lead__sub">{page.intro}</p>
        </div>
      </section>

      {/* 1 — Top Stories */}
      <section className="section">
        <div className="wrap">
          <header className="section-head">
            <h2 className="section-head__title">Top stories</h2>
            <span className="section-head__rule" aria-hidden />
          </header>
          <div className="article-grid">
            {topStories.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      </section>

      {/* 2 — Latest News */}
      <section className="section">
        <div className="wrap">
          <header className="section-head">
            <h2 className="section-head__title">Latest news</h2>
            <span className="section-head__rule" aria-hidden />
          </header>
          <div className="article-grid">
            {latest.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      </section>

      {/* 3 — Explore by Category */}
      <section className="section explore">
        <div className="wrap">
          <header className="section-head">
            <h2 className="section-head__title">Explore by category</h2>
            <span className="section-head__rule" aria-hidden />
          </header>
          <Suspense fallback={<ExploreSkeleton />}>
            <Explore categories={categories} searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

function parseParams(sp: URLSearchParams) {
  const q = sp.get("q") ?? undefined;
  const category = sp.get("category") ?? undefined;
  const sortRaw = sp.get("sort");
  const sort: ArticleSort = sortRaw === "oldest" ? "oldest" : "newest";
  const pageRaw = sp.get("page");
  const page = pageRaw && /^\d+$/.test(pageRaw) ? Number(pageRaw) : 1;
  return { q, category, sort, page, perPage: 9 };
}

async function Explore({
  categories,
  searchParams,
}: {
  categories: Awaited<ReturnType<typeof getCategoriesWithCounts>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const urlParams = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") urlParams.set(k, v);
    else if (Array.isArray(v) && v[0]) urlParams.set(k, v[0]);
  }

  const query = parseParams(urlParams);
  const result = await searchArticles(query);

  return (
    <>
      <div className="explore__controls">
        <CategoryTabs categories={categories} activeSlug={query.category ?? ""} />
        <ArticleSearch />
      </div>

      {result.items.length === 0 ? (
        <div className="mag-empty">
          <b>No articles match those filters.</b>
          <p>Try a different category or clear the search.</p>
        </div>
      ) : (
        <>
          <div className="article-grid">
            {result.items.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            basePath="/articles"
            params={urlParams}
          />
        </>
      )}
    </>
  );
}

function ExploreSkeleton() {
  return (
    <div className="explore__controls">
      <div className="cat-tabs" aria-hidden>
        <span className="cat-tabs__tab is-active"><span>Loading…</span></span>
      </div>
    </div>
  );
}
