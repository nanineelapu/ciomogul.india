// Shared content types.
// These shapes mirror the Sanity schema we'll switch to later; keeping them
// here means the component JSX won't change when the data source does.

export type Magazine = {
  slug: string;
  title: string;
  coverImage: string;
  alt: string;
};

export type CoverStory = {
  slug: string;
  name: string;
  role: string;
  tag: string;
  image: string;
};

export type NewsCard = {
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string | null;
  alt?: string;
};

export type VitalUpdate = {
  slug: string;
  title: string;
  description: string | null;
};

export type FeaturedArticle = {
  slug: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

export type WomanLeader = {
  slug: string;
  name: string;
  role: string;
  organization: string;
  image: string;
};

export type Podcast = {
  slug: string;
  title: string;
  date: string;
  youtubeUrl: string;
  thumbnail: string;
};

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  avatar: string;
};

export type Headline = {
  slug: string;
  text: string;
};
