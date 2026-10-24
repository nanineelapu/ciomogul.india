import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbLd, pageLd } from "@/lib/seo";
import { getLegalContent } from "@/lib/data";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "The terms that apply when you use the CIO Mogul India website.",
  path: "/terms",
  keywords: [],
});

export default async function TermsPage() {
  const content = await getLegalContent("terms");
  return (
    <>
      <JsonLd data={[pageLd("WebPage", { name: "Terms of Service", description: "The terms that apply when you use the CIO Mogul India website.", path: "/terms" }), breadcrumbLd([{ name: "Terms of Service", path: "/terms" }])]} />
      <LegalDocument content={content} related={{ label: "Privacy Policy", href: "/privacy" }} />
    </>
  );
}
