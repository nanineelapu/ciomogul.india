// Layout for the public marketing site. The route group "(site)" doesn't
// affect URLs — it just lets this layout wrap every public page with the
// Header/Footer chrome without also wrapping /studio.
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
