import type { Podcast } from "@/types/content";

// Keeping the four real episodes the homepage already shows, then eight
// placeholder episodes so the archive view has enough rows to exercise its
// search, year filter, and pagination. Replace from Sanity later.
export const PODCASTS: Podcast[] = [
  {
    slug: "digital-india-roadmap",
    title: "The future of Digital India: technology roadmap",
    date: "8 March 2026",
    youtubeUrl: "https://www.youtube.com/watch?v=N1LlAwhyWRk",
    thumbnail: "/assets/podcast-digital-india.jpg",
    publishedYear: 2026,
    description:
      "A conversation about what India's technology stack looks like once UPI, Aadhaar and the Data Protection Act all fully compose.",
    duration: "48:12",
  },
  {
    slug: "simon-sinek-infinite-mindset",
    title: "Unlocking leadership with Simon Sinek: the infinite mindset",
    date: "22 May 2026",
    youtubeUrl: "https://youtu.be/tqC1WwWKtfE",
    thumbnail: "/assets/podcast-sinek.jpg",
    publishedYear: 2026,
    description:
      "Simon Sinek on why leaders who play an infinite game outlast every quarterly scorecard.",
    duration: "36:04",
  },
  {
    slug: "michael-timms-leadership-power",
    title: "How to claim your leadership power — Michael Timms",
    date: "22 May 2026",
    youtubeUrl: "https://youtu.be/dIYmzf21d1g",
    thumbnail: "/assets/podcast-timms.jpg",
    publishedYear: 2026,
    description:
      "Michael Timms on the single leadership habit that quietly separates the people everyone trusts from everyone else.",
    duration: "28:47",
  },
  {
    slug: "kat-cole-hot-shot-rule",
    title: "The “hot shot rule” for better leaders — Kat Cole",
    date: "22 May 2026",
    youtubeUrl: "https://youtu.be/lKsvLGdoIH8",
    thumbnail: "/assets/podcast-cole.jpg",
    publishedYear: 2026,
    description:
      "Kat Cole shares the one-question diagnostic she runs on herself every quarter — a stress test for complacency.",
    duration: "41:33",
  },
];
