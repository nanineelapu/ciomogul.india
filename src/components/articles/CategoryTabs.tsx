"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { Category } from "@/types/content";

// Horizontal chip row used to switch the Explore grid. Updates ?category=
// in the URL — pure replace, no scroll jump, so the grid underneath
// re-renders in place.
export default function CategoryTabs({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  function selectCategory(slug: string) {
    const next = new URLSearchParams(params.toString());
    if (slug) next.set("category", slug);
    else next.delete("category");
    // Any category change resets back to page 1
    next.delete("page");
    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `/articles?${qs}` : "/articles", { scroll: false });
    });
  }

  return (
    <div className={`cat-tabs${pending ? " is-pending" : ""}`} role="tablist" aria-label="Filter by category">
      {categories.map((c) => {
        const isActive = (c.slug || "") === (activeSlug || "");
        return (
          <button
            key={c.slug || "all"}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`cat-tabs__tab${isActive ? " is-active" : ""}`}
            onClick={() => selectCategory(c.slug)}
          >
            <span>{c.name}</span>
            <span className="cat-tabs__count" aria-hidden>{c.count}</span>
          </button>
        );
      })}
    </div>
  );
}
