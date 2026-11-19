import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Playfair_Display, Poppins } from "next/font/google";
import { BASE_KEYWORDS, DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_NAME, ogImageUrl } from "@/lib/seo";
import "./globals.css";
import "./responsive.css";
import { SITE_URL } from "@/lib/site";

// Generate viewport dynamically based on User-Agent:
// - Mobile browsers (iPhone, Android mobile) receive standard responsive viewport (width=device-width).
// - When an iPhone user taps "Request Desktop Website", Safari/Chrome reloads the page with a Mac desktop User-Agent.
//   Serving width=1024 statically in the HTML head forces WebKit to render the full desktop layout scaled to fit,
//   exactly like Android "Desktop site" does.
// - Real desktop browsers (PC / Mac) ignore the viewport meta tag entirely.
export async function generateViewport(): Promise<Viewport> {
  try {
    const headersList = await headers();
    const ua = headersList.get("user-agent") || "";
    const isMobile = /iPhone|iPod|Android.*Mobile|Mobile/i.test(ua);
    if (isMobile) {
      return {
        width: "device-width",
        initialScale: 1,
      };
    }
    return {
      width: 1024,
    };
  } catch {
    return {
      width: "device-width",
      initialScale: 1,
    };
  }
}

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
  // favicon.ico sits in src/app, so Next.js adds it (with a cache-busting address).
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png?v=2", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png?v=2", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/icons/site.webmanifest?v=2",
  applicationName: SITE_NAME,
  publisher: SITE_NAME,
  creator: SITE_NAME,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
    images: [{ url: ogImageUrl({ title: SITE_NAME, kicker: "Digital magazine" }), width: 1200, height: 630 }],
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
