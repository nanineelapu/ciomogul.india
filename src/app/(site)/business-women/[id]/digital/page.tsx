import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PdfViewer from "@/components/magazines/PdfViewerLoader";
import { storyHref } from "@/data/womenSpotlightData";
import { findPublishedProfile, getPublishedProfiles } from "@/lib/data/spotlight";
import { getSiteText } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

type Params = { id: string };

export async function generateStaticParams(): Promise<Params[]> {
  return (await getPublishedProfiles()).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const profile = await findPublishedProfile(id);
  if (!profile?.pdfUrl) return { title: "Not found | CIO Mogul India", robots: { index: false } };
  return buildMetadata({
    title: `${profile.name} | Digital magazine`,
    description: profile.intro,
    path: `/business-women/${profile.id}/digital`,
    image: profile.cover,
    imageAlt: profile.name,
    kicker: "Digital magazine",
  });
}

// Digital View for a business woman: her magazine PDF in the page-turning reader.
// The Business Women page opens it in a new tab.
async function DigitalContent({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const profile = await findPublishedProfile(id);
  if (!profile?.pdfUrl) notFound();
  const t = await getSiteText();

  return (
    <main>
      <div className="wrap">
        <Link href={storyHref(profile.id)} className="back-link">
          {t.womenSpotlight.readStory}
        </Link>
      </div>

      <section className="section">
        <div className="wrap">
          <header className="digital__head">
            <h1 className="digital__title">{profile.name}</h1>
            <span className="digital__hint">{t.magazines.readerHint}</span>
          </header>
          <PdfViewer file={profile.pdfUrl} poster={profile.cover} title={profile.name} />
        </div>
      </section>
    </main>
  );
}

export default function BusinessWomanDigitalPage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={null}>
      <DigitalContent params={params} />
    </Suspense>
  );
}
