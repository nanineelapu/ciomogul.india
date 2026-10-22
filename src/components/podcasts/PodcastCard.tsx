import Image from "next/image";
import type { Podcast } from "@/types/content";

export default function PodcastCard({
  podcast,
  index,
}: {
  podcast: Podcast;
  // Shown as a small "EP ##" chip; purely a visual device.
  index?: number;
}) {
  return (
    <a
      href={podcast.youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="pod-card"
      aria-label={`${podcast.title} — opens on YouTube`}
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
      <span className="pod-card__kicker">{podcast.date}</span>
      <span className="pod-card__title">{podcast.title}</span>
      {podcast.description && (
        <span className="pod-card__desc">{podcast.description}</span>
      )}
      <span className="pod-card__cta">Watch episode</span>
    </a>
  );
}
