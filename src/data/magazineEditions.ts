import type { MagazineEdition } from "@/types/content";

// Dummy content for every field. Each string is a placeholder the client will
// replace in Sanity once the CMS is wired up; the shape doesn't change.
const LOREM_PARAGRAPH =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
const LOREM_PARAGRAPH_2 =
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const LOREM_PARAGRAPH_3 =
  "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.";

export const MAGAZINE_EDITIONS: MagazineEdition[] = [
  {
    slug: "edition-014-cyber-governance",
    editionLabel: "Edition 014 · October 2026",
    featuredPersonName: "Featured Leader Name",
    title: "The Dummy Headline for This Magazine Edition Goes Here",
    subtitle:
      "A short editorial subtitle that explains the edition in one line. Replaced from Sanity later.",
    coverImage: "/assets/cover-abhirup-guha.jpg",
    coverAlt: "Magazine cover placeholder",
    pullQuote:
      "A pull-quote taken from the cover artwork or the feature interview — around twenty to thirty words — sits here as a design anchor.",
    pullQuoteAttribution: "Featured Leader Name — Role, Organization",
    roleTags: ["Role Tag One", "Role Tag Two", "Role Tag Three"],
    pdfUrl: "/assets/pdfs/sample.pdf",
    publishedOn: "October 2026",
    publishedYear: 2026,
    body: [LOREM_PARAGRAPH, LOREM_PARAGRAPH_2, LOREM_PARAGRAPH_3],
  },
  {
    slug: "edition-013-industrial-leadership",
    editionLabel: "Edition 013 · September 2026",
    featuredPersonName: "Featured Leader Name",
    title: "Another Dummy Headline Representing a Different Edition",
    subtitle:
      "A short editorial subtitle that explains the edition in one line. Replaced from Sanity later.",
    coverImage: "/assets/mag-cover-abhirup.jpg",
    coverAlt: "Magazine cover placeholder",
    pullQuote:
      "Another dummy pull-quote. Keep the length roughly consistent across editions so the hero block holds its shape.",
    pullQuoteAttribution: "Featured Leader Name — Role, Organization",
    roleTags: ["Role Tag One", "Role Tag Two"],
    pdfUrl: null,
    publishedOn: "September 2026",
    publishedYear: 2026,
    body: [LOREM_PARAGRAPH_2, LOREM_PARAGRAPH, LOREM_PARAGRAPH_3],
  },
  {
    slug: "edition-012-finance-leader",
    editionLabel: "Edition 012 · August 2026",
    featuredPersonName: "Featured Leader Name",
    title: "A Third Dummy Edition Headline for the Grid Preview",
    subtitle:
      "A short editorial subtitle that explains the edition in one line. Replaced from Sanity later.",
    coverImage: "/assets/mag-cover-finance.jpg",
    coverAlt: "Magazine cover placeholder",
    pullQuote:
      "Pull-quotes read best when they sit between twenty and thirty words. The design holds up at either end of that range.",
    pullQuoteAttribution: "Featured Leader Name — Role, Organization",
    roleTags: ["Role Tag One", "Role Tag Two", "Role Tag Three"],
    pdfUrl: null,
    publishedOn: "August 2026",
    publishedYear: 2026,
    body: [LOREM_PARAGRAPH, LOREM_PARAGRAPH_3, LOREM_PARAGRAPH_2],
  },
  {
    slug: "edition-011-leader-to-watch",
    editionLabel: "Edition 011 · July 2026",
    featuredPersonName: "Featured Leader Name",
    title: "Dummy Headline Four for the Fourth Edition in the Grid",
    subtitle:
      "A short editorial subtitle that explains the edition in one line. Replaced from Sanity later.",
    coverImage: "/assets/mag-cover-parin.jpg",
    coverAlt: "Magazine cover placeholder",
    pullQuote:
      "This quote is the hook. It is the one line the reader remembers from the page, so leave it room to breathe in the layout.",
    pullQuoteAttribution: "Featured Leader Name — Role, Organization",
    roleTags: ["Role Tag One", "Role Tag Two"],
    pdfUrl: null,
    publishedOn: "July 2026",
    publishedYear: 2026,
    body: [LOREM_PARAGRAPH_3, LOREM_PARAGRAPH, LOREM_PARAGRAPH_2],
  },
  {
    slug: "edition-010-chaos-to-clarity",
    editionLabel: "Edition 010 · June 2026",
    featuredPersonName: "Featured Leader Name",
    title: "From Chaos to Clarity — a Dummy Edition Headline",
    subtitle:
      "A short editorial subtitle that explains the edition in one line. Replaced from Sanity later.",
    coverImage: "/assets/cover-chaos-clarity.jpg",
    coverAlt: "Magazine cover placeholder",
    pullQuote:
      "Covers that pair a strong portrait with a tight headline tend to earn the longest average dwell time on the detail page.",
    pullQuoteAttribution: "Featured Leader Name — Role, Organization",
    roleTags: ["Role Tag One", "Role Tag Two", "Role Tag Three"],
    pdfUrl: null,
    publishedOn: "June 2026",
    publishedYear: 2026,
    body: [LOREM_PARAGRAPH, LOREM_PARAGRAPH_2, LOREM_PARAGRAPH_3],
  },
  {
    slug: "edition-009-finance-leader-2026",
    editionLabel: "Edition 009 · May 2026",
    featuredPersonName: "Featured Leader Name",
    title: "A Dummy Finance-Leader Edition Headline for the Grid",
    subtitle:
      "A short editorial subtitle that explains the edition in one line. Replaced from Sanity later.",
    coverImage: "/assets/cover-finance-leader.jpg",
    coverAlt: "Magazine cover placeholder",
    pullQuote:
      "A short, specific line reads stronger than a long general one. Treat the pull-quote as the second headline of the page.",
    pullQuoteAttribution: "Featured Leader Name — Role, Organization",
    roleTags: ["Role Tag One", "Role Tag Two"],
    pdfUrl: null,
    publishedOn: "May 2026",
    publishedYear: 2026,
    body: [LOREM_PARAGRAPH_2, LOREM_PARAGRAPH, LOREM_PARAGRAPH_3],
  },
  {
    slug: "edition-008-ceo-coach",
    editionLabel: "Edition 008 · April 2026",
    featuredPersonName: "Featured Leader Name",
    title: "The Trusted Coach — a Dummy Edition Headline",
    subtitle:
      "A short editorial subtitle that explains the edition in one line. Replaced from Sanity later.",
    coverImage: "/assets/cover-ceo-coach.jpg",
    coverAlt: "Magazine cover placeholder",
    pullQuote:
      "The edition's thesis in one breath. Keep the pull-quote within thirty words and the typography will do the rest of the work.",
    pullQuoteAttribution: "Featured Leader Name — Role, Organization",
    roleTags: ["Role Tag One", "Role Tag Two", "Role Tag Three"],
    pdfUrl: null,
    publishedOn: "April 2026",
    publishedYear: 2026,
    body: [LOREM_PARAGRAPH_3, LOREM_PARAGRAPH_2, LOREM_PARAGRAPH],
  },
  {
    slug: "edition-007-abhirup-guha",
    editionLabel: "Edition 007 · March 2026",
    featuredPersonName: "Featured Leader Name",
    title: "An OT Cyber Resilience Edition — Dummy Headline",
    subtitle:
      "A short editorial subtitle that explains the edition in one line. Replaced from Sanity later.",
    coverImage: "/assets/cover-abhirup-guha.jpg",
    coverAlt: "Magazine cover placeholder",
    pullQuote:
      "Breaches don't happen because systems are advanced — a dummy version of a quote the real one will replace from the CMS later.",
    pullQuoteAttribution: "Featured Leader Name — Role, Organization",
    roleTags: ["Role Tag One", "Role Tag Two"],
    pdfUrl: null,
    publishedOn: "March 2026",
    publishedYear: 2026,
    body: [LOREM_PARAGRAPH, LOREM_PARAGRAPH_3, LOREM_PARAGRAPH_2],
  },
  {
    slug: "edition-006-dummy-2025-four",
    editionLabel: "Edition 006 · December 2025",
    featuredPersonName: "Featured Leader Name",
    title: "A Dummy 2025 Edition Headline — Fourth From End",
    subtitle:
      "A short editorial subtitle that explains the edition in one line. Replaced from Sanity later.",
    coverImage: "/assets/mag-cover-abhirup.jpg",
    coverAlt: "Magazine cover placeholder",
    pullQuote:
      "A fallback pull-quote while the real one is drafted. Keep the shape, lose the words — the CMS will replace it later.",
    pullQuoteAttribution: "Featured Leader Name — Role, Organization",
    roleTags: ["Role Tag One", "Role Tag Two"],
    pdfUrl: null,
    publishedOn: "December 2025",
    publishedYear: 2025,
    body: [LOREM_PARAGRAPH_2, LOREM_PARAGRAPH, LOREM_PARAGRAPH_3],
  },
  {
    slug: "edition-005-dummy-2025-three",
    editionLabel: "Edition 005 · October 2025",
    featuredPersonName: "Featured Leader Name",
    title: "A Dummy 2025 Edition Headline — Third From End",
    subtitle:
      "A short editorial subtitle that explains the edition in one line. Replaced from Sanity later.",
    coverImage: "/assets/cover-chaos-clarity.jpg",
    coverAlt: "Magazine cover placeholder",
    pullQuote:
      "Dummy copy lets us test the layout at various string lengths before the real content lands in the CMS.",
    pullQuoteAttribution: "Featured Leader Name — Role, Organization",
    roleTags: ["Role Tag One", "Role Tag Two", "Role Tag Three"],
    pdfUrl: null,
    publishedOn: "October 2025",
    publishedYear: 2025,
    body: [LOREM_PARAGRAPH, LOREM_PARAGRAPH_2, LOREM_PARAGRAPH_3],
  },
  {
    slug: "edition-004-dummy-2025-two",
    editionLabel: "Edition 004 · August 2025",
    featuredPersonName: "Featured Leader Name",
    title: "A Dummy 2025 Edition Headline — Second From End",
    subtitle:
      "A short editorial subtitle that explains the edition in one line. Replaced from Sanity later.",
    coverImage: "/assets/cover-finance-leader.jpg",
    coverAlt: "Magazine cover placeholder",
    pullQuote:
      "Early editions get retrieved from the archive view; keep enough variety for the filter and sort controls to be exercised.",
    pullQuoteAttribution: "Featured Leader Name — Role, Organization",
    roleTags: ["Role Tag One", "Role Tag Two"],
    pdfUrl: null,
    publishedOn: "August 2025",
    publishedYear: 2025,
    body: [LOREM_PARAGRAPH_3, LOREM_PARAGRAPH, LOREM_PARAGRAPH_2],
  },
  {
    slug: "edition-003-dummy-2025-one",
    editionLabel: "Edition 003 · June 2025",
    featuredPersonName: "Featured Leader Name",
    title: "A Dummy 2025 Edition Headline — First From End",
    subtitle:
      "A short editorial subtitle that explains the edition in one line. Replaced from Sanity later.",
    coverImage: "/assets/cover-ceo-coach.jpg",
    coverAlt: "Magazine cover placeholder",
    pullQuote:
      "The oldest edition shown in the archive. Replaced by the real archive catalogue once content is in the CMS.",
    pullQuoteAttribution: "Featured Leader Name — Role, Organization",
    roleTags: ["Role Tag One", "Role Tag Two", "Role Tag Three"],
    pdfUrl: null,
    publishedOn: "June 2025",
    publishedYear: 2025,
    body: [LOREM_PARAGRAPH, LOREM_PARAGRAPH_3, LOREM_PARAGRAPH_2],
  },
];
