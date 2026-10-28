// Shared content types.
// These shapes mirror the Sanity schema we'll switch to later; keeping them
// here means the component JSX won't change when the data source does.

export type Magazine = {
  slug: string;
  href: string;          // the edition page this cover opens
  title: string;
  coverImage: string;
  alt: string;
};

// Full edition record for /magazines and /magazines/[slug].
// Every text field is dummy for now; each one maps 1:1 to a Sanity field later.
export type MagazineEdition = {
  slug: string;
  editionLabel: string;         // e.g. "Edition 014 · October 2026"
  featuredPersonName: string;   // e.g. "Kannan Subbiah"
  title: string;                // long editorial headline
  subtitle: string;             // one-line summary under the title
  coverImage: string;
  coverAlt: string;
  pullQuote: string;            // short quote shown next to the cover
  pullQuoteAttribution: string; // name + role beneath the quote
  roleTags: string[];           // e.g. ["Fractional CISO", "Board Advisor"]
  pdfUrl: string | null;        // null until a PDF is uploaded
  publishedOn: string;          // display string; no Date parsing needed
  publishedYear: number;        // used by the archive filter — kept separate so
                                // the display string stays free-form
  body: string[];               // paragraphs for the "Inside this edition" block
  seo?: Seo | null;
};

export type CoverStory = {
  slug: string;
  href: string;
  name: string;
  role: string;
  tag: string;
  image: string;
};

export type NewsCard = {
  slug: string;
  href: string;         // the article this card opens
  title: string;
  category: string;
  date: string;
  image: string | null;
  alt?: string;
};

export type VitalUpdate = {
  slug: string;
  href: string;
  title: string;
  description: string | null;
};

export type FeaturedArticle = {
  slug: string;
  href: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

export type WomanLeader = {
  slug: string;
  name: string;
  role: string;
  organization: string;
  image: string;
  // Optional on the homepage (where the strip is just 4 portraits); used by
  // the /business-women archive filter + per-person detail page.
  featuredYear?: number;
  featuredOn?: string;      // free-form display, e.g. "October 2026"
  bio?: string[];           // paragraphs for the profile page
};

export type Podcast = {
  slug: string;
  title: string;
  date: string;
  youtubeUrl: string;
  thumbnail: string;
  // Optional on homepage, used by the /podcasts archive filter.
  publishedYear?: number;
  // Short editorial description for the archive card + for Sanity.
  description?: string;
  // Minutes:seconds display string (e.g. "42:16"). Optional.
  duration?: string;
};

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  avatar: string;
};

// Optional search-engine overrides entered in Sanity.
export type Seo = { title?: string; description?: string; keywords?: string[] };

export type Headline = {
  slug: string;
  href: string;
  text: string;
};

// The /articles page is powered by a richer document than the homepage
// NewsCard — it tracks category, author, read time and flags for the
// editor-curated sections (Top Stories, Trending). The homepage types stay
// as they are so the homepage layout isn't disturbed.
export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;        // display name — "Business", "Technology", etc.
  categorySlug: string;    // url-safe form — "business", "technology"
  author: string;
  date: string;            // free-form display
  publishedYear: number;
  image: string;
  alt?: string;
  readTime?: string;       // e.g. "6 min read"
  isTopStory?: boolean;    // picked up by the Top Stories section
  industries?: string[];   // industry slugs this article is tagged with
  body?: string[];         // paragraphs for the article page
  isoDate?: string;        // yyyy-mm-dd, used by search engines
  seo?: Seo | null;
  isTrending?: boolean;    // picked up by the Trending list
  trendingRank?: number;   // 1 = most trending; smaller = higher
};

export type Category = {
  slug: string;    // "" means "All"
  name: string;
  count: number;   // populated by the data layer, not hand-maintained
};

// A Hall of Fame entry is a curated nomination; it references an existing
// magazine edition (so title / pullQuote / cover don't drift) and layers on
// its own serial number, induction year, and an optional override portrait.
export type HallOfFameEntry = {
  slug: string;             // url-safe id (usually the edition slug)
  serial: number;           // permanent registry number — "001", "002", …
  inductionYear: number;    // used by the year filter + sort
  inductedOn: string;       // free-form display, e.g. "October 2026"
  editionSlug: string;      // link into /magazines/<slug>
  name: string;             // honoree name (snapshot of the edition's)
  role: string;             // honoree role (short, Playfair card)
  organization: string;
  portrait: string;         // image path — may be the cover for now
  pullQuote: string;        // one-line quote from their edition
  profileBody: string[];    // paragraphs on the honoree profile page
  seo?: Seo | null;
};
