"use client";
import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Smooth scrolling for the public site only (the Sanity Studio is outside this
// layout). People who ask their device for reduced motion get normal wheel
// scrolling. The wrapper is always rendered so the page never remounts, and on
// touch screens the native scrolling is kept.
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [smooth, setSmooth] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSmooth(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: smooth }}>
      <ScrollToTop />
      {children}
    </ReactLenis>
  );
}

// Lenis keeps its own scroll target, so after a client-side navigation it can
// hold the previous page's position. Jump to the top on every route change,
// unless the link points at a #section.
function ScrollToTop() {
  const lenis = useLenis();
  const pathname = usePathname();
  const last = useRef(pathname);

  useEffect(() => {
    if (last.current === pathname) return;
    last.current = pathname;
    if (window.location.hash) return;
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [pathname, lenis]);

  return null;
}
