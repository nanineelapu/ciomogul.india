import type { LegalContent } from "./terms";

// Legal text is kept exactly as supplied by the client.
export const PRIVACY: LegalContent = {
  title: "Privacy Policy",
  intro:
    "This Privacy Policy explains how CIO India (“we,” “our,” “us”) collects, uses, and protects your personal information when you visit our website.",
  sections: [
    {
      title: "Information We Collect",
      paragraphs: [
        {
          ref: "1.1",
          text: "We may collect personal details such as your name, email address, and phone number when you contact us or subscribe to our services.",
        },
        {
          ref: "1.2",
          text: "We may also collect non-personal data, including browser type, device information, and pages visited, through analytics tools such as Google Analytics.",
        },
      ],
    },
    {
      title: "How We Use Your Information",
      paragraphs: [
        { ref: "2.1", text: "To improve our website and services." },
        { ref: "2.2", text: "To respond to inquiries or feedback." },
        { ref: "2.3", text: "To send newsletters or updates, only if you have subscribed." },
        { ref: "2.4", text: "To analyze user behavior and enhance user experience." },
      ],
    },
    {
      title: "Cookies",
      paragraphs: [
        { ref: "3.1", text: "Our website uses cookies to enhance your browsing experience." },
        { ref: "3.2", text: "You may choose to control or disable cookies through your browser settings." },
      ],
    },
    {
      title: "Third-Party Services",
      paragraphs: [
        {
          ref: "4.1",
          text: "We may use third-party services such as Google Analytics, social media plugins, and advertising tools.",
        },
        {
          ref: "4.2",
          text: "These third parties may collect and process data according to their own privacy policies.",
        },
      ],
    },
    {
      title: "Data Protection",
      paragraphs: [
        {
          ref: "5.1",
          text: "We take reasonable technical and organizational measures to protect your personal data from unauthorized access, misuse, or disclosure.",
        },
      ],
    },
    {
      title: "Your Rights",
      paragraphs: [
        { ref: "6.1", text: "You have the right to request access to or correction of your personal data." },
        { ref: "6.2", text: "You may withdraw consent for communications at any time." },
        {
          ref: "6.3",
          text: "You may also request the deletion of your personal information, subject to applicable legal requirements.",
        },
      ],
    },
    {
      title: "Changes to This Policy",
      paragraphs: [
        { ref: "7.1", text: "We may update this Privacy Policy periodically." },
        { ref: "7.2", text: "Any changes will be posted on this page, along with the updated date." },
      ],
    },
    {
      title: "Contact Us",
      paragraphs: [
        {
          ref: "8.1",
          text: "If you have any questions about this Privacy Policy, please contact us at:",
        },
      ],
      email: "info@ciomogulindia.com",
    },
  ],
};
