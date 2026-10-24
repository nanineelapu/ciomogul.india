import Image from "next/image";
import Link from "next/link";
import { getSiteText } from "@/lib/data";
import type { HallOfFameEntry } from "@/types/content";

// Small card used in the "More inductees" row. Shares the portrait card style.
export default async function HallCard({ entry }: { entry: HallOfFameEntry }) {
  const t = await getSiteText();
  return (
    <Link href={`/hall-of-fame/${entry.slug}`} className="ws-card">
      <span className="ws-card__portrait">
        <Image
          src={entry.portrait}
          alt={entry.name}
          width={600}
          height={720}
          sizes="(max-width: 520px) 100vw, (max-width: 820px) 50vw, 25vw"
        />
      </span>
      <span className="ws-card__name">{entry.name}</span>
      <span className="ws-card__role">{entry.role}</span>
      {entry.organization && <span className="ws-card__org">{entry.organization}</span>}
      <span className="ws-card__cta">{t.hallOfFame.viewProfile}</span>
    </Link>
  );
}
