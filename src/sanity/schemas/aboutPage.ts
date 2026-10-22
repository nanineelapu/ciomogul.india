import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  fields: [
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
    defineField({ name: "whoWeAre", title: "Who we are (paragraphs)", type: "array", of: [{ type: "text", rows: 4 }] }),
    defineField({
      name: "whatWeCover",
      title: "What we cover",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", title: "Title" }),
            defineField({ name: "text", type: "text", title: "Text", rows: 3 }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
      validation: (r) => r.max(6),
    }),
    defineField({ name: "joinTitle", title: "Join band: title", type: "string" }),
    defineField({ name: "joinText", title: "Join band: text", type: "text", rows: 3 }),
  ],
  preview: { prepare: () => ({ title: "About page" }) },
});
