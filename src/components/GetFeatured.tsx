import Image from "next/image";
import Link from "next/link";
import { getGetFeaturedCovers } from "@/lib/data";

export default async function GetFeatured() {
  const covers = await getGetFeaturedCovers();

  return (
    <section className="section" id="get-featured" aria-labelledby="feat-title">
      <div className="wrap">
        <div className="feature-cta">
          <div className="feature-cta__covers" aria-hidden>
            {covers.map((c) => <Image key={c.slug} src={c.coverImage} alt={c.alt} width={300} height={425} />)}
          </div>
          <div className="feature-cta__text">
            <p className="feature-cta__kicker">For leaders &amp; companies</p>
            <h2 className="s-title" id="feat-title">Get featured in CIO Mogul India</h2>
            <p>Share your story with India&apos;s technology and business leaders &mdash; as a cover story, a profile or an interview.</p>
            <div className="btn-row">
              <Link href="/contact" className="btn btn-ink">Get featured</Link>
              <a href="mailto:info@ciomogulindia.com" className="btn btn-line">info@ciomogulindia.com</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
