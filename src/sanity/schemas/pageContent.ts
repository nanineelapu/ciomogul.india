import { defineField, defineType } from "sanity";
import { seoField } from "./seoFields";

// One heading + intro per page, grouped so editors can find them easily.
const pageFields = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    options: { collapsible: true, collapsed: true },
    fields: [
      defineField({ name: "title", title: "Heading", type: "string" }),
      defineField({ name: "intro", title: "Intro text", type: "text", rows: 3 }),
      seoField,
    ],
  });

export const pageContent = defineType({
  name: "pageContent",
  title: "Page headings",
  type: "document",
  fields: [
    pageFields("magazines", "Magazines page"),
    pageFields("podcasts", "Podcasts page"),
    pageFields("hallOfFame", "Hall of Fame page"),
    pageFields("womenSpotlight", "Women Spotlight page"),
    pageFields("articles", "Articles page"),
    pageFields("contact", "Contact page"),
  ],
  preview: { prepare: () => ({ title: "Page headings" }) },
});
