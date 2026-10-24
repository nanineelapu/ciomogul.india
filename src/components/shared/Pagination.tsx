import Link from "next/link";
import { getSiteText } from "@/lib/data";

// Server-rendered pagination. Each button is a plain Link that updates the
// ?page= search param while keeping any existing filters (q, year, sort).
// Numbers get elided with "…" once the range gets long.
export default async function Pagination({
  page,
  totalPages,
  basePath,
  params,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  params: URLSearchParams;
}) {
  const t = await getSiteText();
  if (totalPages <= 1) return null;

  function hrefForPage(p: number) {
    const next = new URLSearchParams(params);
    if (p <= 1) next.delete("page");
    else next.set("page", String(p));
    const qs = next.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const pages = buildPageList(page, totalPages);

  return (
    <nav className="pagination" aria-label="Pagination">
      <Link
        href={hrefForPage(page - 1)}
        className="pagination__step"
        aria-disabled={page <= 1}
        tabIndex={page <= 1 ? -1 : 0}
      >
        {t.general.paginationPrev}
      </Link>

      <ol className="pagination__list">
        {pages.map((p, i) =>
          p === "…" ? (
            <li key={`gap-${i}`} className="pagination__gap" aria-hidden>
              …
            </li>
          ) : (
            <li key={p}>
              <Link
                href={hrefForPage(p)}
                className={`pagination__num${p === page ? " is-current" : ""}`}
                aria-current={p === page ? "page" : undefined}
              >
                {String(p).padStart(2, "0")}
              </Link>
            </li>
          )
        )}
      </ol>

      <Link
        href={hrefForPage(page + 1)}
        className="pagination__step"
        aria-disabled={page >= totalPages}
        tabIndex={page >= totalPages ? -1 : 0}
      >
        {t.general.paginationNext}
      </Link>
    </nav>
  );
}

// Compact list: always show first, last, current, and one neighbour either
// side; everything else collapses to "…".
function buildPageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return range(1, total);
  const set = new Set<number>([1, total, current, current - 1, current + 1]);
  const pages = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

function range(start: number, end: number) {
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}
