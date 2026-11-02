"use client";
import { useEffect, useRef, useState } from "react";
import SocialIcon from "@/components/layout/SocialIcon";

// Share button in the reader's bottom bar. Opens a small menu of places to
// share the magazine; each one opens that site's share page in a new tab.
export default function ShareMenu({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on a click outside or on Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const share = (where: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);
    const links: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      x: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      email: `mailto:?subject=${text}&body=${url}`,
    };
    if (where === "email") window.location.href = links.email;
    else window.open(links[where], "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked: leave the menu open so the address bar can be used.
    }
  };

  return (
    <div className="pdfv__share" ref={ref}>
      <button
        type="button"
        className="pdfv__btn pdfv__btn--text"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Share
      </button>
      {open && (
        <div className="pdfv__menu" role="menu" aria-label="Share this magazine">
          <button type="button" role="menuitem" onClick={() => share("facebook")}><SocialIcon name="facebook" />Facebook</button>
          <button type="button" role="menuitem" onClick={() => share("x")}><SocialIcon name="x" />X</button>
          <button type="button" role="menuitem" onClick={() => share("linkedin")}><SocialIcon name="linkedin" />LinkedIn</button>
          <button type="button" role="menuitem" onClick={() => share("whatsapp")}><SocialIcon name="whatsapp" />WhatsApp</button>
          <button type="button" role="menuitem" onClick={() => share("email")}>
            <svg viewBox="0 0 24 24" aria-hidden><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M3.5 6.5L12 13l8.5-6.5" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
            Email
          </button>
          <button type="button" role="menuitem" onClick={copy}>
            <svg viewBox="0 0 24 24" aria-hidden><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
