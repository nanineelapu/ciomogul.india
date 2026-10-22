import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { PRIVACY } from "@/data/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy — CIO Mogul India",
  description: "How CIO Mogul India collects, uses and protects your personal information.",
};

export default function PrivacyPage() {
  return <LegalDocument content={PRIVACY} related={{ label: "Terms of Service", href: "/terms" }} />;
}
