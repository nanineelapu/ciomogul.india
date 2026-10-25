import Image from "next/image";
import Link from "next/link";
import { profileHref } from "@/data/womenSpotlightData";
import { getPublishedProfiles } from "@/lib/data/spotlight";
import { getSiteText } from "@/lib/data";

// Row of round portraits that switches which profile the feature shows.
// Plain links (?profile=…) so it works without client JavaScript.
export default async function SpotlightTabs({ activeId }: { activeId: string }) {
  const [profiles, siteText] = await Promise.all([getPublishedProfiles(), getSiteText()]);
  const t = siteText.womenSpotlight;

  return (
    <nav className="spot-tabs" aria-label="Choose a profile">
      {profiles.map((p) => {
        const active = p.id === activeId;
        return (
          <Link
            key={p.id}
            href={profileHref(p.id)}
            className={`spot-tab${active ? " is-active" : ""}`}
            aria-current={active ? "page" : undefined}
            scroll={false}
          >
            <span className="spot-tab__img">
              <Image src={p.image} alt="" width={64} height={64} />
            </span>
            <span className="spot-tab__text">
              <span className="spot-tab__name">{p.name}</span>
              <span className="spot-tab__go">{t.exploreProfile} <span aria-hidden>→</span></span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
