import { defineField, defineType } from "sanity";

export const womanLeader = defineType({
  name: "womanLeader",
  title: "Woman leader (Wall of Fame)",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "role", title: "Role / title", type: "string" }),
    defineField({ name: "organization", title: "Organization", type: "string" }),
    defineField({
      name: "image",
      title: "Portrait",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "featuredYear",
      title: "Featured year (for filtering)",
      type: "number",
      validation: (r) => r.integer().min(2000).max(2100),
    }),
    defineField({ name: "featuredOn", title: "Featured on (display)", type: "string" }),
    defineField({
      name: "bio",
      title: "Bio paragraphs",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      description: "Paragraphs for the women spotlight detail page.",
    }),
    defineField({ name: "order", title: "Order", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
});
