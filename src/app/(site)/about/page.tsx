import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { getAboutContent } from "@/lib/data";
import { buildMetadata, breadcrumbLd, pageLd } from "@/lib/seo";

const DESCRIPTION =
  "CIO Mogul India is a premier digital magazine and broadcast platform showcasing the visionaries, innovators and leaders shaping India's business, technology and industry.";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description: DESCRIPTION,
  path: "/about",
  keywords: [
    "about CIO Mogul India",
    "digital magazine platform India",
    "broadcast publication India",
    "magazine features CIOs",
    "industry insights India",
  ],
});

// Two sections: an editorial masthead (word-by-word headline, lead, who we
// are, actions) and a navy band of expanding "what we cover" panels.
export default async function AboutPage() {
  const about = await getAboutContent();
  const words = about.headline.split(" ");
  const featured = ["CIOs", "Entrepreneurs", "Startup founders", "Healthcare leaders", "Industry pioneers"];

  return (
    <main className="abt">
      <JsonLd
        data={[
          pageLd("AboutPage", { name: "About Us", description: DESCRIPTION, path: "/about" }),
          breadcrumbLd([{ name: "About Us", path: "/about" }]),
        ]}
      />
      <section className="abt-mast" aria-labelledby="abt-title">
        <div className="wrap">
          <div className="abt-mast__bar">
            <span>About us</span>
            <span>Digital magazine &amp; broadcast</span>
          </div>

          <h1 className="abt-mast__title" id="abt-title">
            {words.map((w, i) => (
              <span key={i} className="abt-word" style={{ "--i": i } as React.CSSProperties}>
                <span>{w}</span>{" "}
              </span>
            ))}
          </h1>

          <div className="abt-mast__grid">
            <div className="abt-mast__lead">
              <p>{about.intro}</p>
              <div className="abt-actions">
                <Link href="/magazines" className="btn btn-ink">Read the Magazine <span aria-hidden>→</span></Link>
                <Link href="/contact" className="btn btn-line">Get in Touch</Link>
              </div>
            </div>
            <div className="abt-mast__body">
              {about.whoWeAre.map((p, i) => <p key={i}>{p}</p>)}
              <div className="abt-feature">
                <span className="abt-feature__label">Who we feature</span>
                <ul className="abt-feature__list">
                  {featured.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="abt-cover" aria-labelledby="abt-cover-title">
        <div className="wrap">
          <div className="abt-cover__head">
            <h2 className="abt-cover__title" id="abt-cover-title">What we cover</h2>
            <p>Three formats, one purpose: telling the stories of the people shaping India&apos;s business and technology.</p>
          </div>

          <ol className="abt-panels">
            {about.whatWeCover.map((item, i) => (
              <li key={item.title} className="abt-panel" style={{ "--i": i } as React.CSSProperties}>
                <span className="abt-panel__num" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                <div className="abt-panel__text">
                  <h3 className="abt-panel__name">{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="abt-join">
            <div>
              <h3 className="abt-join__title">{about.join.title}</h3>
              <p className="abt-join__text">{about.join.text}</p>
            </div>
            <div className="abt-actions abt-actions--light">
              <Link href="/podcasts" className="btn btn-paper">Watch the Broadcasts <span aria-hidden>→</span></Link>
              <Link href="/articles" className="btn abt-btn-ghost">Explore Articles</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
