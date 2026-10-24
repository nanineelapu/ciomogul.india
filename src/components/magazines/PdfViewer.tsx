"use client";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Point pdfjs at the worker file we copied into /public during setup.
// Doing this at module scope so it only runs once per client bundle.
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// react-pdf asks for a stable options object or it re-fetches on every render.
const PDF_OPTIONS = { cMapUrl: "/cmaps/", standardFontDataUrl: "/standard_fonts/" } as const;

const ZOOM_LEVELS = [0.6, 0.75, 1, 1.25, 1.5, 1.75, 2];

export default function PdfViewer({
  file,
  title,
}: {
  file: string;
  title: string;
}) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [zoomIdx, setZoomIdx] = useState(2); // starts at 1x
  const [loadError, setLoadError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const frameRef = useRef<HTMLDivElement>(null);

  const zoom = ZOOM_LEVELS[zoomIdx];

  // Measure the container so the base page width scales to it; zoom multiplies.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 800;
      setContainerWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Keyboard navigation — only active while the viewer is actually on screen.
  useEffect(() => {
    const el = frameRef.current;
    if (!el || !numPages) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      // Don't hijack when the user is typing somewhere
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (!isInView(el)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); setPage((p) => Math.min(numPages, p + 1)); }
      if (e.key === "ArrowLeft") { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }
      if (e.key === "+" || e.key === "=") { e.preventDefault(); setZoomIdx((z) => Math.min(ZOOM_LEVELS.length - 1, z + 1)); }
      if (e.key === "-") { e.preventDefault(); setZoomIdx((z) => Math.max(0, z - 1)); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [numPages]);

  const onLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPage(1);
    setLoadError(null);
  }, []);

  const onLoadError = useCallback((err: Error) => {
    setLoadError(err.message || "Could not load PDF.");
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = frameRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen().catch(() => {});
  }, []);

  const pageWidth = useMemo(() => Math.max(240, Math.round(containerWidth * zoom)), [containerWidth, zoom]);

  return (
    <div className="pdfv" ref={frameRef} tabIndex={0} aria-label={`${title} — PDF reader`}>
      <div className="pdfv__stage" data-lenis-prevent>
        {loadError ? (
          <div className="pdfv__error">
            <b>Could not load PDF</b>
            <p>{loadError}</p>
          </div>
        ) : (
          <Document
            file={file}
            onLoadSuccess={onLoadSuccess}
            onLoadError={onLoadError}
            options={PDF_OPTIONS}
            loading={<div className="pdfv__loading">Loading edition…</div>}
            error={<div className="pdfv__error"><b>Could not load PDF</b></div>}
          >
            {numPages ? (
              <Page
                pageNumber={page}
                width={pageWidth}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                loading={<div className="pdfv__loading">Rendering page…</div>}
              />
            ) : null}
          </Document>
        )}
      </div>

      <div className="pdfv__controls" role="toolbar" aria-label="PDF controls">
        <div className="pdfv__group">
          <button
            type="button"
            className="pdfv__btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!numPages || page <= 1}
            aria-label="Previous page"
          >
            ←
          </button>
          <span className="pdfv__pageinfo" aria-live="polite">
            <b>{String(page).padStart(2, "0")}</b>
            <span>/ {numPages ? String(numPages).padStart(2, "0") : "—"}</span>
          </span>
          <button
            type="button"
            className="pdfv__btn"
            onClick={() => setPage((p) => (numPages ? Math.min(numPages, p + 1) : p))}
            disabled={!numPages || page >= (numPages ?? 1)}
            aria-label="Next page"
          >
            →
          </button>
        </div>

        <div className="pdfv__group">
          <button
            type="button"
            className="pdfv__btn"
            onClick={() => setZoomIdx((z) => Math.max(0, z - 1))}
            disabled={zoomIdx <= 0}
            aria-label="Zoom out"
          >
            −
          </button>
          <span className="pdfv__zoom" aria-live="polite">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            className="pdfv__btn"
            onClick={() => setZoomIdx((z) => Math.min(ZOOM_LEVELS.length - 1, z + 1))}
            disabled={zoomIdx >= ZOOM_LEVELS.length - 1}
            aria-label="Zoom in"
          >
            +
          </button>
        </div>

        <div className="pdfv__group">
          <button
            type="button"
            className="pdfv__btn pdfv__btn--text"
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
          >
            Fullscreen
          </button>
          <a
            href={file}
            download
            className="pdfv__btn pdfv__btn--text"
            aria-label="Download PDF"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
}

function isInView(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight;
}
