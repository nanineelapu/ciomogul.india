import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findPublishedProfile, getPublishedProfiles, profileHref } from "@/data/womenSpotlightData";
import SpotlightStory from "@/components/womenSpotlight/SpotlightStory";
import SpotlightPager from "@/components/womenSpotlight/SpotlightPager";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbLd, buildMetadata, mergeKeywords, profileLd } from "@/lib/seo";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  return getPublishedProfiles().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const profile = findPublishedProfile(id);
  if (!profile) return { title: "Not found | CIO Mogul India", robots: { index: false } };
  return buildMetadata({
    title: `${profile.name}: Her Story | Women Spotlight`,
    description: profile.intro,
    path: `/women-spotlight/${profile.id}`,
    image: profile.cover,
    imageAlt: profile.name,
    keywords: mergeKeywords(profile.tags, [
      profile.name,
      `${profile.name} profile`,
      profile.organization,
      profile.designation,
      profile.sector,
      "women leaders in India",
    ]),
    type: "profile",
  });
}

async function StoryContent({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const profile = findPublishedProfile(id);
  if (!profile) notFound();

  return (
    <main className="spot spot-story-page">
      <JsonLd
        data={[
          profileLd({
            name: profile.name,
            role: profile.designation,
            organization: profile.organization,
            description: profile.intro,
            path: `/women-spotlight/${profile.id}`,
            image: profile.cover,
          }),
          breadcrumbLd([
            { name: "Women Spotlight", path: "/women-spotlight" },
            { name: profile.name, path: `/women-spotlight/${profile.id}` },
          ]),
        ]}
      />
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
