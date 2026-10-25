import type { PublishedProfile } from "@/data/womenSpotlightData";
import { getSiteText } from "@/lib/data";

// Long-form story: narrative with drop cap, headed by the leader's name, and a
// sticky rail of honours and sources.
export default async function SpotlightStory({ profile }: { profile: PublishedProfile }) {
  const t = (await getSiteText()).womenSpotlight;
  const [lead, ...rest] = profile.story;

  return (
    <section className="section spot-story" id="story" aria-labelledby="spot-story-title">
      <div className="wrap">
        <header className="s-head">
          <h2 className="s-title" id="spot-story-title">{profile.name}</h2>
          <span className="s-rule" aria-hidden />
        </header>

        <div className="spot-story__grid">
          <div className="spot-story__text">
            <p className="spot-story__lead">{lead}</p>

            {profile.quote && (
              <figure className="spot-quote">
                <blockquote>&ldquo;{profile.quote.text}&rdquo;</blockquote>
                <figcaption>
                  <b>{profile.name}</b>
                  <a href={profile.quote.source.href} target="_blank" rel="noopener noreferrer" className="spot-link">
                    {profile.quote.source.label} <span aria-hidden>↗</span>
                  </a>
                </figcaption>
              </figure>
            )}
            {rest.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <aside className="spot-rail" aria-label="Honours and sources">
            <div className="spot-rail__block">
              <h3 className="spot-rail__title">{t.honoursTitle}</h3>
              <p className="spot-rail__text">{profile.honours}</p>
            </div>

            <div className="spot-rail__block" id="sources">
              <h3 className="spot-rail__title">{t.sourcesTitle}</h3>
              <ul className="spot-sources">
                {profile.sources.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="spot-link">
                      {s.label} <span aria-hidden>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
