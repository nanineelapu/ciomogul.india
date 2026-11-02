import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PdfViewer from "@/components/magazines/PdfViewerLoader";
import { getMagazineEditionBySlug, getMagazineEditions, getSiteText } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const editions = await getMagazineEditions();
  return editions.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const edition = await getMagazineEditionBySlug(slug);
  if (!edition?.pdfUrl) return { title: "Edition not found | CIO Mogul India", robots: { index: false } };
  return buildMetadata({
    title: `${edition.featuredPersonName} | ${edition.editionLabel} | Digital edition`,
    description: edition.subtitle || edition.title,
    path: `/magazines/${edition.slug}/digital`,
    image: edition.coverImage,
    imageAlt: edition.coverAlt || edition.title,
    kicker: "Digital edition",
  });
}

// Digital Live: the flip-page magazine reader on a page of its own.
// The edition page opens it in a new tab.
async function DigitalLiveContent({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const edition = await getMagazineEditionBySlug(slug);
  if (!edition?.pdfUrl) notFound();
  const t = await getSiteText();

  return (
    <main>
      <div className="wrap">
        <Link href={`/magazines/${edition.slug}`} className="back-link">
          {t.magazines.storyBack}
        </Link>
      </div>

      <section className="section">
        <div className="wrap">
          <header className="digital__head">
            <h1 className="digital__title">
              {edition.featuredPersonName} · {edition.editionLabel}
            </h1>
            <span className="digital__hint">{t.magazines.readerHint}</span>
          </header>
          <PdfViewer
            file={edition.pdfUrl}
            poster={edition.coverImage}
            title={`${edition.featuredPersonName} — ${edition.editionLabel}`}
          />
        </div>
      </section>
    </main>
  );
}

export default function DigitalLivePage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={null}>
      <DigitalLiveContent params={params} />
    </Suspense>
  );
}
