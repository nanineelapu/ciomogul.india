// Single source of truth for Sanity env values. Reads once at module load.
// Everything else imports from here — including the Studio config, the server
// client and the image URL builder — so swapping dev/prod is a one-file job.

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-03-01";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

export const studioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "/studio";

// True only when the deployment actually has credentials wired in. The data
// layer uses this flag to decide whether to try Sanity at all — if false, we
// skip the network call and return the hard-coded fallback immediately.
export const sanityConfigured = Boolean(projectId);
