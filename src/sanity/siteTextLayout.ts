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
      { title: "Menu", fields: [["nav", "Menu links", "Each item is a link name and the page it opens, for example /magazines."]] },
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
      { title: "1. Headline ticker", fields: [["tickerLabel", "Label before the headlines"]] },
      {
        title: "2. Magazine release",
        fields: [
          ["releaseTitle", "Heading"],
          ["releaseText", "Text"],
          ["releaseButton", "Button"],
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
        title: "4. Industries we cover",
        fields: [
          ["industriesTitle", "Heading"],
          ["industriesIntro", "Line under the heading"],
          ["industriesButton", "Button"],
        ],
      },
      {
        title: "5. Latest news and Vital updates",
        fields: [
          ["newsTitle", "Latest news heading"],
          ["updatesTitle", "Vital updates heading"],
          ["readMore", "Read more link"],
        ],
      },
      { title: "6. Featured articles", fields: [["featuredArticlesTitle", "Heading"]] },
      {
        title: "7. Women leaders (Wall of fame)",
        fields: [
          ["wallTitle", "Heading"],
          ["wallIntro", "Line under the heading"],
          ["wallReadFeature", "Link on each card"],
          ["wallButton", "Button"],
        ],
      },
      { title: "8. Podcasts", fields: [["podcastsTitle", "Heading"]] },
      { title: "9. Testimonials", fields: [["testimonialsTitle", "Heading"]] },
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
      { title: "2. Edition cards", fields: [["readEdition", "Link under each cover"]] },
      {
        title: "3. Edition page: top",
        fields: [
          ["backLink", "Back link"],
          ["readButton", "Read the edition button"],
          ["downloadButton", "Download PDF button"],
          ["exploreMore", "Button shown when there is no PDF yet"],
          ["scrollToRead", "Hint under the buttons"],
          ["pdfSoon", "Hint when there is no PDF yet"],
        ],
      },
      {
        title: "4. Edition page: magazine reader",
        fields: [
          ["readerTitle", "Heading"],
          ["readerHint", "Tip next to the heading"],
          ["readerSoon", "Tip when there is no PDF yet"],
          ["readerPlaceholderTitle", "Empty reader: heading"],
          ["readerPlaceholderText", "Empty reader: text"],
        ],
      },
      {
        title: "5. Edition page: more editions",
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
        title: "1. Carousel",
        fields: [
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
    title: "Women Spotlight",
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
          ["readStory", "Read her story button"],
          ["readEdition", "Read the edition button"],
          ["viewSources", "View sources button"],
          ["themesLabel", "Heading of the themes panel"],
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
    key: "podcasts",
    title: "Podcasts",
    sections: [
      {
        title: "1. Search and filters",
        fields: [
          ["searchPlaceholder", "Hint inside the search box"],
          ["searchLabel", "Search box name (read out by screen readers)"],
          ["yearLabel", "Year filter label"],
          ["allYears", "All years option"],
          ["sortLabel", "Sort label"],
          ["sortNewest", "Newest first option"],
          ["sortOldest", "Oldest first option"],
          ["countWord", "Word after the number, as in 4 episodes"],
          ["clearFilters", "Clear filters button"],
          ["noResultsTitle", "No results: heading"],
          ["noResultsText", "No results: text"],
        ],
      },
      { title: "2. Episode cards", fields: [["watchEpisode", "Link on each card"]] },
      {
        title: "3. Video pop-up",
        fields: [
          ["openOnYoutube", "Open on YouTube link"],
          ["close", "Close button"],
          ["closePlayer", "Close button name (read out by screen readers)"],
          ["embedError", "Message if the video cannot load"],
        ],
      },
    ],
  },
  {
    key: "articles",
    title: "Articles",
    sections: [
      {
        title: "1. Section headings",
        fields: [
          ["topTitle", "Top stories"],
          ["latestTitle", "Latest news"],
          ["exploreTitle", "Explore by category"],
        ],
      },
      {
        title: "2. Search",
        fields: [
          ["searchPlaceholder", "Hint inside the search box"],
          ["searchLabel", "Search box name (read out by screen readers)"],
          ["noResultsTitle", "No results: heading"],
          ["noResultsText", "No results: text"],
        ],
      },
      {
        title: "3. Article page",
        fields: [
          ["backLink", "Back link"],
          ["moreTitle", "More articles heading"],
          ["viewAll", "View all link"],
        ],
      },
    ],
  },
  {
    key: "contact",
    title: "Contact",
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
          ["sendingButton", "Button while sending"],
        ],
      },
      {
        title: "3. After the message is sent",
        fields: [
          ["successTitle", "Thank-you heading"],
          ["successText", "Thank-you text"],
          ["sendAnother", "Send another message link"],
        ],
      },
      {
        title: "4. Error messages",
        fields: [
          ["nameRequired", "When the name is missing"],
          ["emailInvalid", "When the email is wrong"],
          ["subjectRequired", "When the subject is missing"],
          ["messageShort", "When the message is too short"],
          ["genericError", "When something else fails"],
        ],
      },
    ],
  },
  {
    key: "footer",
    title: "Footer",
    sections: [
      { title: "1. Under the logo", fields: [["tagline", "Short description"]] },
      {
        title: "2. Link columns",
        fields: [
          ["platformHeading", "First column: heading"],
          ["platformLinks", "First column: links"],
          ["exploreHeading", "Second column: heading"],
          ["exploreLinks", "Second column: links"],
          ["legalHeading", "Third column: heading"],
          ["termsLabel", "Terms of Service link"],
          ["privacyLabel", "Privacy Policy link"],
          ["followHeading", "Fourth column: heading", "The social links themselves are in Contact details and social links."],
        ],
      },
      { title: "3. Bottom line", fields: [["copyright", "Copyright line"]] },
    ],
  },
  {
    key: "general",
    title: "Other pages",
    sections: [
      {
        title: "1. Page not found",
        fields: [
          ["notFoundTitle", "Heading"],
          ["notFoundText", "Text"],
          ["notFoundHome", "First button"],
          ["notFoundMagazines", "Second button"],
        ],
      },
      {
        title: "2. Page numbers",
        fields: [
          ["paginationPrev", "Previous button"],
          ["paginationNext", "Next button"],
        ],
      },
      {
        title: "3. Terms and Privacy pages",
        fields: [
          ["alsoRead", "Also read label"],
          ["contactUs", "Contact us link"],
        ],
      },
    ],
  },
];

// Kept in the data for older pages but no longer shown on the site.
export const HIDDEN_TEXT_KEYS: Record<string, string[]> = {
  magazines: ["scrollToInside", "insideLabel"],
};
