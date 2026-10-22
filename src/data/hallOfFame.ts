import type { HallOfFameEntry } from "@/types/content";

// Dummy roll of inductees. Each row points back at an existing magazine
// edition (so title, cover and pull-quote stay in sync later from Sanity).
// Serial numbers are permanent — they don't shift when sort changes.

// Shared placeholder body paragraphs for the honoree profile pages. Each
// entry starts with its own first line (the one unique dummy sentence we
// gave the entry) and continues with these generic paragraphs. Replaced
// per-entry from Sanity once the client's content lands.
const PROFILE_BODY_LOREM = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. The honoree's induction citation would typically open here — one or two paragraphs explaining why their body of work earned a place on the roll, written in the editorial voice of the magazine rather than as a résumé.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Supporting detail belongs in this second paragraph: specific decisions, specific outcomes, specific readers who benefitted — the texture that distinguishes a cover feature from a profile.",
  "Curabitur pretium tincidunt lacus. The closing paragraph usually links the honoree's work to a broader shift the magazine is tracking, giving the induction its editorial frame rather than treating it as an isolated award.",
];

export const HALL_OF_FAME: HallOfFameEntry[] = [
  {
    slug: "edition-014-cyber-governance",
    serial: 14,
    inductionYear: 2026,
    inductedOn: "October 2026",
    editionSlug: "edition-014-cyber-governance",
    name: "Honoree Name Placeholder",
    role: "Role / Title Placeholder",
    organization: "Organization Name",
    portrait: "/assets/cover-abhirup-guha.jpg",
    pullQuote:
      "A short pull-quote from this honoree's cover edition — around twenty words so the layout holds its rhythm.",
    profileBody: PROFILE_BODY_LOREM,
  },
  {
    slug: "edition-013-industrial-leadership",
    serial: 13,
    inductionYear: 2026,
    inductedOn: "September 2026",
    editionSlug: "edition-013-industrial-leadership",
    name: "Honoree Name Placeholder",
    role: "Role / Title Placeholder",
    organization: "Organization Name",
    portrait: "/assets/mag-cover-abhirup.jpg",
    pullQuote:
      "Dummy pull-quote content. The client replaces this from the CMS once a Sanity honoree document is published.",
    profileBody: PROFILE_BODY_LOREM,
  },
  {
    slug: "edition-012-finance-leader",
    serial: 12,
    inductionYear: 2026,
    inductedOn: "August 2026",
    editionSlug: "edition-012-finance-leader",
    name: "Honoree Name Placeholder",
    role: "Role / Title Placeholder",
    organization: "Organization Name",
    portrait: "/assets/mag-cover-finance.jpg",
    pullQuote:
      "A placeholder quote that will be swapped for the real line the honoree stood by on their cover.",
    profileBody: PROFILE_BODY_LOREM,
  },
  {
    slug: "edition-011-leader-to-watch",
    serial: 11,
    inductionYear: 2026,
    inductedOn: "July 2026",
    editionSlug: "edition-011-leader-to-watch",
    name: "Honoree Name Placeholder",
    role: "Role / Title Placeholder",
    organization: "Organization Name",
    portrait: "/assets/mag-cover-parin.jpg",
    pullQuote:
      "Another placeholder for the roll. Pull-quotes between fifteen and twenty-five words sit best in this layout.",
    profileBody: PROFILE_BODY_LOREM,
  },
  {
    slug: "edition-010-chaos-to-clarity",
    serial: 10,
    inductionYear: 2026,
    inductedOn: "June 2026",
    editionSlug: "edition-010-chaos-to-clarity",
    name: "Honoree Name Placeholder",
    role: "Role / Title Placeholder",
    organization: "Organization Name",
    portrait: "/assets/cover-chaos-clarity.jpg",
    pullQuote:
      "Each roll entry gets its own quote; the editor can lift it from the magazine edition or write a fresh one.",
    profileBody: PROFILE_BODY_LOREM,
  },
  {
    slug: "edition-009-finance-leader-2026",
    serial: 9,
    inductionYear: 2026,
    inductedOn: "May 2026",
    editionSlug: "edition-009-finance-leader-2026",
    name: "Honoree Name Placeholder",
    role: "Role / Title Placeholder",
    organization: "Organization Name",
    portrait: "/assets/cover-finance-leader.jpg",
    pullQuote:
      "A placeholder quote while real editorial copy is being drafted. The layout stays the same.",
    profileBody: PROFILE_BODY_LOREM,
  },
  {
    slug: "edition-008-ceo-coach",
    serial: 8,
    inductionYear: 2026,
    inductedOn: "April 2026",
    editionSlug: "edition-008-ceo-coach",
    name: "Honoree Name Placeholder",
    role: "Role / Title Placeholder",
    organization: "Organization Name",
    portrait: "/assets/cover-ceo-coach.jpg",
    pullQuote:
      "A short, specific line reads stronger than a general one — hold the honoree's quote to one idea.",
    profileBody: PROFILE_BODY_LOREM,
  },
  {
    slug: "edition-007-abhirup-guha",
    serial: 7,
    inductionYear: 2026,
    inductedOn: "March 2026",
    editionSlug: "edition-007-abhirup-guha",
    name: "Honoree Name Placeholder",
    role: "Role / Title Placeholder",
    organization: "Organization Name",
    portrait: "/assets/cover-abhirup-guha.jpg",
    pullQuote:
      "Dummy pull-quote content. The client replaces this from the CMS once real honoree data lands.",
    profileBody: PROFILE_BODY_LOREM,
  },
  {
    slug: "edition-006-dummy-2025-four",
    serial: 6,
    inductionYear: 2025,
    inductedOn: "December 2025",
    editionSlug: "edition-006-dummy-2025-four",
    name: "Honoree Name Placeholder",
    role: "Role / Title Placeholder",
    organization: "Organization Name",
    portrait: "/assets/mag-cover-abhirup.jpg",
    pullQuote:
      "A quote retrieved from the honoree's edition — surfaces here so visitors see why they were featured.",
    profileBody: PROFILE_BODY_LOREM,
  },
  {
    slug: "edition-005-dummy-2025-three",
    serial: 5,
    inductionYear: 2025,
    inductedOn: "October 2025",
    editionSlug: "edition-005-dummy-2025-three",
    name: "Honoree Name Placeholder",
    role: "Role / Title Placeholder",
    organization: "Organization Name",
    portrait: "/assets/cover-chaos-clarity.jpg",
    pullQuote:
      "Placeholder dummy content. Replaced via the Sanity Studio once the Hall of Fame schema is wired in.",
    profileBody: PROFILE_BODY_LOREM,
  },
  {
    slug: "edition-004-dummy-2025-two",
    serial: 4,
    inductionYear: 2025,
    inductedOn: "August 2025",
    editionSlug: "edition-004-dummy-2025-two",
    name: "Honoree Name Placeholder",
    role: "Role / Title Placeholder",
    organization: "Organization Name",
    portrait: "/assets/cover-finance-leader.jpg",
    pullQuote:
      "The early entries anchor the roll's history — these are the ones that give the Hall its weight over time.",
    profileBody: PROFILE_BODY_LOREM,
  },
  {
    slug: "edition-003-dummy-2025-one",
    serial: 3,
    inductionYear: 2025,
    inductedOn: "June 2025",
    editionSlug: "edition-003-dummy-2025-one",
    name: "Honoree Name Placeholder",
    role: "Role / Title Placeholder",
    organization: "Organization Name",
    portrait: "/assets/cover-ceo-coach.jpg",
    pullQuote:
      "The first few editions on the roll. Replaced from the CMS once published records are entered.",
    profileBody: PROFILE_BODY_LOREM,
  },
];
