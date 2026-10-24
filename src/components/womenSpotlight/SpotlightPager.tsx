import Image from "next/image";
import Link from "next/link";
import { getAdjacentProfiles, storyHref, type PublishedProfile } from "@/data/womenSpotlightData";

// Previous / All honorees / Next, shown after the story. Previous and next open
// the neighbouring stories; "All honorees" returns to the spotlight's profile tabs.
export default function SpotlightPager({ currentId }: { currentId: string }) {
  const { prev, next } = getAdjacentProfiles(currentId);

  return (
    <nav className="wrap spot-pager" aria-label="More profiles">
      {prev && <PagerLink dir="prev" p={prev} />}
      <Link href="/women-spotlight#profile" className="spot-pager__all">
        <span className="spot-pager__label">Browse</span>
        <span className="spot-pager__name">All Honorees</span>
      </Link>
      {next && <PagerLink dir="next" p={next} />}
    </nav>
  );
}

function PagerLink({ dir, p }: { dir: "prev" | "next"; p: PublishedProfile }) {
  return (
    <Link href={storyHref(p.id)} className={`spot-pager__link spot-pager__link--${dir}`}>
      <span className="spot-pager__img">
        <Image src={p.image} alt="" width={72} height={72} />
      </span>
      <span className="spot-pager__text">
        <span className="spot-pager__label">
          {dir === "prev" ? "← Previous" : "Next →"}
        </span>
        <span className="spot-pager__name">{p.name}</span>
        <span className="spot-pager__org">{p.organization}</span>
      </span>
    </Link>
  );
}
