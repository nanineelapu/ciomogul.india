"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

// Debounced search for the Explore block. Separate from CategoryTabs so each
// filter stays small and single-purpose; both push to the same URL.
export default function ArticleSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");

  useEffect(() => { setQ(params.get("q") ?? ""); }, [params]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (q === (params.get("q") ?? "")) return;
      const next = new URLSearchParams(params.toString());
      if (q) next.set("q", q);
      else next.delete("q");
      next.delete("page");
      const qs = next.toString();
      startTransition(() => {
        router.replace(qs ? `/articles?${qs}` : "/articles", { scroll: false });
      });
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <label className={`mag-filters__search article-search${pending ? " is-pending" : ""}`}>
      <span className="sr-only">Search articles</span>
      <input
        type="search"
        placeholder="Search articles…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
    </label>
  );
}
