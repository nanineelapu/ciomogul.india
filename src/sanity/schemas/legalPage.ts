import { defineField, defineType } from "sanity";

export const legalPage = defineType({
  name: "legalPage",
  title: "Legal page (Terms / Privacy)",
  type: "document",
  fields: [
    defineField({
      name: "kind",
      title: "Which page",
      type: "string",
      options: {
        list: [
          { title: "Terms of Service", value: "terms" },
          { title: "Privacy Policy", value: "privacy" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", title: "Section title" }),
            defineField({
              name: "paragraphs",
              title: "Paragraphs",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "ref", type: "string", title: "Number (optional)", description: "For example: 1.1" }),
                    defineField({ name: "text", type: "text", title: "Text", rows: 3 }),
                  ],
                  preview: { select: { title: "text", subtitle: "ref" } },
                },
              ],
            }),
            defineField({ name: "email", type: "string", title: "Contact email (optional)" }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
  ],
  preview: { select: { title: "title", subtitle: "kind" } },
});
