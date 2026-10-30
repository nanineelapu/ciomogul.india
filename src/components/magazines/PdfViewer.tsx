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
const SWIPE_DISTANCE = 50;
const MAX_PIXEL_RATIO = 2; // sharper than this costs memory and looks the same

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

export default function PdfViewer({ file, title }: { file: string; title: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);

  const [near, setNear] = useState(false); // load nothing until the reader is close
  const [visible, setVisible] = useState(false); // entrance animation
  const [numPages, setNumPages] = useState(0);
  const [ratio, setRatio] = useState(1.414); // page height / width
  const [page, setPage] = useState(1); // first page on screen; survives layout changes
  const [zoomIdx, setZoomIdx] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [fullscreen, setFullscreen] = useState(false);
  const [failed, setFailed] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

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
  const fitWidth = Math.floor(
    Math.min((size.width - pad * 2) / (book ? 2 : 1), maxHeight / ratio)
  );
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

  // Measure the stage. Height is the screen minus room for the bar and controls.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const full = Boolean(document.fullscreenElement);
        setSize({
          width: el.clientWidth,
          height: full ? el.clientHeight : Math.round(window.innerHeight * 0.76),
        });
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
    (idx: number) => {
      const target = views[idx];
      if (!target) return;
      setDirection(idx >= viewIdx ? 1 : -1);
      setPage(target[0]);
      setZoomIdx(0);
      stageRef.current?.scrollTo({ top: 0, left: 0 });
    },
    [views, viewIdx]
  );

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

  // Swipe to turn on touch screens (when not zoomed in, where a drag should pan).
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    swipeRef.current = e.touches.length === 1 ? { x: t.clientX, y: t.clientY } : null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = swipeRef.current;
    swipeRef.current = null;
    if (!s || zoomed) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.5) goTo(viewIdx + (dx < 0 ? 1 : -1));
  };

  // Only the current spread and its neighbours are drawn; the neighbours are
  // ready before they are needed, which is what makes turning instant.
  const mounted = views
    .map((pages, i) => ({ pages, i }))
    .filter(({ i }) => Math.abs(i - viewIdx) <= 1);

  const firstShown = views[viewIdx]?.[0] ?? 1;
  const lastShown = views[viewIdx]?.[views[viewIdx].length - 1] ?? 1;
  const pageLabel = firstShown === lastShown ? String(firstShown) : `${firstShown}-${lastShown}`;

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
        // Only a zoomed page scrolls inside; otherwise the wheel keeps moving the page.
        {...(zoomed ? { "data-lenis-prevent": true } : {})}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
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
              <div
                className="pdfv__book"
                style={{ width: pageWidth * (book ? 2 : 1), height: pageHeight }}
                data-direction={direction}
              >
                {mounted.map(({ pages, i }) => (
                  <div
                    key={pages[0]}
                    className={`pdfv__view ${i === viewIdx ? "is-active" : i < viewIdx ? "is-before" : "is-after"}${pages.length === 2 ? " is-spread" : ""}`}
                    aria-hidden={i !== viewIdx}
                  >
                    {pages.map((n) => (
                      <div key={n} className="pdfv__page" style={{ width: pageWidth, height: pageHeight }}>
                        <Page
                          pageNumber={n}
                          width={pageWidth}
                          devicePixelRatio={pixelRatio}
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                          loading={null}
                          onRenderError={() => {}}
                        />
                      </div>
                    ))}
                  </div>
                ))}
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
