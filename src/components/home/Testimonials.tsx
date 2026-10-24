import Image from "next/image";
import { getSiteText, getTestimonials } from "@/lib/data";

export default async function Testimonials() {
  const [testis, t] = await Promise.all([getTestimonials(), getSiteText()]);
  return (
    <section className="section" id="testimonials" aria-labelledby="testi-title">
      <div className="wrap">
        <header className="s-head">
          <h2 className="s-title" id="testi-title">{t.home.testimonialsTitle}</h2>
          <span className="s-rule" aria-hidden />
        </header>
        <div className="testis">
          {testis.map((item) => (
            <figure key={item.name} className="testi">
              <blockquote>&ldquo;{item.quote}&rdquo;</blockquote>
              <figcaption>
                <Image src={item.avatar} alt="" width={52} height={52} />
                <span>
                  <b>{item.name}</b>
                  <span>{item.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
