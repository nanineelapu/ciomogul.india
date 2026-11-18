import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { BASE_KEYWORDS, DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_NAME, ogImageUrl } from "@/lib/seo";
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

// Script to support iPhone in "Request Desktop Website" mode.
// On Android, "Desktop site" mode automatically overrides the viewport to 980px, activating the desktop layout (min-width: 961px).
// On iOS Safari / Chrome, "Request Desktop Website" sends a Mac user agent but continues to respect width=device-width (~390-430px),
// leaving the phone stuck in the mobile layout. This script detects that state and sets viewport content to "width=1024",
// allowing the full desktop layout to render and scale to fit the screen, matching Android behavior.
const IPHONE_DESKTOP_VIEWPORT_SCRIPT = `(function () {
  try {
    var isIPhoneDesktop = (
      (/Macintosh/i.test(navigator.userAgent) || navigator.platform === 'MacIntel') &&
      navigator.maxTouchPoints > 0 &&
      Math.min(window.screen.width, window.screen.height) < 700
    );
    if (!isIPhoneDesktop) return;

    function applyDesktopViewport() {
      var meta = document.querySelector('meta[name="viewport"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'viewport';
        document.head.appendChild(meta);
      }
      if (meta.getAttribute('content') !== 'width=1024') {
        meta.setAttribute('content', 'width=1024');
      }
    }

    applyDesktopViewport();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyDesktopViewport);
    }
    window.addEventListener('load', applyDesktopViewport);
    window.addEventListener('orientationchange', applyDesktopViewport);

    if (window.MutationObserver) {
      var observer = new MutationObserver(function () {
        var meta = document.querySelector('meta[name="viewport"]');
        if (meta && meta.getAttribute('content') !== 'width=1024') {
          meta.setAttribute('content', 'width=1024');
        }
      });
      observer.observe(document.head || document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['content'],
      });
    }
  } catch (e) {}
})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${playfair.variable} ${poppins.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: IPHONE_DESKTOP_VIEWPORT_SCRIPT,
          }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
