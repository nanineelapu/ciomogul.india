import type { Metadata } from "next";
import { Suspense } from "react";
import { getSiteText } from "@/lib/data";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbLd, buildMetadata, magazineIssueLd, mergeKeywords } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import MagazineCard from "@/components/magazines/MagazineCard";
import PdfViewer from "@/components/magazines/PdfViewerLoader";
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
    description: edition.seo?.description || edition.subtitle || edition.title,
    path: `/magazines/${edition.slug}`,
    image: edition.coverImage,
    imageAlt: edition.coverAlt || edition.title,
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
          <div className="mag-hero">
            <div className="mag-hero__cover">
              <Image
                src={edition.coverImage}
                alt={edition.coverAlt}
                width={713}
                height={1009}
                priority
                sizes="(max-width: 820px) 100vw, (max-width: 1080px) 300px, 360px"
              />
            </div>

            <div className="mag-hero__side">
              <p className="mag-hero__eyebrow">{edition.editionLabel}</p>
              <h1 className="mag-hero__name">{edition.featuredPersonName}</h1>
              <div className="mag-hero__rule" aria-hidden />
              {edition.title && <p className="mag-hero__title">{edition.title}</p>}
              {edition.subtitle && <p className="mag-hero__sub">{edition.subtitle}</p>}

              {edition.roleTags.length > 0 && (
                <ul className="mag-hero__meta" aria-label="About the featured leader">
                  {edition.roleTags.slice(0, 3).map((tag) => (
                    <li key={tag} className="mag-hero__meta-item">{tag}</li>
                  ))}
                </ul>
              )}

              <div className="mag-hero__actions">
                <a href="#read" className="btn btn-ink">
                  {t.magazines.readButton} <span aria-hidden>↓</span>
                </a>
                {edition.pdfUrl ? (
                  <a href={edition.pdfUrl} download className="btn btn-line">
                    {t.magazines.downloadButton}
                  </a>
                ) : (
                  <Link href="/magazines" className="btn btn-line">
                    {t.magazines.exploreMore}
                  </Link>
                )}
              </div>

              <p className="mag-hero__hint">
                <span aria-hidden>↓</span>
                {edition.pdfUrl ? t.magazines.scrollToRead : t.magazines.pdfSoon}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* "Inside this edition" removed per client request — the PDF reader
          below is the content. */}

      <section id="read">
        <div className="wrap">
          <div className="mag-pdf">
            <header className="mag-pdf__head">
              <h2 className="mag-pdf__title">{t.magazines.readerTitle}</h2>
              <span className="mag-pdf__hint">
                {edition.pdfUrl ? t.magazines.readerHint : t.magazines.readerSoon}
              </span>
            </header>
            {edition.pdfUrl ? (
              <PdfViewer
                file={edition.pdfUrl}
                title={`${edition.featuredPersonName} — ${edition.editionLabel}`}
              />
            ) : (
              <div className="mag-pdf__frame">
                <div className="mag-pdf__placeholder" role="status">
                  <div className="mag-pdf__placeholder-inner">
                    <b>{t.magazines.readerPlaceholderTitle}</b>
                    <p>
                      {t.magazines.readerPlaceholderText}
                    </p>
                  </div>
                </div>
              </div>
            )}
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
