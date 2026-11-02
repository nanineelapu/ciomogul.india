// Heading and intro for each listing page. Used as the fallback when the
// "Page headings" document in Sanity is empty.
import type { Seo } from "@/types/content";

export type PageText = { title: string; intro: string; seo?: Seo };

export type PageContent = {
  magazines: PageText;
  hallOfFame: PageText;
  womenSpotlight: PageText;
  articles: PageText;
  industries: PageText;
  contact: PageText;
};

export const PAGE_CONTENT: PageContent = {
  magazines: {
    title: "Magazines",
    intro:
      "Each issue of CIO Mogul India features the people shaping how India's technology, business and industry work. Browse the archive, read a cover story, or revisit an edition.",
  },
  hallOfFame: {
    title: "Hall of Fame",
    intro:
      "Every leader we have featured on the cover of CIO Mogul India.",
  },
  womenSpotlight: {
    title: "Business Women",
    intro: "The women leaders we have featured in CIO Mogul India.",
  },
  articles: {
    title: "Articles",
    intro:
      "What's new, what's read, and what we think is worth your time, plus the full archive filtered the way you want it.",
  },
  industries: {
    title: "Industries",
    intro: "Leadership stories from the sectors that keep India running.",
  },
  contact: {
    title: "Contact us",
    intro:
      "Have an enquiry or a story to share? Send us a message and our team will get back to you.",
  },
};
