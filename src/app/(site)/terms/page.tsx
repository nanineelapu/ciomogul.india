import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { getLegalContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms of Service — CIO Mogul India",
  description: "The terms that apply when you use the CIO Mogul India website.",
};

export default async function TermsPage() {
  const content = await getLegalContent("terms");
  return <LegalDocument content={content} related={{ label: "Privacy Policy", href: "/privacy" }} />;
}
