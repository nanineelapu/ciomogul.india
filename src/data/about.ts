import defaults from "./about.default.json";

// Everything on the About page. The same JSON file is used as the built-in
// content here and as the starting content copied into Sanity (see
// scripts/seed-about.mjs), so the two always match.
export type AboutContent = {
  seo?: import("@/types/content").Seo;
  eyebrowLeft: string;
  eyebrowRight: string;
  headline: string;
  intro: string;
  primaryButton: string;
  secondaryButton: string;
  whoWeAre: string[];
  featureLabel: string;
  featured: string[];
  coverTitle: string;
  coverIntro: string;
  whatWeCover: { title: string; text: string }[];
  join: {
    title: string;
    text: string;
    primaryButton: string;
    secondaryButton: string;
  };
};

export const ABOUT: AboutContent = {
  eyebrowLeft: defaults.eyebrowLeft,
  eyebrowRight: defaults.eyebrowRight,
  headline: defaults.headline,
  intro: defaults.intro,
  primaryButton: defaults.primaryButton,
  secondaryButton: defaults.secondaryButton,
  whoWeAre: defaults.whoWeAre,
  featureLabel: defaults.featureLabel,
  featured: defaults.featured,
  coverTitle: defaults.coverTitle,
  coverIntro: defaults.coverIntro,
  whatWeCover: defaults.whatWeCover,
  join: {
    title: defaults.joinTitle,
    text: defaults.joinText,
    primaryButton: defaults.joinPrimaryButton,
    secondaryButton: defaults.joinSecondaryButton,
  },
};
