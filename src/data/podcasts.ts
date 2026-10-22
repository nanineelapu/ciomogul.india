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
  {
    slug: "dummy-episode-05",
    title: "A placeholder episode title about India's manufacturing resurgence",
    date: "12 February 2026",
    youtubeUrl: "https://youtu.be/dIYmzf21d1g",
    thumbnail: "/assets/podcast-digital-india.jpg",
    publishedYear: 2026,
    description:
      "Placeholder description for a conversation about where India's manufacturing economy is quietly adding capacity.",
    duration: "33:20",
  },
  {
    slug: "dummy-episode-06",
    title: "Placeholder episode on AI governance in large enterprises",
    date: "22 January 2026",
    youtubeUrl: "https://youtu.be/tqC1WwWKtfE",
    thumbnail: "/assets/podcast-sinek.jpg",
    publishedYear: 2026,
    description:
      "What AI governance actually looks like once a model is deployed into a regulated workflow.",
    duration: "52:08",
  },
  {
    slug: "dummy-episode-07",
    title: "A placeholder conversation about CFO-CIO alignment in 2026",
    date: "4 January 2026",
    youtubeUrl: "https://youtu.be/dIYmzf21d1g",
    thumbnail: "/assets/podcast-timms.jpg",
    publishedYear: 2026,
    description:
      "Two office-of-the-CFO leaders on how they renegotiate the IT budget without renegotiating the roadmap.",
    duration: "39:51",
  },
  {
    slug: "dummy-episode-08",
    title: "Placeholder episode on building a security-first engineering team",
    date: "20 December 2025",
    youtubeUrl: "https://youtu.be/lKsvLGdoIH8",
    thumbnail: "/assets/podcast-cole.jpg",
    publishedYear: 2025,
    description:
      "What it means — in day-to-day engineering terms — for security to be the default rather than a review gate.",
    duration: "44:17",
  },
  {
    slug: "dummy-episode-09",
    title: "Placeholder episode on the OT / IT divide and bridging it in practice",
    date: "6 November 2025",
    youtubeUrl: "https://youtu.be/tqC1WwWKtfE",
    thumbnail: "/assets/podcast-digital-india.jpg",
    publishedYear: 2025,
    description:
      "An OT-security practitioner on the first three things to fix when operational and IT networks start to meet.",
    duration: "37:04",
  },
  {
    slug: "dummy-episode-10",
    title: "A placeholder discussion on India's EV supply chain and localisation",
    date: "15 October 2025",
    youtubeUrl: "https://www.youtube.com/watch?v=N1LlAwhyWRk",
    thumbnail: "/assets/podcast-sinek.jpg",
    publishedYear: 2025,
    description:
      "Where India's electric-vehicle supply chain is deep, where it's thin, and what the next 24 months look like.",
    duration: "46:30",
  },
  {
    slug: "dummy-episode-11",
    title: "Placeholder episode on the quiet rise of mid-market SaaS exits",
    date: "9 September 2025",
    youtubeUrl: "https://youtu.be/dIYmzf21d1g",
    thumbnail: "/assets/podcast-timms.jpg",
    publishedYear: 2025,
    description:
      "A mid-market SaaS founder on the exit path nobody writes about on Twitter.",
    duration: "31:12",
  },
  {
    slug: "dummy-episode-12",
    title: "A placeholder episode on resilient leadership through downturns",
    date: "28 July 2025",
    youtubeUrl: "https://youtu.be/lKsvLGdoIH8",
    thumbnail: "/assets/podcast-cole.jpg",
    publishedYear: 2025,
    description:
      "A seasoned CEO on the leadership moves that look obvious in retrospect but almost no one makes in real time.",
    duration: "40:55",
  },
];
