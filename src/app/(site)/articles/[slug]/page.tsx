import type { Metadata } from "next";
import { Suspense } from "react";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbLd, buildMetadata, mergeKeywords, newsArticleLd } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/articles/ArticleCard";
import MoreBlock from "@/components/shared/MoreBlock";
import {
  getArticleBySlug,
  getArticles,
  getRelatedArticles,
} from "@/lib/data";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const all = await getArticles();
  return all.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found | CIO Mogul India", robots: { index: false } };
  return buildMetadata({
    title: article.seo?.title || article.title,
    description: article.seo?.description || article.excerpt,
    path: `/articles/${article.slug}`,
    image: article.image,
    imageAlt: article.alt || article.title,
    keywords: mergeKeywords(article.seo?.keywords, [
      article.category,
      `${article.category} news India`,
      `${article.category} articles`,
      article.author,
    ]),
    type: "article",
    publishedTime: article.isoDate,
    authors: article.author ? [article.author] : undefined,
    section: article.category,
  });
}

async function ArticleContent({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(slug, 4);

  return (
    <main>
      <JsonLd
        data={[
          newsArticleLd({
            title: article.title,
            description: article.seo?.description || article.excerpt,
            path: `/articles/${article.slug}`,
            image: article.image,
            isoDate: article.isoDate,
            author: article.author,
            section: article.category,
            keywords: mergeKeywords(article.seo?.keywords, [article.category]),
          }),
          breadcrumbLd([
            { name: "Articles", path: "/articles" },
            { name: article.title, path: `/articles/${article.slug}` },
          ]),
        ]}
      />
      <div className="wrap">
        <Link href="/articles" className="back-link">
          Back to Articles
        </Link>
      </div>

      <article className="article-page">
        <div className="wrap">
          <header className="article-page__head">
            <p className="article-page__kicker">{article.category}</p>
            <h1 className="article-page__title">{article.title}</h1>
            <p className="article-page__meta">
              {article.author && <span>{article.author}</span>}
              <span>{article.date}</span>
              {article.readTime && <span>{article.readTime}</span>}
            </p>
          </header>

          <div className="article-page__hero">
            <Image
              src={article.image}
              alt={article.alt || article.title}
              width={1280}
              height={720}
              priority
              sizes="(max-width: 900px) 100vw, 900px"
            />
          </div>

          <div className="article-page__body">
            {article.excerpt && <p className="article-page__lead">{article.excerpt}</p>}
            {(article.body ?? []).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <MoreBlock title="More articles" viewAll={{ label: "View all", href: "/articles" }}>
          {related.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </MoreBlock>
      )}
    </main>
  );
}

// Awaiting params suspends, so the page body runs inside a Suspense boundary.
export default function ArticlePage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={null}>
      <ArticleContent params={params} />
    </Suspense>
  );
}
