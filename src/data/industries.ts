// Industries: shown in the navbar "Industries" menu, on the home page and on
// /industries. Used until the client adds their own in Sanity (Industries).
export type Industry = {
  slug: string;
  name: string;
  description: string; // one short line (menu tiles, home page)
  intro?: string; // paragraph at the top of the industry page
  seo?: { title?: string; description?: string; keywords?: string[] } | null;
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "supply-chain",
    name: "Supply Chain",
    description: "Logistics, procurement and resilient operations.",
    intro:
      "Stories from the leaders who keep India's goods moving: procurement, logistics, manufacturing and the technology that makes supply chains resilient.",
  },
  {
    slug: "hr",
    name: "HR",
    description: "People, talent and the future of work.",
    intro:
      "How India's people leaders hire, grow and keep talent, and how technology is changing the way teams work.",
  },
  {
    slug: "it",
    name: "IT",
    description: "Cloud, data, AI and enterprise technology.",
    intro:
      "CIOs and CTOs on cloud, data, AI, software and the infrastructure that runs India's businesses.",
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    description: "Security leaders protecting India's businesses.",
    intro:
      "CISOs and security leaders on protecting systems, data and people, from incident response to regulation.",
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    description: "Hospitals, health-tech and patient care.",
    intro:
      "Hospital leaders and health-tech innovators using technology to widen access to care across India.",
  },
];
