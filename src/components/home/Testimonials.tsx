import Image from "next/image";
import { getTestimonials } from "@/lib/data";

export default async function Testimonials() {
  const testis = await getTestimonials();

  return (
    <section className="section" id="testimonials" aria-labelledby="testi-title">
      <div className="wrap">
        <header className="s-head">
          <h2 className="s-title" id="testi-title">What leaders say</h2>
          <span className="s-rule" aria-hidden />
        </header>
        <div className="testis">
          {testis.map((t) => (
            <figure key={t.name} className="testi">
              <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption>
                <Image src={t.avatar} alt="" width={52} height={52} />
                <span>
                  <b>{t.name}</b>
                  <span>{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
