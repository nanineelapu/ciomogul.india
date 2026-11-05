import type { SchemaTypeDefinition } from "sanity";

// Plain-language help for the Studio, kept in one place so the wording is easy
// to review. It is applied to every schema in schemas/index.ts:
//   titles  - the name an editor sees for a kind of document
//   fields  - "document.field" -> text shown under that field. It says where on
//             the live site the value appears.
// A field that already has its own description keeps it unless it is listed here.

const SLUG =
  "Click Generate. It becomes part of the page address. Do not change it after the page is live, or old links and Google results will break.";
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
  "magazineEdition.pdfFile": "Upload the magazine PDF. The Digital View button opens it in the flip-page reader, in a new tab. The button appears once a PDF is uploaded.",
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

  // ── Page headings
  "pageContent.magazines": "Heading and intro at the top of the Magazines page (also used by Google).",
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
  "article.slug": "Web address (slug)",
  "newsCard.slug": "Internal name",
  "vitalUpdate.slug": "Internal name",
  "featuredArticle.slug": "Internal name",
  "womanLeader.slug": "Web address (slug)",
  "headline.slug": "Internal name",
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
