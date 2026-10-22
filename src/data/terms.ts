// A paragraph is plain text, or a numbered point like { ref: "1.1", text }.
export type LegalPoint = string | { ref: string; text: string };

export type LegalSection = {
  title: string;
  paragraphs: LegalPoint[];
  email?: string;
};

export type LegalContent = {
  title: string;
  intro: string;
  sections: LegalSection[];
};

// Legal text is kept exactly as supplied by the client.
export const TERMS: LegalContent = {
  title: "Terms of Service",
  intro:
    "Welcome to CIO India (“we,” “our,” “us”). By accessing or using our website, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully.",
  sections: [
    {
      title: "Use of the Website",
      paragraphs: [
        "You agree to use our website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use of the website.",
      ],
    },
    {
      title: "Intellectual Property",
      paragraphs: [
        "All content, trademarks, and materials available on this website — including text, graphics, logos, and images — are the property of CIO India or its licensors. You may not reproduce, distribute, or modify any part of this website without prior written permission.",
      ],
    },
    {
      title: "Content Accuracy",
      paragraphs: [
        "We strive to ensure that all information provided on this website is accurate and up to date. However, we do not guarantee the completeness, accuracy, or reliability of the content. CIO India will not be held responsible for any loss or damage resulting from reliance on website content.",
      ],
    },
    {
      title: "External Links",
      paragraphs: [
        "Our website may include links to external websites. These are provided for convenience only, and we are not responsible for the content or policies of third-party sites.",
      ],
    },
    {
      title: "Limitation of Liability",
      paragraphs: [
        "CIO India shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of, or inability to use, our website.",
      ],
    },
    {
      title: "Changes to These Terms",
      paragraphs: [
        "We may update these Terms from time to time without prior notice. Any changes will be posted on this page with an updated “Last Updated” date.",
      ],
    },
    {
      title: "Contact Us",
      paragraphs: [
        "If you have any questions about these Terms, please contact us at:",
      ],
      email: "info@ciomogulindia.com",
    },
  ],
};
