import Image from "next/image";
import Link from "next/link";
import { getSiteSettings, getSiteText } from "@/lib/data";
import SocialIcon from "./SocialIcon";

// White footer in three rows: logo and social icons; description, two link
// columns and contact details in equal columns; then the legal line.
export default async function Footer() {
  const [settings, t] = await Promise.all([getSiteSettings(), getSiteText()]);
  const f = t.footer;
  const social = settings.social.filter((s) => s.href);

  const cols = [
    { head: f.platformHeading, links: f.platformLinks },
    { head: f.exploreHeading, links: f.exploreLinks },
  ];

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__head-row">
          <Link href="/" aria-label="CIO Mogul India home">
            <Image src="/assets/cio-mogul-india-logo.png" alt="CIO Mogul India — Magazine" width={1200} height={374} sizes="260px" />
          </Link>
          {social.length > 0 && (
            <div className="footer__social" aria-label={f.followHeading}>
              {social.map((s) => (
                <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <SocialIcon name={s.key} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="footer__top">
          <div className="footer__brand">
            <p>{f.tagline}</p>
          </div>

          {cols.map((col) => (
            <nav key={col.head} className="footer__col" aria-label={col.head}>
              <p className="footer__head">{col.head}</p>
              {col.links.map((l) =>
                l.href.startsWith("http") ? (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
                ) : (
                  <Link key={l.label} href={l.href}>{l.label}</Link>
                )
              )}
            </nav>
          ))}

          <div className="footer__col footer__contact">
            <p className="footer__head">{f.contactHeading}</p>
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
            {settings.phone && <a href={settings.phoneHref}>{settings.phone}</a>}
            {settings.office && <span>{settings.office}</span>}
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="wrap footer__bottom-inner">
          <span>{f.copyright}</span>
          <span className="footer__legal">
            <Link href="/terms">{f.termsLabel}</Link>
            <span aria-hidden>·</span>
            <Link href="/privacy">{f.privacyLabel}</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
