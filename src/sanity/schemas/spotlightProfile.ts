import { defineField, defineType } from "sanity";
import { seoField } from "./seoFields";

const imageField = (name: string, title: string, description: string, required = true) =>
  defineField({
    name,
    title,
    type: "image",
    description,
    options: { hotspot: true },
    validation: required ? (r) => r.required() : undefined,
  });

export const spotlightProfile = defineType({
  name: "spotlightProfile",
  title: "Women Spotlight profile",
  type: "document",
  groups: [
    { name: "basics", title: "1. Basics", default: true },
    { name: "story", title: "2. Story" },
    { name: "facts", title: "3. Facts and sources" },
    { name: "review", title: "Under review only" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "basics",
      description:
        "Published = full profile page on the site. Under review = only a name card (no page) until the facts are verified.",
      options: {
        list: [
          { title: "Published (full profile page)", value: "published" },
          { title: "Under review (name card only)", value: "pending" },
        ],
        layout: "radio",
      },
      initialValue: "published",
      validation: (r) => r.required(),
    }),
    defineField({ name: "name", title: "Name", type: "string", group: "basics", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Web address (slug)",
      type: "slug",
      group: "basics",
      description: "Click Generate. It becomes the page address: /women-spotlight/<slug>. Do not change it after publishing.",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Order on the page",
      type: "number",
      group: "basics",
      description: "1 shows first. Controls the order of the portrait tabs and the pager arrows.",
      validation: (r) => r.required().integer().min(1),
    }),
    defineField({ name: "designation", title: "Designation", type: "string", group: "basics", description: "For example: Joint Managing Director" }),
    defineField({ name: "organization", title: "Organization", type: "string", group: "basics" }),
    defineField({ name: "sector", title: "Sector", type: "string", group: "basics", description: "For example: Healthcare & Digital Health" }),
    defineField({
      name: "tags",
      title: "Topic tags",
      type: "array",
      group: "basics",
      of: [{ type: "string" }],
      description: "Short topics shown above the name, for example Healthcare.",
    }),
    imageField("image", "Round portrait", "Small square photo used in the tabs, the pager and the lists."),
    imageField("cover", "Cover image", "Tall magazine-style picture shown on the profile (portrait, about 3:4)."),

    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 4,
      group: "story",
      description: "Two or three sentences shown beside the cover and used in search results.",
    }),
    defineField({
      name: "story",
      title: "Story paragraphs",
      type: "array",
      group: "story",
      of: [{ type: "text", rows: 5 }],
      description: "The full story page. One item per paragraph; the first one is shown larger.",
    }),
    defineField({
      name: "summary",
      title: "Closing summary",
      type: "text",
      rows: 3,
      group: "story",
      description: "One short editorial note that closes the profile (not a quotation).",
    }),
    defineField({
      name: "voice",
      title: "'In their words' line",
      type: "text",
      rows: 2,
      group: "story",
      description: "One-line description of the work. Do not put quotation marks around it.",
    }),
    defineField({
      name: "themes",
      title: "Leadership themes",
      type: "array",
      group: "story",
      of: [{ type: "string" }],
      description: "Three or four short themes shown in the navy panel next to the cover.",
    }),

    defineField({
      name: "milestones",
      title: "Career milestones",
      type: "array",
      group: "facts",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "when", title: "When (optional)", type: "string", description: "For example: FY 2026–27" }),
            defineField({ name: "event", title: "What happened", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "event", subtitle: "when" } },
        },
      ],
    }),
    defineField({ name: "honours", title: "Honours and recognitions", type: "text", rows: 3, group: "facts" }),
    defineField({
      name: "achievements",
      title: "Key achievements",
      type: "array",
      group: "facts",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Heading", type: "string" }),
            defineField({ name: "desc", title: "Description", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", subtitle: "desc" } },
        },
      ],
    }),
    defineField({
      name: "sources",
      title: "Sources",
      type: "array",
      group: "facts",
      description: "Where the facts come from. Every published profile should list at least one.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", description: "For example: Apollo Hospitals biography" }),
            defineField({ name: "href", title: "Link", type: "url", validation: (r) => r.uri({ scheme: ["http", "https"] }) }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
    }),
    defineField({
      name: "quote",
      title: "Direct quotation (only if sourced)",
      type: "object",
      group: "facts",
      description: "Leave empty unless the words can be traced to a published source.",
      fields: [
        defineField({ name: "text", title: "Quotation", type: "text", rows: 3 }),
        defineField({ name: "sourceLabel", title: "Source name", type: "string" }),
        defineField({ name: "sourceHref", title: "Source link", type: "url", validation: (r) => r.uri({ scheme: ["https", "http"] }) }),
      ],
    }),
    defineField({
      name: "edition",
      title: "Magazine edition (only if she is on a real cover)",
      type: "object",
      group: "facts",
      description: "Fill this only once the real CIO Mogul India issue is confirmed. It adds a 'Cover honoree' label and a 'Read the edition' button.",
      fields: [
        defineField({ name: "label", title: "Label", type: "string", description: "For example: Edition 03" }),
        defineField({ name: "month", title: "Month", type: "string", description: "For example: October 2026" }),
        defineField({ name: "href", title: "Edition link", type: "string", description: "For example: /magazines/the-healthcare-issue" }),
      ],
    }),

    { ...seoField, group: "seo" },
    defineField({ name: "statusLabel", title: "Status label", type: "string", group: "review", description: "Short line under the name, for example: Profile under review." }),
    defineField({ name: "note", title: "Note", type: "text", rows: 2, group: "review" }),
    defineField({ name: "teaser", title: "Teaser", type: "text", rows: 2, group: "review" }),
  ],
  orderings: [{ title: "Order on the page", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", subtitle: "organization", media: "image", status: "status" },
    prepare: ({ title, subtitle, media, status }) => ({
      title,
      subtitle: `${status === "pending" ? "Under review · " : ""}${subtitle ?? ""}`,
      media,
    }),
  },
});
