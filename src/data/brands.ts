// "Trusted by" brands on the home page. Used until brands are added in Sanity
// (Home page → Trusted brands). Without a logo, a brand shows as its name;
// upload the official logo in Sanity to replace the name.
export type Brand = {
  slug: string;
  name: string;
  logo?: string | null; // image URL; empty = show the name instead
  website?: string | null;
};

export const BRANDS: Brand[] = [
  { slug: "coca-cola", name: "Coca-Cola" },
  { slug: "times-of-india", name: "The Times of India" },
  { slug: "capgemini", name: "Capgemini" },
  { slug: "tcs", name: "Tata Consultancy Services" },
  { slug: "microsoft", name: "Microsoft" },
];
