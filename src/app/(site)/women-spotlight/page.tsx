import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbLd, pageLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Women Spotlight",
  description: "The women leaders featured in CIO Mogul India: CEOs, founders and technology executives shaping business in India.",
  path: "/women-spotlight",
  keywords: ["women leaders in technology India","women CEOs India","women in business India","women founders India","women in tech leadership"],
});

// The full Women Spotlight pages are being redesigned. Previous code is saved in
// docs/archive/women-spotlight.
export default function WomenSpotlightPage() {
  return (
    <main>
      <JsonLd data={[pageLd("CollectionPage", { name: "Women Spotlight", description: "The women leaders featured in CIO Mogul India: CEOs, founders and technology executives shaping business in India.", path: "/women-spotlight" }), breadcrumbLd([{ name: "Women Spotlight", path: "/women-spotlight" }])]} />
      <section className="page-lead page-lead--light">
        <div className="wrap">
          <h1 className="page-lead__title">Women Spotlight</h1>
          <p className="page-lead__sub">This page is coming soon.</p>
        </div>
      </section>
    </main>
  );
}
