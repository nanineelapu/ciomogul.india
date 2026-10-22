// Data-access layer.
//
// Each function tries Sanity first; if Sanity isn't configured, returns
// nothing, or throws, we fall back to the hard-coded arrays so the public
// site always renders. Components stay unchanged — they only know the typed
// shape, not where the data came from.

import type { Image as SanityImage } from "sanity";
import { HEADLINES } from "@/data/headlines";
import { RELEASE_COVERS, GET_FEATURED_COVERS } from "@/data/magazines";
import { MAGAZINE_EDITIONS } from "@/data/magazineEditions";
import { HALL_OF_FAME } from "@/data/hallOfFame";
import { COVER_STORIES } from "@/data/coverStories";
import { NEWS_CARDS, VITAL_UPDATES, FEATURED_ARTICLES } from "@/data/news";
import { WOMEN_LEADERS } from "@/data/womenLeaders";
import { PODCASTS } from "@/data/podcasts";
import { TESTIMONIALS } from "@/data/testimonials";
import { sanityConfigured } from "@/sanity/env";
import { sanityFetch } from "@/sanity/lib/client";
import { urlForOrDefault } from "@/sanity/lib/image";
import {
  COVER_STORIES_QUERY,
  FEATURED_ARTICLES_QUERY,
  GET_FEATURED_COVERS_QUERY,
  HEADLINES_QUERY,
  MAGAZINE_EDITIONS_QUERY,
  MAGAZINE_EDITION_BY_SLUG_QUERY,
  NEWS_CARDS_QUERY,
  PODCASTS_QUERY,
  RELEASE_COVERS_QUERY,
  TESTIMONIALS_QUERY,
  VITAL_UPDATES_QUERY,
  WOMEN_LEADERS_QUERY,
} from "@/sanity/lib/queries";
import type {
  CoverStory,
  FeaturedArticle,
  HallOfFameEntry,
  Headline,
  Magazine,
  MagazineEdition,
  NewsCard,
  Podcast,
  Testimonial,
  VitalUpdate,
  WomanLeader,
} from "@/types/content";

// Shape helper — Sanity returns the raw image object; the frontend wants a URL.
// Everywhere we read an image from Sanity we pipe it through this.
function mapImage(src: SanityImage | undefined | null, fallback: string): string {
  return urlForOrDefault(src, fallback);
}

// Small wrapper that absorbs Sanity failures and returns the fallback.
async function withFallback<T>(load: () => Promise<T>, fallback: T): Promise<T> {
  if (!sanityConfigured) return fallback;
  try {
    const result = await load();
    const empty = Array.isArray(result) ? result.length === 0 : !result;
    return empty ? fallback : result;
  } catch (err) {
    // Not console-noisy at build; this fires once per request if Sanity is
    // down and the fallback keeps the page rendering.
    console.warn("[data] Sanity fetch failed, using fallback:", err);
    return fallback;
  }
}

// ─── Headlines ───────────────────────────────────────────────────────────

type RawHeadline = { slug: string; text: string };
export async function getHeadlines(): Promise<Headline[]> {
  return withFallback<Headline[]>(async () => {
    const rows = await sanityFetch<RawHeadline[]>({ query: HEADLINES_QUERY });
    return rows.map((r) => ({ slug: r.slug, text: r.text }));
  }, HEADLINES);
}

// ─── Release covers (homepage) ───────────────────────────────────────────

type RawCover = {
  slug: string;
  title?: string;
  coverImage?: SanityImage;
  alt?: string;
};
function mapCover(r: RawCover, fallback: string): Magazine {
  return {
    slug: r.slug,
    title: r.title ?? "",
    coverImage: mapImage(r.coverImage, fallback),
    alt: r.alt ?? "",
  };
}
export async function getReleaseCovers(): Promise<Magazine[]> {
  return withFallback<Magazine[]>(async () => {
    const rows = await sanityFetch<RawCover[]>({ query: RELEASE_COVERS_QUERY });
    return rows.map((r, i) => mapCover(r, RELEASE_COVERS[i % RELEASE_COVERS.length].coverImage));
  }, RELEASE_COVERS);
}

export async function getGetFeaturedCovers(): Promise<Magazine[]> {
  return withFallback<Magazine[]>(async () => {
    const rows = await sanityFetch<RawCover[]>({ query: GET_FEATURED_COVERS_QUERY });
    return rows.map((r, i) =>
      mapCover(r, GET_FEATURED_COVERS[i % GET_FEATURED_COVERS.length].coverImage)
    );
  }, GET_FEATURED_COVERS);
}

// ─── Cover stories (homepage strip) ──────────────────────────────────────

type RawCoverStory = {
  slug: string;
  name: string;
  role?: string;
  tag?: string;
  image?: SanityImage;
};
export async function getCoverStories(): Promise<CoverStory[]> {
  return withFallback<CoverStory[]>(async () => {
    const rows = await sanityFetch<RawCoverStory[]>({ query: COVER_STORIES_QUERY });
    return rows.map((r, i) => ({
      slug: r.slug,
      name: r.name,
      role: r.role ?? "",
      tag: r.tag ?? "",
      image: mapImage(r.image, COVER_STORIES[i % COVER_STORIES.length].image),
    }));
  }, COVER_STORIES);
}

// ─── News ────────────────────────────────────────────────────────────────

type RawNewsCard = {
  slug: string;
  title: string;
  category?: string;
  date?: string;
  image?: SanityImage;
  alt?: string;
};
export async function getNewsCards(): Promise<NewsCard[]> {
  return withFallback<NewsCard[]>(async () => {
    const rows = await sanityFetch<RawNewsCard[]>({ query: NEWS_CARDS_QUERY });
    return rows.map((r, i) => ({
      slug: r.slug,
      title: r.title,
      category: r.category ?? "",
      date: r.date ?? "",
      image: r.image ? mapImage(r.image, NEWS_CARDS[i % NEWS_CARDS.length].image ?? "") : null,
      alt: r.alt,
    }));
  }, NEWS_CARDS);
}

type RawVitalUpdate = { slug: string; title: string; description: string | null };
export async function getVitalUpdates(): Promise<VitalUpdate[]> {
  return withFallback<VitalUpdate[]>(async () => {
    const rows = await sanityFetch<RawVitalUpdate[]>({ query: VITAL_UPDATES_QUERY });
    return rows;
  }, VITAL_UPDATES);
}

type RawFeaturedArticle = {
  slug: string;
  title: string;
  description?: string;
  image?: SanityImage;
  alt?: string;
};
export async function getFeaturedArticles(): Promise<FeaturedArticle[]> {
  return withFallback<FeaturedArticle[]>(async () => {
    const rows = await sanityFetch<RawFeaturedArticle[]>({ query: FEATURED_ARTICLES_QUERY });
    return rows.map((r, i) => ({
      slug: r.slug,
      title: r.title,
      description: r.description ?? "",
      image: mapImage(r.image, FEATURED_ARTICLES[i % FEATURED_ARTICLES.length].image),
      alt: r.alt ?? r.title,
    }));
  }, FEATURED_ARTICLES);
}

// ─── Women leaders ───────────────────────────────────────────────────────

type RawWomanLeader = {
  slug: string;
  name: string;
  role?: string;
  organization?: string;
  image?: SanityImage;
  featuredYear?: number;
  featuredOn?: string;
  bio?: string[];
};
export async function getWomenLeaders(): Promise<WomanLeader[]> {
  return withFallback<WomanLeader[]>(async () => {
    const rows = await sanityFetch<RawWomanLeader[]>({ query: WOMEN_LEADERS_QUERY });
    return rows.map((r, i) => ({
      slug: r.slug,
      name: r.name,
      role: r.role ?? "",
      organization: r.organization ?? "",
      image: mapImage(r.image, WOMEN_LEADERS[i % WOMEN_LEADERS.length].image),
      featuredYear: r.featuredYear,
      featuredOn: r.featuredOn ?? "",
      bio: r.bio ?? [],
    }));
  }, WOMEN_LEADERS);
}

export async function getWomanLeaderBySlug(slug: string): Promise<WomanLeader | null> {
  const all = await getWomenLeaders();
  return all.find((w) => w.slug === slug) ?? null;
}

export async function getAdjacentWomenLeaders(slug: string): Promise<{
  prev: WomanLeader | null;
  next: WomanLeader | null;
}> {
  const all = await getWomenLeaders();
  const i = all.findIndex((w) => w.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? all[i - 1] : null,
    next: i < all.length - 1 ? all[i + 1] : null,
  };
}

export type WomenSort = "newest" | "oldest";

export type WomenQuery = {
  q?: string;
  year?: number;
  sort?: WomenSort;
  page?: number;
  perPage?: number;
};

export async function searchWomenLeaders(query: WomenQuery = {}) {
  const { q, year, sort = "newest", page = 1, perPage = 12 } = query;
  const leaders = await getWomenLeaders();

  const normalised = q?.trim().toLowerCase() ?? "";
  const matches = (w: WomanLeader) => {
    if (year && w.featuredYear !== year) return false;
    if (!normalised) return true;
    return (
      w.name.toLowerCase().includes(normalised) ||
      w.role.toLowerCase().includes(normalised) ||
      w.organization.toLowerCase().includes(normalised)
    );
  };

  const filtered = leaders.filter(matches);
  // Insertion order is newest-first; respect it rather than parse free-form
  // display strings.
  const sorted = sort === "oldest" ? [...filtered].reverse() : filtered;

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  const items = sorted.slice(start, start + perPage);

  const years = Array.from(
    new Set(leaders.map((w) => w.featuredYear).filter((y): y is number => typeof y === "number"))
  ).sort((a, b) => b - a);

  return { items, total, totalPages, page: safePage, perPage, years };
}

// ─── Podcasts ────────────────────────────────────────────────────────────

type RawPodcast = {
  slug: string;
  title: string;
  date?: string;
  youtubeUrl: string;
  thumbnail?: SanityImage;
  publishedYear?: number;
  description?: string;
  duration?: string;
};
export async function getPodcasts(): Promise<Podcast[]> {
  return withFallback<Podcast[]>(async () => {
    const rows = await sanityFetch<RawPodcast[]>({ query: PODCASTS_QUERY });
    return rows.map((r, i) => ({
      slug: r.slug,
      title: r.title,
      date: r.date ?? "",
      youtubeUrl: r.youtubeUrl,
      thumbnail: mapImage(r.thumbnail, PODCASTS[i % PODCASTS.length].thumbnail),
      publishedYear: r.publishedYear,
      description: r.description ?? "",
      duration: r.duration ?? "",
    }));
  }, PODCASTS);
}

// Archive search for /podcasts. Mirrors searchMagazineEditions so the page
// component looks the same; move to GROQ-level filtering if the catalogue
// ever grows past a few hundred rows.
export type PodcastSort = "newest" | "oldest";

export type PodcastQuery = {
  q?: string;
  year?: number;
  sort?: PodcastSort;
  page?: number;
  perPage?: number;
};

export async function searchPodcasts(query: PodcastQuery = {}) {
  const { q, year, sort = "newest", page = 1, perPage = 9 } = query;
  const podcasts = await getPodcasts();

  const normalised = q?.trim().toLowerCase() ?? "";
  const matches = (p: Podcast) => {
    if (year && p.publishedYear !== year) return false;
    if (!normalised) return true;
    return (
      p.title.toLowerCase().includes(normalised) ||
      (p.description ?? "").toLowerCase().includes(normalised)
    );
  };

  const filtered = podcasts.filter(matches);
  // Insertion order in the array is already newest-first; respect it rather
  // than parse free-form `date` strings.
  const sorted = sort === "oldest" ? [...filtered].reverse() : filtered;

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  const items = sorted.slice(start, start + perPage);

  const years = Array.from(
    new Set(podcasts.map((p) => p.publishedYear).filter((y): y is number => typeof y === "number"))
  ).sort((a, b) => b - a);

  return { items, total, totalPages, page: safePage, perPage, years };
}

// ─── Hall of Fame ────────────────────────────────────────────────────────
// Sanity schema will come when the client wants to edit the roll in the CMS.
// For now the fetcher just returns the hard-coded array; the search layer
// below keeps the component shape identical to magazines and podcasts.

export async function getHallOfFame(): Promise<HallOfFameEntry[]> {
  return HALL_OF_FAME;
}

export async function getHallEntryBySlug(slug: string): Promise<HallOfFameEntry | null> {
  return HALL_OF_FAME.find((e) => e.slug === slug) ?? null;
}

// Returns the entries immediately before/after `slug` in the natural roll
// order (newest-first — matches /hall-of-fame default). Null when at an end.
export async function getAdjacentHallEntries(slug: string): Promise<{
  prev: HallOfFameEntry | null;
  next: HallOfFameEntry | null;
}> {
  const roll = HALL_OF_FAME;
  const i = roll.findIndex((e) => e.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? roll[i - 1] : null,
    next: i < roll.length - 1 ? roll[i + 1] : null,
  };
}

export type HallSort = "newest" | "oldest";

export type HallQuery = {
  q?: string;
  year?: number;
  sort?: HallSort;
  page?: number;
  perPage?: number;
};

export async function searchHallOfFame(query: HallQuery = {}) {
  const { q, year, sort = "newest", page = 1, perPage = 10 } = query;
  const entries = await getHallOfFame();

  const normalised = q?.trim().toLowerCase() ?? "";
  const matches = (e: HallOfFameEntry) => {
    if (year && e.inductionYear !== year) return false;
    if (!normalised) return true;
    return (
      e.name.toLowerCase().includes(normalised) ||
      e.role.toLowerCase().includes(normalised) ||
      e.organization.toLowerCase().includes(normalised) ||
      e.pullQuote.toLowerCase().includes(normalised)
    );
  };

  const filtered = entries.filter(matches);
  // Newest (highest serial) first by default.
  const sorted =
    sort === "oldest"
      ? [...filtered].sort((a, b) => a.serial - b.serial)
      : [...filtered].sort((a, b) => b.serial - a.serial);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  const items = sorted.slice(start, start + perPage);

  const years = Array.from(new Set(entries.map((e) => e.inductionYear))).sort(
    (a, b) => b - a
  );

  return { items, total, totalPages, page: safePage, perPage, years };
}

// ─── Testimonials ────────────────────────────────────────────────────────

type RawTestimonial = { name: string; role?: string; quote: string; avatar?: SanityImage };
export async function getTestimonials(): Promise<Testimonial[]> {
  return withFallback<Testimonial[]>(async () => {
    const rows = await sanityFetch<RawTestimonial[]>({ query: TESTIMONIALS_QUERY });
    return rows.map((r, i) => ({
      name: r.name,
      role: r.role ?? "",
      quote: r.quote,
      avatar: mapImage(r.avatar, TESTIMONIALS[i % TESTIMONIALS.length].avatar),
    }));
  }, TESTIMONIALS);
}

// ─── Magazine editions ───────────────────────────────────────────────────

type RawEdition = {
  slug: string;
  editionLabel: string;
  featuredPersonName: string;
  title: string;
  subtitle: string;
  coverImage?: SanityImage;
  coverAlt: string;
  pullQuote: string;
  pullQuoteAttribution: string;
  roleTags: string[];
  pdfUrl: string | null;
  publishedOn: string;
  publishedYear: number;
  body: string[];
};
function mapEdition(r: RawEdition, fallbackCover: string): MagazineEdition {
  return {
    slug: r.slug,
    editionLabel: r.editionLabel,
    featuredPersonName: r.featuredPersonName,
    title: r.title,
    subtitle: r.subtitle,
    coverImage: mapImage(r.coverImage, fallbackCover),
    coverAlt: r.coverAlt,
    pullQuote: r.pullQuote,
    pullQuoteAttribution: r.pullQuoteAttribution,
    roleTags: r.roleTags ?? [],
    pdfUrl: r.pdfUrl ?? null,
    publishedOn: r.publishedOn,
    publishedYear: r.publishedYear,
    body: r.body ?? [],
  };
}

export async function getMagazineEditions(): Promise<MagazineEdition[]> {
  return withFallback<MagazineEdition[]>(async () => {
    const rows = await sanityFetch<RawEdition[]>({ query: MAGAZINE_EDITIONS_QUERY });
    return rows.map((r, i) =>
      mapEdition(r, MAGAZINE_EDITIONS[i % MAGAZINE_EDITIONS.length].coverImage)
    );
  }, MAGAZINE_EDITIONS);
}

export async function getMagazineEditionBySlug(slug: string): Promise<MagazineEdition | null> {
  // When Sanity isn't configured, use the hard-coded data directly.
  if (!sanityConfigured) {
    return MAGAZINE_EDITIONS.find((m) => m.slug === slug) ?? null;
  }
  try {
    const r = await sanityFetch<RawEdition | null>({
      query: MAGAZINE_EDITION_BY_SLUG_QUERY,
      params: { slug },
    });
    if (!r) return MAGAZINE_EDITIONS.find((m) => m.slug === slug) ?? null;
    const fallbackCover =
      MAGAZINE_EDITIONS.find((m) => m.slug === slug)?.coverImage ??
      MAGAZINE_EDITIONS[0].coverImage;
    return mapEdition(r, fallbackCover);
  } catch (err) {
    console.warn("[data] getMagazineEditionBySlug fallback:", err);
    return MAGAZINE_EDITIONS.find((m) => m.slug === slug) ?? null;
  }
}

export async function getOtherMagazineEditions(
  currentSlug: string,
  limit = 4
): Promise<MagazineEdition[]> {
  const all = await getMagazineEditions();
  return all.filter((m) => m.slug !== currentSlug).slice(0, limit);
}

// ─── Archive filter / sort / paginate ────────────────────────────────────
// Filtering happens on the already-loaded list rather than issuing a new
// GROQ query per filter combination. With a few hundred editions this is
// cheap and keeps the sort/filter/paginate logic in one place.

export type MagazineSort = "newest" | "oldest";

export type MagazineQuery = {
  q?: string;
  year?: number;
  sort?: MagazineSort;
  page?: number;
  perPage?: number;
};

export async function searchMagazineEditions(query: MagazineQuery = {}) {
  const { q, year, sort = "newest", page = 1, perPage = 12 } = query;
  const editions = await getMagazineEditions();

  const normalised = q?.trim().toLowerCase() ?? "";
  const matches = (m: MagazineEdition) => {
    if (year && m.publishedYear !== year) return false;
    if (!normalised) return true;
    return (
      m.featuredPersonName.toLowerCase().includes(normalised) ||
      m.title.toLowerCase().includes(normalised) ||
      m.subtitle.toLowerCase().includes(normalised) ||
      m.editionLabel.toLowerCase().includes(normalised)
    );
  };

  const filtered = editions.filter(matches);
  const sorted =
    sort === "oldest"
      ? [...filtered].sort((a, b) => a.publishedYear - b.publishedYear)
      : [...filtered].sort((a, b) => b.publishedYear - a.publishedYear);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  const items = sorted.slice(start, start + perPage);

  const years = Array.from(new Set(editions.map((m) => m.publishedYear))).sort(
    (a, b) => b - a
  );

  return { items, total, totalPages, page: safePage, perPage, years };
}
