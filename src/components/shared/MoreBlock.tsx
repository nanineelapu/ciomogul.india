import Link from "next/link";

// "More from this section" row shown at the bottom of detail pages.
export default function MoreBlock({
  title,
  viewAll,
  children,
}: {
  title: string;
  viewAll: { label: string; href: string };
  children: React.ReactNode;
}) {
  return (
    <section className="more-block" aria-label={title}>
      <div className="wrap">
        <header className="more-block__head">
          <h2 className="more-block__title">{title}</h2>
          <Link href={viewAll.href} className="more-block__all">
            {viewAll.label}
          </Link>
        </header>
        <div className="more-grid">{children}</div>
      </div>
    </section>
  );
}
