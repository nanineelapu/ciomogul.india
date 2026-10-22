import Image from "next/image";
import Link from "next/link";
import { SOCIAL } from "@/data/social";

const COLS = [
  { head: "Platform", links: [["Home", "/"], ["Magazines", "/magazines"], ["Podcasts", "/podcasts"], ["About Us", "/about"]] },
  { head: "Explore", links: [["Hall of Fame", "/hall-of-fame"], ["Women Spotlight", "/women-spotlight"], ["Articles", "/articles"], ["Contact Us", "/contact"]] },
  { head: "Legal", links: [["Terms of Service", "/terms"], ["Privacy Policy", "/privacy"]] },
  { head: "Follow", links: SOCIAL.filter((s) => s.key !== "whatsapp").map((s) => [s.label, s.href] as const) },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__top">
        <div className="footer__brand">
          <Image src="/assets/logo.png" alt="CIO Mogul India — Magazine" width={318} height={63} />
          <p>Digital magazine and media platform for technology leaders in India.</p>
          <a href="mailto:info@ciomogulindia.com">info@ciomogulindia.com</a>
        </div>
        {COLS.map((col) => (
          <nav key={col.head} className="footer__col" aria-label={col.head}>
            <p className="footer__head">{col.head}</p>
            {col.links.map(([label, href]) => (
              <Link key={label} href={href}>{label}</Link>
            ))}
          </nav>
        ))}
      </div>
      <div className="wrap footer__bottom">
        <span>© 2026 CIO Mogul India. All rights reserved.</span>
        <span><Link href="/terms">Terms of Service</Link> · <Link href="/privacy">Privacy Policy</Link></span>
      </div>
    </footer>
  );
}
