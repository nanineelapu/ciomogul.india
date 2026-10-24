import Image from "next/image";
import Link from "next/link";
import { getReleaseCovers } from "@/lib/data";

export default async function MagazineRelease() {
  const covers = await getReleaseCovers();

  return (
    <section className="section release" aria-labelledby="release-title">
      <div className="wrap release__grid">
        <div className="release__covers">
          {covers.map((c) => (
            <Link key={c.slug} href="/magazines" className="mag">
              <Image src={c.coverImage} alt={c.alt} width={713} height={1009} sizes="(max-width: 1080px) 100vw, 33vw" priority />
            </Link>
          ))}
        </div>
        <div className="release__text">
          <h1 className="s-title" id="release-title">Magazine release</h1>
          <span className="s-rule" aria-hidden />
          <p>Stories and lessons from India&apos;s technology and business leaders. Each edition features the people shaping how India works.</p>
          <Link href="/magazines" className="btn btn-ink">View all editions</Link>
        </div>
      </div>
    </section>
  );
}
