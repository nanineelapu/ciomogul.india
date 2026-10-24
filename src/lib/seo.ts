import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const SITE_NAME = "CIO Mogul India";
export const DEFAULT_TITLE = "CIO Mogul India | Digital Magazine for India's Technology Leaders";
export const DEFAULT_DESCRIPTION =
  "CIO Mogul India is a digital magazine and media platform featuring cover stories, interviews, podcasts and news from India's CIOs, CTOs, CISOs, founders and business leaders.";
export const LOGO_PATH = "/assets/logo-cio-mogul.png";

// A focused list of terms people really search for in this field. Search
// engines ignore long keyword lists, so quality matters more than quantity.
export const BASE_KEYWORDS = [
  "CIO Mogul India",
  "CIO magazine India",
  "technology leaders India",
  "digital magazine India",
  "business magazine India",
  "CIO interviews",
  "CTO interviews India",
  "CISO India",
  "IT leaders India",
  "enterprise technology India",
  "digital transformation India",
  "cybersecurity leaders India",
  "cover story magazine",
  "leadership magazine",
  "technology news India",
  "business news India",
  "startup founders India",
  "women leaders in technology India",
  "Hall of Fame technology leaders",
  "technology podcast India",
  "leadership podcast",
  "CIO podcast",
  "AI in business India",
  "cloud computing India",
  "fintech India",
  "healthcare technology India",
  "industry leaders India",
  "executive profiles India",
  "magazine feature for leaders",
];

export const absoluteUrl = (path = "") =>
  path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export function truncate(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ") > 80 ? cut.lastIndexOf(" ") : cut.length) + "…";
}

export function mergeKeywords(...lists: (string[] | undefined | null)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const k of lists.flat()) {
    const v = k?.trim();
    if (v && !seen.has(v.toLowerCase())) {
      seen.add(v.toLowerCase());
      out.push(v);
    }
  }
  return out.slice(0, 25);
}

export type SeoOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  keywords?: string[];
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
  publishedTime?: string;
  authors?: string[];
  section?: string;
};

// One place that builds the head tags for a page: title, description, canonical
// address (without search filters, so filtered pages don't compete with each
// other), Open Graph and Twitter cards, and keywords.
export function buildMetadata(o: SeoOptions): Metadata {
  const fullTitle = o.title.includes(SITE_NAME) ? o.title : `${o.title} | ${SITE_NAME}`;
  const description = truncate(o.description);
  const url = absoluteUrl(o.path);
  const image = absoluteUrl(o.image || LOGO_PATH);

  return {
    title: { absolute: fullTitle },
    description,
    keywords: mergeKeywords(o.keywords, BASE_KEYWORDS),
    alternates: { canonical: url },
    robots: o.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: o.type === "profile" ? "profile" : o.type === "article" ? "article" : "website",
      url,
      siteName: SITE_NAME,
      locale: "en_IN",
      title: fullTitle,
      description,
      images: [{ url: image, alt: o.imageAlt || fullTitle }],
      ...(o.type === "article"
        ? { publishedTime: o.publishedTime, authors: o.authors, section: o.section }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

// ── Structured data (JSON-LD) ────────────────────────────────────────────

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export function organizationLd(opts: {
  email: string;
  phone: string;
  sameAs: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "NewsMediaOrganization"],
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: absoluteUrl(LOGO_PATH) },
    description: DEFAULT_DESCRIPTION,
    email: opts.email,
    telephone: opts.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    sameAs: opts.sameAs,
    areaServed: "IN",
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "en-IN",
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/articles?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function pageLd(
  type: "CollectionPage" | "AboutPage" | "ContactPage" | "WebPage",
  o: { name: string; description: string; path: string }
) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: o.name,
    description: truncate(o.description),
    url: absoluteUrl(o.path),
    inLanguage: "en-IN",
    isPartOf: { "@id": SITE_ID },
    publisher: { "@id": ORG_ID },
  };
}

export function newsArticleLd(a: {
  title: string;
  description: string;
  path: string;
  image: string;
  isoDate?: string;
  author?: string;
  section?: string;
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: truncate(a.title, 110),
    description: truncate(a.description),
    image: [absoluteUrl(a.image)],
    ...(a.isoDate ? { datePublished: a.isoDate, dateModified: a.isoDate } : {}),
    author: { "@type": a.author ? "Person" : "Organization", name: a.author || SITE_NAME },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(a.path) },
    articleSection: a.section,
    keywords: a.keywords?.join(", "),
    inLanguage: "en-IN",
  };
}

export function magazineIssueLd(m: {
  name: string;
  description: string;
  path: string;
  image: string;
  year: number;
  person: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "PublicationIssue",
    name: m.name,
    description: truncate(m.description),
    url: absoluteUrl(m.path),
    image: absoluteUrl(m.image),
    datePublished: String(m.year),
    isPartOf: { "@type": "Periodical", name: SITE_NAME, url: absoluteUrl("/magazines") },
    about: { "@type": "Person", name: m.person },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
  };
}

export function profileLd(p: {
  name: string;
  role?: string;
  organization?: string;
  description: string;
  path: string;
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: absoluteUrl(p.path),
    mainEntity: {
      "@type": "Person",
      name: p.name,
      ...(p.role ? { jobTitle: p.role } : {}),
      ...(p.organization ? { worksFor: { "@type": "Organization", name: p.organization } } : {}),
      description: truncate(p.description),
      image: absoluteUrl(p.image),
    },
  };
}
