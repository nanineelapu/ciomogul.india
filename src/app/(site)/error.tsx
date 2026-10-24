"use client";

// Shown if something fails while rendering a page. The header and footer stay,
// and the visitor can retry without losing their place.
export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main>
      <section className="page-lead page-lead--light">
        <div className="wrap">
          <h1 className="page-lead__title">Something went wrong</h1>
          <p className="page-lead__sub">
            We couldn&apos;t load this page. Please try again in a moment.
          </p>
          <p style={{ marginTop: 24 }}>
            <button type="button" className="btn btn-ink" onClick={() => reset()}>
              Try again
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
