import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Content Security Policy for the public site. Pages are prerendered (partial
// prerendering), and Next.js cannot add nonces to prerendered pages, so inline
// scripts are allowed with 'unsafe-inline' as the Next.js docs describe for this
// setup. Everything else is limited to what the site really uses: Sanity's
// image CDN (images, PDFs), the YouTube no-cookie player, and this site.
const SITE_CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io",
  "font-src 'self' data:",
  `connect-src 'self' https://cdn.sanity.io${isDev ? " ws: wss:" : ""}`,
  "media-src 'self' https://cdn.sanity.io",
  "frame-src https://www.youtube-nocookie.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

// The embedded Sanity Studio talks to Sanity's APIs and loads avatars. It is
// sent as report-only (violations are logged in the browser console, nothing is
// blocked) until it has been checked with a signed-in editor.
const STUDIO_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://core.sanity-cdn.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io https://*.googleusercontent.com https://*.githubusercontent.com",
  "font-src 'self' data: https://design-system-static.sanity.io",
  "connect-src 'self' https://*.sanity.io wss://*.sanity.io https://*.sanity-cdn.com",
  "frame-src 'self' https://*.sanity.io",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // Fonts read from disk by the share-card route (app/og/route.tsx).
  outputFileTracingIncludes: {
    "/og": ["./src/app/og/fonts/**"],
  },
  // Images uploaded in Sanity are served from its CDN.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    // Resized images are kept for 30 days, so repeat visits are instant.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // The old site used /news; articles now live at /articles.
  async redirects() {
    return [
      { source: "/news", destination: "/articles", permanent: true },
      { source: "/news/:slug", destination: "/articles/:slug", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      // Industries now use full names.
      { source: "/industries/hr", destination: "/industries/human-resources", permanent: true },
      { source: "/industries/it", destination: "/industries/information-technology", permanent: true },
      // Women Spotlight was renamed Business Women. Query strings (?profile=) are kept.
      { source: "/women-spotlight", destination: "/business-women", permanent: true },
      { source: "/women-spotlight/:path*", destination: "/business-women/:path*", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // HTTPS only for a year (production). No includeSubDomains/preload:
          // both are hard to undo and need every subdomain on HTTPS first.
          ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=31536000" }]),
        ],
      },
      {
        // Every public page (everything except the Studio)
        source: "/((?!studio).*)",
        headers: [
          { key: "Content-Security-Policy", value: SITE_CSP },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
      {
        source: "/studio/:path*",
        headers: [{ key: "Content-Security-Policy-Report-Only", value: STUDIO_CSP }],
      },
      {
        // Local brand images and the PDF worker rarely change.
        source: "/assets/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
