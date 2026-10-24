import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — CIO Mogul India",
  description: "About CIO Mogul India.",
};

// The full About page is being redesigned. Previous code is saved in docs/archive/about.
export default function AboutPage() {
  return (
    <main>
      <section className="page-lead page-lead--light">
        <div className="wrap">
          <h1 className="page-lead__title">About us</h1>
          <p className="page-lead__sub">This page is coming soon.</p>
        </div>
      </section>
    </main>
  );
}
