import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import ArticleCard from "@/components/articles/ArticleCard";
import { getIndustries, getIndustryArticles, getIndustryBySlug, getPageContent, getSiteText } from "@/lib/data";
import { breadcrumbLd, buildMetadata, collectionLd, mergeKeywords, pageLd } from "@/lib/seo";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return (await getIndustries()).map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const [industry, content] = await Promise.all([getIndustryBySlug(slug), getPageContent()]);
  if (!industry) return { title: "Not found | CIO Mogul India", robots: { index: false } };
  return buildMetadata({
    title: `${industry.name} leaders and stories`,
    description: industry.intro || industry.description,
    path: `/industries/${industry.slug}`,
    seo: industry.seo,
    kicker: content.industries.title,
    keywords: mergeKeywords(industry.seo?.keywords, [`${industry.name} India`, `${industry.name} leaders India`, `${industry.name} news India`]),
  });
}

async function IndustryContent({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);
  if (!industry) notFound();

  const [articles, all, t, content] = await Promise.all([getIndustryArticles(industry), getIndustries(), getSiteText(), getPageContent()]);
  const others = all.filter((i) => i.slug !== industry.slug);
  const path = `/industries/${industry.slug}`;

  return (
    <main>
      <JsonLd
        data={[
          pageLd("CollectionPage", { name: industry.name, description: industry.intro || industry.description, path }),
          breadcrumbLd([
            { name: content.industries.title, path: "/industries" },
            { name: industry.name, path },
          ]),
          collectionLd({
            name: `${industry.name} stories`,
            path,
            items: articles.map((a) => ({ name: a.title, url: `/articles/${a.slug}`, image: a.image, description: a.excerpt })),
          }),
        ]}
      />
      <div className="wrap">
        <Link href="/industries" className="back-link">{t.industries.backLink}</Link>
      </div>

      <section className="page-lead page-lead--light">
        <div className="wrap">
          <h1 className="page-lead__title">{industry.name}</h1>
          <p className="page-lead__sub">{industry.intro || industry.description}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <header className="section-head">
            <h2 className="section-head__title">{t.industries.storiesTitle}</h2>
            <span className="section-head__rule" aria-hidden />
          </header>
          {articles.length ? (
            <div className="article-grid">
              {articles.map((a) => <ArticleCard key={a.slug} article={a} />)}
            </div>
          ) : (
            <div className="mag-empty">
              <b>{t.industries.emptyTitle}</b>
              <p>{t.industries.emptyText}</p>
              <p style={{ marginTop: 16 }}>
                <Link href="/articles" className="btn btn-line btn-sm">{t.industries.emptyButton}</Link>
              </p>
            </div>
          )}
        </div>
      </section>

      {others.length > 0 && (
        <section className="section ind-others">
          <div className="wrap">
            <header className="section-head">
              <h2 className="section-head__title">{t.industries.otherTitle}</h2>
              <span className="section-head__rule" aria-hidden />
            </header>
            <ul className="ind-chips">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/industries/${o.slug}`} className="ind-chip">{o.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}

// Awaiting params suspends, so the page body runs inside a Suspense boundary.
export default function IndustryPage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={null}>
      <IndustryContent params={params} />
    </Suspense>
  );
}
