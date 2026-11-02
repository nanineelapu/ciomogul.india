import Image from "next/image";
import Link from "next/link";
import { getSiteText } from "@/lib/data";
import type { MagazineEdition } from "@/types/content";

export default async function MagazineCard({ edition }: { edition: MagazineEdition }) {
  const t = await getSiteText();
  return (
    <Link href={`/magazines/${edition.slug}`} className="mag-card">
      <span className="mag-card__cover">
        <Image
          src={edition.coverImage}
          alt={edition.coverAlt}
          width={713}
          height={1009}
          sizes="(max-width: 420px) 100vw, (max-width: 820px) 50vw, (max-width: 1080px) 33vw, 25vw"
        />
      </span>
      <span className="mag-card__name">{edition.featuredPersonName}</span>
      <span className="mag-card__role">{edition.subtitle}</span>
      <span className="mag-card__foot">
        <span className="mag-card__cta">{t.magazines.readEdition}</span>
        <span className="mag-card__date">{edition.publishedOn}</span>
      </span>
    </Link>
  );
}
