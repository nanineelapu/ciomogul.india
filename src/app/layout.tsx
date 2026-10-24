import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

// Root layout — nothing but the html/body shell + global fonts. Site chrome
// (Header, Footer) lives in (site)/layout so the /studio route can render
// Sanity Studio full-bleed without any marketing nav around it.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-display",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: "CIO Mogul India",
    type: "website",
    locale: "en_IN",
    images: ["/assets/logo.png"],
  },
  title: "CIO Mogul India — The Magazine for India's Technology Leaders",
  description:
    "Cover stories, news and podcasts for India's technology and business leaders.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
