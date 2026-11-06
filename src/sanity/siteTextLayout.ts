// How the "Menus, buttons and labels" editor is laid out in the Studio.
// One tab per page, in the same order as the website's menu, and inside each
// tab the sections follow the page from top to bottom. Each field gets a plain
// label that says what it is on the page.
//
// Keys must exist in src/data/siteText.default.json. A key that is not listed
// here still appears, under "Other", so nothing can go missing.

export type TextField = [key: string, label: string, help?: string];
export type TextSection = { title: string; fields: TextField[] };
export type TextGroup = { key: string; title: string; sections: TextSection[] };

const FILL = "Words in curly brackets, like {name}, are filled in automatically. Keep them.";

export const SITE_TEXT_LAYOUT: TextGroup[] = [
  {
    key: "header",
    title: "Top menu",
    sections: [
      {
        title: "Menu",
        fields: [
          ["nav", "Menu links", "Each item is a link name and the page it opens, for example /magazines. The item that opens /industries shows the Industries dropdown."],
          ["allIndustries", "Last link in the Industries dropdown"],
        ],
      },
      {
        title: "Buttons",
        fields: [
          ["subscribe", "Subscribe button (top right)"],
          ["latestEdition", "Latest edition button (in the menu bar)"],
        ],
      },
    ],
  },
  {
    key: "home",
    title: "Home",
    sections: [
      { title: "1. Headline ticker", fields: [["tickerLabel", "Tab under the headlines, above the magazine covers"]] },
      {
        title: "2. Top of the page: covers and India map",
        fields: [
          ["releaseTitle", "Big title on the left"],
          ["releaseText", "Text beside the title"],
          ["releaseButton", "Button under the covers"],
        ],
      },
      {
        title: "3. Cover stories",
        fields: [
          ["coverStoriesTitle", "Heading"],
          ["coverStoryLabel", "Small label on each cover"],
        ],
      },
      {
        title: "4. Industries we cover (the industries themselves are in 6. Industries)",
        fields: [
          ["industriesTitle", "Heading"],
          ["industriesIntro", "Line under the heading"],
          ["industriesButton", "Button"],
        ],
      },
      {
        title: "5. Latest news",
        fields: [
          ["newsTitle", "Latest news heading"],
          ["readMore", "Read more link"],
        ],
      },
      { title: "6. Featured articles", fields: [["featuredArticlesTitle", "Heading"]] },
      {
        title: "7. Business women (Wall of fame)",
        fields: [
          ["wallTitle", "Heading"],
          ["wallIntro", "Line under the heading"],
          ["wallReadFeature", "Link on each card"],
          ["wallButton", "Button"],
        ],
      },
      { title: "8. Testimonials", fields: [["testimonialsTitle", "Heading"]] },
      {
        title: "9. Trusted brands (the logos are in Home page → Trusted brands)",
        fields: [
          ["brandsKicker", "Small label above the heading"],
          ["brandsTitle", "Heading"],
        ],
      },
      {
        title: "10. Get featured",
        fields: [
          ["getFeaturedKicker", "Small label above the heading"],
          ["getFeaturedTitle", "Heading"],
          ["getFeaturedText", "Text"],
          ["getFeaturedButton", "Button"],
        ],
      },
      {
        title: "11. Newsletter",
        fields: [
          ["newsletterTitle", "Heading"],
          ["newsletterText", "Text"],
          ["newsletterPlaceholder", "Hint inside the email box"],
          ["newsletterButton", "Button"],
          ["newsletterSending", "Button while sending"],
          ["newsletterSuccess", "Message after subscribing"],
          ["newsletterInvalid", "Message when the email is wrong"],
          ["newsletterError", "Message if something fails"],
        ],
      },
    ],
  },
  {
    key: "magazines",
    title: "Magazines",
    sections: [
      {
        title: "1. Search and filters (archive page)",
        fields: [
          ["searchPlaceholder", "Hint inside the search box"],
          ["searchLabel", "Search box name (read out by screen readers)"],
          ["yearLabel", "Year filter label"],
          ["allYears", "All years option"],
          ["sortLabel", "Sort label"],
          ["sortNewest", "Newest first option"],
          ["sortOldest", "Oldest first option"],
          ["countWord", "Word after the number, as in 7 editions"],
          ["clearFilters", "Clear filters button"],
          ["noResultsTitle", "No results: heading"],
          ["noResultsText", "No results: text"],
        ],
      },
      { title: "2. Edition cards", fields: [["readEdition", "Button under each cover"]] },
      {
        title: "3. Edition page: top",
        fields: [
          ["backLink", "Back link"],
          ["webLive", "Web View button (opens the story)"],
          ["digitalLive", "Digital Version button (opens the magazine in a new tab)"],
          ["liveSoon", "Shown when neither is ready yet"],
        ],
      },
      {
        title: "4. Web View page",
        fields: [
          ["storyBack", "Back link"],
          ["storyDigital", "Button at the end of the story"],
        ],
      },
      {
        title: "5. Digital Version page",
        fields: [["readerHint", "Tip next to the heading", "The heading is the person's name and the edition."]],
      },
      {
        title: "6. Edition page: more editions",
        fields: [
          ["moreTitle", "Heading"],
          ["viewArchive", "View the archive link"],
        ],
      },
    ],
  },
  {
    key: "hallOfFame",
    title: "Hall of Fame",
    sections: [
      {
        title: "1. Top of the page and carousel",
        fields: [
          ["mastLabel", "Small label at the top left"],
          ["jumpButton", "Button under the intro (scrolls to the carousel)"],
          ["rollTitle", "Heading above the grid of all inductees"],
          ["carouselHint", "Swipe hint above the carousel"],
          ["carouselEyebrow", "Small label above the name"],
          ["carouselPosition", "Position text", FILL],
          ["citation", "Sentence under the name", FILL],
          ["citationNoDate", "Sentence when there is no induction date", FILL],
          ["viewProfile", "View profile button"],
          ["readEdition", "Read the edition button"],
        ],
      },
      {
        title: "2. Search and filters",
        fields: [
          ["searchPlaceholder", "Hint inside the search box"],
          ["searchLabel", "Search box name (read out by screen readers)"],
          ["yearLabel", "Year filter label"],
          ["allYears", "All years option"],
          ["sortLabel", "Sort label"],
          ["sortNewest", "Most recent option"],
          ["sortOldest", "Earliest first option"],
          ["countWord", "Word after the number, as in 7 inductees"],
          ["clearFilters", "Clear filters button"],
          ["noResultsTitle", "No results: heading"],
          ["noResultsText", "No results: text"],
        ],
      },
      {
        title: "3. Apply band (bottom of the page)",
        fields: [
          ["applyLabel", "Small label"],
          ["applyTitle", "Heading"],
          ["applyText", "Text"],
          ["applyButton", "Button"],
          ["applyLink", "Link under the button"],
        ],
      },
      {
        title: "4. Inductee page",
        fields: [
          ["backLink", "Back link"],
          ["inducted", "Inducted label"],
          ["openProfile", "Open profile link"],
          ["moreTitle", "More inductees heading"],
          ["viewAll", "View all link"],
        ],
      },
    ],
  },
  {
    key: "womenSpotlight",
    title: "Business Women",
    sections: [
      {
        title: "1. Top of the page",
        fields: [
          ["introOne", "Intro: first paragraph"],
          ["introTwo", "Intro: second paragraph"],
          ["meetButton", "First button"],
          ["nominateButton", "Second button"],
          ["featuredCount", "Label above the number of profiles"],
          ["tickerThemes", "Scrolling themes", "Separate the themes with commas."],
        ],
      },
      {
        title: "2. Profile section",
        fields: [
          ["sectionTitle", "Heading"],
          ["exploreProfile", "Link on each name tab"],
          ["coverHonoree", "Label when she has been on a cover"],
          ["featuredProfile", "Label for other profiles"],
          ["readStory", "Read her story button (the Digital Version button uses the Magazines label)"],
        ],
      },
      {
        title: "3. Story page",
        fields: [
          ["backLink", "Back link"],
          ["honoursTitle", "Honours box heading"],
          ["sourcesTitle", "Sources box heading"],
          ["pagerPrev", "Previous label"],
          ["pagerNext", "Next label"],
          ["pagerBrowse", "Small text above the middle link"],
          ["pagerAll", "Middle link (all honorees)"],
        ],
      },
    ],
  },
  {
    key: "articles",
    title: "Articles",
    sections: [
      {
        title: "1. Articles page",
        fields: [
          ["topTitle", "Top stories heading"],
          ["latestTitle", "Latest news heading"],
          ["exploreTitle", "Categories heading"],
          ["searchPlaceholder", "Hint inside the search box"],
          ["searchLabel", "Search box name (read out by screen readers)"],
          ["noResultsTitle", "No results: heading"],
          ["noResultsText", "No results: text"],
        ],
      },
      {
        title: "2. Article page",
        fields: [
          ["backLink", "Back link"],
          ["moreTitle", "More articles heading"],
          ["viewAll", "View all link"],
        ],
      },
    ],
  },
  {
    key: "industries",
    title: "Industries",
    sections: [
      {
        title: "1. Industries page",
        fields: [
          ["viewIndustry", "Link on each industry"],
          ["countWord", "Word after the number, as in 7 stories"],
          ["countWordOne", "Same word for just one, as in 1 story"],
        ],
      },
      {
        title: "2. One industry's page",
        fields: [
          ["backLink", "Back link"],
          ["storiesTitle", "Stories heading"],
          ["emptyTitle", "No stories yet: heading"],
          ["emptyText", "No stories yet: text"],
          ["emptyButton", "No stories yet: button"],
          ["otherTitle", "Other industries heading"],
        ],
      },
    ],
  },
  {
    key: "contact",
    title: "Contact Us",
    sections: [
      {
        title: "1. Contact details",
        fields: [
          ["emailLabel", "Email label"],
          ["phoneLabel", "Phone label"],
          ["whatsappLabel", "WhatsApp label"],
          ["whatsappCta", "WhatsApp link text"],
          ["officeLabel", "Office label"],
        ],
      },
      {
        title: "2. Form",
        fields: [
          ["nameLabel", "Name box label"],
          ["formEmailLabel", "Email box label"],
          ["subjectLabel", "Subject box label"],
          ["messageLabel", "Message box label"],
          ["sendButton", "Send button"],
          ["sendingButton", "Send button while sending"],
        ],
      },
      {
        title: "3. Messages",
        fields: [
          ["successTitle", "After sending: heading"],
          ["successText", "After sending: text"],
          ["sendAnother", "Send another message link"],
          ["nameRequired", "When the name is missing"],
          ["emailInvalid", "When the email is wrong"],
          ["subjectRequired", "When the subject is missing"],
          ["messageShort", "When the message is too short"],
          ["genericError", "If something fails"],
        ],
      },
    ],
  },
  {
    key: "footer",
    title: "Footer",
    sections: [
      {
        title: "1. Left side",
        fields: [
          ["ctaTitle", "Large line under the logo (an orange full stop is added after it)"],
          ["ctaButton", "Button (opens Contact Us)", "The email under the button comes from 8. Contact Us."],
        ],
      },
      {
        title: "2. Right side",
        fields: [
          ["locationHeading", "Location heading", "The address comes from 8. Contact Us."],
          ["contactHeading", "Contact heading", "The phone number comes from 8. Contact Us. Hidden when there is no phone number."],
          ["followHeading", "Social heading", "The social links come from 8. Contact Us."],
          ["linksHeading", "Links heading"],
          ["platformLinks", "Links (first part)"],
          ["exploreLinks", "Links (second part)"],
        ],
      },
      {
        title: "3. Bottom row",
        fields: [
          ["copyright", "Copyright line"],
          ["termsLabel", "Terms link"],
          ["privacyLabel", "Privacy link"],
        ],
      },
    ],
  },
  {
    key: "general",
    title: "Whole site",
    sections: [
      {
        title: "1. Page not found",
        fields: [
          ["notFoundTitle", "Heading"],
          ["notFoundText", "Text"],
          ["notFoundHome", "Home page button"],
          ["notFoundMagazines", "Magazines button"],
        ],
      },
      {
        title: "2. Used on several pages",
        fields: [
          ["paginationPrev", "Previous page button"],
          ["paginationNext", "Next page button"],
          ["alsoRead", "Also read label"],
          ["contactUs", "Contact us link"],
        ],
      },
    ],
  },
];

// Kept in the data for older pages but no longer shown on the site.
export const HIDDEN_TEXT_KEYS: Record<string, string[]> = {
  home: ["updatesTitle"],
  magazines: ["scrollToInside", "insideLabel", "readButton", "exploreMore", "scrollToRead", "pdfSoon", "readerSoon", "readerPlaceholderTitle", "readerPlaceholderText", "readerTitle", "downloadButton"],
  womenSpotlight: ["themesLabel", "readEdition", "viewSources"],
  hallOfFame: ["mastLabel", "jumpButton", "rollTitle", "applyLabel", "applyTitle", "applyText", "applyButton", "applyLink"],
  footer: ["legalHeading", "tagline", "platformHeading", "exploreHeading"],
};
