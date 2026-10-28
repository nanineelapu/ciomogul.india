// "Trusted by" brands on the home page. Used until brands are added in Sanity
// (Home page → Trusted brands). Without a logo, a brand shows as its name.
// Logos are the companies' official files (from Wikimedia Commons).
export type Brand = {
  slug: string;
  name: string;
  logo?: string | null; // image URL; empty = show the name instead
  website?: string | null;
};

export const BRANDS: Brand[] = [
  { slug: "coca-cola", name: "Coca-Cola", logo: "/assets/brands/coca-cola.png" },
  { slug: "times-of-india", name: "The Times of India", logo: "/assets/brands/times-of-india.png" },
  { slug: "capgemini", name: "Capgemini", logo: "/assets/brands/capgemini.png" },
  { slug: "tcs", name: "Tata Consultancy Services", logo: "/assets/brands/tcs.png" },
  { slug: "microsoft", name: "Microsoft", logo: "/assets/brands/microsoft.png" },
];
