import Image from "next/image";
import Link from "next/link";
import { getGetFeaturedCovers, getSiteSettings, getSiteText } from "@/lib/data";

export default async function GetFeatured() {
  const [covers, t, settings] = await Promise.all([getGetFeaturedCovers(), getSiteText(), getSiteSettings()]);
  return (
    <section className="section" id="get-featured" aria-labelledby="feat-title">
      <div className="wrap">
        <div className="feature-cta">
          <div className="feature-cta__covers" aria-hidden>
            {covers.map((c) => <Image key={c.slug} src={c.coverImage} alt={c.alt} width={300} height={425} sizes="200px" />)}
          </div>
          <div className="feature-cta__text">
            <p className="feature-cta__kicker">{t.home.getFeaturedKicker}</p>
            <h2 className="s-title" id="feat-title">{t.home.getFeaturedTitle}</h2>
            <p>{t.home.getFeaturedText}</p>
            <div className="btn-row">
              <Link href="/contact" className="btn btn-ink">{t.home.getFeaturedButton}</Link>
              <a href={`mailto:${settings.email}`} className="btn btn-line">{settings.email}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
