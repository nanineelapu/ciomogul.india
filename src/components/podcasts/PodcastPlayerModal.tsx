"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Podcast } from "@/types/content";

// Reads ?watch=<slug> from the URL and renders a dark-backdrop modal with the
// YouTube embed inside. Closing clears the param (so back/forward also work).
export default function PodcastPlayerModal({ podcasts }: { podcasts: Podcast[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const slug = params.get("watch");

  // Only start portalling after mount — avoids an SSR / hydration mismatch
  // because document doesn't exist on the server.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const active = useMemo(
    () => (slug ? podcasts.find((p) => p.slug === slug) ?? null : null),
    [slug, podcasts]
  );

  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    const next = new URLSearchParams(params.toString());
    next.delete("watch");
    const qs = next.toString();
    router.replace(qs ? `/podcasts?${qs}` : "/podcasts", { scroll: false });
  }, [params, router]);

  // Esc to close + scroll lock while open. Also move focus to the close
  // button so screen-reader users land in the right place.
  useEffect(() => {
    if (!active) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    // defer focus so the button exists by the time we grab it
    const t = setTimeout(() => closeRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [active, close]);

  if (!mounted || !active) return null;

  const embed = toYouTubeEmbed(active.youtubeUrl);

  return createPortal(
    <div
      className="pod-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pod-modal-title"
      onClick={(e) => {
        // Backdrop click (not inside the panel) closes
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="pod-modal__panel">
        <header className="pod-modal__head">
          <div className="pod-modal__meta">
            <span className="pod-modal__kicker">{active.date}</span>
            <h2 className="pod-modal__title" id="pod-modal-title">{active.title}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="pod-modal__close"
            onClick={close}
            aria-label="Close player"
          >
            ×
          </button>
        </header>

        <div className="pod-modal__video">
          {embed ? (
            <iframe
              key={active.slug}
              src={embed}
              title={active.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <div className="pod-modal__fallback">
              <p>Couldn&apos;t load the embedded player.</p>
              <a href={active.youtubeUrl} target="_blank" rel="noopener noreferrer">
                Open on YouTube ↗
              </a>
            </div>
          )}
        </div>

        <footer className="pod-modal__foot">
          <a
            href={active.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pod-modal__youtube"
          >
            Open on YouTube ↗
          </a>
          <button type="button" onClick={close} className="pod-modal__dismiss">
            Close
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
}

// Normalise the various YouTube URL shapes to the canonical embed URL.
// Returns null if we can't recognise it so the UI falls back cleanly.
function toYouTubeEmbed(raw: string): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  let id: string | null = null;

  try {
    const u = new URL(trimmed);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      id = u.pathname.slice(1).split("/")[0];
    } else if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname === "/watch") id = u.searchParams.get("v");
      else if (u.pathname.startsWith("/embed/")) id = u.pathname.slice("/embed/".length).split("/")[0];
      else if (u.pathname.startsWith("/shorts/")) id = u.pathname.slice("/shorts/".length).split("/")[0];
      else if (u.pathname.startsWith("/live/")) id = u.pathname.slice("/live/".length).split("/")[0];
    }
  } catch {
    // Not a URL — treat whole string as a potential bare id
    if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) id = trimmed;
  }

  if (!id || !/^[A-Za-z0-9_-]{10,15}$/.test(id)) return null;
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}
