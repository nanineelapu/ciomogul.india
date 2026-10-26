import { defineField, defineType } from "sanity";

export const headline = defineType({
  name: "headline",
  title: "Headline (ticker)",
  type: "document",
  fields: [
    defineField({ name: "text", title: "Text", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug (used for key)",
      type: "slug",
      options: { source: "text", maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "article",
      title: "Article to open",
      type: "reference",
      to: [{ type: "article" }],
      description: "Pick the article this opens on the live site. If none is picked, the link below is used.",
    }),
    defineField({
      name: "href",
      title: "Other link (optional)",
      type: "string",
      description: 'Only used when no article is picked above. Defaults to "/articles" if blank.',
      validation: (r) =>
        r.custom((v?: string) =>
          !v || /^\/(?!\/)/.test(v) || /^https?:\/\//i.test(v) ? true : "Use a site path like /articles or a full https:// link."
        ),
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      initialValue: 100,
    }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "text" } },
});
