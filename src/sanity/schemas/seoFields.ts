import { defineField } from "sanity";

// Optional search-engine overrides, added to the documents that get their own
// page. Leave empty and the site writes sensible values from the content.
export const seoField = defineField({
  name: "seo",
  title: "SEO (optional)",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Search title",
      type: "string",
      description: "Shown in Google results. Around 50 to 60 characters.",
      validation: (r) => r.max(70).warning("Long titles get cut off in search results."),
    }),
    defineField({
      name: "metaDescription",
      title: "Search description",
      type: "text",
      rows: 3,
      description: "The grey text under the title in Google. Around 140 to 160 characters.",
      validation: (r) => r.max(170).warning("Long descriptions get cut off in search results."),
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "A few relevant phrases people would search for. More is not better.",
    }),
  ],
});

