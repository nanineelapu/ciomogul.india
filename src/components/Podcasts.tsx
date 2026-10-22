import Image from "next/image";
import { getPodcasts } from "@/lib/data";

export default async function Podcasts() {
  const pods = await getPodcasts();

  return (
    <section className="section" id="podcasts" aria-labelledby="pod-title">
      <div className="wrap">
        <header className="s-head">
          <h2 className="s-title" id="pod-title">Podcasts</h2>
          <span className="s-rule" aria-hidden />
        </header>
        <div className="pods">
          {pods.map((p) => (
            <a key={p.slug} href={p.youtubeUrl} target="_blank" rel="noopener" className="pod">
              <span className="pod__img">
                <Image src={p.thumbnail} alt="" width={640} height={360} sizes="(max-width: 720px) 100vw, 25vw" />
                <span className="pod__play" aria-hidden>▶</span>
              </span>
              <span className="pod__date">{p.date}</span>
              <span className="pod__title">{p.title}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
