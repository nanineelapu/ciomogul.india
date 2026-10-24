import Image from "next/image";
import Link from "next/link";
import { storyHref, type PublishedProfile } from "@/data/womenSpotlightData";

// The "cover spread": framed image · name and introduction · navy themes panel.
export default function SpotlightFeature({ profile }: { profile: PublishedProfile }) {
  const { edition } = profile;
  const label = edition ? "Cover honoree" : "Featured profile";

  return (
    // key: re-run the entrance animation when the profile changes
    <div className="spot-feature" key={profile.id}>
      <figure className="spot-feature__cover">
        <Image
          src={profile.cover}
          alt={`${profile.name}, CIO Mogul India ${label.toLowerCase()}`}
          width={428}
          height={588}
          priority
          sizes="(max-width: 900px) 70vw, 340px"
        />
        <figcaption className="spot-feature__edition">
          {edition ? <><b>{edition.label}</b> {edition.month}</> : <b>{label}</b>}
        </figcaption>
      </figure>

      <div className="spot-feature__body">
        <p className="spot-feature__kicker">
          {profile.tags.map((t, i) => (
            <span key={t}>{i > 0 && <span aria-hidden>· </span>}{t}</span>
          ))}
        </p>
        <h2 className="spot-feature__name" id="spot-feature-name">{profile.name}</h2>
        <p className="spot-feature__role">
          {profile.designation}, <b>{profile.organization}</b>
        </p>
        <p className="spot-feature__lead">{profile.intro}</p>

        <div className="spot-feature__byline">
          <span className="spot-feature__avatar">
            <Image src={profile.image} alt="" width={56} height={56} />
          </span>
          <span>
            {label} · {profile.sector}
            <b>
              {edition
                ? `Featured in the ${edition.month} edition`
                : `Based on ${profile.sources.length} published sources`}
            </b>
          </span>
        </div>

        <div className="spot-feature__actions">
          <Link href={storyHref(profile.id)} className="btn btn-ink">Read her story <span aria-hidden>→</span></Link>
          {edition ? (
            <Link href={edition.href} className="btn btn-line">Read the edition</Link>
          ) : (
            <Link href={`${storyHref(profile.id)}#sources`} className="btn btn-line">View sources</Link>
          )}
        </div>
      </div>

      <aside className="spot-impact" aria-label={`${profile.name}: leadership themes`}>
        <p className="spot-impact__label">Leadership themes</p>
        <ol className="spot-themes">
          {profile.themes.map((t, i) => (
            <li key={t}>
              <span className="spot-themes__num" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
              {t}
            </li>
          ))}
        </ol>
        <p className="spot-impact__foot">
          <span aria-hidden>★</span> CIO Mogul India · {label}
        </p>
      </aside>
    </div>
  );
}
