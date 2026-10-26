import { defineField, defineType } from "sanity";

// Singleton document that picks which magazine editions appear in the three
// homepage cover strips. Using references instead of duplicating cover images
// means the editor only maintains covers in one place.
export const homepageConfig = defineType({
  name: "homepageConfig",
  title: "Magazine covers on the home page",
  type: "document",
  // Keep this as a true singleton; configure in sanity.config.ts to hide the
  // "create new" button.
  fields: [
    defineField({
      name: "releaseCovers",
      title: "2. Magazine release: the large covers",
      type: "array",
      of: [{ type: "reference", to: [{ type: "magazineEdition" }] }],
      description: "Pick 2-3 editions to feature in the big release block.",
      validation: (r) => r.min(1).max(4),
    }),
    defineField({
      name: "coverStories",
      title: "3. Cover stories: the four leaders",
      type: "array",
      of: [{ type: "reference", to: [{ type: "magazineEdition" }] }],
      description: "Pick the four editions that make up the Cover Stories strip.",
      validation: (r) => r.min(2).max(6),
    }),
    defineField({
      name: "getFeaturedCovers",
      title: "10. Get featured: the covers behind the box",
      type: "array",
      of: [{ type: "reference", to: [{ type: "magazineEdition" }] }],
      description: "Any 2-3 covers used as the decorative stack behind the CTA.",
      validation: (r) => r.min(1).max(4),
    }),
  ],
  preview: { prepare: () => ({ title: "Magazine covers on the home page" }) },
});
