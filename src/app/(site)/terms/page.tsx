import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbLd, pageLd } from "@/lib/seo";
import { getLegalContent, getSiteText } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getLegalContent("terms");
  return buildMetadata({
    title: "Terms of Service",
    description: "The terms that apply when you use the CIO Mogul India website.",
    path: "/terms",
    keywords: [],
    seo: content.seo,
    kicker: "Legal",
  });
}

export default async function TermsPage() {
  const [content, text] = await Promise.all([getLegalContent("terms"), getSiteText()]);
  return (
    <>
      <JsonLd data={[pageLd("WebPage", { name: "Terms of Service", description: "The terms that apply when you use the CIO Mogul India website.", path: "/terms" }), breadcrumbLd([{ name: "Terms of Service", path: "/terms" }])]} />
      <LegalDocument content={content} related={{ label: text.footer.privacyLabel, href: "/privacy" }} />
    </>
  );
}
