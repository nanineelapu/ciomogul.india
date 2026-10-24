// Public address of the site. Set NEXT_PUBLIC_SITE_URL in production.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.ciomogulindia.com"
).replace(/\/$/, "");
