"use client";
import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";

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
      {children}
    </ReactLenis>
  );
}
