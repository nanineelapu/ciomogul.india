import type { Metadata } from "next";
import Link from "next/link";
import ExploreLinks from "@/components/shared/ExploreLinks";
import { getAboutContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "About — CIO Mogul India",
  description:
    "CIO Mogul India is a digital magazine and broadcast platform for India's technology and business leaders.",
};

export default async function AboutPage() {
  const about = await getAboutContent();

  return (
    <main>
      <section className="page-lead page-lead--light">
        <div className="wrap">
          <span className="page-lead__eyebrow">About us</span>
          <h1 className="page-lead__title">{about.headline}</h1>
          <p className="page-lead__sub">{about.intro}</p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="mag-body">
            <aside className="mag-body__label">
              Who we are
              <span aria-hidden />
            </aside>
            <div className="mag-body__text">
              {about.whoWeAre.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <header className="section-head">
            <h2 className="section-head__title">What we cover</h2>
            <span className="section-head__rule" aria-hidden />
          </header>
          <ol className="about-cover">
            {about.whatWeCover.map((item, i) => (
              <li key={item.title} className="about-cover__item">
                <span className="about-cover__num" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="about-cover__title">{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ExploreLinks heading="Explore the magazine" />

      <section className="hall-apply" aria-labelledby="join-title">
        <div className="wrap hall-apply__inner">
          <div className="hall-apply__text">
            <h2 className="hall-apply__title" id="join-title">{about.join.title}</h2>
            <p>{about.join.text}</p>
          </div>
          <div className="hall-apply__actions">
            <Link href="/contact" className="btn btn-paper">Get in touch</Link>
            <Link href="/magazines" className="hall-apply__link">Read the magazine →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
