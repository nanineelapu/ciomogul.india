// Single source of truth for social links, used by the header, footer and contact page.
export const SOCIAL = [
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/cio_mogul_india" },
  { key: "facebook", label: "Facebook", href: "https://www.facebook.com/share/17bTG5bU1v/" },
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/cio-mogul-india/" },
  { key: "x", label: "X", href: "https://x.com/CioMogul5334" },
  { key: "whatsapp", label: "WhatsApp", href: "https://wa.me/919529203836" },
] as const;

export type SocialKey = (typeof SOCIAL)[number]["key"];

export const WHATSAPP_URL = "https://wa.me/919529203836";
