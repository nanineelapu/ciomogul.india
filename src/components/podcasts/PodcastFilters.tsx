"use client";
import { useRouter, useSearchParams } from "next/navigation";
import type { SiteText } from "@/data/siteText";
import { useEffect, useState, useTransition } from "react";

// Same URL-driven pattern as MagazineFilters — the server does the actual
// filtering, this component just mutates ?q=&year=&sort= and lets the page
// re-render.
export default function PodcastFilters({
  years,
  resultCount,
  totalCount,
  text,
}: {
  years: number[];
  resultCount: number;
  totalCount: number;
  text: SiteText["podcasts"];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [q, setQ] = useState(params.get("q") ?? "");
  const year = params.get("year") ?? "";
  const sort = params.get("sort") ?? "newest";

  useEffect(() => { setQ(params.get("q") ?? ""); }, [params]);

  function updateParam(name: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value && value.length > 0) next.set(name, value);
    else next.delete(name);
    if (name !== "page") next.delete("page");
    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `/podcasts?${qs}` : "/podcasts", { scroll: false });
    });
  }

  // Debounce typing so the URL doesn't thrash
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
          <span className="sr-only">{text.searchLabel}</span>
          <input
            type="search"
            placeholder={text.searchPlaceholder}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>

        <div className="mag-filters__selects">
          <label className="mag-filters__select">
            <span>{text.yearLabel}</span>
            <select value={year} onChange={(e) => updateParam("year", e.target.value || null)}>
              <option value="">{text.allYears}</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </label>

          <label className="mag-filters__select">
            <span>{text.sortLabel}</span>
            <select value={sort} onChange={(e) => updateParam("sort", e.target.value)}>
              <option value="newest">{text.sortNewest}</option>
              <option value="oldest">{text.sortOldest}</option>
            </select>
          </label>
        </div>
      </div>

      <p className="mag-filters__count">
        <b>{resultCount}</b> of <b>{totalCount}</b> {text.countWord}
        {q || year ? (
          <>
            {" "}·{" "}
            <button
              type="button"
              className="mag-filters__clear"
              onClick={() => { setQ(""); startTransition(() => router.replace("/podcasts", { scroll: false })); }}
            >
              {text.clearFilters}
            </button>
          </>
        ) : null}
      </p>
    </div>
  );
}
