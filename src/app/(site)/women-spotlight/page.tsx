import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Women Spotlight — CIO Mogul India",
  description: "The women leaders featured in CIO Mogul India.",
};

// The full Women Spotlight pages are being redesigned. Previous code is saved in
// docs/archive/women-spotlight.
export default function WomenSpotlightPage() {
  return (
    <main>
      <section className="page-lead page-lead--light">
        <div className="wrap">
          <h1 className="page-lead__title">Women Spotlight</h1>
          <p className="page-lead__sub">This page is coming soon.</p>
        </div>
      </section>
    </main>
  );
}
