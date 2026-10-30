import type { SchemaTypeDefinition } from "sanity";

// Plain-language help for the Studio, kept in one place so the wording is easy
// to review. It is applied to every schema in schemas/index.ts:
//   titles  - the name an editor sees for a kind of document
//   fields  - "document.field" -> text shown under that field. It says where on
//             the live site the value appears.
// A field that already has its own description keeps it unless it is listed here.

const SLUG =
  "Click Generate. It becomes part of the page address. Do not change it after the page is live, or old links and Google results will break.";
const ORDER = "Lower numbers come first. 1 is shown first.";
const SEO = "Optional. Only fill this to change what Google shows for this page. Leave empty to use the normal text.";

export const TITLES: Record<string, string> = {
  homepageConfig: "Magazine covers on the home page",
  headline: "Headline",
  newsCard: "News card",
  vitalUpdate: "Vital update",
  featuredArticle: "Featured article",
  womanLeader: "Woman leader",
  testimonial: "Testimonial",
  industry: "Industry",
  trustedBrand: "Trusted brand",
  magazineEdition: "Magazine edition",
  podcast: "Podcast episode",
  hallOfFame: "Hall of Fame inductee",
  spotlightProfile: "Business Women profile",
  article: "Article",
  aboutPage: "About Us page",
  legalPage: "Legal page",
};

export const FIELD_HELP: Record<string, string> = {
  // ── Magazines page, edition pages and the home page strips
  "magazineEdition.featuredPersonName": "The leader on the cover. Shown on the card, the edition page and the home page.",
  "magazineEdition.slug": `${SLUG} Edition page: /magazines/<slug>.`,
  "magazineEdition.cover": "The cover picture. Shown on the Magazines page, the edition page and wherever the home page uses this edition.",
  "magazineEdition.pullQuote": "A short quotation shown on the edition page. Leave empty to hide it.",
  "magazineEdition.pullQuoteAttribution": "Who said the quotation above.",
  "magazineEdition.pdfFile": "Upload the magazine PDF. It powers the reader and the download button on the edition page.",
  "magazineEdition.seo": SEO,

  // ── Hall of Fame
  "hallOfFame.name": "Shown on the Hall of Fame list and on the person's own page.",
  "hallOfFame.slug": `${SLUG} Page: /hall-of-fame/<slug>.`,
  "hallOfFame.inductionYear": "Used by the year filter on the Hall of Fame page.",
  "hallOfFame.edition": "Optional. Links the person to their magazine cover.",
  "hallOfFame.role": "Shown under the name on the card and the person's page.",
  "hallOfFame.organization": "Shown with the role.",
  "hallOfFame.portrait": "Photo shown on the card and the person's page.",
  "hallOfFame.pullQuote": "Highlighted quotation on the person's page. Leave empty to hide it.",
  "hallOfFame.profileBody": "The profile text on the person's page. One item per paragraph.",
  "hallOfFame.seo": SEO,

  // ── Podcasts
  "podcast.title": "Episode title on the Podcasts page and in the player pop-up.",
  "podcast.slug": SLUG,
  "podcast.date": "Shown on the episode card. For example: 12 March 2026.",
  "podcast.publishedYear": "Used by the year filter on the Podcasts page.",
  "podcast.duration": "For example: 42:16.",
  "podcast.youtubeUrl": "Paste the YouTube link. The episode plays from it in the pop-up.",
  "podcast.thumbnail": "Picture shown on the episode card.",
  "podcast.order": ORDER,

  "podcast.description": "Kept for your own reference. It is not shown on the site.",

  // ── Articles
  "article.title": "Headline on the Articles page, the article page and the home page lists.",
  "article.slug": `${SLUG} Article page: /articles/<slug>.`,
  "article.excerpt": "Short summary shown on cards and used by Google.",
  "article.body": "The article text. One item per paragraph.",
  "article.category": "Decides which 'Explore by category' tab the article appears under.",
  "article.author": "Shown under the headline.",
  "article.publishDate": "Articles are sorted newest first by this date.",
  "article.image": "Picture shown on the card and at the top of the article.",
  "article.seo": SEO,

  // ── Home page
  "homepageConfig.releaseCovers": "The big 'Magazine release' block near the top.",
  "homepageConfig.coverStories": "The 'Cover stories' strip (four leaders).",
  "homepageConfig.getFeaturedCovers": "Decorative covers behind the 'Get featured' block.",
  "headline.text": "One line in the scrolling headline ticker under the menu.",
  "headline.slug": "Internal name. Click Generate.",
  "headline.order": ORDER,
  "headline.article": "Pick the article this headline opens when clicked in the ticker.",
  "newsCard.title": "Title of a card in 'Latest news'.",
  "newsCard.slug": "Internal name. Click Generate.",
  "newsCard.category": "Small label. Cards without a picture show this word as a text tile.",
  "newsCard.date": "Shown under the title. For example: 12 March 2026.",
  "newsCard.image": "Optional. Without a picture the card shows a text tile.",
  "newsCard.order": ORDER,
  "newsCard.article": "The article this card opens when a visitor clicks the picture, title or Read more.",
  "vitalUpdate.title": "Headline in the 'Vital updates' column beside the news cards.",
  "vitalUpdate.slug": "Internal name. Click Generate.",
  "vitalUpdate.description": "One or two lines under the headline.",
  "vitalUpdate.order": ORDER,
  "vitalUpdate.article": "The article this update opens when clicked.",
  "featuredArticle.title": "Title in the 'Featured articles' block.",
  "featuredArticle.slug": "Internal name. Click Generate.",
  "featuredArticle.description": "Short text under the title.",
  "featuredArticle.image": "Picture for the card.",
  "featuredArticle.order": ORDER,
  "featuredArticle.article": "The article this block opens when clicked.",
  "womanLeader.name": "Name on the women leaders strip.",
  "womanLeader.slug":
    "Must match the web address of a Business Women profile for the card to open that profile. Otherwise it opens the Business Women page.",
  "womanLeader.role": "Title shown under the name.",
  "womanLeader.organization": "Small line above the name.",
  "womanLeader.image": "Round portrait on the card.",
  "womanLeader.featuredYear": "Not shown on the site.",
  "womanLeader.featuredOn": "Not shown on the site.",
  "womanLeader.bio": "Not shown on the live site. Business Women profiles have their own story text.",
  "womanLeader.order": ORDER,
  "industry.name": "Shown in the Industries menu, on the home page and as the page title.",
  "industry.slug": `${SLUG} Page: /industries/<web address>.`,
  "industry.description": "One short line under the name in the menu and on the home page (up to 160 characters).",
  "industry.intro": "Paragraph at the top of this industry's page. Leave empty to use the short line. To show stories on this page, open an article in 6. Articles and pick this industry in its Industries field.",
  "industry.order": ORDER,
  "industry.seo": SEO,
  "article.industries": "Pick the industries this article belongs to. Once published, it appears on each of those industry pages.",
  "pageContent.industries": "Heading and intro at the top of the Industries page (also used by Google).",
  "trustedBrand.name": "Shown in the 'Trusted by' strip when no logo is uploaded, and read out by screen readers.",
  "trustedBrand.slug": "Internal name. Click Generate.",
  "trustedBrand.logo": "Upload the brand's official logo (PNG or SVG, ideally on a white or transparent background). Until a logo is uploaded, the brand name is shown instead.",
  "trustedBrand.website": "Optional. If filled in, the logo links to this website.",
  "trustedBrand.order": ORDER,
  "testimonial.name": "Testimonials block.",
  "testimonial.role": "Shown under the name.",
  "testimonial.quote": "The testimonial text.",
  "testimonial.avatar": "Small portrait.",
  "testimonial.order": ORDER,

  // ── About page
  "aboutPage.eyebrowLeft": "Small label at the top left of the first section.",
  "aboutPage.eyebrowRight": "Small label at the top right of the first section.",
  "aboutPage.headline": "The big heading.",
  "aboutPage.intro": "The sentence under the big heading.",
  "aboutPage.whoWeAre": "The 'Who we are' text. One item per paragraph.",
  "aboutPage.featureLabel": "Small heading above the list of who is featured.",
  "aboutPage.featured": "The short list of who is featured.",
  "aboutPage.coverTitle": "Heading of the light 'What we cover' section.",
  "aboutPage.coverIntro": "Sentence under that heading.",
  "aboutPage.whatWeCover": "The three panels in 'What we cover'. Each has a title and a short text.",
  "aboutPage.joinTitle": "Heading of the blue 'Join our community' band at the bottom.",
  "aboutPage.joinText": "Text in the blue band.",

  "aboutPage.seo": "Optional. Change what Google and share cards show for the About page. Leave empty to use the page text.",
  "spotlightProfile.seo": "Optional. Change what Google and share cards show for this profile. Leave empty to use her name and introduction.",
  "legalPage.seo": "Optional. Change what Google shows for this page.",

  // ── Terms and Privacy
  "legalPage.title": "Heading of the page.",
  "legalPage.intro": "Opening paragraph under the heading.",
  "legalPage.sections": "The numbered sections of the page. Add, remove or drag to reorder.",

  // ── Contact details (footer, Contact page, 404 page, Google)
  "siteSettings.email": "Shown in the footer, on the Contact page and on the 'page not found' page.",
  "siteSettings.office": "Office address on the Contact page and in the footer.",
  "siteSettings.instagram": "Footer and Contact page social icon. Leave empty to hide the icon.",
  "siteSettings.facebook": "Footer and Contact page social icon. Leave empty to hide the icon.",
  "siteSettings.linkedin": "Footer and Contact page social icon. Leave empty to hide the icon.",
  "siteSettings.x": "Footer and Contact page social icon. Leave empty to hide the icon.",

  // ── Page headings
  "pageContent.magazines": "Heading and intro at the top of the Magazines page (also used by Google).",
  "pageContent.podcasts": "Heading and intro at the top of the Podcasts page (also used by Google).",
  "pageContent.hallOfFame": "Heading and intro at the top of the Hall of Fame page (also used by Google).",
  "pageContent.womenSpotlight": "Heading and intro at the top of the Business Women page (also used by Google).",
  "pageContent.articles": "Heading and intro at the top of the Articles page (also used by Google).",
  "pageContent.contact": "Heading and intro at the top of the Contact page (also used by Google).",

  // ── Business Women (the rest of the help is written on the fields themselves)
  "spotlightProfile.name": "Shown everywhere this profile appears.",
  "spotlightProfile.organization": "Shown under the name.",
  "spotlightProfile.milestones": "The timeline on the story page. Add them in order.",
  "spotlightProfile.honours": "Shown in the 'Honours' box beside the story.",
  "spotlightProfile.achievements": "Short achievement cards. Each has a heading and a sentence.",
  "spotlightProfile.note": "Shown on the name card while the profile is under review.",
  "spotlightProfile.teaser": "One line shown on the name card while the profile is under review.",
};

// Extra title tweaks for fields whose original title was empty or unclear.
const FIELD_TITLES: Record<string, string> = {
  "magazineEdition.slug": "Web address (slug)",
  "hallOfFame.slug": "Web address (slug)",
  "podcast.slug": "Web address (slug)",
  "article.slug": "Web address (slug)",
  "newsCard.slug": "Internal name",
  "vitalUpdate.slug": "Internal name",
  "featuredArticle.slug": "Internal name",
  "womanLeader.slug": "Web address (slug)",
  "headline.slug": "Internal name",
  "podcast.description": "Description (kept for reference, not shown)",
};

type Loose = SchemaTypeDefinition & {
  title?: string;
  fields?: { name: string; title?: string; description?: string }[];
};

export function withHelp(types: SchemaTypeDefinition[]): SchemaTypeDefinition[] {
  return types.map((raw) => {
    const t = raw as Loose;
    if (!t.fields) return raw;
    return {
      ...t,
      title: TITLES[t.name] ?? t.title,
      fields: t.fields.map((f) => {
        const k = `${t.name}.${f.name}`;
        return {
          ...f,
          title: FIELD_TITLES[k] ?? f.title,
          description: FIELD_HELP[k] ?? f.description,
        };
      }),
    } as SchemaTypeDefinition;
  });
}
