// Heading and intro for each listing page. Used as the fallback when the
// "Page headings" document in Sanity is empty.
export type PageText = { title: string; intro: string };

export type PageContent = {
  magazines: PageText;
  podcasts: PageText;
  hallOfFame: PageText;
  womenSpotlight: PageText;
  articles: PageText;
  contact: PageText;
};

export const PAGE_CONTENT: PageContent = {
  magazines: {
    title: "Magazines",
    intro:
      "Each issue of CIO Mogul India features the people shaping how India's technology, business and industry work. Browse the archive, read a cover story, or revisit an edition.",
  },
  podcasts: {
    title: "Podcasts",
    intro:
      "Long-form interviews with CIOs, founders, operators and the thinkers whose work ends up in the magazine. Every episode is free, archived here, and lives on YouTube.",
  },
  hallOfFame: {
    title: "Hall of Fame",
    intro:
      "Every leader we have featured on the cover of CIO Mogul India.",
  },
  womenSpotlight: {
    title: "Women Spotlight",
    intro: "The women leaders we have featured in CIO Mogul India.",
  },
  articles: {
    title: "Articles",
    intro:
      "What's new, what's read, and what we think is worth your time, plus the full archive filtered the way you want it.",
  },
  contact: {
    title: "Contact us",
    intro:
      "Have an enquiry or a story to share? Send us a message and our team will get back to you.",
  },
};
