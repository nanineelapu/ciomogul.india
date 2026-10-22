import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { dataset, projectId } from "../env";

// Builder used by every component that renders a Sanity image. Call .url() on
// the chain; without a configured project the output is undefined and callers
// fall back to the local /public/assets/* path.
const builder = projectId
  ? createImageUrlBuilder({ projectId, dataset })
  : null;

export function urlFor(source: Image | undefined | null) {
  if (!source || !builder) return null;
  return builder.image(source);
}

export function urlForOrDefault(
  source: Image | undefined | null,
  fallback: string
): string {
  const url = urlFor(source)?.auto("format").fit("max").url();
  return url ?? fallback;
}
