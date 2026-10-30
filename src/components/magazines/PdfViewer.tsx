"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs, type DocumentProps } from "react-pdf";
import "./pdfViewer.css";

// The worker and the files below are copied from the pdf.js that react-pdf uses
// (npm run sync:pdfjs). They must be the same version or the reader won't start.
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// A stable object, or react-pdf reloads the file on every render.
// disableAutoFetch: only the pages being looked at are downloaded.
const PDF_OPTIONS = {
  cMapUrl: "/pdfjs/cmaps/",
  standardFontDataUrl: "/pdfjs/standard_fonts/",
  wasmUrl: "/pdfjs/wasm/",
  iccUrl: "/pdfjs/iccs/",
  disableAutoFetch: true,
} as const;

const ZOOM_LEVELS = [1, 1.25, 1.5, 2];
const BOOK_MIN_WIDTH = 900; // narrower than this shows one page at a time
const DRAG_START = 8; // pointer travel that makes a press a drag rather than a click
const DRAG_COMMIT = 0.25; // how far a page must be dragged to complete the turn when let go
const WHEEL_THRESHOLD = 30; // wheel travel that counts as one page turn
const FLIP_MS = 720;
const MAX_PIXEL_RATIO = 2; // sharper than this costs memory and looks the same
const DRAW_AHEAD = 2; // spreads kept drawn either side, so a turn never shows a blank page

// Which pages show together: book mode keeps the cover and a last even page alone.
function buildViews(numPages: number, book: boolean): number[][] {
  if (!book) return Array.from({ length: numPages }, (_, i) => [i + 1]);
  const views: number[][] = [[1]];
  for (let p = 2; p <= numPages; p += 2) views.push(p + 1 <= numPages ? [p, p + 1] : [p]);
  return views;
}

function downloadUrl(file: string) {
  // The browser ignores the download attribute for files on another domain.
  return file.includes("cdn.sanity.io") ? `${file}${file.includes("?") ? "&" : "?"}dl=` : file;
}

type Flip = { from: number[]; to: number[]; forward: boolean; held?: boolean };
type Drag = { x: number; y: number; active: boolean; forward: boolean; progress: number };

export default function PdfViewer({ file, title }: { file: string; title: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const animsRef = useRef<Animation[]>([]);
  const commitRef = useRef(true); // whether the running turn lands on the new page
  const turningRef = useRef(false);
  const queuedRef = useRef<1 | -1 | 0>(0);
  const wheelRef = useRef({ sum: 0, until: 0 });

  const [near, setNear] = useState(false); // load nothing until the reader is close
  const [visible, setVisible] = useState(false); // entrance animation
  const [numPages, setNumPages] = useState(0);
  const [ratio, setRatio] = useState(1.414); // page height / width
  const [page, setPage] = useState(1); // first page on screen; survives layout changes
  const [zoomIdx, setZoomIdx] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [fullscreen, setFullscreen] = useState(false);
  const [failed, setFailed] = useState(false);
  const [flip, setFlip] = useState<Flip | null>(null);

  const zoom = ZOOM_LEVELS[zoomIdx];
  const zoomed = zoomIdx > 0;
  const book = size.width >= BOOK_MIN_WIDTH && ratio >= 1;
  const views = useMemo(() => buildViews(numPages, book), [numPages, book]);
  const viewIdx = Math.max(0, views.findIndex((v) => v.includes(page)));
  const canPrev = viewIdx > 0;
  const canNext = viewIdx < views.length - 1;

  // Page size: fits the room available, so a page never needs inner scrolling
  // until someone zooms in.
  const pad = size.width < 600 ? 12 : 28;
  const maxHeight = fullscreen ? size.height - pad * 2 : Math.max(320, Math.min(size.height, 900));
  const fitWidth = Math.floor(Math.min((size.width - pad * 2) / (book ? 2 : 1), maxHeight / ratio));
  const pageWidth = Math.max(160, Math.round(fitWidth * zoom));
  const pageHeight = Math.round(pageWidth * ratio);
  const stageHeight = fullscreen ? undefined : Math.round(fitWidth * ratio) + pad * 2;
  const pixelRatio = typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    const reveal = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          reveal.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    reveal.observe(el);
    return () => {
      io.disconnect();
      reveal.disconnect();
    };
  }, []);

  // Measure the stage. Redrawing every page is expensive, so small height changes
  // (a phone's address bar sliding away while scrolling) are ignored.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const full = Boolean(document.fullscreenElement);
        const width = el.clientWidth;
        const height = full ? el.clientHeight : Math.round(window.innerHeight * 0.76);
        setSize((prev) =>
          prev.width === width && (full ? prev.height === height : Math.abs(prev.height - height) < 120)
            ? prev
            : { width, height }
        );
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const onChange = () => {
      setFullscreen(document.fullscreenElement === rootRef.current);
      setZoomIdx(0);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const goTo = useCallback(
    (idx: number, held = false) => {
      const target = views[idx];
      if (!target || idx === viewIdx) return;
      // A turn is already running: remember one more, so fast clicks aren't lost.
      if (turningRef.current) {
        queuedRef.current = idx > viewIdx ? 1 : -1;
        return;
      }
      setZoomIdx(0);
      stageRef.current?.scrollTo({ top: 0, left: 0 });
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced || Math.abs(idx - viewIdx) > 1) {
        setPage(target[0]);
        return;
      }
      turningRef.current = true;
      setFlip({ from: views[viewIdx], to: target, forward: idx > viewIdx, held });
    },
    [views, viewIdx]
  );

  // Runs the page turn. It animates only transform and opacity, directly on the
  // pages, so React and the page drawing aren't involved while it plays.
  useEffect(() => {
    if (!flip) return;
    const el = bookRef.current;
    commitRef.current = true;
    const finish = () => {
      if (commitRef.current) setPage(flip.to[0]);
      setFlip(null);
      turningRef.current = false;
    };
    if (!el) {
      finish();
      return;
    }
    const pageEl = (n?: number) => (n ? el.querySelector<HTMLElement>(`[data-page="${n}"]`) : null);
    const half = FLIP_MS / 2;
    const anims: Animation[] = [];
    const play = (node: HTMLElement | null, origin: string, from: number, to: number, delay: number, easing: string) => {
      if (!node) return;
      node.style.transformOrigin = origin;
      anims.push(
        node.animate([{ transform: `rotateY(${from}deg)` }, { transform: `rotateY(${to}deg)` }], {
          duration: half,
          delay,
          easing,
          fill: "both",
        })
      );
      const shade = node.querySelector(".pdfv__shade");
      if (shade) {
        anims.push(
          shade.animate(
            delay ? [{ opacity: 0.32 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 0.32 }],
            { duration: half, delay, easing: "linear", fill: "both" }
          )
        );
      }
    };

    if (book) {
      // The leaf is the page lifting off one side and the page landing on the other.
      if (flip.forward) {
        play(pageEl(flip.from.find((n) => n % 2 === 1)), "left center", 0, -90, 0, "ease-in");
        play(pageEl(flip.to.find((n) => n % 2 === 0)), "right center", 90, 0, half, "ease-out");
      } else {
        play(pageEl(flip.from.find((n) => n % 2 === 0)), "right center", 0, 90, 0, "ease-in");
        play(pageEl(flip.to.find((n) => n % 2 === 1)), "left center", -90, 0, half, "ease-out");
      }
    } else if (flip.forward) {
      play(pageEl(flip.from[0]), "left center", 0, -90, 0, "ease-in");
    } else {
      play(pageEl(flip.to[0]), "left center", -90, 0, 0, "ease-out");
    }

    // A dragged page holds still and follows the pointer until it is let go.
    animsRef.current = anims;
    const drag = dragRef.current;
    if (flip.held && drag?.active) {
      const total = book ? FLIP_MS : half;
      anims.forEach((a) => {
        a.pause();
        a.currentTime = drag.progress * total;
      });
    }

    let cancelled = false;
    Promise.all(anims.map((a) => a.finished))
      .catch(() => {})
      .then(() => {
        if (cancelled) return;
        finish();
        anims.forEach((a) => a.cancel());
      });
    return () => {
      cancelled = true;
      animsRef.current = [];
      anims.forEach((a) => a.cancel());
      turningRef.current = false;
    };
  }, [flip, book]);

  // Play a turn that was asked for while the last one was running.
  useEffect(() => {
    if (flip || !queuedRef.current) return;
    const step = queuedRef.current;
    queuedRef.current = 0;
    goTo(viewIdx + step);
  }, [flip, viewIdx, goTo]);

  // Mouse wheel turns the pages once the reader is on screen. At the first and
  // last page, or while the reader is only partly visible, the page scrolls as usual.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !numPages) return;
    const onWheel = (e: WheelEvent) => {
      if (zoomed || e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      const forward = e.deltaY > 0;
      if (forward ? !canNext : !canPrev) return;
      const box = (rootRef.current ?? el).getBoundingClientRect();
      const tolerance = 90;
      if (box.top < -tolerance || box.bottom > window.innerHeight + tolerance) return;

      // Handled here: the browser and the smooth-scroll library must not scroll too.
      e.preventDefault();
      e.stopPropagation();
      const w = wheelRef.current;
      const now = performance.now();
      if (now < w.until) return; // still settling after the last turn
      w.sum += e.deltaY;
      if (Math.abs(w.sum) < WHEEL_THRESHOLD) return;
      w.sum = 0;
      w.until = now + FLIP_MS + 140;
      goTo(viewIdx + (forward ? 1 : -1));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [numPages, zoomed, canNext, canPrev, viewIdx, goTo]);

  // Arrow keys and +/-, only while the reader is on screen and nothing is being typed.
  useEffect(() => {
    if (!numPages) return;
    const onKey = (e: KeyboardEvent) => {
      const el = rootRef.current;
      const t = e.target as HTMLElement | null;
      if (!el || (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable))) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 80 || r.top > window.innerHeight - 80) return;
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(viewIdx + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(viewIdx - 1); }
      if (e.key === "+" || e.key === "=") setZoomIdx((z) => Math.min(ZOOM_LEVELS.length - 1, z + 1));
      if (e.key === "-") setZoomIdx((z) => Math.max(0, z - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [numPages, viewIdx, goTo]);

  const onLoadSuccess = useCallback<NonNullable<DocumentProps["onLoadSuccess"]>>(async (pdf) => {
    try {
      const first = await pdf.getPage(1);
      const vp = first.getViewport({ scale: 1 });
      if (vp.width > 0) setRatio(vp.height / vp.width);
    } catch {
      // keep the default shape
    }
    setNumPages(pdf.numPages);
    setFailed(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen().catch(() => {});
  }, []);

  // Like a magazine in the hand: click the right or left side to turn that way, or
  // hold a page and drag it. Works the same for mouse and touch; a zoomed page pans instead.
  const onPointerDown = (e: React.PointerEvent) => {
    if (zoomed || !numPages || e.button !== 0 || !e.isPrimary) return;
    dragRef.current = { x: e.clientX, y: e.clientY, active: false, forward: true, progress: 0 };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || !e.isPrimary) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.active) {
      if (Math.hypot(dx, dy) < DRAG_START) return;
      const forward = dx < 0;
      // Mostly vertical, or nowhere to turn to: not a page drag.
      if (Math.abs(dx) < Math.abs(dy) * 1.2 || turningRef.current || (forward ? !canNext : !canPrev)) {
        dragRef.current = null;
        return;
      }
      d.active = true;
      d.forward = forward;
      e.currentTarget.setPointerCapture(e.pointerId);
      goTo(viewIdx + (forward ? 1 : -1), true);
    }
    // Kept just inside both ends: a paused animation sitting exactly on an end restarts when played.
    d.progress = Math.min(0.99, Math.max(0.01, (d.forward ? -dx : dx) / pageWidth));
    const total = book ? FLIP_MS : FLIP_MS / 2;
    animsRef.current.forEach((a) => {
      a.currentTime = d.progress * total;
    });
  };
  const endDrag = (commit: boolean) => {
    commitRef.current = commit;
    animsRef.current.forEach((a) => (commit ? a.play() : a.reverse()));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;
    if (d.active) {
      endDrag(d.progress >= DRAG_COMMIT);
      return;
    }
    const box = bookRef.current?.getBoundingClientRect();
    if (!box || e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) return;
    goTo(viewIdx + (e.clientX >= box.left + box.width / 2 ? 1 : -1));
  };
  const onPointerCancel = () => {
    const d = dragRef.current;
    dragRef.current = null;
    if (d?.active) endDrag(false);
  };

  // Pages kept drawn: the current spread and its neighbours, ready before they're needed.
  const mountedPages = useMemo(
    () => views.filter((_, i) => Math.abs(i - viewIdx) <= DRAW_AHEAD).flat(),
    [views, viewIdx]
  );

  const current = views[viewIdx] ?? [1];
  const pageLabel = current.length > 1 ? `${current[0]}-${current[current.length - 1]}` : String(current[0]);

  return (
    <div
      ref={rootRef}
      className={`pdfv${visible ? " is-visible" : ""}${fullscreen ? " is-fullscreen" : ""}`}
      aria-label={`${title}: magazine reader`}
      role="region"
    >
      <div
        ref={stageRef}
        className={`pdfv__stage${zoomed ? " is-zoomed" : ""}`}
        style={{ height: stageHeight, padding: pad }}
        // Only a zoomed page scrolls inside. Marking it otherwise would stop the site
        // scrolling while the pointer is over the reader.
        {...(zoomed ? { "data-lenis-prevent": true } : {})}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        {failed ? (
          <div className="pdfv__message">
            <b>This edition could not be opened here.</b>
            <a href={downloadUrl(file)} className="btn btn-line btn-sm">Download the PDF</a>
          </div>
        ) : !near || size.width === 0 ? (
          <div className="pdfv__message" role="status">Loading edition…</div>
        ) : (
          <Document
            file={file}
            options={PDF_OPTIONS}
            onLoadSuccess={onLoadSuccess}
            onLoadError={() => setFailed(true)}
            loading={<div className="pdfv__message" role="status">Loading edition…</div>}
            error={null}
          >
            {numPages > 0 && (
              <div ref={bookRef} className="pdfv__book" style={{ width: pageWidth * (book ? 2 : 1), height: pageHeight }}>
                {mountedPages.map((n) => {
                  const onLeft = book && n % 2 === 0;
                  const showing = flip ? flip.from.includes(n) || flip.to.includes(n) : current.includes(n);
                  // The page that lifts or lands sits on top of the pages staying still.
                  const leaf = flip
                    ? book
                      ? flip.forward
                        ? (flip.from.includes(n) && !onLeft) || (flip.to.includes(n) && onLeft)
                        : (flip.from.includes(n) && onLeft) || (flip.to.includes(n) && !onLeft)
                      : flip.forward
                        ? flip.from.includes(n)
                        : flip.to.includes(n)
                    : false;
                  return (
                    <div
                      key={n}
                      data-page={n}
                      className={`pdfv__page${book ? (onLeft ? " is-left" : " is-right") : ""}${showing ? " is-showing" : ""}${leaf ? " is-leaf" : ""}`}
                      style={{ width: pageWidth, height: pageHeight, left: book && !onLeft ? pageWidth : 0 }}
                      aria-hidden={!showing}
                    >
                      <Page
                        pageNumber={n}
                        width={pageWidth}
                        devicePixelRatio={pixelRatio}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        loading={null}
                        onRenderError={() => {}}
                      />
                      <span className="pdfv__shade" aria-hidden />
                    </div>
                  );
                })}
              </div>
            )}
          </Document>
        )}
      </div>

      <div className="pdfv__controls" role="toolbar" aria-label="Reader controls">
        <div className="pdfv__group">
          <button type="button" className="pdfv__btn" onClick={() => goTo(viewIdx - 1)} disabled={!canPrev} aria-label="Previous page">←</button>
          <span className="pdfv__pageinfo" aria-live="polite">
            <b>{numPages ? pageLabel : "–"}</b>
            <span>/ {numPages || "–"}</span>
          </span>
          <button type="button" className="pdfv__btn" onClick={() => goTo(viewIdx + 1)} disabled={!canNext} aria-label="Next page">→</button>
        </div>

        <div className="pdfv__group">
          <button type="button" className="pdfv__btn" onClick={() => setZoomIdx((z) => Math.max(0, z - 1))} disabled={zoomIdx === 0} aria-label="Zoom out">−</button>
          <span className="pdfv__zoom" aria-live="polite">{Math.round(zoom * 100)}%</span>
          <button type="button" className="pdfv__btn" onClick={() => setZoomIdx((z) => Math.min(ZOOM_LEVELS.length - 1, z + 1))} disabled={zoomIdx === ZOOM_LEVELS.length - 1} aria-label="Zoom in">+</button>
        </div>

        <div className="pdfv__group">
          <button type="button" className="pdfv__btn pdfv__btn--text" onClick={toggleFullscreen}>{fullscreen ? "Exit" : "Fullscreen"}</button>
          <a href={downloadUrl(file)} className="pdfv__btn pdfv__btn--text">Download</a>
        </div>
      </div>
    </div>
  );
}
