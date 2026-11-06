"use client";
import { useEffect, useState } from "react";

const MIN_MS = 900;   // show the loader for at least this long, so it never just flashes
const EASE_MS = 650;  // how quickly the number climbs towards 90 while the page loads

// Counts the percentage under the ring and fades the preloader away once the page
// has finished loading. The browser gives no real "percent loaded", so the number
// eases up to 90 on its own and runs to 100 the moment the page is ready.
export default function PreloaderGate() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const el = document.getElementById("preloader");
    if (!el) return;
    const start = performance.now();
    let raf = 0;
    let timer: number | undefined;
    let ready = false;
    let from = 0;
    let finishAt = 0;

    const tick = (now: number) => {
      let v: number;
      if (!ready) {
        v = 90 * (1 - Math.exp(-Math.max(0, now - start) / EASE_MS));
      } else {
        const k = Math.min(1, (now - finishAt) / 350);
        v = from + (100 - from) * k;
        if (k >= 1) {
          setPct(100);
          timer = window.setTimeout(() => el.classList.add("is-done"), 250);
          return;
        }
      }
      setPct(Math.max(0, Math.round(v)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const finish = () => {
      timer = window.setTimeout(() => {
        from = 90 * (1 - Math.exp(-(performance.now() - start) / EASE_MS));
        finishAt = performance.now();
        ready = true;
      }, Math.max(0, MIN_MS - (performance.now() - start)));
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", finish);
      window.clearTimeout(timer);
    };
  }, []);

  return <p className="pre__pct" aria-hidden>{pct}%</p>;
}
