import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { TERMS } from "@/data/terms";

export const metadata: Metadata = {
  title: "Terms of Service — CIO Mogul India",
  description: "The terms that apply when you use the CIO Mogul India website.",
};

export default function TermsPage() {
  return <LegalDocument content={TERMS} related={{ label: "Privacy Policy", href: "/privacy" }} />;
}
