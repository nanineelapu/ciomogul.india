"use client";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { pdfjs } from "react-pdf";
import "./pdfViewer.css";

// The worker and the files below are copied from the pdf.js that react-pdf uses
// (npm run sync:pdfjs). They must be the same version or the reader won't start.
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// disableAutoFetch + disableStream: only the pages being looked at are downloaded.
const PDF_OPTIONS = {
  cMapUrl: "/pdfjs/cmaps/",
  standardFontDataUrl: "/pdfjs/standard_fonts/",
  wasmUrl: "/pdfjs/wasm/",
  iccUrl: "/pdfjs/iccs/",
  disableAutoFetch: true,
  disableStream: true,
  rangeChunkSize: 1 << 20,
  enableHWA: true,
} as const;

type PdfDocument = Awaited<ReturnType<typeof pdfjs.getDocument>["promise"]>;

// Sanity's CDN serves parts of a file but hides the header pdf.js looks for, so left
// alone pdf.js downloads the whole magazine first. Asking for the parts ourselves
// means opening a magazine costs a few MB. Falls back to a plain download.
class RangeLoader extends pdfjs.PDFDataRangeTransport {
  constructor(length: number, private url: string, private onFail: () => void) {
    super(length, null);
  }
  requestDataRange(begin: number, end: number) {
    const get = () =>
      fetch(this.url, { headers: { Range: `bytes=${begin}-${end - 1}` } }).then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.arrayBuffer().then((b) => (r.status === 206 ? new Uint8Array(b) : new Uint8Array(b).subarray(begin, end)));
      });
    get()
      .catch(() => get())
      .then((bytes) => this.onDataRange(begin, bytes))
      .catch(this.onFail);
  }
}

async function openPdf(url: string, onFail: () => void) {
  const length = await fetch(url, { method: "HEAD" })
    .then((r) => (r.ok ? Number(r.headers.get("content-length")) || 0 : 0))
    .catch(() => 0);
  return length
    ? pdfjs.getDocument({ ...PDF_OPTIONS, range: new RangeLoader(length, url, onFail) })
    : pdfjs.getDocument({ ...PDF_OPTIONS, url });
}

const ZOOM_LEVELS = [1, 1.25, 1.5, 2];
const BOOK_MIN_WIDTH = 900; // narrower than this shows one page at a time
const WIDE_SHEET = 1.1; // a PDF page this much wider than tall holds two magazine pages
const DRAG_START = 8; // pointer travel that makes a press a drag rather than a click
const DRAG_COMMIT = 0.25; // how far a page must be dragged to complete the turn when let go
const WHEEL_THRESHOLD = 30; // wheel travel that counts as one page turn
const FLIP_MS = 720;
const MAX_PIXEL_RATIO = 2; // sharper than this costs memory and looks the same
const DRAW_AHEAD = 2; // spreads kept drawn either side, so a turn never shows a blank page
const KEEP_SHEETS = 12; // finished sheets kept in memory, so going back is instant
const DRAW_GAP = 160; // pause between background drawing, so the page stays responsive

// One magazine page. A wide PDF page is a printed spread: two magazine pages on one
// sheet, so it becomes two sides, each showing one half of the sheet.
type Side = { n: number; pdfPage: number; part: "full" | "left" | "right" };
type PdfSize = { w: number; h: number };

const isWide = (p: PdfSize) => p.w > p.h * WIDE_SHEET;

// A PDF whose first page is wide isn't a magazine with a cover (slides, say), so
// its pages are shown whole, one at a time.
function buildSides(sizes: PdfSize[]): Side[] {
  const split = sizes.length > 0 && !isWide(sizes[0]);
  const sides: Side[] = [];
  sizes.forEach((p, i) => {
    const pdfPage = i + 1;
    if (split && isWide(p)) {
      sides.push({ n: sides.length + 1, pdfPage, part: "left" });
      sides.push({ n: sides.length + 1, pdfPage, part: "right" });
    } else {
      sides.push({ n: sides.length + 1, pdfPage, part: "full" });
    }
  });
  return sides;
}

// Which sides show together: book mode keeps the cover alone, keeps each spread
// together, and pairs up single pages. A single page left over stays alone.
function buildViews(sides: Side[], book: boolean): number[][] {
  if (!book) return sides.map((side) => [side.n]);
  const views: number[][] = [];
  let single = 0;
  const flush = () => {
    if (single) views.push([single]);
    single = 0;
  };
  sides.forEach((side, i) => {
    if (i === 0) views.push([side.n]);
    else if (side.part === "left") {
      flush();
      views.push([side.n, side.n + 1]);
    } else if (side.part === "full") {
      if (single) {
        views.push([single, side.n]);
        single = 0;
      } else single = side.n;
    }
  });
  flush();
  return views;
}

function downloadUrl(file: string) {
  // The browser ignores the download attribute for files on another domain.
  return file.includes("cdn.sanity.io") ? `${file}${file.includes("?") ? "&" : "?"}dl=` : file;
}

// lift: the page leaving; land: the page arriving. Only these two move.
type Flip = { from: number[]; to: number[]; forward: boolean; held?: boolean; lift?: number; land?: number };
type Job = { key: string; pdfPage: number; width: number; visible: boolean };
type Drag = { x: number; y: number; button: number; active: boolean; forward: boolean; progress: number };

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function PdfViewer({ file, title, poster }: { file: string; title: string; poster?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const animsRef = useRef<Animation[]>([]);
  const docRef = useRef<PdfDocument | null>(null);
  const sheetsRef = useRef(new Map<string, HTMLCanvasElement>()); // finished sheets
  const jobsRef = useRef<Job[]>([]); // what should be drawn, most important first
  const skipRef = useRef(new Set<string>()); // sheets that failed to draw
  const drawingRef = useRef(false);
  const commitRef = useRef(true); // whether the running turn lands on the new page
  const turningRef = useRef(false);
  const queuedRef = useRef<1 | -1 | 0>(0);
  const wheelRef = useRef({ sum: 0, until: 0 });

  const [near, setNear] = useState(false); // load nothing until the reader is close
  const [visible, setVisible] = useState(false); // entrance animation
  const [sizes, setSizes] = useState<PdfSize[]>([]); // every PDF page, for its shape
  const [page, setPage] = useState(1); // first page on screen; survives layout changes
  const [zoomIdx, setZoomIdx] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [fullscreen, setFullscreen] = useState(false);
  const [failed, setFailed] = useState(false);
  const [flip, setFlip] = useState<Flip | null>(null);
  const [drawn, setDrawn] = useState(0); // goes up each time a sheet finishes

  const zoom = ZOOM_LEVELS[zoomIdx];
  const zoomed = zoomIdx > 0;
  const sides = useMemo(() => buildSides(sizes), [sizes]);
  const numPages = sides.length;
  // Tallest page shape, so no page is ever cropped; shorter ones sit centred.
  const ratio = useMemo(
    () =>
      sides.reduce((max, side) => {
        const p = sizes[side.pdfPage - 1];
        return Math.max(max, p.h / (side.part === "full" ? p.w : p.w / 2));
      }, 0) || 1.414,
    [sides, sizes]
  );
  // Before the PDF opens, assume a magazine, so the cover doesn't jump when it does.
  const book = size.width >= BOOK_MIN_WIDTH && (sizes.length === 0 || !isWide(sizes[0]));
  const views = useMemo(() => buildViews(sides, book), [sides, book]);
  // In book mode the first page of a view sits on the left, except the cover.
  const leftSides = useMemo(() => new Set(book ? views.slice(1).map((v) => v[0]) : []), [views, book]);
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
      { rootMargin: "1500px 0px" }
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
        if (!width) return; // hidden for a moment; keep the last size
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

  // Open the PDF. Page shapes are read first: they decide how the magazine is laid out.
  useEffect(() => {
    if (!near) return;
    let cancelled = false;
    let task: Awaited<ReturnType<typeof openPdf>> | null = null;
    const sheets = sheetsRef.current;
    const fail = () => {
      if (!cancelled) setFailed(true);
    };
    openPdf(file, fail)
      .then(async (opened) => {
        task = opened;
        if (cancelled) return;
        const pdf = await opened.promise;
        const all = await Promise.all(
          Array.from({ length: pdf.numPages }, async (_, i) => {
            try {
              const vp = (await pdf.getPage(i + 1)).getViewport({ scale: 1 });
              return { w: vp.width, h: vp.height };
            } catch {
              return { w: 1, h: 1.414 }; // keep the default shape
            }
          })
        );
        if (cancelled) return;
        docRef.current = pdf;
        setSizes(all);
        setFailed(false);
      })
      .catch(fail);
    return () => {
      cancelled = true;
      docRef.current = null;
      sheets.clear();
      task?.destroy();
    };
  }, [near, file]);

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
      const forward = idx > viewIdx;
      const from = views[viewIdx];
      const leftOf = (v: number[]) => v.find((n) => leftSides.has(n));
      const rightOf = (v: number[]) => v.find((n) => !leftSides.has(n));
      setFlip(
        book
          ? { from, to: target, forward, held, lift: forward ? rightOf(from) : leftOf(from), land: forward ? leftOf(target) : rightOf(target) }
          : { from, to: target, forward, held, lift: forward ? from[0] : undefined, land: forward ? undefined : target[0] }
      );
    },
    [views, viewIdx, leftSides, book]
  );

  // Runs the page turn. It animates only transform and opacity, directly on the
  // pages, so React and the page drawing aren't involved while it plays.
  // A layout effect: it must start before the browser paints, or the arriving page
  // shows flat for one frame.
  useLayoutEffect(() => {
    if (!flip) return;
    const el = bookRef.current;
    commitRef.current = true;
    const finish = () => {
      if (commitRef.current) setPage(flip.to[0]);
      setFlip(null);
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
        play(pageEl(flip.lift), "left center", 0, -90, 0, "ease-in");
        play(pageEl(flip.land), "right center", 90, 0, half, "ease-out");
      } else {
        play(pageEl(flip.lift), "right center", 0, 90, 0, "ease-in");
        play(pageEl(flip.land), "left center", -90, 0, half, "ease-out");
      }
    } else if (flip.forward) {
      play(pageEl(flip.lift), "left center", 0, -90, 0, "ease-in");
    } else {
      play(pageEl(flip.land), "left center", -90, 0, 0, "ease-out");
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
        // The pages keep their final position until React has swapped them: the
        // clean-up below removes the animations in that same update, so nothing snaps back.
        if (!cancelled) finish();
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

  // Mouse wheel turns the pages only in fullscreen. Otherwise it scrolls the site as usual.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !numPages || !fullscreen) return;
    const onWheel = (e: WheelEvent) => {
      if (zoomed || e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      // Handled here: the browser and the smooth-scroll library must not scroll too.
      e.preventDefault();
      e.stopPropagation();
      const forward = e.deltaY > 0;
      if (forward ? !canNext : !canPrev) return;
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
  }, [numPages, fullscreen, zoomed, canNext, canPrev, viewIdx, goTo]);

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

  const toggleFullscreen = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen().catch(() => {});
  }, []);

  // Like a magazine in the hand: click the right or left side to turn that way, or
  // hold a page and drag it, with either mouse button. Works the same for mouse and
  // touch; a zoomed page pans instead.
  const onPointerDown = (e: React.PointerEvent) => {
    if (zoomed || !numPages || (e.button !== 0 && e.button !== 2) || !e.isPrimary) return;
    dragRef.current = { x: e.clientX, y: e.clientY, button: e.button, active: false, forward: true, progress: 0 };
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
    animsRef.current.forEach((a) => {
      if (!commit) a.reverse();
      // The lifting page is done halfway through the turn. Playing it again would
      // restart it from flat, so one already past its end just finishes.
      else if (Number(a.currentTime) >= Number(a.effect?.getComputedTiming().endTime)) a.finish();
      else a.play();
    });
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;
    if (d.active) {
      endDrag(d.progress >= DRAG_COMMIT);
      return;
    }
    if (d.button !== 0) return; // only the left button turns on a plain click
    const box = bookRef.current?.getBoundingClientRect();
    if (!box || e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) return;
    goTo(viewIdx + (e.clientX >= box.left + box.width / 2 ? 1 : -1));
  };
  const onPointerCancel = () => {
    const d = dragRef.current;
    dragRef.current = null;
    if (d?.active) endDrag(false);
  };

  // Pages kept ready: the current spread and its neighbours.
  const mountedPages = useMemo(
    () => views.filter((_, i) => Math.abs(i - viewIdx) <= DRAW_AHEAD).flat(),
    [views, viewIdx]
  );

  // Drawing a page freezes the browser for a moment, however it's done. So each sheet
  // is drawn once, one at a time, the page on screen first, and never during a turn.
  const drawSheets = useCallback(async () => {
    if (drawingRef.current) return;
    drawingRef.current = true;
    const sheets = sheetsRef.current;
    const nextJob = () => jobsRef.current.find((j) => !sheets.has(j.key) && !skipRef.current.has(j.key));
    for (let job = nextJob(); job && docRef.current; job = nextJob()) {
      if (turningRef.current || !job.visible) {
        await wait(DRAW_GAP);
        if (turningRef.current || job !== nextJob()) continue;
      }
      try {
        const pdfPage = await docRef.current.getPage(job.pdfPage);
        const base = pdfPage.getViewport({ scale: 1 });
        const viewport = pdfPage.getViewport({ scale: job.width / base.width });
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        await pdfPage.render({ canvas, viewport, annotationMode: pdfjs.AnnotationMode.DISABLE }).promise;
        pdfPage.cleanup();
        sheets.set(job.key, canvas);
        for (const key of sheets.keys()) {
          if (sheets.size <= KEEP_SHEETS) break;
          if (!jobsRef.current.some((j) => j.key === key)) sheets.delete(key);
        }
        setDrawn((d) => d + 1);
      } catch {
        if (docRef.current) skipRef.current.add(job.key);
      }
    }
    drawingRef.current = false;
  }, []);

  // A half of a spread shows half of the sheet.
  const sheetFor = useCallback(
    (side: Side) => {
      const width = Math.round((side.part === "full" ? pageWidth : pageWidth * 2) * pixelRatio);
      return { key: `${side.pdfPage}@${width}`, pdfPage: side.pdfPage, width };
    },
    [pageWidth, pixelRatio]
  );

  useEffect(() => {
    if (!sides.length) return;
    const order = [0, 1, 2, -1, -2]; // people mostly read forward
    const jobs = new Map<string, Job>();
    order.forEach((step) => {
      (views[viewIdx + step] ?? []).forEach((n) => {
        const sheet = sheetFor(sides[n - 1]);
        if (!jobs.has(sheet.key)) jobs.set(sheet.key, { ...sheet, visible: step === 0 });
      });
    });
    jobsRef.current = [...jobs.values()];
    queueMicrotask(drawSheets);
  }, [sides, views, viewIdx, sheetFor, drawSheets, flip]);

  // Copy finished sheets onto the pages. Quick: the slow drawing has already happened.
  useEffect(() => {
    const el = bookRef.current;
    if (!el) return;
    mountedPages.forEach((n) => {
      const side = sides[n - 1];
      const sheet = sheetFor(side);
      const source = sheetsRef.current.get(sheet.key);
      const canvas = el.querySelector<HTMLCanvasElement>(`[data-page="${n}"] canvas`);
      if (!source || !canvas || canvas.dataset.key === sheet.key) return;
      const half = side.part !== "full";
      canvas.width = half ? Math.round(source.width / 2) : source.width;
      canvas.height = source.height;
      canvas.getContext("2d")?.drawImage(source, side.part === "right" ? -canvas.width : 0, 0);
      canvas.dataset.key = sheet.key;
    });
  }, [drawn, mountedPages, sides, sheetFor]);

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
        // The browser's right-click menu would interrupt a right-button drag.
        onContextMenu={(e) => e.preventDefault()}
      >
        {failed ? (
          <div className="pdfv__message">
            <b>This edition could not be opened here.</b>
            <a href={downloadUrl(file)} className="btn btn-line btn-sm">Download the PDF</a>
          </div>
        ) : size.width === 0 ? (
          <div className="pdfv__message" role="status">Loading edition…</div>
        ) : numPages === 0 ? (
          // The cover from the site shows straight away, while the PDF opens.
          <div className="pdfv__book" style={{ width: pageWidth * (book ? 2 : 1), height: pageHeight }}>
            <div className="pdfv__page is-showing" style={{ width: pageWidth, height: pageHeight, left: book ? pageWidth : 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {poster && <img className="pdfv__poster" src={poster} alt="" />}
              <span className="pdfv__spin" role="status" aria-label="Loading edition" />
            </div>
          </div>
        ) : (
          <div ref={bookRef} className="pdfv__book" style={{ width: pageWidth * (book ? 2 : 1), height: pageHeight }}>
            {mountedPages.map((n) => {
              const onLeft = leftSides.has(n);
              const showing = flip ? flip.from.includes(n) || flip.to.includes(n) : current.includes(n);
              // The page that lifts or lands sits on top of the pages staying still.
              const leaf = flip ? n === flip.lift || n === flip.land : false;
              return (
                <div
                  key={n}
                  data-page={n}
                  className={`pdfv__page${book ? (onLeft ? " is-left" : " is-right") : ""}${showing ? " is-showing" : ""}${leaf ? " is-leaf" : ""}`}
                  style={{ width: pageWidth, height: pageHeight, left: book && !onLeft ? pageWidth : 0 }}
                  aria-hidden={!showing}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {n === 1 && poster && <img className="pdfv__poster" src={poster} alt="" />}
                  <canvas />
                  <span className="pdfv__spin" aria-hidden />
                  <span className="pdfv__shade" aria-hidden />
                </div>
              );
            })}
          </div>
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
