import { defineField, defineType } from "sanity";
import { seoField } from "./seoFields";

export const hallOfFame = defineType({
  name: "hallOfFame",
  title: "Hall of Fame inductee",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name", maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: "serial", title: "Serial number", type: "number", description: "Permanent roll number, e.g. 14.", validation: (r) => r.required().integer().min(1) }),
    defineField({ name: "inductionYear", title: "Induction year (for filtering)", type: "number", validation: (r) => r.required().integer().min(2000).max(2100) }),
    defineField({ name: "inductedOn", title: "Inducted on (display)", type: "string", description: "For example: October 2026" }),
    defineField({ name: "edition", title: "Cover edition", type: "reference", to: [{ type: "magazineEdition" }] }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "organization", title: "Organization", type: "string" }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
      validation: (r) => r.required(),
    }),
    defineField({ name: "pullQuote", title: "Pull quote", type: "text", rows: 3 }),
    defineField({ name: "profileBody", title: "Profile paragraphs", type: "array", of: [{ type: "text", rows: 4 }] }),
    seoField,
  ],
  orderings: [{ title: "Serial, newest first", name: "serialDesc", by: [{ field: "serial", direction: "desc" }] }],
  preview: { select: { title: "name", subtitle: "inductedOn", media: "portrait" } },
});
