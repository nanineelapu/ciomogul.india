import { defineField, defineType } from "sanity";

export const vitalUpdate = defineType({
  name: "vitalUpdate",
  title: "Vital update (homepage sidebar)",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
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
  preview: { select: { title: "title" } },
});
