import type { MetadataRoute } from "next";
import { getArticles, getHallOfFame, getMagazineEditions } from "@/lib/data";
import { getPublishedProfiles } from "@/lib/data/spotlight";
import { storyHref } from "@/data/womenSpotlightData";
import { absoluteUrl } from "@/lib/seo";
import { sanityConfigured } from "@/sanity/env";
import { sanityFetch } from "@/sanity/lib/client";

// Built from Sanity on every refresh, so anything an editor publishes is listed
// with its real "last updated" date and its main image. If Sanity can't be
// reached, the same pages are listed from the site's built-in content.

type Doc = {
  _type: "magazineEdition" | "hallOfFame" | "article" | "spotlightProfile";
  slug: string;
  updated: string;
  status?: string;
  image?: string | null;
};

const DOCS_QUERY = /* groq */ `
  *[_type in ["magazineEdition", "hallOfFame", "article", "spotlightProfile"] && defined(slug.current)] {
    _type,
    "slug": slug.current,
    "updated": _updatedAt,
    status,
    "image": coalesce(cover.asset->url, portrait.asset->url, image.asset->url)
  }
`;

const PATHS: Record<Doc["_type"], (slug: string) => string> = {
  magazineEdition: (s) => `/magazines/${s}`,
  hallOfFame: (s) => `/hall-of-fame/${s}`,
  article: (s) => `/articles/${s}`,
  spotlightProfile: (s) => storyHref(s),
};

const PRIORITY: Record<Doc["_type"], number> = {
  article: 0.7,
  magazineEdition: 0.7,
  hallOfFame: 0.6,
  spotlightProfile: 0.6,
};

const STATIC: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/articles", priority: 0.9, changeFrequency: "daily" },
  { path: "/magazines", priority: 0.9, changeFrequency: "weekly" },
  { path: "/podcasts", priority: 0.8, changeFrequency: "weekly" },
  { path: "/hall-of-fame", priority: 0.8, changeFrequency: "weekly" },
  { path: "/women-spotlight", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
];

async function fromSanity(): Promise<Doc[] | null> {
  if (!sanityConfigured) return null;
  try {
    const docs = await sanityFetch<Doc[]>({ query: DOCS_QUERY });
    return docs.length ? docs : null;
  } catch {
    return null;
  }
}

async function fromBuiltIn(): Promise<Doc[]> {
  const [editions, hall, articles, profiles] = await Promise.all([
    getMagazineEditions(),
    getHallOfFame(),
    getArticles(),
    getPublishedProfiles(),
  ]);
  const now = new Date().toISOString();
  return [
    ...editions.map((e) => ({ _type: "magazineEdition" as const, slug: e.slug, updated: now, image: e.coverImage })),
    ...hall.map((e) => ({ _type: "hallOfFame" as const, slug: e.slug, updated: now, image: e.portrait })),
    ...articles.map((a) => ({ _type: "article" as const, slug: a.slug, updated: a.isoDate || now, image: a.image })),
    ...profiles.map((p) => ({ _type: "spotlightProfile" as const, slug: p.id, updated: now, status: "published", image: p.cover })),
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = ((await fromSanity()) ?? (await fromBuiltIn()))
    // Profiles still under review have no page of their own.
    .filter((d) => d._type !== "spotlightProfile" || d.status !== "pending");

  // The listing pages change whenever something in them does.
  const newest = docs.reduce((max, d) => (d.updated > max ? d.updated : max), "");
  const lastModified = newest ? new Date(newest) : new Date();

  return [
    ...STATIC.map((p) => ({
      url: absoluteUrl(p.path),
      lastModified: p.priority >= 0.8 ? lastModified : undefined,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...docs.map((d) => ({
      url: absoluteUrl(PATHS[d._type](d.slug)),
      lastModified: new Date(d.updated),
      changeFrequency: d._type === "article" ? ("weekly" as const) : ("monthly" as const),
      priority: PRIORITY[d._type],
      ...(d.image ? { images: [absoluteUrl(d.image)] } : {}),
    })),
  ];
}
