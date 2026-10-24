import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/data";

// Shown for unknown URLs and for notFound() calls. It renders its own header
// and footer because it sits outside the (site) layout.
export default async function NotFound() {
  const settings = await getSiteSettings();

  return (
    <>
      <Header social={settings.social} />
      <main>
        <section className="page-lead page-lead--light">
          <div className="wrap">
            <h1 className="page-lead__title">Page not found</h1>
            <p className="page-lead__sub">
              The page you are looking for doesn&apos;t exist or may have moved.
            </p>
            <p style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/" className="btn btn-ink">Go to the home page</Link>
              <Link href="/magazines" className="btn btn-line">Browse magazines</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
