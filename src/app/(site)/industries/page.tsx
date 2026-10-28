import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { getIndustries, getIndustryArticles, getPageContent, getSiteText } from "@/lib/data";
import { breadcrumbLd, buildMetadata, collectionLd, pageLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [page, industries] = await Promise.all([getPageContent().then((c) => c.industries), getIndustries()]);
  return buildMetadata({
    title: page.title,
    description: page.intro,
    path: "/industries",
    seo: page.seo,
    kicker: page.title,
    keywords: industries.map((i) => `${i.name} leaders India`),
  });
}

// All industries, each with how many stories it has.
export default async function IndustriesPage() {
  const [content, industries, t] = await Promise.all([getPageContent(), getIndustries(), getSiteText()]);
  const page = content.industries;
  const counts = await Promise.all(industries.map((i) => getIndustryArticles(i).then((a) => a.length)));

  return (
    <main>
      <JsonLd
        data={[
          pageLd("CollectionPage", { name: page.title, description: page.intro, path: "/industries" }),
          breadcrumbLd([{ name: page.title, path: "/industries" }]),
          collectionLd({
            name: page.title,
            path: "/industries",
            items: industries.map((i) => ({ name: i.name, url: `/industries/${i.slug}`, description: i.description })),
          }),
        ]}
      />
      <section className="page-lead page-lead--light">
        <div className="wrap">
          <h1 className="page-lead__title">{page.title}</h1>
          <p className="page-lead__sub">{page.intro}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <ol className="ind-list">
            {industries.map((ind, n) => (
              <li key={ind.slug}>
                <Link href={`/industries/${ind.slug}`} className="ind-card">
                  <span className="ind-card__num" aria-hidden>{String(n + 1).padStart(2, "0")}</span>
                  <span className="ind-card__name">{ind.name}</span>
                  <span className="ind-card__text">{ind.description}</span>
                  <span className="ind-card__foot">
                    <span>{counts[n]} {counts[n] === 1 ? t.industries.countWordOne : t.industries.countWord}</span>
                    <span className="ind-card__go">{t.industries.viewIndustry} <span aria-hidden>→</span></span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
