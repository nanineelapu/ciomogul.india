import Image from "next/image";
import Link from "next/link";
import { getSiteText, getWomenLeaders } from "@/lib/data";
import { profileHref } from "@/data/womenSpotlightData";
import { getPublishedProfiles } from "@/lib/data/spotlight";

export default async function WallOfFame() {
  const [leaders, t, profiles] = await Promise.all([getWomenLeaders(), getSiteText(), getPublishedProfiles()]);
  const published = new Set(profiles.map((p) => p.id));
  return (
    <section className="section" id="women-spotlight" aria-labelledby="wall-title">
      <div className="wrap">
        <header className="s-head">
          <h2 className="s-title" id="wall-title">{t.home.wallTitle}</h2>
          <span className="s-rule" aria-hidden />
          <p className="s-intro">{t.home.wallIntro}</p>
        </header>
        <div className="leaders">
          {leaders.map((l) => (
            <Link key={l.slug} href={published.has(l.slug) ? profileHref(l.slug) : "/women-spotlight#profile"} className="leader">
              <span className="leader__img"><Image src={l.image} alt={l.name} width={112} height={112} /></span>
              <span className="leader__body">
                <span className="leader__org">{l.organization}</span>
                <span className="leader__name">{l.name}</span>
                <span className="leader__role">{l.role}</span>
                <span className="leader__link">{t.home.wallReadFeature}</span>
              </span>
            </Link>
          ))}
        </div>
        <p className="center-link wall-more"><Link href="/women-spotlight" className="btn btn-line">{t.home.wallButton}</Link></p>
      </div>
    </section>
  );
}
