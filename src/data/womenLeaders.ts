import type { WomanLeader } from "@/types/content";

// The four real women leaders shown on the homepage strip, extended with
// the fields the /women-spotlight archive + detail pages need. Eight more
// placeholder entries follow so the filter + pagination have material.
// Replaced per-entry from Sanity later.
const BIO_LOREM = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. The feature's opening paragraph would introduce the leader's current remit and the shift her work is driving — written in editorial voice rather than as a résumé bullet.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. The second paragraph adds specific decisions, specific outcomes, specific numbers where they help the reader understand the scale.",
  "Curabitur pretium tincidunt lacus. The closing paragraph places the leader's work inside the broader shift the magazine tracks, giving the feature its editorial frame.",
];

export const WOMEN_LEADERS: WomanLeader[] = [
  {
    slug: "sangita-reddy",
    name: "Dr. Sangita Reddy",
    role: "Joint Managing Director",
    organization: "Apollo Hospitals",
    image: "/assets/leader-sangita.jpg",
    featuredYear: 2026,
    featuredOn: "October 2026",
    bio: BIO_LOREM,
  },
  {
    slug: "arundhati-bhattacharya",
    name: "Arundhati Bhattacharya",
    role: "Chairperson & CEO",
    organization: "Salesforce India",
    image: "/assets/leader-arundhati.jpg",
    featuredYear: 2026,
    featuredOn: "September 2026",
    bio: BIO_LOREM,
  },
  {
    slug: "shobha-nv",
    name: "Shobha NV",
    role: "Founder & Managing Director",
    organization: "Infrastructure",
    image: "/assets/leader-shobha.jpg",
    featuredYear: 2026,
    featuredOn: "August 2026",
    bio: BIO_LOREM,
  },
  {
    slug: "nila-malik",
    name: "Nila Malik",
    role: "Enterprise Transformation Leader",
    organization: "Aviation",
    image: "/assets/leader-nila.jpg",
    featuredYear: 2026,
    featuredOn: "July 2026",
    bio: BIO_LOREM,
  },
];
