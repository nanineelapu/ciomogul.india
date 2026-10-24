// Layout for the public marketing site. The route group "(site)" doesn't
// affect URLs; it lets this layout wrap every public page with the
// Header/Footer chrome without also wrapping /studio.
import Header from "@/components/layout/Header";
import JsonLd from "@/components/seo/JsonLd";
import { organizationLd, websiteLd } from "@/lib/seo";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { getSiteSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <SmoothScroll>
      <JsonLd
        data={[
          organizationLd({
            email: settings.email,
            phone: settings.phone,
            sameAs: settings.social.filter((x) => x.key !== "whatsapp").map((x) => x.href),
          }),
          websiteLd(),
        ]}
      />
      <link rel="alternate" type="application/rss+xml" title="CIO Mogul India" href={`${SITE_URL}/feed.xml`} />
      <Header social={settings.social} />
      {children}
      <Footer />
    </SmoothScroll>
  );
}
