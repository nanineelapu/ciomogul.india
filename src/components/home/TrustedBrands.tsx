import Image from "next/image";
import { getBrands, getSiteText } from "@/lib/data";

// "Trusted by" strip: brand logos drifting slowly across, in grey until hovered.
// A brand without an uploaded logo shows its name as a wordmark.
export default async function TrustedBrands() {
  const [brands, t] = await Promise.all([getBrands(), getSiteText()]);
  if (brands.length === 0) return null;

  // The row is repeated so the loop has no gap; the copies are hidden from screen readers.
  const loop = brands.length < 6 ? [...brands, ...brands, ...brands] : [...brands, ...brands];

  return (
    <section className="section brands" aria-labelledby="brands-title">
      <div className="wrap">
        <header className="brands__head">
          <p className="brands__kicker">{t.home.brandsKicker}</p>
          <h2 className="brands__title" id="brands-title">{t.home.brandsTitle}</h2>
        </header>
      </div>

      <div className="brands__viewport">
        <ul className="brands__track">
          {[...loop, ...loop].map((b, i) => {
            const copy = i >= brands.length;
            const tile = b.logo ? (
              <Image src={b.logo} alt={b.name} width={240} height={120} sizes="180px" className="brands__logo" />
            ) : (
              <span className="brands__name">{b.name}</span>
            );
            return (
              <li key={`${b.slug}-${i}`} className="brands__item" aria-hidden={copy || undefined}>
                {b.website ? (
                  <a href={b.website} target="_blank" rel="noopener noreferrer" tabIndex={copy ? -1 : undefined} aria-label={b.name}>
                    {tile}
                  </a>
                ) : (
                  tile
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
