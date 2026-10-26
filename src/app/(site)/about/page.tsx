import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import JsonLd from "@/components/seo/JsonLd";
import { getAboutContent } from "@/lib/data";
import { buildMetadata, breadcrumbLd, pageLd } from "@/lib/seo";

const DESCRIPTION =
  "CIO Mogul India is a premier digital magazine and broadcast platform showcasing the visionaries, innovators and leaders shaping India's business, technology and industry.";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutContent();
  return buildMetadata({
    title: "About Us",
    description: DESCRIPTION,
    path: "/about",
    seo: about.seo,
    kicker: "About",
    keywords: [
      "about CIO Mogul India",
      "digital magazine platform India",
      "broadcast publication India",
      "magazine features CIOs",
      "industry insights India",
    ],
  });
}

// Two bands, styled like pages of the magazine: an opening (labels, watermark,
// one-line word-by-word headline, then intro, who we are, actions and who we
// feature) and a navy join band.
export default async function AboutPage() {
  const about = await getAboutContent();
  const words = about.headline.split(" ");

  return (
    <main className="abt">
      <JsonLd
        data={[
          pageLd("AboutPage", { name: "About Us", description: DESCRIPTION, path: "/about" }),
          breadcrumbLd([{ name: "About Us", path: "/about" }]),
        ]}
      />
      <section className="abt-mast" aria-labelledby="abt-title">
        <span className="abt-mast__mark" aria-hidden>{about.eyebrowLeft}</span>
        <div className="wrap">
          <div className="abt-mast__bar">
            <span>{about.eyebrowLeft}</span>
            <span>{about.eyebrowRight}</span>
          </div>

          <h1 className="abt-mast__title" id="abt-title">
            {words.map((w, i) => (
              <Fragment key={i}>
                <span className="abt-word" style={{ "--i": i } as React.CSSProperties}>
                  <span>{w}</span>
                </span>{" "}
              </Fragment>
            ))}
          </h1>

          <div className="abt-mast__body">
            <p className="abt-mast__lead">{about.intro}</p>
            {about.whoWeAre.map((p, i) => <p key={i}>{p}</p>)}

            <div className="abt-actions">
              <Link href="/magazines" className="btn btn-ink">{about.primaryButton} <span aria-hidden>→</span></Link>
              <Link href="/contact" className="btn btn-line">{about.secondaryButton}</Link>
            </div>

            <div className="abt-feature">
              <span className="abt-feature__label">{about.featureLabel}</span>
              <ul className="abt-feature__list">
                {about.featured.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="abt-joinband" aria-labelledby="abt-join-title">
        <div className="wrap abt-join">
          <span className="abt-join__rule" aria-hidden />
          <h2 className="abt-join__title" id="abt-join-title">{about.join.title}</h2>
          <p className="abt-join__text">{about.join.text}</p>
          <div className="abt-actions abt-actions--light">
            <Link href="/podcasts" className="btn btn-paper">{about.join.primaryButton} <span aria-hidden>→</span></Link>
            <Link href="/articles" className="btn abt-btn-ghost">{about.join.secondaryButton}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
