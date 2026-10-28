import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { getIndustries, getSiteText } from "@/lib/data";
import { itemListLd } from "@/lib/seo";

// "Industries we cover": a ruled grid of sectors. The same list is also sent to
// search engines as structured data (an ItemList).
export default async function Industries() {
  const [industries, t] = await Promise.all([getIndustries(), getSiteText()]);
  return (
    <section className="section" id="industries" aria-labelledby="industries-title">
      <JsonLd
        data={itemListLd({
          name: t.home.industriesTitle,
          path: "/#industries",
          items: industries.map((i) => ({ name: i.name, description: i.description })),
        })}
      />
      <div className="wrap">
        <header className="s-head">
          <h2 className="s-title" id="industries-title">{t.home.industriesTitle}</h2>
          <span className="s-rule" aria-hidden />
          <p className="s-intro">{t.home.industriesIntro}</p>
        </header>
        <ol className="industries">
          {industries.map((i, n) => (
            <li key={i.slug}>
              <Link href={`/industries/${i.slug}`} className="industry">
                <span className="industry__num" aria-hidden>{String(n + 1).padStart(2, "0")}</span>
                <h3 className="industry__name">{i.name}</h3>
                <p className="industry__text">{i.description}</p>
              </Link>
            </li>
          ))}
        </ol>
        <p className="center-link industries__more">
          <Link href="/industries" className="btn btn-line">{t.home.industriesButton}</Link>
        </p>
      </div>
    </section>
  );
}
