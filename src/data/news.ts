import type { NewsCard, VitalUpdate, FeaturedArticle } from "@/types/content";

export const NEWS_CARDS: NewsCard[] = [
  {
    slug: "ambani-support-working-women",
    href: "/articles/ambani-support-system-working-women",
    title:
      "Mukesh Ambani calls on Corporate India to build a stronger support system for working women",
    category: "Business",
    date: "September 11, 2026",
    image: "/assets/featured-ambani-hd.jpg",
    alt: "Mukesh Ambani speaking at an event",
  },
  {
    slug: "lt-shares-jpmorgan-target",
    href: "/articles/lt-shares-jpmorgan-target",
    title:
      "L&T shares: JPMorgan sets ₹5,060 target as capex, defence and new-age businesses draw attention",
    category: "Markets",
    date: "Markets",
    image: "/assets/news-lt-shares.jpg",
    alt: "Larsen & Toubro sign on a building",
  },
  {
    slug: "ism-2-semiconductor-ecosystem",
    href: "/articles/ism-2-semiconductor-ecosystem",
    title:
      "ISM 2.0 set to go live by May-end: India focuses on building a complete semiconductor ecosystem",
    category: "Policy",
    date: "April 7, 2026",
    image: "/assets/semiconductor-ism.png",
    alt: "India Semiconductor Mission graphic",
  },
  {
    slug: "uidai-face-auth-sdk",
    href: "/articles/uidai-face-authentication-sdk",
    title: "UIDAI launches Aadhaar face authentication SDK for banks and fintechs",
    category: "Policy",
    date: "Policy",
    image: null,
  },
];

export const VITAL_UPDATES: VitalUpdate[] = [
  {
    slug: "innovation-at-the-edge",
    href: "/articles/small-teams-big-ideas",
    title: "Innovation at the edge: why small teams are driving big ideas",
    description:
      "Startups and agile squads are outpacing legacy players in the race to innovate.",
  },
  {
    slug: "modern-incident-readiness",
    href: "/articles/incident-readiness-beyond-the-soc",
    title: "Modern incident readiness beyond the SOC",
    description: "CIO + CISO response design for complex incidents.",
  },
  {
    slug: "rise-of-edge-computing",
    href: "/articles/rise-of-edge-computing",
    title: "The rise of edge computing: why the future isn’t in the cloud",
    description: null,
  },
];

export const FEATURED_ARTICLES: FeaturedArticle[] = [
  {
    slug: "rise-of-edge-computing",
    href: "/articles/rise-of-edge-computing",
    title: "The rise of edge computing: why the future isn’t in the cloud",
    description: "Why more processing is moving closer to where data is created.",
    image: "/assets/article-edge.jpg",
    alt: "Edge computing infographic",
  },
  {
    slug: "ambani-risk-taking",
    href: "/articles/why-risk-taking-matters",
    title:
      "Mukesh Ambani's entrepreneurial wisdom: why risk-taking is essential for success",
    description:
      "“If you want to become an entrepreneur, you must learn to take risks.”",
    image: "/assets/news-ambani-risk.jpg",
    alt: "Mukesh Ambani",
  },
  {
    slug: "modern-incident-readiness",
    href: "/articles/incident-readiness-beyond-the-soc",
    title: "Modern incident readiness beyond the SOC",
    description: "CIO + CISO response design for complex incidents. 9 min read.",
    image: "/assets/news-incident.jpg",
    alt: "A person working on a laptop and phone",
  },
  {
    slug: "ai-coding-assistants",
    href: "/articles/ai-coding-assistants-developers",
    title: "AI coding assistants — are developers still needed?",
    description: "March 28, 2026",
    image: "/assets/ai-coding.jpg",
    alt: "Illustration of AI coding assistants",
  },
];
