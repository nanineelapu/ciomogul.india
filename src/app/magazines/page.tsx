import type { Metadata } from "next";
import MagazineCard from "@/components/MagazineCard";
import { getMagazineEditions } from "@/lib/data";

export const metadata: Metadata = {
  title: "Magazines — CIO Mogul India",
  description:
    "Every edition of CIO Mogul India — cover stories and interviews with India's technology and business leaders.",
};

export default async function MagazinesPage() {
  const editions = await getMagazineEditions();

  return (
    <main>
      <section className="page-lead">
        <div className="wrap">
          <span className="page-lead__eyebrow">The archive</span>
          <h1 className="page-lead__title">Every edition, in one place.</h1>
          <p className="page-lead__sub">
            Each issue of CIO Mogul India features the people shaping how
            India&apos;s technology, business and industry work. Browse the
            archive, read a cover story, or revisit an edition.
          </p>
          <dl className="page-lead__meta">
            <div>
              Editions
              <b>{editions.length} published</b>
            </div>
            <div>
              Format
              <b>Digital · print-ready PDF</b>
            </div>
            <div>
              Cadence
              <b>Monthly</b>
            </div>
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="mag-index-bar">
            <span className="mag-index-bar__count">
              Showing <b>{editions.length}</b> of <b>{editions.length}</b> editions
            </span>
            <span className="mag-sort">
              Sorted by <span>newest first</span>
            </span>
          </div>
          <div className="mag-grid">
            {editions.map((edition, i) => (
              <MagazineCard key={edition.slug} edition={edition} index={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
