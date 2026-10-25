import { defineField, defineType } from "sanity";

export const newsCard = defineType({
  name: "newsCard",
  title: "News card (homepage)",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "category", title: "Category / kicker", type: "string" }),
    defineField({ name: "date", title: "Date (display)", type: "string" }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
      description: "Optional. Cards without an image render the Aadhaar-style text tile.",
    }),
    defineField({
      name: "article",
      title: "Article to open",
      type: "reference",
      to: [{ type: "article" }],
      description: "Pick the article this opens on the live site.",
    }),
    defineField({ name: "order", title: "Order", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "category", media: "image" } },
});
