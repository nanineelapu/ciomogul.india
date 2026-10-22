"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

// Keeps filter state in the URL (?q=&year=&sort=&page=) so results are
// shareable, the back button works, and the server does the actual filtering.
// This component just mutates the URL; the page re-renders with new params.
export default function MagazineFilters({
  years,
  resultCount,
  totalCount,
}: {
  years: number[];
  resultCount: number;
  totalCount: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [q, setQ] = useState(params.get("q") ?? "");
  const year = params.get("year") ?? "";
  const sort = params.get("sort") ?? "newest";

  // keep the input synced if the URL changes under us (back/forward)
  useEffect(() => { setQ(params.get("q") ?? ""); }, [params]);

  function updateParam(name: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value && value.length > 0) next.set(name, value);
    else next.delete(name);
    // Any filter change should reset back to the first page of results
    if (name !== "page") next.delete("page");
    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `/magazines?${qs}` : "/magazines", { scroll: false });
    });
  }

  // Debounce typing so the URL doesn't thrash on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      if (q !== (params.get("q") ?? "")) updateParam("q", q || null);
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className={`mag-filters${pending ? " is-pending" : ""}`}>
      <div className="mag-filters__row">
        <label className="mag-filters__search">
          <span className="sr-only">Search editions</span>
          <input
            type="search"
            placeholder="Search by name, title or edition…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>

        <div className="mag-filters__selects">
          <label className="mag-filters__select">
            <span>Year</span>
            <select value={year} onChange={(e) => updateParam("year", e.target.value || null)}>
              <option value="">All years</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </label>

          <label className="mag-filters__select">
            <span>Sort</span>
            <select value={sort} onChange={(e) => updateParam("sort", e.target.value)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>
      </div>

      <p className="mag-filters__count">
        <b>{resultCount}</b> of <b>{totalCount}</b> editions
        {q || year ? (
          <>
            {" "}·{" "}
            <button
              type="button"
              className="mag-filters__clear"
              onClick={() => { setQ(""); startTransition(() => router.replace("/magazines", { scroll: false })); }}
            >
              Clear filters
            </button>
          </>
        ) : null}
      </p>
    </div>
  );
}
