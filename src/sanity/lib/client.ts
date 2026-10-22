import { createClient, type ClientConfig, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId, sanityConfigured } from "../env";

// Lazy client. createClient() throws immediately when projectId is empty, so
// we must not instantiate it at module load — otherwise *any* file that
// transitively imports the data layer fails before our fallbacks can run.
//
// sanityFetch() asks for the client only when it's about to make a request,
// and short-circuits to a Promise rejection when Sanity isn't configured,
// which withFallback() in the data layer catches and swaps for the local
// hard-coded data.
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

// Exported for the Studio and for callers that know Sanity is configured.
// Reading .sanityClient when sanityConfigured is false will throw — gate it.
export const sanityClient = new Proxy({} as SanityClient, {
  get(_target, prop) {
    return (getClient() as unknown as Record<string | symbol, unknown>)[prop as string | symbol];
  },
});

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
    // Thrown so withFallback() in the data layer catches it and returns the
    // hard-coded array. Dev-mode console will show one warning line and move on.
    throw new Error(
      "Sanity not configured (NEXT_PUBLIC_SANITY_PROJECT_ID missing) — using fallback data."
    );
  }
  return getClient().fetch<T>(query, params, {
    next: { tags, revalidate: 60 },
  });
}
