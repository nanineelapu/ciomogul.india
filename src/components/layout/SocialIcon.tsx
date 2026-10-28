import type { SocialKey } from "@/data/social";

// Small line icons for the social links, used in the header and the footer.
export default function SocialIcon({ name }: { name: SocialKey }) {
  if (name === "x") return (<svg viewBox="0 0 24 24" aria-hidden><path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.3l-4.9-6.4L5.2 21H2.1l7.3-8.3L2 3h6.4l4.4 5.9L17.8 3zm-1.1 16.2h1.7L7.3 4.7H5.5l11.2 14.5z" fill="currentColor" /></svg>);
  if (name === "whatsapp") return (<svg viewBox="0 0 24 24" aria-hidden><path d="M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M9 8.5c.3 2.6 2.8 5.2 5.9 6.2l1.1-1.4-1.9-.9-.9.7c-.8-.4-1.7-1.3-2.1-2.1l.7-.9-.9-1.9L9 8.5z" fill="currentColor" /></svg>);
  if (name === "instagram") return (<svg viewBox="0 0 24 24" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" /></svg>);
  if (name === "facebook") return (<svg viewBox="0 0 24 24" aria-hidden><path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v7h4v-7h3l.5-4h-3.5V8.8c0-.5.3-.8.5-.8z" fill="currentColor" /></svg>);
  return (<svg viewBox="0 0 24 24" aria-hidden><path d="M5 9h3.5v11H5zM6.8 3.5a2 2 0 110 4 2 2 0 010-4zM10.5 9H14v1.6c.6-1 1.9-1.9 3.7-1.9 3.3 0 4 2.1 4 5V20h-3.5v-5.4c0-1.4-.1-2.9-1.9-2.9-1.9 0-2.2 1.4-2.2 2.8V20h-3.6z" fill="currentColor" /></svg>);
}
