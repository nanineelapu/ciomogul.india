import Image from "next/image";
import Link from "next/link";
import { getPodcasts, getSiteText } from "@/lib/data";

export default async function Podcasts() {
  const [all, t] = await Promise.all([getPodcasts(), getSiteText()]);
  const pods = all.slice(0, 4);

  return (
    <section className="section" id="podcasts" aria-labelledby="pod-title">
      <div className="wrap">
        <header className="s-head">
          <h2 className="s-title" id="pod-title">{t.home.podcastsTitle}</h2>
          <span className="s-rule" aria-hidden />
        </header>
        <div className="pods">
          {pods.map((p) => (
            // Each tile deep-links into /podcasts with the player open on
            // this episode. The archive page's modal reads ?watch= and shows
            // the embedded YouTube player.
            <Link
              key={p.slug}
              href={`/podcasts?watch=${encodeURIComponent(p.slug)}`}
              className="pod"
              aria-label={`Play: ${p.title}`}
            >
              <span className="pod__img">
                <Image src={p.thumbnail} alt="" width={640} height={360} sizes="(max-width: 720px) 100vw, 25vw" />
                <span className="pod__play" aria-hidden>▶</span>
              </span>
              <span className="pod__date">{p.date}</span>
              <span className="pod__title">{p.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
