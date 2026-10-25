import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { BASE_KEYWORDS, DEFAULT_DESCRIPTION, DEFAULT_TITLE, LOGO_PATH, SITE_NAME } from "@/lib/seo";
import "./globals.css";
import "./responsive.css";
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

// Default head tags for every page. Each page sets its own title, description
// and address (see src/lib/seo.ts). These are fixed values, because the Studio
// route has no list of addresses and its head tags can't wait for data.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: `%s | ${SITE_NAME}` },
  description: DEFAULT_DESCRIPTION,
  keywords: BASE_KEYWORDS,
  applicationName: SITE_NAME,
  publisher: SITE_NAME,
  creator: SITE_NAME,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
    images: [LOGO_PATH],
  },
  twitter: { card: "summary_large_image" },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${playfair.variable} ${poppins.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
