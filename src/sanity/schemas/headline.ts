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
      name: "href",
      title: "Link URL",
      type: "string",
      description: 'Where this headline links to. Defaults to "/articles" if blank.',
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
