import Link from "next/link";

const LINKS = [
  { title: "Magazines", text: "Every edition, in one place.", href: "/magazines" },
  { title: "Podcasts", text: "Conversations with leaders.", href: "/podcasts" },
  { title: "Hall of Fame", text: "The permanent record.", href: "/hall-of-fame" },
  { title: "Business Women", text: "Leaders shaping the next decade.", href: "/business-women" },
];

// Small row of links to the main sections. Used at the bottom of About.
export default function ExploreLinks({ heading = "Explore" }: { heading?: string }) {
  return (
    <section className="section">
      <div className="wrap">
        <header className="section-head">
          <h2 className="section-head__title">{heading}</h2>
          <span className="section-head__rule" aria-hidden />
        </header>
        <ul className="explore-links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="explore-links__item">
                <span className="explore-links__title">{l.title}</span>
                <span className="explore-links__text">{l.text}</span>
                <span className="explore-links__cta" aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
