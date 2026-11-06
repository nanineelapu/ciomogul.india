import type { CSSProperties, ReactNode } from "react";

// Loading skeletons: grey shapes that stand in for the content (same layout,
// same spacing) while a page streams in. They are shown by each route's
// loading.tsx. Server components, no JavaScript; the shimmer is plain CSS.

/** One grey block. Size it with w / h (numbers are px), round it with r. */
export function Sk({ w, h, r, className = "", style }: { w?: string | number; h?: string | number; r?: string | number; className?: string; style?: CSSProperties }) {
  return <span className={`sk ${className}`.trim()} style={{ width: w, height: h, borderRadius: r, ...style }} aria-hidden />;
}

/** A paragraph: n lines, the last one shorter. */
export function SkLines({ n = 3, last = "62%", h = 14, gap = 10 }: { n?: number; last?: string; h?: number; gap?: number }) {
  return (
    <div className="sk-lines" style={{ gap }} aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <Sk key={i} h={h} w={i === n - 1 && n > 1 ? last : "100%"} />
      ))}
    </div>
  );
}

/** Wraps a page's skeleton: tells screen readers the page is loading. */
export function SkShell({ children }: { children: ReactNode }) {
  return (
    <main className="sk-page" role="status" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      {children}
    </main>
  );
}

/** Label bar, big title, intro lines and two buttons: the top of most pages. */
export function SkPageHead({ big = false, buttons = false }: { big?: boolean; buttons?: boolean }) {
  return (
    <section className="sk-head">
      <div className="wrap">
        <Sk w={150} h={12} />
        <Sk w={big ? "min(560px, 80%)" : "min(420px, 70%)"} h={big ? 76 : 48} style={{ marginTop: 28 }} />
        <div style={{ marginTop: 22, maxWidth: 640 }}>
          <SkLines n={2} last="70%" h={16} />
        </div>
        {buttons && (
          <div className="sk-row" style={{ marginTop: 28 }}>
            <Sk w={190} h={52} />
            <Sk w={170} h={52} />
          </div>
        )}
      </div>
    </section>
  );
}

/** A section heading with its short underline. */
export function SkSectionHead({ w = 260 }: { w?: number }) {
  return (
    <div className="sk-sechead">
      <Sk w={w} h={36} />
      <Sk w={140} h={3} />
    </div>
  );
}

/** Framed magazine covers with a name and a line underneath. */
export function SkCovers({ count = 8, cols = 4 }: { count?: number; cols?: number }) {
  return (
    <ul className="sk-grid" style={{ "--cols": cols } as CSSProperties}>
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="sk-card">
          <Sk className="sk-cover" />
          <Sk w="70%" h={18} style={{ marginTop: 18 }} />
          <Sk w="48%" h={12} style={{ marginTop: 10 }} />
        </li>
      ))}
    </ul>
  );
}

/** A heading with its line, then rows of cover + text: Magazines and Hall of Fame. */
export function SkRows({ count = 3 }: { count?: number }) {
  return (
    <div className="sk-rows">
      <div className="sk-rowhead">
        <Sk w={230} h={34} />
        <Sk w={140} h={3} />
      </div>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="sk-row-item">
          <Sk className="sk-cover sk-row-item__cover" />
          <div>
            <Sk w={160} h={12} />
            <Sk w="min(380px, 80%)" h={36} style={{ marginTop: 16 }} />
            <Sk w="min(480px, 90%)" h={16} style={{ marginTop: 16 }} />
            <div style={{ marginTop: 18, maxWidth: 640 }}>
              <SkLines n={3} h={14} />
            </div>
            <div className="sk-row" style={{ marginTop: 22 }}>
              <Sk w={130} h={40} />
              <Sk w={120} h={40} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Image on top, then a title and a short line: articles and news cards. */
export function SkPosts({ count = 6, cols = 3 }: { count?: number; cols?: number }) {
  return (
    <ul className="sk-grid" style={{ "--cols": cols } as CSSProperties}>
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="sk-card">
          <Sk className="sk-wide" />
          <Sk w="40%" h={11} style={{ marginTop: 16 }} />
          <Sk w="92%" h={20} style={{ marginTop: 12 }} />
          <Sk w="66%" h={20} style={{ marginTop: 8 }} />
        </li>
      ))}
    </ul>
  );
}

/** Plain tiles with a title and two lines: industries. */
export function SkTiles({ count = 6, cols = 3 }: { count?: number; cols?: number }) {
  return (
    <ul className="sk-grid" style={{ "--cols": cols } as CSSProperties}>
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="sk-tile">
          <Sk w={44} h={28} />
          <Sk w="60%" h={20} style={{ marginTop: 16 }} />
          <SkLines n={2} last="70%" h={12} />
        </li>
      ))}
    </ul>
  );
}

/** A cover on the left, a name, a role and a few paragraphs on the right: detail pages. */
export function SkProfile() {
  return (
    <>
      <div className="wrap" style={{ paddingTop: 28 }}>
        <Sk w={170} h={12} />
      </div>
      <section className="sk-profile">
        <div className="wrap sk-profile__grid">
          <Sk className="sk-cover sk-profile__cover" />
          <div>
            <Sk w={140} h={12} />
            <Sk w="min(520px, 90%)" h={54} style={{ marginTop: 22 }} />
            <Sk w="min(360px, 70%)" h={16} style={{ marginTop: 18 }} />
            <div style={{ marginTop: 30, maxWidth: 620 }}>
              <SkLines n={4} h={15} gap={12} />
            </div>
            <div style={{ marginTop: 24, maxWidth: 620 }}>
              <SkLines n={4} h={15} gap={12} />
            </div>
            <div className="sk-row" style={{ marginTop: 30 }}>
              <Sk w={180} h={52} />
              <Sk w={180} h={52} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/** An article: label, headline, meta line, wide image, then the text. */
export function SkArticle() {
  return (
    <>
      <div className="wrap" style={{ paddingTop: 28 }}>
        <Sk w={140} h={12} />
      </div>
      <section className="sk-article wrap">
        <Sk w={110} h={12} />
        <Sk w="100%" h={50} style={{ marginTop: 20 }} />
        <Sk w="64%" h={50} style={{ marginTop: 10 }} />
        <Sk w={240} h={13} style={{ marginTop: 22 }} />
        <Sk className="sk-wide" style={{ marginTop: 32 }} />
        <div style={{ marginTop: 34 }}>
          <SkLines n={5} h={16} gap={12} />
        </div>
        <div style={{ marginTop: 26 }}>
          <SkLines n={5} h={16} gap={12} />
        </div>
      </section>
    </>
  );
}

/** Long text (terms, privacy). */
export function SkText() {
  return (
    <section className="sk-article wrap" style={{ paddingTop: 48 }}>
      <Sk w="min(380px, 70%)" h={48} />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ marginTop: 36 }}>
          <Sk w={220} h={22} style={{ marginBottom: 16 }} />
          <SkLines n={4} h={15} gap={12} />
        </div>
      ))}
    </section>
  );
}

/** The home hero: details, the row of covers, and the map. */
export function SkHero() {
  return (
    <section className="sk-hero">
      <div className="wrap">
        <Sk w={190} h={40} style={{ marginBottom: 28 }} />
        <div className="sk-hero__grid">
          <div>
            <Sk w={150} h={12} />
            <Sk w="85%" h={34} style={{ marginTop: 20 }} />
            <Sk w="55%" h={34} style={{ marginTop: 10 }} />
            <div style={{ marginTop: 22, maxWidth: 320 }}>
              <SkLines n={2} h={14} />
            </div>
            <div className="sk-row" style={{ marginTop: 24 }}>
              <Sk w={130} h={40} />
              <Sk w={150} h={40} />
            </div>
          </div>
          <div className="sk-hero__covers" aria-hidden>
            <Sk className="sk-cover sk-hero__side" />
            <Sk className="sk-cover sk-hero__front" />
            <Sk className="sk-cover sk-hero__side" />
          </div>
          <Sk className="sk-hero__map" />
        </div>
      </div>
    </section>
  );
}
