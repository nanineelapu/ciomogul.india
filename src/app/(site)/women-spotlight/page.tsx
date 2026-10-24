import type { Metadata } from "next";
import { Suspense } from "react";
import { getPageContent } from "@/lib/data";
import { getProfileById } from "@/data/womenSpotlightData";
import SpotlightHero from "@/components/womenSpotlight/SpotlightHero";
import SpotlightTabs from "@/components/womenSpotlight/SpotlightTabs";
import SpotlightFeature from "@/components/womenSpotlight/SpotlightFeature";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// ?profile=<id> picks the profile (?leader= kept as an alias). Unknown,
// missing or still-under-review ids fall back to the first published profile.
async function readProfile(searchParams: SearchParams) {
  const sp = await searchParams;
  const raw = sp.profile ?? sp.leader;
  return getProfileById(Array.isArray(raw) ? raw[0] : raw);
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const profile = await readProfile(searchParams);
  const title = `${profile.name} — Women Spotlight · CIO Mogul India`;
  return {
    title,
    description: profile.intro,
    openGraph: { title, description: profile.intro, type: "profile", images: [profile.cover] },
  };
}

export default async function WomenSpotlightPage({ searchParams }: { searchParams: SearchParams }) {
  const page = (await getPageContent()).womenSpotlight;

  return (
    <main className="spot">
      <SpotlightHero title={page.title} />

      <section className="section spot-profile" id="profile" aria-labelledby="spot-feature-name">
        <div className="wrap">
          <header className="s-head">
            <h2 className="s-title">In the spotlight</h2>
            <span className="s-rule" aria-hidden />
          </header>
          <Suspense fallback={<FeatureSkeleton />}>
            <ProfileHead searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

async function ProfileHead({ searchParams }: { searchParams: SearchParams }) {
  const profile = await readProfile(searchParams);
  return (
    <>
      <SpotlightTabs activeId={profile.id} />
      <SpotlightFeature profile={profile} />
    </>
  );
}

function FeatureSkeleton() {
  return (
    <div className="spot-skeleton" aria-busy="true" aria-label="Loading the spotlight">
      <span className="spot-skeleton__cover" />
      <span className="spot-skeleton__lines">
        <span /><span /><span />
      </span>
    </div>
  );
}
