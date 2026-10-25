import Link from "next/link";
import type { LegalContent } from "@/data/terms";
import { getSiteText } from "@/lib/data";

// Shared layout for legal pages (Terms, Privacy). Plain, readable, numbered.
export default async function LegalDocument({
  content,
  related,
}: {
  content: LegalContent;
  related?: { label: string; href: string };
}) {
  const { general } = await getSiteText();
  return (
    <main>
      <section className="page-lead page-lead--light">
        <div className="wrap">
          <h1 className="page-lead__title">{content.title}</h1>
          <p className="page-lead__sub">{content.intro}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="legal">
            {content.sections.map((s, i) => (
              <section key={s.title} className="legal__section">
                <h2 className="legal__title">
                  <span className="legal__num" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.title}
                </h2>
                <div className="legal__text">
                  {s.paragraphs.map((p, j) =>
                    typeof p === "string" ? (
                      <p key={j}>{p}</p>
                    ) : (
                      <p key={j} className="legal__point">
                        <span className="legal__ref" aria-hidden>{p.ref}</span>
                        {p.text}
                      </p>
                    )
                  )}
                  {s.email && (
                    <p>
                      <a href={`mailto:${s.email}`} className="legal__link">
                        {s.email}
                      </a>
                    </p>
                  )}
                </div>
              </section>
            ))}
          </div>

          <nav className="legal-also" aria-label="Related pages">
            <span className="legal-also__label">{general.alsoRead}</span>
            {related && <Link href={related.href}>{related.label}</Link>}
            <Link href="/contact">{general.contactUs}</Link>
          </nav>
        </div>
      </section>
    </main>
  );
}
