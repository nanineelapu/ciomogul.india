import { defineField, defineType } from "sanity";
import { seoField } from "./seoFields";

export const industry = defineType({
  name: "industry",
  title: "Industry",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Industry name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Short line",
      type: "text",
      rows: 2,
      validation: (r) => r.required().max(160),
    }),
    defineField({ name: "intro", title: "Page intro", type: "text", rows: 3 }),
    defineField({ name: "order", title: "Order", type: "number", initialValue: 100 }),
    seoField,
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "description" } },
});
