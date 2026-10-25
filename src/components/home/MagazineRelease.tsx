import Image from "next/image";
import Link from "next/link";
import { getReleaseCovers, getSiteText } from "@/lib/data";

export default async function MagazineRelease() {
  const [covers, t] = await Promise.all([getReleaseCovers(), getSiteText()]);
  return (
    <section className="section release" aria-labelledby="release-title">
      <div className="wrap release__grid">
        <div className="release__covers">
          {covers.map((c) => (
            <Link key={c.slug} href={c.href} className="mag">
              <Image src={c.coverImage} alt={c.alt} width={713} height={1009} sizes="(max-width: 1080px) 100vw, 33vw" priority />
            </Link>
          ))}
        </div>
        <div className="release__text">
          <h1 className="s-title" id="release-title">{t.home.releaseTitle}</h1>
          <span className="s-rule" aria-hidden />
          <p>{t.home.releaseText}</p>
          <Link href="/magazines" className="btn btn-ink">{t.home.releaseButton}</Link>
        </div>
      </div>
    </section>
  );
}
