// Data-access layer.
//
// Components import from here (e.g. `import { getCoverStories } from "@/lib/data"`).
// For now, each function returns a hard-coded array. When Sanity goes live,
// we only edit this file — swap the body for a GROQ query — and no component
// has to change.
//
// Keeping these async now so the switchover is a no-op at the call sites.

import { HEADLINES } from "@/data/headlines";
import { RELEASE_COVERS, GET_FEATURED_COVERS } from "@/data/magazines";
import { MAGAZINE_EDITIONS } from "@/data/magazineEditions";
import { COVER_STORIES } from "@/data/coverStories";
import { NEWS_CARDS, VITAL_UPDATES, FEATURED_ARTICLES } from "@/data/news";
import { WOMEN_LEADERS } from "@/data/womenLeaders";
import { PODCASTS } from "@/data/podcasts";
import { TESTIMONIALS } from "@/data/testimonials";

export async function getHeadlines() {
  return HEADLINES;
}

export async function getReleaseCovers() {
  return RELEASE_COVERS;
}

export async function getGetFeaturedCovers() {
  return GET_FEATURED_COVERS;
}

export async function getMagazineEditions() {
  return MAGAZINE_EDITIONS;
}

export async function getMagazineEditionBySlug(slug: string) {
  return MAGAZINE_EDITIONS.find((m) => m.slug === slug) ?? null;
}

export async function getOtherMagazineEditions(currentSlug: string, limit = 4) {
  return MAGAZINE_EDITIONS.filter((m) => m.slug !== currentSlug).slice(0, limit);
}

export type MagazineSort = "newest" | "oldest";

export type MagazineQuery = {
  q?: string;        // free-text search across name, title, subtitle
  year?: number;     // exact year match on publishedYear
  sort?: MagazineSort;
  page?: number;     // 1-indexed
  perPage?: number;
};

// All sort/filter/paginate logic lives in one place so the page component
// just reads `searchParams` and asks for data; the swap to Sanity GROQ is
// a one-file change.
export async function searchMagazineEditions(query: MagazineQuery = {}) {
  const { q, year, sort = "newest", page = 1, perPage = 12 } = query;

  const normalised = q?.trim().toLowerCase() ?? "";
  const matches = (m: (typeof MAGAZINE_EDITIONS)[number]) => {
    if (year && m.publishedYear !== year) return false;
    if (!normalised) return true;
    return (
      m.featuredPersonName.toLowerCase().includes(normalised) ||
      m.title.toLowerCase().includes(normalised) ||
      m.subtitle.toLowerCase().includes(normalised) ||
      m.editionLabel.toLowerCase().includes(normalised)
    );
  };

  const filtered = MAGAZINE_EDITIONS.filter(matches);

  // The source list is already ordered newest-first by convention; a sort
  // keeps that intent explicit rather than depending on insertion order.
  const sorted = sort === "oldest" ? [...filtered].reverse() : filtered;

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  const items = sorted.slice(start, start + perPage);

  const years = Array.from(new Set(MAGAZINE_EDITIONS.map((m) => m.publishedYear)))
    .sort((a, b) => b - a);

  return { items, total, totalPages, page: safePage, perPage, years };
}

export async function getCoverStories() {
  return COVER_STORIES;
}

export async function getNewsCards() {
  return NEWS_CARDS;
}

export async function getVitalUpdates() {
  return VITAL_UPDATES;
}

export async function getFeaturedArticles() {
  return FEATURED_ARTICLES;
}

export async function getWomenLeaders() {
  return WOMEN_LEADERS;
}

export async function getPodcasts() {
  return PODCASTS;
}

export async function getTestimonials() {
  return TESTIMONIALS;
}
