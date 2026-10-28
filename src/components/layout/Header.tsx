"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import type { SocialKey } from "@/data/social";
import type { SiteText } from "@/data/siteText";
import SocialIcon from "./SocialIcon";

// A nav link is "active" when the current URL is the link itself, or sits
// below it (so /news/some-article still highlights "News"). The root "/" has
// to match exactly, otherwise it would light up on every page.
function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// The menu item that points to /industries opens a dropdown of industries.
const INDUSTRIES_HREF = "/industries";

export default function Header({
  social,
  text,
  industries,
}: {
  text: SiteText["header"];
  social: { key: SocialKey; label: string; href: string }[];
  industries: { slug: string; name: string; description: string }[];
}) {
  const pathname = usePathname();
  const [dropOpen, setDropOpen] = useState(false);
  const [date, setDate] = useState("");
  const [compact, setCompact] = useState(false);
  const barRef = useRef<HTMLSpanElement>(null);
  const lenis = useLenis();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setDate(new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setCompact(y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      }
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); setDropOpen(false); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  // Close the menus when the page changes.
  useEffect(() => {
    setDropOpen(false);
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="site-head">
        <div className="wrap site-head__top">
          <Link href="/" className="site-head__logo" aria-label="CIO Mogul India home">
            <Image src="/assets/logo-cio-mogul.png" alt="CIO Mogul India — Magazine" width={1200} height={374} sizes="300px" priority />
          </Link>
          <div className="site-head__actions">
            <span className="site-head__date">{date}</span>
            <div className="site-head__social" aria-label="Follow CIO Mogul India">
              {social.map((s) => (
                <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label={s.label}><SocialIcon name={s.key} /></a>
              ))}
            </div>
            <Link href="/#subscribe" className="btn btn-ink btn-sm">{text.subscribe}</Link>
          </div>
        </div>
      </header>

      <nav className={`masthead${compact ? " is-compact" : ""}`} aria-label="Primary">
        <div className="wrap">
          <div className="masthead__inner">
            <Link href="/" className="masthead__brand">CIO Mogul India</Link>
            <div className={`nav${open ? " is-open" : ""}`}>
              {text.nav.map((item) => {
                const active = isActive(pathname, item.href);
                if (item.href === INDUSTRIES_HREF && industries.length > 0) {
                  return (
                    <div
                      key={item.href}
                      className={`nav__drop${dropOpen ? " is-open" : ""}`}
                      onMouseLeave={() => setDropOpen(false)}
                    >
                      <button
                        type="button"
                        className={`nav__link nav__drop-btn${active ? " is-active" : ""}`}
                        aria-expanded={dropOpen}
                        aria-haspopup="true"
                        onClick={() => setDropOpen((v) => !v)}
                      >
                        {item.label}
                        <svg className="nav__caret" viewBox="0 0 12 8" aria-hidden><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
                      </button>
                      <div className="nav__menu">
                        {industries.map((ind) => (
                          <Link
                            key={ind.slug}
                            href={`/industries/${ind.slug}`}
                            className={`nav__menu-link${pathname === `/industries/${ind.slug}` ? " is-active" : ""}`}
                          >
                            <span className="nav__menu-name">{ind.name}</span>
                            <span className="nav__menu-text">{ind.description}</span>
                          </Link>
                        ))}
                        <Link href={INDUSTRIES_HREF} className="nav__menu-all">
                          {text.allIndustries} <span aria-hidden>→</span>
                        </Link>
                      </div>
                    </div>
                  );
                }
                return (
                  <Link key={item.href} href={item.href} className={`nav__link${active ? " is-active" : ""}`} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <Link href="/magazines" className="masthead__edition">{text.latestEdition} <span aria-hidden>→</span></Link>
            <button className="menu-btn" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
              <span /><span />
            </button>
            <span className="read-progress" aria-hidden ref={barRef} style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
      </nav>
    </>
  );
}
