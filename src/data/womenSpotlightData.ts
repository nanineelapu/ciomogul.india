// Women Spotlight content. Only "published" profiles get a full feature,
// tabs, pager links and a shareable ?profile= URL. "pending" profiles are
// listed as under review until their identity and achievements are verified.
//
// Editorial rules baked into the shape:
// - No statistics or direct quotes unless sourced (fields don't exist yet).
// - `edition` (and the "Cover honoree" label / "Read the edition" button)
//   only once the real magazine issue is confirmed.

export type SpotlightSource = { label: string; href: string };

export type PublishedProfile = {
  status: "published";
  id: string;
  name: string;
  designation: string;
  organization: string;
  sector: string;
  tags: string[];
  image: string;
  cover: string;
  intro: string;
  story: string[];
  // Closing editorial summary, shown as a highlighted note (not a quote).
  summary: string;
  // One-line description for "In their words" (not a quotation).
  voice: string;
  themes: string[];
  milestones: { when?: string; event: string }[];
  honours: string;
  achievements: { title: string; desc: string }[];
  sources: SpotlightSource[];
  // A direct quotation, only when it can be traced to a published source.
  quote?: { text: string; source: SpotlightSource };
  // Set only when the real CIO Mogul India issue is confirmed.
  edition?: { label: string; month: string; href: string };
  // Optional search overrides from Sanity.
  seo?: { title?: string; description?: string; keywords?: string[] };
};

export type PendingProfile = {
  status: "pending";
  id: string;
  name: string;
  sector: string;
  image: string;
  statusLabel: string;
  note: string;
  teaser: string;
};

export type SpotlightProfile = PublishedProfile | PendingProfile;

export const SPOTLIGHT_COPY = {
  intro: [
    "Celebrating women shaping healthcare, banking, enterprise technology, entrepreneurship and the future of business.",
    "Meet the leaders whose careers reflect innovation, institutional change and a commitment to building what comes next.",
  ],
  sectors: "Healthcare, Banking, Real Estate & Aviation",
  focus: "Leadership, Innovation & Impact",
  tickerThemes: ["Healthcare", "Banking", "Enterprise Technology", "Real Estate", "Aviation", "The Future of Business"],
};

export const WOMEN_SPOTLIGHT_DATA: SpotlightProfile[] = [
  {
    status: "published",
    id: "sangita-reddy",
    name: "Dr. Sangita Reddy",
    designation: "Joint Managing Director",
    organization: "Apollo Hospitals Enterprise Limited",
    sector: "Healthcare & Digital Health",
    tags: ["Healthcare", "Digital Health", "Healthcare Policy"],
    image: "/assets/leader-sangita.jpg",
    cover: "/assets/women-cover-sangita.jpg",
    intro:
      "Dr. Sangita Reddy is an Indian healthcare entrepreneur and executive whose work spans hospital operations, digital health, telemedicine, healthcare technology and public policy. As Joint Managing Director of Apollo Hospitals Enterprise Limited, she has contributed to the group's technology-enabled healthcare initiatives and efforts to broaden access to healthcare services.",
    story: [
      "Dr. Sangita Reddy has worked across healthcare operations, technology adoption and industry collaboration. A member of the founding team at Apollo Hospitals, she has held leadership responsibilities across hospital operations and technology-enabled healthcare delivery.",
      "Her work has included the development of digital healthcare platforms, telemedicine and technology-driven approaches to patient care. She has also participated in national and international healthcare policy discussions, including through her role as Chairperson of G20 Empower India and her previous presidency of FICCI.",
      "In FY 2026–2027, Apollo Hospitals announced her appointment as President of NATHEALTH, the Healthcare Federation of India. This role places her within industry-wide efforts to improve healthcare accessibility, affordability, quality and collaboration.",
    ],
    summary:
      "Her career illustrates the relationship between healthcare leadership, digital innovation and the challenge of expanding access to patient-centred services.",
    voice: "Explore her work in healthcare technology, telemedicine and patient-centred innovation.",
    themes: [
      "Digital health and telemedicine",
      "Healthcare operations and innovation",
      "Patient-centred technology",
      "Healthcare policy and industry collaboration",
    ],
    milestones: [
      { event: "Joined the Apollo Hospitals organisation in the early stages of its development." },
      { event: "Took on leadership responsibilities in operations and technology-enabled healthcare." },
      { event: "Served as President of FICCI." },
      { event: "Chaired G20 Empower India during India's G20 presidency." },
      { when: "FY 2026–27", event: "Appointed President of NATHEALTH, the Healthcare Federation of India." },
    ],
    honours:
      "Apollo's official biography records multiple recognitions, including CNN-News18 Indian of the Year 2024 in Business and honorary doctorates.",
    achievements: [
      {
        title: "Technology-enabled healthcare",
        desc: "Contributed to digital health, telemedicine and technology-enabled patient-care initiatives at Apollo Hospitals.",
      },
      {
        title: "Industry leadership",
        desc: "Participated in healthcare policy and industry collaboration through leadership roles at FICCI, G20 Empower India and NATHEALTH.",
      },
      {
        title: "Healthcare access and innovation",
        desc: "Supported technology-led approaches intended to expand access to healthcare and improve patient services.",
      },
    ],
    sources: [
      {
        label: "Apollo Hospitals — official biography",
        href: "https://www.apollohospitals.com/management/dr-sangita-reddy-joint-managing-director",
      },
      {
        label: "Apollo Hospitals — NATHEALTH appointment",
        href: "https://www.apollohospitals.com/apollo-in-the-news/dr-sangita-reddy-appointed-president-of-nathealth",
      },
    ],
  },
  {
    status: "published",
    id: "arundhati-bhattacharya",
    name: "Arundhati Bhattacharya",
    designation: "President & CEO",
    organization: "Salesforce – South Asia",
    sector: "Banking & Enterprise Technology",
    tags: ["Banking", "Enterprise Technology", "Business Leadership"],
    image: "/assets/leader-arundhati.jpg",
    cover: "/assets/women-cover-arundhati.jpg",
    intro:
      "Arundhati Bhattacharya is an Indian business leader whose career spans banking, financial services and enterprise technology. She joined the State Bank of India (SBI) in 1977 and became its first woman chairperson in 2013. In 2020, she moved into the technology sector by joining Salesforce.",
    story: [
      "Arundhati Bhattacharya built her career over several decades in India's banking industry, progressing through roles at the State Bank of India before becoming its first woman chairperson. Her tenure coincided with an important period of change in financial services, including increased attention to digital banking and customer-facing technology.",
      "In 2020, she joined Salesforce, bringing her experience in financial services and organisational leadership to the enterprise technology sector. Her responsibilities have included regional business growth and engagement with customers, partners and the wider business ecosystem.",
    ],
    summary:
      "Her career illustrates how leadership experience can transfer across sectors, from a large public-sector financial institution to a global enterprise software company.",
    voice: "Explore her career across banking, enterprise technology and organisational leadership.",
    themes: [
      "Banking and financial services",
      "Enterprise technology and digital transformation",
      "Organisational leadership and governance",
      "Business strategy and institutional change",
    ],
    milestones: [
      { when: "1977", event: "Joined the State Bank of India." },
      { when: "2013", event: "Became the first woman chairperson of the State Bank of India." },
      { when: "2020", event: "Joined Salesforce to lead its India business." },
      {
        when: "Current",
        event: "President & CEO, Salesforce – South Asia, as reported by Salesforce-related and business publications.",
      },
    ],
    honours:
      "Her documented recognitions include being named among Fortune's World's 50 Greatest Leaders and Forbes' World's 100 Most Powerful Women.",
    achievements: [
      {
        title: "Leadership in Indian banking",
        desc: "Became the first woman to chair the State Bank of India.",
      },
      {
        title: "Transition to enterprise technology",
        desc: "Brought her financial-sector leadership experience to Salesforce, working across business growth and the technology ecosystem.",
      },
      {
        title: "Leadership and workplace development",
        desc: "Has spoken publicly about management, organisational culture and opportunities for women in leadership.",
      },
    ],
    sources: [
      {
        label: "Salesforce — author profile",
        href: "https://www.salesforce.com/in/blog/author/arundhati-bhattacharya/",
      },
      {
        label: "Government of India — Padma Awards material",
        href: "https://www.presidentofindia.gov.in/",
      },
      {
        label: "Fortune Asia — profile",
        href: "https://www.fortune.com/asia/ranking/most-powerful-women-asia/2026/arundhati-bhattacharya/",
      },
    ],
  },
  {
    status: "published",
    id: "shobha-nv",
    name: "Shobha NV",
    designation: "Founder & CEO",
    organization: "Infinite Building Technologies",
    sector: "Real Estate & Infrastructure",
    tags: ["Real Estate", "Infrastructure", "Development Management"],
    image: "/assets/leader-shobha.jpg",
    cover: "/assets/women-cover-shobha.jpg",
    intro:
      "Shobha NV is the Founder and CEO of Infinite Building Technologies (IBT), a Bengaluru-based real estate services and consulting firm. Before founding IBT in 2024, she built close to three decades of experience in real estate and infrastructure, including at Brigade and Ascendas.",
    story: [
      "Shobha NV's career has been built on the delivery side of real estate: the planning, coordination and governance that turn a development plan into a finished building. In an interview with Prime Insights, she describes nearly three decades of experience at organisations including Brigade and Ascendas, and work on complex, multi-city developments.",
      "In 2024 she founded Infinite Building Technologies in Bengaluru. The firm describes itself as a professionally managed real estate services company offering design, development management, cost and contract management, technical due diligence, asset management and quality and safety oversight across residential, commercial, IT, retail, hotel and hospital buildings.",
      "She describes her current focus as development strategy, project governance and ESG-aligned advisory, and reports board certifications in corporate directorship and ESG.",
    ],
    summary:
      "Her career reflects a shift in real estate from building volume to building value, with governance, capital efficiency and sustainability treated as part of the brief.",
    voice: "Explore her work in real estate development, project governance and ESG-aligned advisory.",
    quote: {
      text: "Rather than chasing volume, we will scale through value and impact.",
      source: {
        label: "Prime Insights interview",
        href: "https://primeinsights.in/shobha-n-v-infinite-building-technologies/",
      },
    },
    themes: [
      "Development strategy and project governance",
      "Real estate design and development management",
      "ESG-aligned advisory",
      "Capital efficiency and digital innovation",
    ],
    milestones: [
      { event: "Built nearly three decades of experience in real estate and infrastructure, including at Brigade and Ascendas." },
      { event: "Worked on complex, multi-city developments, including at BSCPL Infrastructure." },
      { when: "2024", event: "Founded Infinite Building Technologies in Bengaluru." },
      { when: "2026", event: "Featured by Prime Insights among The Most Trusted Women CXOs from Bangalore." },
    ],
    honours:
      "Featured by Prime Insights among The Most Trusted Women CXOs from Bangalore Known for Executive Excellence and Operational Leadership (2026), and in a CEO India Magazine cover story. She reports board certifications in corporate directorship and ESG.",
    achievements: [
      {
        title: "Founded Infinite Building Technologies",
        desc: "Established a Bengaluru-based real estate services firm covering design, development management, cost and contract management and asset management.",
      },
      {
        title: "Multi-city development experience",
        desc: "Worked on complex, multi-city developments across a career at organisations including Brigade, Ascendas and BSCPL Infrastructure.",
      },
      {
        title: "Governance-led advisory",
        desc: "Shapes IBT's advisory work around project governance, capital efficiency and ESG alignment.",
      },
    ],
    sources: [
      {
        label: "Prime Insights — interview with Shobha N V",
        href: "https://primeinsights.in/shobha-n-v-infinite-building-technologies/",
      },
      {
        label: "Infinite Building Technologies — company website",
        href: "https://infinitebuildingtech.com/",
      },
      {
        label: "LinkedIn — professional profile",
        href: "https://in.linkedin.com/in/shobha-n-v-0b38a9124",
      },
    ],
  },
  {
    status: "published",
    id: "nila-malik",
    name: "Nila Malik",
    designation: "Enterprise Transformation Leader",
    organization: "Aviation & Smart Infrastructure",
    sector: "Aviation & Digital Transformation",
    tags: ["Aviation", "Digital Transformation", "Smart Infrastructure"],
    image: "/assets/leader-nila.jpg",
    cover: "/assets/women-cover-nila.jpg",
    intro:
      "Nila Malik is an enterprise transformation leader working in aviation technology and smart infrastructure. A certified Project Management Professional (PMP) and Certified ScrumMaster (CSM), she has led complex technology and business programmes for more than two decades, most recently on digital transformation initiatives at Los Angeles World Airports.",
    story: [
      "Nila Malik's work sits where large technology programmes meet day-to-day operations. Her professional profile lists experience with organisations including VMware, Wipro, Enablon and United Airlines, and she describes more than 20 years of leading transformation work.",
      "At United Airlines, she is credited with helping lead the development and deployment of ConnectionSaver, the tool United launched in 2019 to identify departing flights that can be held for connecting customers while keeping passengers already on board on schedule.",
      "She has since worked on digital transformation and smart infrastructure initiatives at Los Angeles World Airports, the airport authority of the City of Los Angeles that operates LAX and Van Nuys Airport. Colleagues' recommendations describe a programme leader who manages complex technical and business programmes with many stakeholders, and keeps high-change projects on track with transparent executive reporting.",
    ],
    summary:
      "Her career shows how disciplined programme leadership turns aviation technology from a project into an operational system that travellers rely on.",
    voice: "Explore her work in aviation technology, airport digital transformation and smart infrastructure.",
    themes: [
      "Enterprise digital transformation",
      "Aviation technology and passenger operations",
      "Smart infrastructure",
      "Programme governance and stakeholder leadership",
    ],
    milestones: [
      { when: "2005", event: "Certified as a Project Management Professional (PMP) by the Project Management Institute." },
      { when: "2011", event: "Received the Excellent Communication and Client Service Award at Enablon North America." },
      { when: "2019", event: "United Airlines launched ConnectionSaver; she is credited with helping lead its development and deployment." },
      { event: "Took on digital transformation and smart infrastructure initiatives at Los Angeles World Airports." },
      { when: "2026", event: "Featured by CIO Mogul Magazine as a digital transformation leader." },
    ],
    honours:
      "Her professional profile lists a Deputy Minister's Award (Canada, 2005), the Excellent Communication and Client Service Award from Enablon North America (2011), a Marquis Who's Who honored listing (2026) and a CIO Mogul Certificate of Excellence (2026).",
    achievements: [
      {
        title: "ConnectionSaver at United Airlines",
        desc: "Helped lead the development and deployment of United's tool for holding departing flights for connecting customers.",
      },
      {
        title: "Airport digital transformation",
        desc: "Works on digital transformation and smart infrastructure initiatives at Los Angeles World Airports.",
      },
      {
        title: "Two decades of programme leadership",
        desc: "PMP-certified since 2005, with programme leadership across enterprise software, consulting and aviation.",
      },
    ],
    sources: [
      {
        label: "LinkedIn — professional profile",
        href: "https://www.linkedin.com/in/nilamalik/",
      },
      {
        label: "United Airlines — ConnectionSaver announcement (2019)",
        href: "https://www.prnewswire.com/news-releases/united-airlines-makes-connecting-the-world-easier-than-ever-with-connectionsaver-300864600.html",
      },
    ],
  },
];

export function getAllProfiles(): SpotlightProfile[] {
  return WOMEN_SPOTLIGHT_DATA;
}

export function getPublishedProfiles(): PublishedProfile[] {
  return WOMEN_SPOTLIGHT_DATA.filter((p): p is PublishedProfile => p.status === "published");
}

export function isPublishedProfile(id: string) {
  return getPublishedProfiles().some((p) => p.id === id);
}

// Unknown, missing or still-pending ids fall back to the first published profile.
export function getProfileById(id?: string): PublishedProfile {
  const published = getPublishedProfiles();
  return published.find((p) => p.id === id) ?? published[0];
}

export function profileHref(id: string) {
  return `/women-spotlight?profile=${id}#profile`;
}

// Exact lookup for the story page: no fallback, so unknown ids can 404.
export function findPublishedProfile(id: string): PublishedProfile | undefined {
  return getPublishedProfiles().find((p) => p.id === id);
}

// The full story lives on its own page, opened from "Read her story".
export function storyHref(id: string) {
  return `/women-spotlight/${id}`;
}

// Previous / next published profile for the pager. Wraps around; with only
// two profiles both directions point at the same person, so `prev` is null.
export function getAdjacentProfiles(id: string) {
  const all = getPublishedProfiles();
  const i = Math.max(0, all.findIndex((p) => p.id === id));
  const prev = all[(i - 1 + all.length) % all.length];
  const next = all[(i + 1) % all.length];
  return {
    prev: prev.id === id || prev.id === next.id ? null : prev,
    next: next.id === id ? null : next,
  };
}
