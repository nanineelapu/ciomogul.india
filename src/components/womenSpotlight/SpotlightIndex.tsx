import Image from "next/image";
import Link from "next/link";
import { getAllProfiles, profileHref } from "@/data/womenSpotlightData";

// Every profile as a numbered, table-of-contents style row. Profiles still
// under review are listed but not linked.
export default function SpotlightIndex() {
  const profiles = getAllProfiles();

  return (
    <section className="section spot-index" id="honorees" aria-labelledby="spot-index-title">
      <div className="wrap">
        <header className="s-head">
          <h2 className="s-title" id="spot-index-title">All honorees</h2>
          <span className="s-rule" aria-hidden />
          <p className="s-intro">
            Explore the women whose careers and professional contributions are being documented by CIO Mogul India.
          </p>
        </header>

        <ol className="spot-index__list">
          {profiles.map((p, i) => {
            const num = <span className="spot-row__num" aria-hidden>{String(i + 1).padStart(2, "0")}</span>;
            const img = (
              <span className="spot-row__img">
                <Image src={p.image} alt="" width={80} height={80} />
              </span>
            );

            if (p.status === "pending") {
              return (
                <li key={p.id}>
                  <div className="spot-row is-pending">
                    {num}
                    {img}
                    <span className="spot-row__who">
                      <span className="spot-row__name">{p.name}</span>
                      <span className="spot-row__role">{p.statusLabel}</span>
                      <span className="spot-row__note">{p.note}</span>
                    </span>
                    <span className="spot-row__cat">{p.sector}</span>
                    <span className="spot-row__status">Profile under review</span>
                  </div>
                </li>
              );
            }

            return (
              <li key={p.id}>
                <Link href={profileHref(p.id)} className="spot-row">
                  {num}
                  {img}
                  <span className="spot-row__who">
                    <span className="spot-row__name">{p.name}</span>
                    <span className="spot-row__role">{p.designation}, {p.organization}</span>
                  </span>
                  <span className="spot-row__cat">{p.sector}</span>
                  <span className="spot-row__go">Read Profile <span aria-hidden>→</span></span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
