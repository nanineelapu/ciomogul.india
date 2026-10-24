import Link from "next/link";

const CHECKLIST = [
  "Full name and current designation",
  "Company or organisation",
  "Professional biography",
  "Major projects and achievements",
  "Awards and supporting evidence",
  "Official profile or professional website",
  "Contact details for follow-up",
];

// Closing navy band asking readers to put a leader forward.
export default function SpotlightNominate() {
  return (
    <section className="spot-cta" id="nominate" aria-labelledby="spot-cta-title">
      <div className="wrap spot-cta__inner">
        <div className="spot-cta__text">
          <span className="spot-cta__eyebrow">Nominations open</span>
          <h2 className="spot-cta__title" id="spot-cta-title">
            Know a woman leader who deserves to be recognised?
          </h2>
          <p>
            CIO Mogul India welcomes nominations of women whose work is shaping business, technology,
            healthcare, infrastructure, engineering and other important sectors.
          </p>
          <p>
            Nominate a founder, executive, scientist, engineer or industry leader whose professional
            achievements can be supported by reliable information.
          </p>
          <div className="spot-cta__actions">
            <Link href="/contact" className="btn btn-paper">Submit a Nomination</Link>
            <a href="mailto:info@ciomogulindia.com" className="spot-cta__link">
              info@ciomogulindia.com
            </a>
          </div>
          <p className="spot-cta__fine">
            All nominations are subject to editorial review. Submission does not guarantee publication
            or a magazine cover feature.
          </p>
        </div>

        <div className="spot-cta__side">
          <h3 className="spot-cta__subtitle">What to include in a nomination</h3>
          <ul className="spot-cta__list">
            {CHECKLIST.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
