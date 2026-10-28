import type { Metadata } from "next";
import { Suspense } from "react";
import JsonLd from "@/components/seo/JsonLd";
import { getPageContent, getSiteText } from "@/lib/data";
import { getProfileById } from "@/lib/data/spotlight";
import { buildMetadata, breadcrumbLd, collectionLd, pageLd } from "@/lib/seo";
import { getPublishedProfiles } from "@/lib/data/spotlight";
import { storyHref } from "@/data/womenSpotlightData";
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

// The head tags describe the page as a whole (not the chosen ?profile=), so
// every profile view shares one canonical address and the page can be prerendered.
export async function generateMetadata(): Promise<Metadata> {
  const page = (await getPageContent()).womenSpotlight;
  return buildMetadata({
    title: page.title,
    description: page.intro,
    seo: page.seo,
    kicker: "Business Women",
    path: "/business-women",
    keywords: [
      "business women India",
      "women leaders in technology India",
      "women CEOs India",
      "women in business India",
      "women founders India",
      "women in tech leadership",
    ],
  });
}

export default async function WomenSpotlightPage({ searchParams }: { searchParams: SearchParams }) {
  const [content, siteText, profiles] = await Promise.all([getPageContent(), getSiteText(), getPublishedProfiles()]);
  const page = content.womenSpotlight;

  return (
    <main className="spot">
      <JsonLd
        data={[
          pageLd("CollectionPage", { name: page.title, description: page.intro, path: "/business-women" }),
          breadcrumbLd([{ name: page.title, path: "/business-women" }]),
          collectionLd({
            name: page.title,
            path: "/business-women",
            items: profiles.map((p) => ({ name: p.name, url: storyHref(p.id), image: p.cover, description: p.intro })),
          }),
        ]}
      />
      <SpotlightHero title={page.title} />

      <section className="section spot-profile" id="profile" aria-labelledby="spot-feature-name">
        <div className="wrap">
          <header className="s-head">
            <h2 className="s-title">{siteText.womenSpotlight.sectionTitle}</h2>
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
