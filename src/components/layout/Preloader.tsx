import { INDIA_PATH, INDIA_VIEWBOX } from "@/components/home/indiaMap";
import PreloaderGate from "./PreloaderGate";

// The first thing a visitor sees: a small India map in the middle of the screen
// with a round loader turning around it. It sits over the page and fades away once
// the page has loaded (see PreloaderGate). The markup comes from the server, so it
// shows from the very first paint.
export default function Preloader() {
  return (
    <div id="preloader" className="pre" role="status" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="pre__box" aria-hidden>
        <svg className="pre__ring" viewBox="0 0 100 100">
          <circle className="pre__track" cx="50" cy="50" r="46" />
          <circle className="pre__arc" cx="50" cy="50" r="46" />
        </svg>
        <svg className="pre__map" viewBox={INDIA_VIEWBOX}>
          <defs>
            <linearGradient id="pre-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#1B3A6B" />
              <stop offset="1" stopColor="#0B1F3A" />
            </linearGradient>
          </defs>
          <path d={INDIA_PATH} fill="url(#pre-fill)" />
        </svg>
        <PreloaderGate />
      </div>
    </div>
  );
}
