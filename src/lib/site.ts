// Public address of the site, used for canonical links, the sitemap and share
// cards. In order: NEXT_PUBLIC_SITE_URL (set this once the real domain is live),
// then the Vercel production address, then the planned domain.
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "https://www.ciomogulindia.com";
}

export const SITE_URL = resolveSiteUrl().replace(/\/$/, "");
