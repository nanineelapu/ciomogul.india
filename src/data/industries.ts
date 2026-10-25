// Industries shown in the home page "Industries we cover" section. Used until
// the client adds their own under Home page → Industries in Sanity.
export type Industry = {
  slug: string;
  name: string;
  description: string;
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "healthcare",
    name: "Healthcare & Digital Health",
    description: "Hospital leaders and innovators using technology to widen access to care.",
  },
  {
    slug: "banking-finance",
    name: "Banking & Financial Services",
    description: "Technology and leadership stories from banks, fintechs and financial institutions.",
  },
  {
    slug: "enterprise-technology",
    name: "Enterprise Technology",
    description: "CIOs and CTOs on cloud, data, AI and the journey of digital transformation.",
  },
  {
    slug: "startups",
    name: "Startups & Entrepreneurship",
    description: "Founders building new companies, products and markets across India.",
  },
  {
    slug: "real-estate",
    name: "Real Estate & Infrastructure",
    description: "Leaders shaping the cities, projects and spaces of a growing economy.",
  },
  {
    slug: "aviation",
    name: "Aviation & Mobility",
    description: "The people and technology that keep India's airlines, airports and transport moving.",
  },
];
