// Industries shown in the home page "Industries we cover" section. Used until
// the client adds their own under Home page → Industries in Sanity.
export type Industry = {
  slug: string;
  name: string;
  description: string;
};

export const INDUSTRIES: Industry[] = [
  { slug: "healthcare", name: "Healthcare & Digital Health", description: "Hospitals, telemedicine and care." },
  { slug: "banking-finance", name: "Banking & Financial Services", description: "Banks, fintech and finance." },
  { slug: "enterprise-technology", name: "Enterprise Technology", description: "Cloud, data, AI and transformation." },
  { slug: "startups", name: "Startups & Entrepreneurship", description: "Founders building new companies." },
  { slug: "real-estate", name: "Real Estate & Infrastructure", description: "Cities, projects and spaces." },
  { slug: "aviation", name: "Aviation & Mobility", description: "Airlines, airports and transport." },
];
