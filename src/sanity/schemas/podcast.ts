import { defineField, defineType } from "sanity";

export const podcast = defineType({
  name: "podcast",
  title: "Podcast episode",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "date", title: "Date (display)", type: "string" }),
    defineField({
      name: "publishedYear",
      title: "Published year (for filtering)",
      type: "number",
      validation: (r) => r.integer().min(2000).max(2100),
    }),
    defineField({ name: "duration", title: "Duration (e.g. 42:16)", type: "string" }),
    defineField({ name: "description", title: "Description (not shown on the site)", type: "text", rows: 3 }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
      validation: (r) =>
        r
          .required()
          .uri({ scheme: ["https"] })
          .custom((v?: string) => {
            if (!v) return true;
            try {
              const host = new URL(v).hostname.replace(/^www\./, "");
              return ["youtube.com", "m.youtube.com", "youtu.be"].includes(host) ? true : "Use a YouTube link.";
            } catch {
              return "Use a YouTube link.";
            }
          }),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Order", type: "number", initialValue: 100 }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "date", media: "thumbnail" } },
});
