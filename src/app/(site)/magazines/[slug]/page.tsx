import type { Metadata } from "next";
import { Suspense } from "react";
import { getSiteText } from "@/lib/data";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbLd, buildMetadata, magazineIssueLd, mergeKeywords } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import MagazineCard from "@/components/magazines/MagazineCard";
import RichParagraphs from "@/components/magazines/RichParagraphs";
import {
  getMagazineEditionBySlug,
  getMagazineEditions,
  getOtherMagazineEditions,
} from "@/lib/data";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const editions = await getMagazineEditions();
  return editions.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const edition = await getMagazineEditionBySlug(slug);
  if (!edition) return { title: "Edition not found | CIO Mogul India", robots: { index: false } };
  return buildMetadata({
    title: edition.seo?.title || `${edition.featuredPersonName} | ${edition.editionLabel}`,
    description: edition.seo?.description || edition.description?.replace(/\*\*/g, "").slice(0, 300) || edition.subtitle || edition.title,
    path: `/magazines/${edition.slug}`,
    image: edition.coverImage,
    imageAlt: edition.coverAlt || edition.title,
    kicker: edition.editionLabel || "Magazine",
    keywords: mergeKeywords(edition.seo?.keywords, [
      edition.featuredPersonName,
      `${edition.featuredPersonName} interview`,
      `${edition.featuredPersonName} cover story`,
      edition.editionLabel,
      `magazine edition ${edition.publishedYear}`,
    ]),
  });
}

async function MagazineDetailPageContent({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const edition = await getMagazineEditionBySlug(slug);
  if (!edition) notFound();
  const t = await getSiteText();

  const others = await getOtherMagazineEditions(slug, 4);
  const hasStory = (edition.storyBody ?? []).some((p) => p.trim());
  // The description next to the cover; older editions fall back to their subtitle.
  const description = edition.description?.trim() || edition.subtitle;

  return (
    <main>
      <JsonLd
        data={[
          magazineIssueLd({
            name: `${edition.featuredPersonName}: ${edition.editionLabel}`,
            description: edition.seo?.description || edition.subtitle || edition.title,
            path: `/magazines/${edition.slug}`,
            image: edition.coverImage,
            year: edition.publishedYear,
            person: edition.featuredPersonName,
          }),
          breadcrumbLd([
            { name: "Magazines", path: "/magazines" },
            { name: edition.featuredPersonName, path: `/magazines/${edition.slug}` },
          ]),
        ]}
      />
      <div className="wrap">
        <Link href="/magazines" className="back-link">
          {t.magazines.backLink}
        </Link>
      </div>

      <section className="section">
        <div className="wrap">
          <div className="ed-hero">
            <div className="ed-hero__cover">
              <Image
                src={edition.coverImage}
                alt={edition.coverAlt}
                width={713}
                height={1009}
                priority
                sizes="(max-width: 900px) 80vw, 360px"
              />
            </div>

            <div>
              <p className="ed-hero__label">{edition.editionLabel}</p>
              <h1 className="ed-hero__title">{edition.title || edition.featuredPersonName}</h1>
              {description && (
                <div className="ed-hero__text">
                  <RichParagraphs paragraphs={description.split(/\n\s*\n/)} />
                </div>
              )}

              {hasStory || edition.pdfUrl ? (
                <div className="ed-hero__actions">
                  {hasStory && (
                    <Link href={`/magazines/${edition.slug}/web`} className="ed-btn ed-btn--solid">
                      {t.magazines.webLive}
                    </Link>
                  )}
                  {edition.pdfUrl && (
                    <a
                      href={`/magazines/${edition.slug}/digital`}
                      target="_blank"
                      rel="noopener"
                      className={`ed-btn ${hasStory ? "ed-btn--line" : "ed-btn--solid"}`}
                    >
                      {t.magazines.digitalLive} <span aria-hidden>↗</span>
                    </a>
                  )}
                </div>
              ) : (
                <p className="ed-hero__soon">{t.magazines.liveSoon}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="mag-more">
            <header className="mag-more__head">
              <h2 className="mag-more__title">{t.magazines.moreTitle}</h2>
              <Link href="/magazines" className="mag-more__view-all">
                {t.magazines.viewArchive}
              </Link>
            </header>
            <div className="mag-grid">
              {others.map((e) => (
                <MagazineCard key={e.slug} edition={e} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Awaiting params suspends, so it runs inside a Suspense boundary. The page
// shell renders immediately and the profile streams in.
export default function MagazineDetailPage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={null}>
      <MagazineDetailPageContent params={params} />
    </Suspense>
  );
}
