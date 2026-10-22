// Copy for /about. Every string here maps to a field in the future Sanity
// "aboutPage" singleton; the page layout doesn't change when it moves.
export type AboutContent = {
  headline: string;
  intro: string;
  whoWeAre: string[];
  whatWeCover: { title: string; text: string }[];
  join: { title: string; text: string };
};

export const ABOUT: AboutContent = {
  headline: "The stories behind India's leaders.",
  intro:
    "CIO Mogul India is a digital magazine and broadcast platform. We showcase the visionaries, innovators and leaders shaping India's business, technology and industry.",
  whoWeAre: [
    "Through magazine features, interviews and broadcasts, we tell the stories of CIOs, entrepreneurs, startup founders, healthcare leaders and industry pioneers who are driving change across sectors.",
    "We share thought leadership, innovation, digital transformation journeys and practical business insights from across India.",
    "Our aim is simple: build a strong community of leaders, decision-makers and change-makers, and give a voice to the people and organisations shaping what comes next.",
  ],
  whatWeCover: [
    {
      title: "Magazine features",
      text: "In-depth profiles of CIOs, entrepreneurs and industry leaders who are driving transformation.",
    },
    {
      title: "Broadcast publications",
      text: "Video interviews that bring the stories of India's business and technology visionaries to life.",
    },
    {
      title: "Industry insights",
      text: "Thought leadership and lessons from digital transformation journeys across India.",
    },
  ],
  join: {
    title: "Join our community",
    text: "Follow us for exclusive leadership stories, industry insights and broadcast publications featuring India's most influential leaders.",
  },
};
