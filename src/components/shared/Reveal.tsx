"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

// Fades and lifts its content into place the first time it scrolls into view.
// Anything already on screen when the page loads is left alone, and visitors who
// prefer less motion (or have no JavaScript) just see the content.
export default function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    el.classList.add("is-armed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-in");
        io.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`.trim()} style={{ "--d": `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}
