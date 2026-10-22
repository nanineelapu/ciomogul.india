// Keeps the Studio out of search engines and sets a sensible tab title.
// Studio owns its own full-page UI, so this layout is a pass-through.
export const metadata = {
  title: "CIO Mogul India — Studio",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
