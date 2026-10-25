import { defineField, defineType } from "sanity";

export const industry = defineType({
  name: "industry",
  title: "Industry",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Industry name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Internal name", type: "slug", options: { source: "name", maxLength: 96 }, validation: (r) => r.required() }),
    defineField({
      name: "description",
      title: "Short description",
      type: "text",
      rows: 2,
      validation: (r) => r.required().max(160),
    }),
    defineField({ name: "order", title: "Order", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "description" } },
});
