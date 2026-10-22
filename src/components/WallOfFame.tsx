import Image from "next/image";
import Link from "next/link";
import { getWomenLeaders } from "@/lib/data";

export default async function WallOfFame() {
  const leaders = await getWomenLeaders();

  return (
    <section className="section" id="women-spotlight" aria-labelledby="wall-title">
      <div className="wrap">
        <header className="s-head">
          <h2 className="s-title" id="wall-title">Wall of fame</h2>
          <span className="s-rule" aria-hidden />
          <p className="s-intro">Women leaders featured on the cover of CIO Mogul India.</p>
        </header>
        <div className="leaders">
          {leaders.map((l) => (
            <Link key={l.slug} href="/women-spotlight" className="leader">
              <span className="leader__img"><Image src={l.image} alt={l.name} width={112} height={112} /></span>
              <span className="leader__body">
                <span className="leader__org">{l.organization}</span>
                <span className="leader__name">{l.name}</span>
                <span className="leader__role">{l.role}</span>
                <span className="leader__link">Read feature →</span>
              </span>
            </Link>
          ))}
        </div>
        <p className="center-link"><Link href="/women-spotlight" className="btn btn-line">See all women leaders</Link></p>
      </div>
    </section>
  );
}
