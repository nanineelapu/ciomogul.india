import { defineField, defineType } from "sanity";

export const magazineEdition = defineType({
  name: "magazineEdition",
  title: "Magazine Edition",
  type: "document",
  fields: [
    defineField({
      name: "editionLabel",
      title: "Edition label",
      type: "string",
      description: 'Short label shown above the title. e.g. "Edition 014 · October 2026"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "featuredPersonName",
      title: "Featured person",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Headline",
      type: "string",
      description: "The long editorial headline that appears below the person's name.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 2,
      description: "One-line summary shown under the title.",
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "cover",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "pullQuote",
      title: "Pull quote",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "pullQuoteAttribution",
      title: "Pull-quote attribution",
      type: "string",
    }),
    defineField({
      name: "roleTags",
      title: "Role tags",
      type: "array",
      of: [{ type: "string" }],
      description: "Not shown on the site at the moment.",
      options: { layout: "tags" },
    }),
    defineField({
      name: "pdfFile",
      title: "PDF file",
      type: "file",
      options: { accept: "application/pdf" },
    }),
    defineField({
      name: "publishedOn",
      title: "Published on (display)",
      type: "string",
      description: 'Free-form display string. e.g. "October 2026"',
    }),
    defineField({
      name: "publishedYear",
      title: "Published year (for filtering)",
      type: "number",
      description: "Numeric year used by the archive filter.",
      validation: (r) => r.required().integer().min(2000).max(2100),
    }),
    defineField({
      name: "body",
      title: "Body paragraphs",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      description: 'Paragraphs for the "Inside this edition" block.',
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower number = appears first in the archive.",
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "publishedDesc",
      by: [{ field: "publishedYear", direction: "desc" }, { field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "featuredPersonName",
      subtitle: "editionLabel",
      media: "cover",
    },
  },
});
