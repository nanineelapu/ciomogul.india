import Image from "next/image";
import Link from "next/link";
import type { WomanLeader } from "@/types/content";

// Portrait card used by the /women-spotlight archive. Intentionally spare —
// portrait, name, role, org, link. No chip, no decoration.
export default function LeaderCard({ leader }: { leader: WomanLeader }) {
  return (
    <Link href={`/women-spotlight/${leader.slug}`} className="ws-card">
      <span className="ws-card__portrait">
        <Image
          src={leader.image}
          alt={leader.name}
          width={600}
          height={720}
          sizes="(max-width: 520px) 100vw, (max-width: 820px) 50vw, (max-width: 1080px) 33vw, 25vw"
        />
      </span>
      <span className="ws-card__name">{leader.name}</span>
      <span className="ws-card__role">{leader.role}</span>
      {leader.organization && (
        <span className="ws-card__org">{leader.organization}</span>
      )}
      <span className="ws-card__cta">View profile</span>
    </Link>
  );
}
