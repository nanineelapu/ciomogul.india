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
  "body": coalesce(body, []),
  "seo": seo{ "title": metaTitle, "description": metaDescription, keywords }
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
    "articleSlug": article->slug.current,
    "href": coalesce(href, ""),
    "text": text
  }
`;

export const COVER_STORIES_QUERY = /* groq */ `
  *[_type == "homepageConfig" && _id == "homepageConfig"][0].coverStories[]->{
    "slug": slug.current,
    "name": featuredPersonName,
    "role": coalesce(roleTags[0], editionLabel, ""),
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
    "articleSlug": article->slug.current,
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
    "articleSlug": article->slug.current,
    title,
    "description": coalesce(description, null)
  }
`;

export const FEATURED_ARTICLES_QUERY = /* groq */ `
  *[_type == "featuredArticle"] | order(order asc) {
    "slug": slug.current,
    "articleSlug": article->slug.current,
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
    "image": image,
    featuredYear,
    "featuredOn": coalesce(featuredOn, ""),
    "bio": coalesce(bio, [])
  }
`;

export const PODCASTS_QUERY = /* groq */ `
  *[_type == "podcast"] | order(order asc) {
    "slug": slug.current,
    title,
    "date": coalesce(date, ""),
    youtubeUrl,
    "thumbnail": thumbnail,
    publishedYear,
    "description": coalesce(description, ""),
    "duration": coalesce(duration, "")
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

export const HALL_OF_FAME_QUERY = /* groq */ `
  *[_type == "hallOfFame"] | order(serial desc) {
    "slug": slug.current,
    serial,
    inductionYear,
    "inductedOn": coalesce(inductedOn, ""),
    "editionSlug": coalesce(edition->slug.current, ""),
    name,
    "role": coalesce(role, ""),
    "organization": coalesce(organization, ""),
    "portrait": portrait,
    "pullQuote": coalesce(pullQuote, ""),
    "profileBody": coalesce(profileBody, []),
    "seo": seo{ "title": metaTitle, "description": metaDescription, keywords }
  }
`;

export const ARTICLES_QUERY = /* groq */ `
  *[_type == "article"] | order(publishDate desc) {
    "slug": slug.current,
    title,
    "excerpt": coalesce(excerpt, ""),
    category,
    "author": coalesce(author, ""),
    publishDate,
    "readTime": coalesce(readTime, ""),
    "image": image,
    "alt": coalesce(image.alt, ""),
    "isTopStory": coalesce(isTopStory, false),
    "body": coalesce(body, []),
    "seo": seo{ "title": metaTitle, "description": metaDescription, keywords }
  }
`;

export const ABOUT_QUERY = /* groq */ `
  *[_type == "aboutPage" && _id == "aboutPage"][0] {
    "seo": seo{ "title": metaTitle, "description": metaDescription, keywords },
    eyebrowLeft,
    eyebrowRight,
    headline,
    intro,
    primaryButton,
    secondaryButton,
    "whoWeAre": coalesce(whoWeAre, []),
    featureLabel,
    "featured": coalesce(featured, []),
    coverTitle,
    coverIntro,
    "whatWeCover": coalesce(whatWeCover[]{ title, text }, []),
    joinTitle,
    joinText,
    joinPrimaryButton,
    joinSecondaryButton
  }
`;

export const LEGAL_QUERY = /* groq */ `
  *[_type == "legalPage" && kind == $kind && count(sections) > 0] | order(_updatedAt desc)[0] {
    title,
    "seo": seo{ "title": metaTitle, "description": metaDescription, keywords },
    "intro": coalesce(intro, ""),
    "sections": coalesce(sections[]{
      title,
      "paragraphs": coalesce(paragraphs[]{ ref, text }, []),
      email
    }, [])
  }
`;

export const SITE_SETTINGS_QUERY = /* groq */ `
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    email, phone, office, instagram, facebook, linkedin, x, whatsapp, siteDescription, keywords
  }
`;

export const PAGE_CONTENT_QUERY = /* groq */ `
  *[_type == "pageContent" && _id == "pageContent"][0] {
    magazines, podcasts, hallOfFame, womenSpotlight, articles, contact
  }
`;

export const SITE_TEXT_QUERY = /* groq */ `
  *[_type == "siteText" && _id == "siteText"][0]
`;

export const SPOTLIGHT_QUERY = /* groq */ `
  *[_type == "spotlightProfile" && defined(slug.current)] | order(order asc) {
    "id": slug.current,
    "seo": seo{ "title": metaTitle, "description": metaDescription, keywords },
    status,
    name,
    designation,
    organization,
    sector,
    tags,
    image,
    cover,
    intro,
    story,
    summary,
    voice,
    themes,
    milestones,
    honours,
    achievements,
    sources,
    quote,
    edition,
    statusLabel,
    note,
    teaser
  }
`;

export const INDUSTRIES_QUERY = /* groq */ `
  *[_type == "industry"] | order(order asc) {
    "slug": slug.current,
    name,
    "description": coalesce(description, "")
  }
`;
