import { defineField, defineType } from "sanity";

export const trustedBrand = defineType({
  name: "trustedBrand",
  title: "Trusted brand",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Brand name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Internal name", type: "slug", options: { source: "name", maxLength: 96 }, validation: (r) => r.required() }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: false },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({ name: "website", title: "Brand website (optional)", type: "url", validation: (r) => r.uri({ scheme: ["https", "http"] }) }),
    defineField({ name: "order", title: "Order", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "website", media: "logo" } },
});
