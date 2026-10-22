import Image from "next/image";
import Link from "next/link";
import type { HallOfFameEntry } from "@/types/content";

// One row of the roll of honor. The parent decides the alternating side via
// the `side` prop so the layout holds its rhythm regardless of filter/sort.
export default function HallEntry({
  entry,
  side = "left",
}: {
  entry: HallOfFameEntry;
  side?: "left" | "right";
}) {
  return (
    <article className={`hall-entry hall-entry--${side}`}>
      <aside className="hall-entry__ordinal" aria-hidden>
        <span className="hall-entry__serial">
          {String(entry.serial).padStart(3, "0")}
        </span>
        <span className="hall-entry__year">{entry.inductionYear}</span>
      </aside>

      <Link
        href={`/magazines/${entry.editionSlug}`}
        className="hall-entry__portrait"
        aria-label={`Open ${entry.name}'s edition`}
      >
        <Image
          src={entry.portrait}
          alt={entry.name}
          width={713}
          height={1009}
          sizes="(max-width: 820px) 100vw, 42vw"
        />
      </Link>

      <div className="hall-entry__body">
        <p className="hall-entry__kicker">Inducted · {entry.inductedOn}</p>
        <h3 className="hall-entry__name">{entry.name}</h3>
        <p className="hall-entry__role">
          {entry.role}
          {entry.organization && <> · <span>{entry.organization}</span></>}
        </p>

        <blockquote className="hall-entry__quote">{entry.pullQuote}</blockquote>

        <Link href={`/magazines/${entry.editionSlug}`} className="hall-entry__cta">
          Read the edition
        </Link>
      </div>
    </article>
  );
}
