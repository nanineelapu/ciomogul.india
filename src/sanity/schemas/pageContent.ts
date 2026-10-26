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
      defineField({ name: "title", title: "Page title", type: "string" }),
      defineField({ name: "intro", title: "Intro under the title", type: "text", rows: 3 }),
      seoField,
    ],
  });

export const pageContent = defineType({
  name: "pageContent",
  title: "Page titles and intros",
  type: "document",
  fields: [
    pageFields("magazines", "Magazines"),
    pageFields("hallOfFame", "Hall of Fame"),
    pageFields("womenSpotlight", "Women Spotlight"),
    pageFields("podcasts", "Podcasts"),
    pageFields("articles", "Articles"),
    pageFields("contact", "Contact Us"),
  ],
  preview: { prepare: () => ({ title: "Page titles and intros" }) },
});
