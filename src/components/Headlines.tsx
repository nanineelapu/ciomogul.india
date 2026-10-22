"use client";
import { useEffect, useState } from "react";
import type { Headline } from "@/types/content";

export default function Headlines({ headlines }: { headlines: Headline[] }) {
  const [date, setDate] = useState("16 October 2026");
  useEffect(() => {
    setDate(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
  }, []);
  // the track is duplicated so the marquee can loop seamlessly
  const items = [...headlines, ...headlines];
  return (
    <div className="wrap">
      <div className="headlines">
        <span className="headlines__tab">Latest</span>
        <div className="headlines__bar">
          <span className="headlines__date">{date}</span>
          <div className="headlines__viewport">
            <div className="headlines__track">
              {items.map((h, i) => (
                <a key={`${h.slug}-${i}`} href="/news" aria-hidden={i >= headlines.length} tabIndex={i >= headlines.length ? -1 : 0}>{h.text}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
