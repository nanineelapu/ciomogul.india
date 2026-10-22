import { createClient, type ClientConfig } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

// One client, used from server components. `useCdn: true` is correct for
// public reads; the webhook-driven /api/revalidate flow is what refreshes
// stale responses after a publish.
const config: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
};

export const sanityClient = createClient(config);

// A small helper that lets callers tag their fetch so revalidateTag("sanity")
// clears every one of them at once. We pass tags in via `next` because that's
// the Next 16 fetch shape next-sanity re-exposes.
export async function sanityFetch<T>({
  query,
  params = {},
  tags = ["sanity"],
}: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
}): Promise<T> {
  return sanityClient.fetch<T>(query, params, {
    next: { tags, revalidate: 60 },
  });
}
