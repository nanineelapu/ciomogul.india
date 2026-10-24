import type { Metadata } from "next";
import { Suspense } from "react";
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
          Back to magazines
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
                sizes="(max-width: 820px) 100vw, (max-width: 1080px) 360px, 440px"
              />
            </div>

            <div className="mag-hero__side">
              <span className="page-lead__eyebrow">{edition.editionLabel}</span>
              <h1 className="page-lead__title" style={{ fontSize: "clamp(32px, 4vw, 56px)" }}>
                {edition.featuredPersonName}
              </h1>
              <p className="page-lead__sub" style={{ marginTop: 16 }}>
                {edition.title}
              </p>

              <blockquote className="mag-hero__pullquote" style={{ marginTop: 32 }}>
                {edition.pullQuote}
              </blockquote>
              <p className="mag-hero__attrib">{edition.pullQuoteAttribution}</p>


              <div className="mag-hero__actions">
                <a
                  href={edition.pdfUrl ?? "#read"}
                  className="btn btn-ink"
                  aria-disabled={!edition.pdfUrl}
                >
                  Read the edition
                </a>
                {edition.pdfUrl ? (
                  <a href={edition.pdfUrl} download className="btn btn-line">
                    Download PDF
                  </a>
                ) : (
                  <span className="btn btn-line" aria-disabled>
                    PDF coming soon
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <article className="mag-body">
            <aside className="mag-body__label">
              Inside this edition
              <span aria-hidden />
            </aside>
            <div className="mag-body__text">
              {edition.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section id="read">
        <div className="wrap">
          <div className="mag-pdf">
            <header className="mag-pdf__head">
              <h2 className="mag-pdf__title">Read the magazine</h2>
              <span className="mag-pdf__hint">
                {edition.pdfUrl ? "← → to turn pages · + − to zoom" : "Preview coming soon"}
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
                    <b>PDF viewer</b>
                    <p>
                      The embedded reader will appear here once the edition&apos;s
                      PDF is uploaded in Sanity.
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
              <h2 className="mag-more__title">More editions</h2>
              <Link href="/magazines" className="mag-more__view-all">
                View the archive
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
