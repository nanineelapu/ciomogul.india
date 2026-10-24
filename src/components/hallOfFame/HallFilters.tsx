"use client";
import { useRouter, useSearchParams } from "next/navigation";
import type { SiteText } from "@/data/siteText";
import { useEffect, useState, useTransition } from "react";

// Same URL-driven pattern as MagazineFilters / PodcastFilters. The server
// does the filtering; this component only mutates ?q=&year=&sort=.
export default function HallFilters({
  years,
  resultCount,
  totalCount,
  text,
}: {
  years: number[];
  resultCount: number;
  totalCount: number;
  text: SiteText["hallOfFame"];
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
      router.replace(qs ? `/hall-of-fame?${qs}` : "/hall-of-fame", { scroll: false });
    });
  }

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
              onClick={() => { setQ(""); startTransition(() => router.replace("/hall-of-fame", { scroll: false })); }}
            >
              {text.clearFilters}
            </button>
          </>
        ) : null}
      </p>
    </div>
  );
}
