import type { Metadata } from "next";
import { Suspense } from "react";
import { getSiteText } from "@/lib/data";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbLd, collectionLd, pageLd } from "@/lib/seo";
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

export async function generateMetadata(): Promise<Metadata> {
  const page = (await getPageContent()).articles;
  return buildMetadata({
    title: page.title,
    description: page.intro,
    seo: page.seo,
    kicker: "News and analysis",
    path: "/articles",
    keywords: ["technology news India","business news India","startup news India","cybersecurity news India","AI news India","policy news India","healthcare technology news","leadership articles"],
  });
}

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
  const t = await getSiteText();

  return (
    <main>
      <JsonLd data={[pageLd("CollectionPage", { name: page.title, description: page.intro, path: "/articles" }), breadcrumbLd([{ name: page.title, path: "/articles" }]), collectionLd({ name: page.title, path: "/articles", items: [...topStories, ...latest].filter((a, i, list) => list.findIndex((b) => b.slug === a.slug) === i).map((a) => ({ name: a.title, url: `/articles/${a.slug}`, image: a.image, description: a.excerpt })) })]} />
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
            <h2 className="section-head__title">{t.articles.topTitle}</h2>
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
            <h2 className="section-head__title">{t.articles.latestTitle}</h2>
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
            <h2 className="section-head__title">{t.articles.exploreTitle}</h2>
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
  const t = await getSiteText();

  return (
    <>
      <div className="explore__controls">
        <CategoryTabs categories={categories} activeSlug={query.category ?? ""} />
        <ArticleSearch text={t.articles} />
      </div>

      {result.items.length === 0 ? (
        <div className="mag-empty">
          <b>{t.articles.noResultsTitle}</b>
          <p>{t.articles.noResultsText}</p>
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
