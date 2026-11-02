import Image from "next/image";
import Link from "next/link";
import { getSiteSettings, getSiteText } from "@/lib/data";
import SocialIcon from "./SocialIcon";

// Navy footer with white text. Left: a large line and a button to Contact Us.
// Right: location, contact, social links and site links in a 2 × 2 grid.
// Below: copyright, legal links and the name.
export default async function Footer() {
  const [settings, t] = await Promise.all([getSiteSettings(), getSiteText()]);
  const f = t.footer;
  const social = settings.social.filter((s) => s.href);
  const links = [...f.platformLinks, ...f.exploreLinks];

  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr__main">
          <div className="ftr__cta">
            <Link href="/" className="ftr__logo" aria-label="CIO Mogul India home">
              <Image src="/assets/cio-mogul-india-logo.png" alt="CIO Mogul India — Magazine" width={170} height={53} sizes="170px" />
            </Link>
            <p className="ftr__title">
              {f.ctaTitle}
              <span className="ftr__dot" aria-hidden>.</span>
            </p>
            <Link href="/contact" className="ftr__btn">
              {f.ctaButton}
              <span className="ftr__btn-icon" aria-hidden>→</span>
            </Link>
            <p className="ftr__mail">
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </p>
          </div>

          <div className="ftr__grid">
            {settings.office && (
              <div className="ftr__block">
                <p className="ftr__head">{f.locationHeading}</p>
                <span>{settings.office}</span>
              </div>
            )}

            {settings.phone && (
              <div className="ftr__block">
                <p className="ftr__head">{f.contactHeading}</p>
                <a href={settings.phoneHref}>{settings.phone}</a>
              </div>
            )}

            {social.length > 0 && (
              <div className="ftr__block">
                <p className="ftr__head">{f.followHeading}</p>
                <ul className="ftr__social">
                  {social.map((s) => (
                    <li key={s.key}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer">
                        <SocialIcon name={s.key} />
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <nav className="ftr__block" aria-label={f.linksHeading}>
              <p className="ftr__head">{f.linksHeading}</p>
              <ul className="ftr__links">
                {links.map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith("http") ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
                    ) : (
                      <Link href={l.href}>{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="ftr__bar">
          <span>{f.copyright}</span>
          <span className="ftr__legal">
            <Link href="/terms">{f.termsLabel}</Link>
            <span className="ftr__sep" aria-hidden>•</span>
            <Link href="/privacy">{f.privacyLabel}</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
