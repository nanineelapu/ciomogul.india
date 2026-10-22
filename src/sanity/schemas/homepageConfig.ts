import { defineField, defineType } from "sanity";

// Singleton document that picks which magazine editions appear in the three
// homepage cover strips. Using references instead of duplicating cover images
// means the editor only maintains covers in one place.
export const homepageConfig = defineType({
  name: "homepageConfig",
  title: "Homepage",
  type: "document",
  // Keep this as a true singleton; configure in sanity.config.ts to hide the
  // "create new" button.
  fields: [
    defineField({
      name: "releaseCovers",
      title: "Magazine release — covers",
      type: "array",
      of: [{ type: "reference", to: [{ type: "magazineEdition" }] }],
      description: "Pick 2-3 editions to feature in the big release block.",
      validation: (r) => r.min(1).max(4),
    }),
    defineField({
      name: "coverStories",
      title: "Cover stories — the four featured leaders",
      type: "array",
      of: [{ type: "reference", to: [{ type: "magazineEdition" }] }],
      description: "Pick the four editions that make up the Cover Stories strip.",
      validation: (r) => r.min(2).max(6),
    }),
    defineField({
      name: "getFeaturedCovers",
      title: 'Get-featured block — background covers',
      type: "array",
      of: [{ type: "reference", to: [{ type: "magazineEdition" }] }],
      description: "Any 2-3 covers used as the decorative stack behind the CTA.",
      validation: (r) => r.min(1).max(4),
    }),
  ],
  preview: { prepare: () => ({ title: "Homepage configuration" }) },
});
