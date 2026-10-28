import Image from "next/image";
import Link from "next/link";
import { storyHref, type PublishedProfile } from "@/data/womenSpotlightData";
import { getAdjacentProfiles } from "@/lib/data/spotlight";
import { getSiteText } from "@/lib/data";

// Previous / All honorees / Next, shown after the story. Previous and next open
// the neighbouring stories; "All honorees" returns to the spotlight's profile tabs.
export default async function SpotlightPager({ currentId }: { currentId: string }) {
  const [{ prev, next }, siteText] = await Promise.all([getAdjacentProfiles(currentId), getSiteText()]);
  const t = siteText.womenSpotlight;

  return (
    <nav className="wrap spot-pager" aria-label="More profiles">
      {prev && <PagerLink dir="prev" p={prev} label={t.pagerPrev} />}
      <Link href="/business-women#profile" className="spot-pager__all">
        <span className="spot-pager__label">{t.pagerBrowse}</span>
        <span className="spot-pager__name">{t.pagerAll}</span>
      </Link>
      {next && <PagerLink dir="next" p={next} label={t.pagerNext} />}
    </nav>
  );
}

function PagerLink({ dir, p, label }: { dir: "prev" | "next"; p: PublishedProfile; label: string }) {
  return (
    <Link href={storyHref(p.id)} className={`spot-pager__link spot-pager__link--${dir}`}>
      <span className="spot-pager__img">
        <Image src={p.image} alt="" width={72} height={72} />
      </span>
      <span className="spot-pager__text">
        <span className="spot-pager__label">
          {label}
        </span>
        <span className="spot-pager__name">{p.name}</span>
        <span className="spot-pager__org">{p.organization}</span>
      </span>
    </Link>
  );
}
