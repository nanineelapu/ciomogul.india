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
