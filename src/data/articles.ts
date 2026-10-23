import type { Article } from "@/types/content";

// Placeholder articles, written to be varied: different headlines, excerpts,
// authors and categories, with images spread so neighbouring cards differ.
// The client replaces all of this from Sanity later. Dates are ISO here and
// formatted for display below; the list is sorted newest first.

type Row = {
  iso: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  read: number;
  top?: boolean;
};

const IMG = {
  ambani: "/assets/featured-ambani-hd.jpg",
  lt: "/assets/news-lt-shares.jpg",
  ism: "/assets/semiconductor-ism.png",
  edge: "/assets/article-edge.jpg",
  incident: "/assets/news-incident.jpg",
  ai: "/assets/ai-coding.jpg",
  risk: "/assets/news-ambani-risk.jpg",
  india: "/assets/podcast-digital-india.jpg",
  sinek: "/assets/podcast-sinek.jpg",
  timms: "/assets/podcast-timms.jpg",
  cole: "/assets/podcast-cole.jpg",
};

const ROWS: Row[] = [
  // ─── Top stories ───────────────────────────────────────────────
  { iso: "2026-09-11", slug: "ambani-support-system-working-women", category: "Business", top: true,
    title: "Ambani calls on Corporate India to build a stronger support system for working women",
    excerpt: "Speaking at an industry event, he urged companies to treat support for women as a business priority, not a favour.",
    image: IMG.ambani, author: "Editorial Desk", read: 6 },
  { iso: "2026-09-06", slug: "lt-shares-jpmorgan-target", category: "Business", top: true,
    title: "L&T shares: JPMorgan sets ₹5,060 target as capex, defence and new-age businesses draw attention",
    excerpt: "Analysts point to a strong order book and growing interest in the company's newer businesses.",
    image: IMG.lt, author: "Markets Desk", read: 4 },
  { iso: "2026-04-07", slug: "ism-2-semiconductor-ecosystem", category: "Policy", top: true,
    title: "ISM 2.0 set to go live by May-end as India builds a complete semiconductor ecosystem",
    excerpt: "The next phase aims to cover design, fabrication and packaging under a single programme.",
    image: IMG.ism, author: "Policy Desk", read: 7 },

  // ─── Latest ────────────────────────────────────────────────────
  { iso: "2026-10-18", slug: "rise-of-edge-computing", category: "Technology",
    title: "The rise of edge computing: why the future isn't only in the cloud",
    excerpt: "Processing is moving closer to where data is created, and enterprise architecture is following.",
    image: IMG.edge, author: "Tech Desk", read: 5 },
  { iso: "2026-10-14", slug: "incident-readiness-beyond-the-soc", category: "Technology",
    title: "Modern incident readiness goes beyond the SOC",
    excerpt: "How CIOs and CISOs are redesigning their response for complex, multi-team incidents.",
    image: IMG.incident, author: "Security Desk", read: 9 },
  { iso: "2026-10-09", slug: "ai-coding-assistants-developers", category: "Technology",
    title: "AI coding assistants: are developers still needed?",
    excerpt: "What changes in a developer's day when the first draft is written by a machine.",
    image: IMG.ai, author: "Editorial Desk", read: 6 },
  { iso: "2026-10-06", slug: "hot-shot-rule-leaders", category: "Leadership",
    title: "The “hot shot rule” and what it asks of leaders",
    excerpt: "A simple self-test for leaders who want to avoid complacency as their teams grow.",
    image: IMG.cole, author: "Leadership Desk", read: 5 },
  { iso: "2026-10-02", slug: "why-risk-taking-matters", category: "Business",
    title: "Why risk-taking is essential for entrepreneurial success",
    excerpt: "Lessons on risk from one of India's best-known business leaders.",
    image: IMG.risk, author: "Business Desk", read: 5 },
  { iso: "2026-09-28", slug: "uidai-face-authentication-sdk", category: "Policy",
    title: "UIDAI launches Aadhaar face authentication SDK for banks and fintechs",
    excerpt: "A new toolkit lets regulated firms add face-based identity checks to their apps.",
    image: IMG.india, author: "Policy Desk", read: 3 },

  // ─── Archive ───────────────────────────────────────────────────
  { iso: "2026-09-22", slug: "digital-india-next-phase", category: "Technology",
    title: "Digital India's next phase: where public technology goes after payments and identity",
    excerpt: "A look at the platforms and standards likely to shape the coming years.",
    image: IMG.india, author: "Tech Desk", read: 6 },
  { iso: "2026-09-20", slug: "business-of-league-cricket", category: "Sports",
    title: "The business side of league cricket",
    excerpt: "Media rights, sponsorship and data are changing how franchises make money.",
    image: IMG.lt, author: "Sports Desk", read: 5 },
  { iso: "2026-09-17", slug: "small-teams-big-ideas", category: "Business",
    title: "Small teams, big ideas: why innovation is moving to the edge of the company",
    excerpt: "Agile squads are shipping faster than the large players they compete with.",
    image: IMG.edge, author: "Business Desk", read: 4 },
  { iso: "2026-09-15", slug: "state-fiscal-policy-business", category: "Politics",
    title: "State-level fiscal policy: what changes for business",
    excerpt: "How recent budget decisions could affect investment, hiring and procurement.",
    image: IMG.sinek, author: "Politics Desk", read: 6 },
  { iso: "2026-09-14", slug: "streaming-and-local-production", category: "Entertainment",
    title: "Streaming platforms and the rise of local production",
    excerpt: "Platforms are investing more in regional stories made close to their audiences.",
    image: IMG.ai, author: "Culture Desk", read: 4 },
  { iso: "2026-09-12", slug: "data-protection-compliance-checklist", category: "Policy",
    title: "Data protection rules: a compliance checklist for technology teams",
    excerpt: "Practical steps to prepare before stricter requirements take effect.",
    image: IMG.risk, author: "Policy Desk", read: 6 },
  { iso: "2026-09-05", slug: "first-security-hire-startups", category: "Startups",
    title: "When should an early-stage startup hire its first security lead?",
    excerpt: "Founders share how they judged timing, scope and budget.",
    image: IMG.incident, author: "Startups Desk", read: 5 },
  { iso: "2026-09-01", slug: "ai-in-hospitals", category: "Healthcare",
    title: "AI in hospitals: where it helps and where it doesn't",
    excerpt: "A grounded look at clinical and administrative uses of AI.",
    image: IMG.timms, author: "Health Desk", read: 7 },
  { iso: "2026-08-30", slug: "cfo-cio-budget-conversation", category: "Business",
    title: "The CFO and CIO budget conversation",
    excerpt: "How finance and technology leaders align on spending without slowing the roadmap.",
    image: IMG.timms, author: "Business Desk", read: 5 },
  { iso: "2026-08-25", slug: "product-team-before-product-market-fit", category: "Startups",
    title: "Building a product team before product-market fit",
    excerpt: "What to hire for first, and what to leave until later.",
    image: IMG.cole, author: "Startups Desk", read: 5 },
  { iso: "2026-08-22", slug: "india-esports-economy", category: "Sports",
    title: "India's growing esports economy",
    excerpt: "Tournaments, teams and sponsors are turning gaming into a serious industry.",
    image: IMG.ai, author: "Sports Desk", read: 4 },
  { iso: "2026-08-18", slug: "healthcare-network-security", category: "Healthcare",
    title: "Data security in healthcare networks",
    excerpt: "Patient data raises the stakes for every IT decision a hospital makes.",
    image: IMG.incident, author: "Health Desk", read: 6 },
  { iso: "2026-08-14", slug: "mid-market-saas-exits", category: "Business",
    title: "Mid-market SaaS and the quiet exit",
    excerpt: "Founders describe exit routes that rarely make the headlines.",
    image: IMG.sinek, author: "Business Desk", read: 6 },
  { iso: "2026-08-08", slug: "infinite-mindset-leadership", category: "Leadership",
    title: "The infinite mindset: leading beyond the quarter",
    excerpt: "Why leaders who play a long game outlast the quarterly scorecard.",
    image: IMG.sinek, author: "Leadership Desk", read: 5 },
  { iso: "2026-08-05", slug: "regional-studios-global", category: "Entertainment",
    title: "How regional studios are quietly scaling globally",
    excerpt: "Smaller studios are finding audiences far beyond their home markets.",
    image: IMG.cole, author: "Culture Desk", read: 5 },
  { iso: "2026-07-30", slug: "claim-your-leadership-power", category: "Leadership",
    title: "How to claim your leadership power",
    excerpt: "The habit that separates the leaders people trust from everyone else.",
    image: IMG.timms, author: "Leadership Desk", read: 4 },
  { iso: "2026-07-25", slug: "data-in-the-dugout", category: "Sports",
    title: "Sports technology: data in the dugout",
    excerpt: "Analytics are now part of selection, training and match-day decisions.",
    image: IMG.edge, author: "Sports Desk", read: 5 },
  { iso: "2026-07-20", slug: "lessons-from-first-thousand-customers", category: "Startups",
    title: "Lessons from the first thousand customers",
    excerpt: "Early customers shape a product more than any roadmap does.",
    image: IMG.india, author: "Startups Desk", read: 6 },
  { iso: "2026-07-12", slug: "telemedicine-after-the-boom", category: "Healthcare",
    title: "Telemedicine after the boom: what stayed",
    excerpt: "Which remote-care habits patients and doctors have kept.",
    image: IMG.risk, author: "Health Desk", read: 5 },
  { iso: "2026-07-03", slug: "parliament-data-regulation", category: "Politics",
    title: "Parliament and the debate over data regulation",
    excerpt: "What lawmakers are weighing as they consider new rules for data.",
    image: IMG.lt, author: "Politics Desk", read: 5 },
  { iso: "2026-06-28", slug: "independent-artists-and-technology", category: "Entertainment",
    title: "Music, technology and the independent artist",
    excerpt: "New tools are helping artists record, release and earn on their own terms.",
    image: IMG.india, author: "Culture Desk", read: 4 },
];

// Placeholder body text for every article until real copy is entered in Sanity.
const BODY = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. The opening paragraph sets out the story in plain terms: what happened, who is involved and why it matters to India's technology and business leaders.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. The second paragraph adds the detail: the numbers, the decisions and the people behind them.",
  "Curabitur pretium tincidunt lacus. Further paragraphs bring in context, expert views and what readers should watch for next.",
  "Excepteur sint occaecat cupidatat non proident. The closing paragraph ties the story back to the wider shift the magazine is following.",
];

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

export const ARTICLES: Article[] = [...ROWS]
  .sort((a, b) => (a.iso < b.iso ? 1 : -1))
  .map((r) => ({
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    category: r.category,
    categorySlug: r.category.toLowerCase(),
    author: r.author,
    date: fmt(r.iso),
    publishedYear: Number(r.iso.slice(0, 4)),
    image: r.image,
    alt: "",
    readTime: `${r.read} min read`,
    isTopStory: r.top ?? false,
    body: BODY,
  }));

// Order the category tabs render in. Counts are derived by the data layer.
export const CATEGORY_ORDER: { slug: string; name: string }[] = [
  { slug: "", name: "All" },
  { slug: "technology", name: "Technology" },
  { slug: "business", name: "Business" },
  { slug: "startups", name: "Startups" },
  { slug: "policy", name: "Policy" },
  { slug: "leadership", name: "Leadership" },
  { slug: "healthcare", name: "Healthcare" },
  { slug: "sports", name: "Sports" },
  { slug: "entertainment", name: "Entertainment" },
  { slug: "politics", name: "Politics" },
];
