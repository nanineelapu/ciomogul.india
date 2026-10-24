import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbLd, pageLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description: "CIO Mogul India is a premier digital magazine and broadcast platform showcasing the visionaries, innovators and leaders shaping India's business, technology and industry.",
  path: "/about",
  keywords: ["about CIO Mogul India","digital magazine platform India","broadcast publication India","magazine features CIOs","industry insights India"],
});

// The full About page is being redesigned. Previous code is saved in docs/archive/about.
export default function AboutPage() {
  return (
    <main>
      <JsonLd data={[pageLd("AboutPage", { name: "About Us", description: "CIO Mogul India is a premier digital magazine and broadcast platform showcasing the visionaries, innovators and leaders shaping India's business, technology and industry.", path: "/about" }), breadcrumbLd([{ name: "About Us", path: "/about" }])]} />
      <section className="page-lead page-lead--light">
        <div className="wrap">
          <h1 className="page-lead__title">About us</h1>
          <p className="page-lead__sub">This page is coming soon.</p>
        </div>
      </section>
    </main>
  );
}
