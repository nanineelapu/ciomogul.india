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
import { ARTICLES, CATEGORY_ORDER } from "@/data/articles";
import { ABOUT, type AboutContent } from "@/data/about";
import { PAGE_CONTENT, type PageContent, type PageText } from "@/data/pageContent";
import { TERMS, type LegalContent } from "@/data/terms";
import { PRIVACY } from "@/data/privacy";
import { SOCIAL, WHATSAPP_URL, type SocialKey } from "@/data/social";
import { DEFAULT_DESCRIPTION } from "@/lib/seo";
import { SITE_TEXT, mergeSiteText, type SiteText } from "@/data/siteText";
import { WOMEN_LEADERS } from "@/data/womenLeaders";
import { PODCASTS } from "@/data/podcasts";
import { TESTIMONIALS } from "@/data/testimonials";
import { INDUSTRIES, type Industry } from "@/data/industries";
import { sanityConfigured } from "@/sanity/env";
import { sanityFetch } from "@/sanity/lib/client";
import { urlForOrDefault } from "@/sanity/lib/image";
import {
  SITE_TEXT_QUERY,
  PAGE_CONTENT_QUERY,
  ABOUT_QUERY,
  ARTICLES_QUERY,
  HALL_OF_FAME_QUERY,
  LEGAL_QUERY,
  SITE_SETTINGS_QUERY,
  COVER_STORIES_QUERY,
  FEATURED_ARTICLES_QUERY,
  GET_FEATURED_COVERS_QUERY,
  HEADLINES_QUERY,
  INDUSTRIES_QUERY,
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
  Article,
  Category,
  Seo,
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

// Where a home page item should go: the article an editor picked, else an
// optional custom link, else the Articles page.
function articleHref(articleSlug?: string | null, custom?: string | null): string {
  if (articleSlug) return `/articles/${articleSlug}`;
  return custom || "/articles";
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

type RawHeadline = { slug: string; text: string; articleSlug?: string | null; href?: string };
export async function getHeadlines(): Promise<Headline[]> {
  return withFallback<Headline[]>(async () => {
    const rows = await sanityFetch<RawHeadline[]>({ query: HEADLINES_QUERY });
    return rows.map((r) => ({ slug: r.slug, text: r.text, href: articleHref(r.articleSlug, r.href) }));
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
    href: `/magazines/${r.slug}`,
    title: r.title ?? "",
    coverImage: mapImage(r.coverImage, fallback),
    alt: r.alt ?? "",
  };
}
export async function getReleaseCovers(): Promise<Magazine[]> {
  return withFallback<Magazine[]>(async () => {
    // No homepage document yet means Sanity answers null; treat that as an empty list.
    const rows = (await sanityFetch<RawCover[] | null>({ query: RELEASE_COVERS_QUERY })) ?? [];
    return rows.map((r, i) => mapCover(r, RELEASE_COVERS[i % RELEASE_COVERS.length].coverImage));
  }, RELEASE_COVERS);
}

export async function getGetFeaturedCovers(): Promise<Magazine[]> {
  return withFallback<Magazine[]>(async () => {
    const rows = (await sanityFetch<RawCover[] | null>({ query: GET_FEATURED_COVERS_QUERY })) ?? [];
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
    const rows = (await sanityFetch<RawCoverStory[] | null>({ query: COVER_STORIES_QUERY })) ?? [];
    return rows.map((r, i) => ({
      slug: r.slug,
      href: `/magazines/${r.slug}`,
      name: r.name,
      role: r.role ?? "",
      tag: r.tag ?? "",
      image: mapImage(r.image, COVER_STORIES[i % COVER_STORIES.length].image),
    }));
  }, COVER_STORIES);
}

// ─── News ────────────────────────────────────────────────────────────────

type RawNewsCard = {
  articleSlug?: string | null;
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
      href: articleHref(r.articleSlug),
      title: r.title,
      category: r.category ?? "",
      date: r.date ?? "",
      image: r.image ? mapImage(r.image, NEWS_CARDS[i % NEWS_CARDS.length].image ?? "") : null,
      alt: r.alt,
    }));
  }, NEWS_CARDS);
}

type RawVitalUpdate = { slug: string; articleSlug?: string | null; title: string; description: string | null };
export async function getVitalUpdates(): Promise<VitalUpdate[]> {
  return withFallback<VitalUpdate[]>(async () => {
    const rows = await sanityFetch<RawVitalUpdate[]>({ query: VITAL_UPDATES_QUERY });
    return rows.map((r) => ({ ...r, href: articleHref(r.articleSlug) }));
  }, VITAL_UPDATES);
}

type RawFeaturedArticle = {
  slug: string;
  articleSlug?: string | null;
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
      href: articleHref(r.articleSlug),
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

type RawHall = Omit<HallOfFameEntry, "portrait"> & { portrait?: SanityImage };

export async function getHallOfFame(): Promise<HallOfFameEntry[]> {
  return withFallback<HallOfFameEntry[]>(async () => {
    const rows = await sanityFetch<RawHall[]>({ query: HALL_OF_FAME_QUERY });
    return rows.map((r, i) => ({
      ...r,
      portrait: mapImage(r.portrait, HALL_OF_FAME[i % HALL_OF_FAME.length].portrait),
    }));
  }, HALL_OF_FAME);
}

export async function getHallEntryBySlug(slug: string): Promise<HallOfFameEntry | null> {
  return (await getHallOfFame()).find((e) => e.slug === slug) ?? null;
}

// Entries immediately before and after the given slug in roll order (newest first).
export async function getAdjacentHallEntries(slug: string): Promise<{
  prev: HallOfFameEntry | null;
  next: HallOfFameEntry | null;
}> {
  const roll = await getHallOfFame();
  const i = roll.findIndex((e) => e.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? roll[i - 1] : null,
    next: i < roll.length - 1 ? roll[i + 1] : null,
  };
}

// ─── Articles ────────────────────────────────────────────────────────────
type RawArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: string;
  image?: SanityImage;
  alt: string;
  isTopStory: boolean;
  body: string[];
  seo?: Seo | null;
};

const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

export async function getArticles(): Promise<Article[]> {
  return withFallback<Article[]>(async () => {
    const rows = await sanityFetch<RawArticle[]>({ query: ARTICLES_QUERY });
    return rows.map((r, i) => ({
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      category: r.category,
      categorySlug: r.category.toLowerCase(),
      author: r.author,
      date: formatDate(r.publishDate),
      publishedYear: Number(r.publishDate.slice(0, 4)),
      image: mapImage(r.image, ARTICLES[i % ARTICLES.length].image),
      alt: r.alt,
      readTime: r.readTime || undefined,
      isTopStory: r.isTopStory,
      body: r.body,
      isoDate: r.publishDate,
      seo: r.seo,
    }));
  }, ARTICLES);
}

export async function getTopStoryArticles(limit = 3): Promise<Article[]> {
  return (await getArticles()).filter((a) => a.isTopStory).slice(0, limit);
}

// Each article should appear once on /articles: Top Stories first, then the
// newest remaining ones as Latest, then everything left as the archive that
// the category tabs explore. Articles are sorted newest first.
const LATEST_COUNT = 6;

async function nonTop(): Promise<Article[]> {
  return (await getArticles()).filter((a) => !a.isTopStory);
}

async function archivePool(): Promise<Article[]> {
  return (await nonTop()).slice(LATEST_COUNT);
}

export async function getLatestArticles(limit = LATEST_COUNT): Promise<Article[]> {
  return (await nonTop()).slice(0, limit);
}

// Category list with live counts derived from the archive.
export async function getCategoriesWithCounts(): Promise<Category[]> {
  const pool = await archivePool();
  return CATEGORY_ORDER.map((c) => ({
    slug: c.slug,
    name: c.name,
    count:
      c.slug === ""
        ? pool.length
        : pool.filter((a) => a.categorySlug === c.slug).length,
  }));
}

export type ArticleSort = "newest" | "oldest";

export type ArticleQuery = {
  q?: string;
  category?: string;
  sort?: ArticleSort;
  page?: number;
  perPage?: number;
};

export async function searchArticles(query: ArticleQuery = {}) {
  const { q, category, sort = "newest", page = 1, perPage = 9 } = query;
  const normalised = q?.trim().toLowerCase() ?? "";

  const matches = (a: Article) => {
    if (category && a.categorySlug !== category) return false;
    if (!normalised) return true;
    return (
      a.title.toLowerCase().includes(normalised) ||
      a.excerpt.toLowerCase().includes(normalised) ||
      a.author.toLowerCase().includes(normalised)
    );
  };

  const filtered = (await archivePool()).filter(matches);
  const sorted = sort === "oldest" ? [...filtered].reverse() : filtered;

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  const items = sorted.slice(start, start + perPage);

  return { items, total, totalPages, page: safePage, perPage };
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

// ─── Industries (home page) ──────────────────────────────────────────────

export async function getIndustries(): Promise<Industry[]> {
  return withFallback<Industry[]>(async () => {
    const rows = await sanityFetch<Industry[]>({ query: INDUSTRIES_QUERY });
    return rows.filter((r) => r.name);
  }, INDUSTRIES);
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
  seo?: Seo | null;
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
    seo: r.seo,
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

// ─── About ───────────────────────────────────────────────────────────────
type RawAbout = Partial<{
  seo: Seo | null;
  eyebrowLeft: string;
  eyebrowRight: string;
  headline: string;
  intro: string;
  primaryButton: string;
  secondaryButton: string;
  whoWeAre: string[];
  featureLabel: string;
  featured: string[];
  coverTitle: string;
  coverIntro: string;
  whatWeCover: { title: string; text: string }[];
  joinTitle: string;
  joinText: string;
  joinPrimaryButton: string;
  joinSecondaryButton: string;
}>;

// Any field left empty in Sanity falls back to the built-in text.
export async function getAboutContent(): Promise<AboutContent> {
  return withFallback<AboutContent>(async () => {
    const r = await sanityFetch<RawAbout | null>({ query: ABOUT_QUERY });
    if (!r) return ABOUT;
    return {
      seo: r.seo ?? undefined,
      eyebrowLeft: r.eyebrowLeft || ABOUT.eyebrowLeft,
      eyebrowRight: r.eyebrowRight || ABOUT.eyebrowRight,
      headline: r.headline || ABOUT.headline,
      intro: r.intro || ABOUT.intro,
      primaryButton: r.primaryButton || ABOUT.primaryButton,
      secondaryButton: r.secondaryButton || ABOUT.secondaryButton,
      whoWeAre: r.whoWeAre?.length ? r.whoWeAre : ABOUT.whoWeAre,
      featureLabel: r.featureLabel || ABOUT.featureLabel,
      featured: r.featured?.length ? r.featured : ABOUT.featured,
      coverTitle: r.coverTitle || ABOUT.coverTitle,
      coverIntro: r.coverIntro || ABOUT.coverIntro,
      whatWeCover: r.whatWeCover?.length ? r.whatWeCover : ABOUT.whatWeCover,
      join: {
        title: r.joinTitle || ABOUT.join.title,
        text: r.joinText || ABOUT.join.text,
        primaryButton: r.joinPrimaryButton || ABOUT.join.primaryButton,
        secondaryButton: r.joinSecondaryButton || ABOUT.join.secondaryButton,
      },
    };
  }, ABOUT);
}

// ─── Terms and Privacy ───────────────────────────────────────────────────
type RawLegal = {
  title: string;
  seo?: Seo | null;
  intro: string;
  sections: { title: string; paragraphs: { ref?: string; text: string }[]; email?: string }[];
};

export async function getLegalContent(kind: "terms" | "privacy"): Promise<LegalContent> {
  const fallback = kind === "terms" ? TERMS : PRIVACY;
  return withFallback<LegalContent>(async () => {
    const r = await sanityFetch<RawLegal | null>({ query: LEGAL_QUERY, params: { kind } });
    if (!r || !r.sections || r.sections.length === 0) return fallback;
    return {
      title: r.title,
      seo: r.seo ?? undefined,
      intro: r.intro,
      sections: r.sections.map((sec) => ({
        title: sec.title,
        paragraphs: sec.paragraphs.map((p) => (p.ref ? { ref: p.ref, text: p.text } : p.text)),
        email: sec.email || undefined,
      })),
    };
  }, fallback);
}

// ─── Site settings (contact details + social links) ──────────────────────
export type SiteSettings = {
  description: string;
  keywords: string[];
  email: string;
  phone: string;
  phoneHref: string;
  office: string;
  whatsappUrl: string;
  social: { key: SocialKey; label: string; href: string }[];
};

const SETTINGS_FALLBACK: SiteSettings = {
  description: DEFAULT_DESCRIPTION,
  keywords: [],
  email: "info@ciomogulindia.com",
  phone: "+91 95292 03836",
  phoneHref: "tel:+919529203836",
  office: "Mumbai, Maharashtra, India",
  whatsappUrl: WHATSAPP_URL,
  social: SOCIAL.map((x) => ({ key: x.key, label: x.label, href: x.href })),
};

type RawSettings = Partial<Record<"email" | "phone" | "office" | SocialKey, string>> & {
  siteDescription?: string;
  keywords?: string[];
};

export async function getSiteSettings(): Promise<SiteSettings> {
  return withFallback<SiteSettings>(async () => {
    const r = await sanityFetch<RawSettings | null>({ query: SITE_SETTINGS_QUERY });
    if (!r) return SETTINGS_FALLBACK;
    const phone = r.phone || SETTINGS_FALLBACK.phone;
    return {
      description: r.siteDescription || SETTINGS_FALLBACK.description,
      keywords: r.keywords ?? [],
      email: r.email || SETTINGS_FALLBACK.email,
      phone,
      phoneHref: "tel:" + phone.replace(/[^+\d]/g, ""),
      office: r.office || SETTINGS_FALLBACK.office,
      whatsappUrl: r.whatsapp || SETTINGS_FALLBACK.whatsappUrl,
      social: SOCIAL.map((x) => ({ key: x.key, label: x.label, href: r[x.key] || x.href })),
    };
  }, SETTINGS_FALLBACK);
}

// ─── Suggestions for the bottom of detail pages ──────────────────────────
export async function getOtherHallEntries(currentSlug: string, limit = 4): Promise<HallOfFameEntry[]> {
  return (await getHallOfFame()).filter((e) => e.slug !== currentSlug).slice(0, limit);
}

export async function getOtherWomenLeaders(currentSlug: string, limit = 4): Promise<WomanLeader[]> {
  return (await getWomenLeaders()).filter((w) => w.slug !== currentSlug).slice(0, limit);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return (await getArticles()).find((a) => a.slug === slug) ?? null;
}

// Other articles to suggest at the bottom of an article: same category first,
// then the newest of the rest.
export async function getRelatedArticles(slug: string, limit = 4): Promise<Article[]> {
  const all = await getArticles();
  const current = all.find((a) => a.slug === slug);
  const others = all.filter((a) => a.slug !== slug);
  const same = others.filter((a) => current && a.categorySlug === current.categorySlug);
  const rest = others.filter((a) => !same.includes(a));
  return [...same, ...rest].slice(0, limit);
}

// ─── Page headings ───────────────────────────────────────────────────────
type RawSeo = { metaTitle?: string; metaDescription?: string; keywords?: string[] } | null;
type RawPageContent = Partial<Record<keyof PageContent, (Partial<Omit<PageText, "seo">> & { seo?: RawSeo }) | null>>;

export async function getPageContent(): Promise<PageContent> {
  return withFallback<PageContent>(async () => {
    const r = await sanityFetch<RawPageContent | null>({ query: PAGE_CONTENT_QUERY });
    if (!r) return PAGE_CONTENT;
    const pick = (key: keyof PageContent): PageText => ({
      title: r[key]?.title || PAGE_CONTENT[key].title,
      intro: r[key]?.intro || PAGE_CONTENT[key].intro,
      seo: r[key]?.seo
        ? { title: r[key]?.seo?.metaTitle, description: r[key]?.seo?.metaDescription, keywords: r[key]?.seo?.keywords }
        : undefined,
    });
    return {
      magazines: pick("magazines"),
      podcasts: pick("podcasts"),
      hallOfFame: pick("hallOfFame"),
      womenSpotlight: pick("womenSpotlight"),
      articles: pick("articles"),
      contact: pick("contact"),
    };
  }, PAGE_CONTENT);
}

// ─── Site text (menus, buttons, section titles, form labels) ─────────────
export async function getSiteText(): Promise<SiteText> {
  return withFallback<SiteText>(async () => {
    const remote = await sanityFetch<unknown>({ query: SITE_TEXT_QUERY });
    return mergeSiteText(SITE_TEXT, remote);
  }, SITE_TEXT);
}
