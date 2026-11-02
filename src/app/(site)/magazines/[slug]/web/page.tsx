import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import RichParagraphs from "@/components/magazines/RichParagraphs";
import { getMagazineEditionBySlug, getMagazineEditions, getSiteText } from "@/lib/data";
import { breadcrumbLd, buildMetadata, mergeKeywords } from "@/lib/seo";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const editions = await getMagazineEditions();
  return editions.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const edition = await getMagazineEditionBySlug(slug);
  if (!edition || !(edition.storyBody ?? []).some((p) => p.trim())) {
    return { title: "Story not found | CIO Mogul India", robots: { index: false } };
  }
  const title = edition.storyTitle || edition.title;
  return buildMetadata({
    title: `${title} | CIO Mogul India`,
    description: edition.storyIntro || edition.subtitle || edition.title,
    path: `/magazines/${edition.slug}/web`,
    image: edition.storyBanner || edition.coverImage,
    imageAlt: edition.storyBannerAlt || title,
    kicker: "Cover story",
    keywords: mergeKeywords(edition.seo?.keywords, [
      edition.featuredPersonName,
      `${edition.featuredPersonName} cover story`,
      `${edition.featuredPersonName} interview`,
    ]),
  });
}

// Web Live: the cover story of an edition, written out as a web page.
async function WebLiveContent({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const edition = await getMagazineEditionBySlug(slug);
  const story = (edition?.storyBody ?? []).filter((p) => p.trim());
  if (!edition || story.length === 0) notFound();
  const t = await getSiteText();
  const title = edition.storyTitle || edition.title;

  return (
    <main>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            image: edition.storyBanner || edition.coverImage,
            about: { "@type": "Person", name: edition.featuredPersonName },
          },
          breadcrumbLd([
            { name: "Magazines", path: "/magazines" },
            { name: edition.featuredPersonName, path: `/magazines/${edition.slug}` },
            { name: title, path: `/magazines/${edition.slug}/web` },
          ]),
        ]}
      />
      <div className="wrap">
        <Link href={`/magazines/${edition.slug}`} className="back-link">
          {t.magazines.storyBack}
        </Link>
      </div>

      <article className="section">
        <div className="wrap story">
          <h1 className="story__title">{title}</h1>

          {edition.storyBanner && (
            <div className="story__banner">
              <Image
                src={edition.storyBanner}
                alt={edition.storyBannerAlt || title}
                width={1600}
                height={900}
                priority
                sizes="(max-width: 1080px) 100vw, 1000px"
              />
            </div>
          )}

          <div className="story__body">
            {edition.storyIntro && <p className="story__intro">{edition.storyIntro}</p>}
            <RichParagraphs paragraphs={story} />

            <div className="story__end">
              {edition.pdfUrl && (
                <a href={`/magazines/${edition.slug}/digital`} target="_blank" rel="noopener" className="ed-btn ed-btn--solid">
                  {t.magazines.storyDigital} <span aria-hidden>↗</span>
                </a>
              )}
              <Link href={`/magazines/${edition.slug}`} className="ed-btn ed-btn--line">
                {t.magazines.storyBack}
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}

export default function WebLivePage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={null}>
      <WebLiveContent params={params} />
    </Suspense>
  );
}
