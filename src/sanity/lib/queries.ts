// GROQ queries, kept together so changes have one home. Each returns the
// exact shape of our existing TypeScript content types — the data layer maps
// the raw image object into a usable URL and otherwise passes through.

export const MAGAZINE_FIELDS_PROJ = /* groq */ `
  "slug": slug.current,
  editionLabel,
  featuredPersonName,
  title,
  "subtitle": coalesce(subtitle, ""),
  "coverImage": cover,
  "coverAlt": coalesce(cover.alt, featuredPersonName, "Magazine cover"),
  "pullQuote": coalesce(pullQuote, ""),
  "pullQuoteAttribution": coalesce(pullQuoteAttribution, ""),
  "roleTags": coalesce(roleTags, []),
  "pdfUrl": pdfFile.asset->url,
  "publishedOn": coalesce(publishedOn, ""),
  publishedYear,
  "body": coalesce(body, [])
`;

export const MAGAZINE_EDITIONS_QUERY = /* groq */ `
  *[_type == "magazineEdition"] | order(publishedYear desc, order asc) {
    ${MAGAZINE_FIELDS_PROJ}
  }
`;

export const MAGAZINE_EDITION_BY_SLUG_QUERY = /* groq */ `
  *[_type == "magazineEdition" && slug.current == $slug][0] {
    ${MAGAZINE_FIELDS_PROJ}
  }
`;

export const HEADLINES_QUERY = /* groq */ `
  *[_type == "headline"] | order(order asc) {
    "slug": slug.current,
    "text": text
  }
`;

export const COVER_STORIES_QUERY = /* groq */ `
  *[_type == "homepageConfig" && _id == "homepageConfig"][0].coverStories[]->{
    "slug": slug.current,
    "name": featuredPersonName,
    "role": coalesce(editionLabel, ""),
    "tag": coalesce(subtitle, ""),
    "image": cover
  }
`;

export const RELEASE_COVERS_QUERY = /* groq */ `
  *[_type == "homepageConfig" && _id == "homepageConfig"][0].releaseCovers[]->{
    "slug": slug.current,
    "title": title,
    "coverImage": cover,
    "alt": coalesce(cover.alt, featuredPersonName, "Magazine cover")
  }
`;

export const GET_FEATURED_COVERS_QUERY = /* groq */ `
  *[_type == "homepageConfig" && _id == "homepageConfig"][0].getFeaturedCovers[]->{
    "slug": slug.current,
    "title": title,
    "coverImage": cover,
    "alt": coalesce(cover.alt, "")
  }
`;

export const NEWS_CARDS_QUERY = /* groq */ `
  *[_type == "newsCard"] | order(order asc) {
    "slug": slug.current,
    title,
    "category": coalesce(category, ""),
    "date": coalesce(date, ""),
    "image": image,
    "alt": coalesce(image.alt, "")
  }
`;

export const VITAL_UPDATES_QUERY = /* groq */ `
  *[_type == "vitalUpdate"] | order(order asc) {
    "slug": slug.current,
    title,
    "description": coalesce(description, null)
  }
`;

export const FEATURED_ARTICLES_QUERY = /* groq */ `
  *[_type == "featuredArticle"] | order(order asc) {
    "slug": slug.current,
    title,
    "description": coalesce(description, ""),
    "image": image,
    "alt": coalesce(image.alt, title)
  }
`;

export const WOMEN_LEADERS_QUERY = /* groq */ `
  *[_type == "womanLeader"] | order(order asc) {
    "slug": slug.current,
    name,
    "role": coalesce(role, ""),
    "organization": coalesce(organization, ""),
    "image": image
  }
`;

export const PODCASTS_QUERY = /* groq */ `
  *[_type == "podcast"] | order(order asc) {
    "slug": slug.current,
    title,
    "date": coalesce(date, ""),
    youtubeUrl,
    "thumbnail": thumbnail
  }
`;

export const TESTIMONIALS_QUERY = /* groq */ `
  *[_type == "testimonial"] | order(order asc) {
    name,
    "role": coalesce(role, ""),
    quote,
    "avatar": avatar
  }
`;
