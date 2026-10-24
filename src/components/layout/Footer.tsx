import Image from "next/image";
import Link from "next/link";
import { getSiteSettings, getSiteText } from "@/lib/data";

export default async function Footer() {
  const [settings, t] = await Promise.all([getSiteSettings(), getSiteText()]);
  const f = t.footer;

  const cols: { head: string; links: [string, string][] }[] = [
    { head: f.platformHeading, links: f.platformLinks.map((l) => [l.label, l.href]) },
    { head: f.exploreHeading, links: f.exploreLinks.map((l) => [l.label, l.href]) },
    {
      head: f.legalHeading,
      links: [
        [f.termsLabel, "/terms"],
        [f.privacyLabel, "/privacy"],
      ],
    },
    {
      head: f.followHeading,
      links: settings.social
        .filter((s) => s.key !== "whatsapp")
        .map((s) => [s.label, s.href] as [string, string]),
    },
  ];

  return (
    <footer className="footer">
      <div className="wrap footer__top">
        <div className="footer__brand">
          <Image src="/assets/logo-cio-mogul.png" alt="CIO Mogul India — Magazine" width={1200} height={223} sizes="260px" />
          <p>{f.tagline}</p>
          <a href={`mailto:${settings.email}`}>{settings.email}</a>
        </div>
        {cols.map((col) => (
          <nav key={col.head} className="footer__col" aria-label={col.head}>
            <p className="footer__head">{col.head}</p>
            {col.links.map(([label, href]) =>
              href.startsWith("http") ? (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
              ) : (
                <Link key={label} href={href}>{label}</Link>
              )
            )}
          </nav>
        ))}
      </div>
      <div className="wrap footer__bottom">
        <span>{f.copyright}</span>
        <span><Link href="/terms">{f.termsLabel}</Link> · <Link href="/privacy">{f.privacyLabel}</Link></span>
      </div>
    </footer>
  );
}
