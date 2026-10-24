import { createClient, type ClientConfig, type SanityClient } from "next-sanity";
import { cacheLife, cacheTag } from "next/cache";
import { apiVersion, dataset, projectId, sanityConfigured } from "../env";

// Lazy client. createClient() throws immediately when projectId is empty, so
// it must not run at import time or the site could not start without keys.
let _client: SanityClient | null = null;
function getClient(): SanityClient {
  if (_client) return _client;
  const config: ClientConfig = {
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    perspective: "published",
  };
  _client = createClient(config);
  return _client;
}

// Exported for callers that know Sanity is configured.
export const sanityClient = new Proxy({} as SanityClient, {
  get(_target, prop) {
    return (getClient() as unknown as Record<string | symbol, unknown>)[prop as string | symbol];
  },
});

// Cached with Next's `use cache`: identical queries are answered from the
// cache, pages can be prerendered, and a Sanity publish clears everything via
// the "sanity" tag (see /api/revalidate). Content also refreshes on its own
// roughly every minute.
async function cachedFetch<T>(
  query: string,
  params: Record<string, unknown>,
  tags: string[]
): Promise<T> {
  "use cache";
  cacheLife("minutes");
  cacheTag(...tags);
  return getClient().fetch<T>(query, params);
}

export async function sanityFetch<T>({
  query,
  params = {},
  tags = ["sanity"],
}: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
}): Promise<T> {
  if (!sanityConfigured) {
    // Thrown before the cached function so the failure is never cached. The
    // data layer catches it and uses the built-in content instead.
    throw new Error(
      "Sanity not configured (NEXT_PUBLIC_SANITY_PROJECT_ID missing) — using fallback data."
    );
  }
  return cachedFetch<T>(query, params, tags);
}
