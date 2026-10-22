// Layout for the public marketing site. The route group "(site)" doesn't
// affect URLs; it lets this layout wrap every public page with the
// Header/Footer chrome without also wrapping /studio.
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/data";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <>
      <Header social={settings.social} />
      {children}
      <Footer />
    </>
  );
}
