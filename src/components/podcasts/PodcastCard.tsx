"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { Podcast } from "@/types/content";

// Click sets ?watch=<slug> in the URL. The PodcastPlayerModal, mounted higher
// in the tree, reads that param and opens itself. Doing it this way makes the
// modal state shareable, back-button-closable, and server-renderable.
export default function PodcastCard({
  podcast,
  index,
}: {
  podcast: Podcast;
  // Shown as a small "EP ##" chip; purely a visual device.
  index?: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  function openPlayer() {
    const next = new URLSearchParams(params.toString());
    next.set("watch", podcast.slug);
    startTransition(() => {
      router.replace(`/podcasts?${next.toString()}`, { scroll: false });
    });
  }

  return (
    <button
      type="button"
      className={`pod-card${pending ? " is-pending" : ""}`}
      onClick={openPlayer}
      aria-label={`Play: ${podcast.title}`}
    >
      <span className="pod-card__thumb">
        {typeof index === "number" && (
          <span className="pod-card__ep" aria-hidden>
            EP {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <Image
          src={podcast.thumbnail}
          alt=""
          width={960}
          height={540}
          sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 33vw"
        />
        <span className="pod-card__play" aria-hidden>
          <svg viewBox="0 0 48 48" width="22" height="22">
            <path d="M16 12v24l20-12z" fill="currentColor" />
          </svg>
        </span>
        {podcast.duration && (
          <span className="pod-card__duration" aria-hidden>
            {podcast.duration}
          </span>
        )}
      </span>
      <span className="pod-card__title">{podcast.title}</span>
      <span className="pod-card__foot">
        <span className="pod-card__cta">Watch episode</span>
        <span className="mag-card__date">{podcast.date.replace(/^\d{1,2}\s+/, "")}</span>
      </span>
    </button>
  );
}
