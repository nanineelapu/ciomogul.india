import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSiteSettings, getSiteText } from "@/lib/data";

// Shown for unknown URLs and for notFound() calls. It renders its own header
// and footer because it sits outside the (site) layout.
export default async function NotFound() {
  const [settings, t] = await Promise.all([getSiteSettings(), getSiteText()]);

  return (
    <>
      <Header social={settings.social} text={t.header} />
      <main>
        <section className="page-lead page-lead--light">
          <div className="wrap">
            <h1 className="page-lead__title">{t.general.notFoundTitle}</h1>
            <p className="page-lead__sub">
              {t.general.notFoundText}
            </p>
            <p style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/" className="btn btn-ink">{t.general.notFoundHome}</Link>
              <Link href="/magazines" className="btn btn-line">{t.general.notFoundMagazines}</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
