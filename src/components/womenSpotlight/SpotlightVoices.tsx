import Image from "next/image";
import Link from "next/link";
import { getAllProfiles, profileHref } from "@/data/womenSpotlightData";

// One line on each leader's work: a sourced quotation where we have one,
// otherwise an editorial description (deliberately without quote marks).
export default function SpotlightVoices() {
  const profiles = getAllProfiles();

  return (
    <section className="spot-voices" aria-labelledby="spot-voices-title">
      <div className="wrap">
        <header className="s-head">
          <h2 className="s-title" id="spot-voices-title">In their words</h2>
          <span className="s-rule" aria-hidden />
          <p className="s-intro">Leadership is expressed through decisions, ideas and the work that changes organisations.</p>
        </header>

        <ul className="spot-voices__list">
          {profiles.map((p) => {
            const published = p.status === "published";
            const quote = published ? p.quote : undefined;
            const text = quote ? `“${quote.text}”` : published ? p.voice : p.teaser;

            return (
              <li key={p.id} className={`spot-voice${published ? "" : " is-pending"}`}>
                <p className={`spot-voice__text${quote ? " is-quote" : ""}`}>{text}</p>
                <div className="spot-voice__who">
                  <Image src={p.image} alt="" width={52} height={52} />
                  <span>
                    <b>{p.name}</b>
                    <span>{quote ? quote.source.label : p.sector}</span>
                    {published ? (
                      <Link href={profileHref(p.id)} className="spot-link">Read Profile →</Link>
                    ) : (
                      <span className="spot-voice__status">Under review</span>
                    )}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

