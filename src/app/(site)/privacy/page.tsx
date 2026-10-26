import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbLd, pageLd } from "@/lib/seo";
import { getLegalContent, getSiteText } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getLegalContent("privacy");
  return buildMetadata({
    title: "Privacy Policy",
    description: "How CIO Mogul India collects, uses and protects your personal information.",
    path: "/privacy",
    keywords: [],
    seo: content.seo,
    kicker: "Legal",
  });
}

export default async function PrivacyPage() {
  const [content, text] = await Promise.all([getLegalContent("privacy"), getSiteText()]);
  return (
    <>
      <JsonLd data={[pageLd("WebPage", { name: "Privacy Policy", description: "How CIO Mogul India collects, uses and protects your personal information.", path: "/privacy" }), breadcrumbLd([{ name: "Privacy Policy", path: "/privacy" }])]} />
      <LegalDocument content={content} related={{ label: text.footer.termsLabel, href: "/terms" }} />
    </>
  );
}
