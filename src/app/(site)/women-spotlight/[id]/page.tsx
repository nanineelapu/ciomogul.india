import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findPublishedProfile, getPublishedProfiles, profileHref } from "@/data/womenSpotlightData";
import SpotlightStory from "@/components/womenSpotlight/SpotlightStory";
import SpotlightPager from "@/components/womenSpotlight/SpotlightPager";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  return getPublishedProfiles().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const profile = findPublishedProfile(id);
  if (!profile) return { title: "Not found — CIO Mogul India" };
  const title = `${profile.name} — Her Story · Women Spotlight · CIO Mogul India`;
  return {
    title,
    description: profile.intro,
    openGraph: { title, description: profile.intro, type: "profile", images: [profile.cover] },
  };
}

async function StoryContent({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const profile = findPublishedProfile(id);
  if (!profile) notFound();

  return (
    <main className="spot spot-story-page">
      <div className="wrap">
        <Link href={profileHref(profile.id)} className="back-link">
          Back to Women Spotlight
        </Link>
      </div>
      <SpotlightStory profile={profile} />
      <SpotlightPager currentId={profile.id} />
    </main>
  );
}

// Awaiting params suspends, so the page body runs inside a Suspense boundary.
export default function WomenSpotlightStoryPage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={null}>
      <StoryContent params={params} />
    </Suspense>
  );
}
