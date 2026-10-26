import { defineField, defineType } from "sanity";
import { seoField } from "./seoFields";

// Every piece of text on the About page, grouped the way the page is laid out.
export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  groups: [
    { name: "top", title: "Top section", default: true },
    { name: "cover", title: "What we cover" },
    { name: "join", title: "Closing band" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "eyebrowLeft", title: "Small label (left)", type: "string", group: "top" }),
    defineField({ name: "eyebrowRight", title: "Small label (right)", type: "string", group: "top" }),
    defineField({ name: "headline", title: "Headline", type: "string", group: "top" }),
    defineField({ name: "intro", title: "Intro paragraph", type: "text", rows: 3, group: "top" }),
    defineField({ name: "primaryButton", title: "First button text", type: "string", group: "top", description: "Links to the Magazines page." }),
    defineField({ name: "secondaryButton", title: "Second button text", type: "string", group: "top", description: "Links to the Contact page." }),
    defineField({ name: "whoWeAre", title: "Who we are (paragraphs)", type: "array", of: [{ type: "text", rows: 4 }], group: "top" }),
    defineField({ name: "featureLabel", title: "Label above the list", type: "string", group: "top" }),
    defineField({ name: "featured", title: "Who we feature", type: "array", of: [{ type: "string" }], options: { layout: "tags" }, group: "top" }),

    defineField({ name: "coverTitle", title: "Section heading", type: "string", group: "cover" }),
    defineField({ name: "coverIntro", title: "Section intro", type: "text", rows: 2, group: "cover" }),
    defineField({
      name: "whatWeCover",
      title: "Panels",
      type: "array",
      group: "cover",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", title: "Title" }),
            defineField({ name: "text", type: "text", title: "Text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        },
      ],
      validation: (r) => r.max(6),
    }),

    defineField({ name: "joinTitle", title: "Title", type: "string", group: "join" }),
    defineField({ name: "joinText", title: "Text", type: "text", rows: 3, group: "join" }),
    defineField({ name: "joinPrimaryButton", title: "First button text", type: "string", group: "join", description: "Links to the Podcasts page." }),
    { ...seoField, group: "seo" },
    defineField({ name: "joinSecondaryButton", title: "Second button text", type: "string", group: "join", description: "Links to the Articles page." }),
  ],
  preview: { prepare: () => ({ title: "About page" }) },
});
