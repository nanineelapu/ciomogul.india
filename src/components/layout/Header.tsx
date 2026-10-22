"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Magazines", href: "/magazines" },
  { label: "Hall of Fame", href: "/hall-of-fame" },
  { label: "Women Spotlight", href: "/women-spotlight" },
  { label: "Podcasts", href: "/podcasts" },
  { label: "News", href: "/news" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

// A nav link is "active" when the current URL is the link itself, or sits
// below it (so /news/some-article still highlights "News"). The root "/" has
// to match exactly, otherwise it would light up on every page.
function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const [date, setDate] = useState("");
  const [compact, setCompact] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setDate(new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setCompact(y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(y / max, 1) : 0);
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="site-head">
        <div className="wrap site-head__top">
          <Link href="/" className="site-head__logo" aria-label="CIO Mogul India home">
            <Image src="/assets/logo.png" alt="CIO Mogul India — Magazine" width={318} height={63} priority />
          </Link>
          <div className="site-head__actions">
            <span className="site-head__date">{date}</span>
            <div className="site-head__social" aria-label="Follow CIO Mogul India">
              <a href="https://instagram.com" className="social-btn" aria-label="Instagram"><Icon name="instagram" /></a>
              <a href="https://facebook.com" className="social-btn" aria-label="Facebook"><Icon name="facebook" /></a>
              <a href="https://linkedin.com" className="social-btn" aria-label="LinkedIn"><Icon name="linkedin" /></a>
            </div>
            <Link href="#subscribe" className="btn btn-ink btn-sm">Subscribe</Link>
          </div>
        </div>
      </header>

      <nav className={`masthead${compact ? " is-compact" : ""}`} aria-label="Primary">
        <div className="wrap">
          <div className="masthead__inner">
            <Link href="/" className="masthead__brand">CIO Mogul India</Link>
            <div className={`nav${open ? " is-open" : ""}`}>
              {NAV.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link key={item.href} href={item.href} className={`nav__link${active ? " is-active" : ""}`} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <Link href="/magazines" className="masthead__edition">Latest edition <span aria-hidden>→</span></Link>
            <button className="menu-btn" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
              <span /><span />
            </button>
            <span className="read-progress" aria-hidden style={{ transform: `scaleX(${progress})` }} />
          </div>
        </div>
      </nav>
    </>
  );
}

function Icon({ name }: { name: "instagram" | "facebook" | "linkedin" }) {
  if (name === "instagram") return (<svg viewBox="0 0 24 24" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" /></svg>);
  if (name === "facebook") return (<svg viewBox="0 0 24 24" aria-hidden><path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v7h4v-7h3l.5-4h-3.5V8.8c0-.5.3-.8.5-.8z" fill="currentColor" /></svg>);
  return (<svg viewBox="0 0 24 24" aria-hidden><path d="M5 9h3.5v11H5zM6.8 3.5a2 2 0 110 4 2 2 0 010-4zM10.5 9H14v1.6c.6-1 1.9-1.9 3.7-1.9 3.3 0 4 2.1 4 5V20h-3.5v-5.4c0-1.4-.1-2.9-1.9-2.9-1.9 0-2.2 1.4-2.2 2.8V20h-3.6z" fill="currentColor" /></svg>);
}
