import { defineField, defineType } from "sanity";
import { seoField } from "./seoFields";

export const ARTICLE_CATEGORIES = [
  "Technology",
  "Business",
  "Startups",
  "Policy",
  "Leadership",
  "Healthcare",
  "Sports",
  "Entertainment",
  "Politics",
];

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
    defineField({ name: "body", title: "Body paragraphs", type: "array", of: [{ type: "text", rows: 5 }] }),
    defineField({ name: "category", title: "Category", type: "string", options: { list: ARTICLE_CATEGORIES }, validation: (r) => r.required() }),
    defineField({ name: "author", title: "Author", type: "string" }),
    defineField({ name: "publishDate", title: "Publish date", type: "date", validation: (r) => r.required() }),
    defineField({ name: "readTime", title: "Read time", type: "string", description: "For example: 6 min read" }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "isTopStory",
      title: "Top story",
      type: "boolean",
      description: "Show in the Top Stories band (the first three are used).",
      initialValue: false,
    }),
    seoField,
  ],
  orderings: [{ title: "Newest first", name: "dateDesc", by: [{ field: "publishDate", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "category", media: "image" } },
});
