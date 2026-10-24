import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbLd, pageLd } from "@/lib/seo";
import { getPageContent } from "@/lib/data";
import { getSiteSettings, getSiteText } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const page = (await getPageContent()).contact;
  return buildMetadata({
    title: page.title,
    description: page.intro,
    path: "/contact",
    keywords: ["contact CIO Mogul India","get featured in magazine","pitch a story","magazine advertising India","media partnership India"],
  });
}

export default async function ContactPage() {
  const [settings, t] = await Promise.all([getSiteSettings(), getSiteText()]);
  const DETAILS: { label: string; value: string; href?: string }[] = [
    { label: t.contact.emailLabel, value: settings.email, href: `mailto:${settings.email}` },
    { label: t.contact.phoneLabel, value: settings.phone, href: settings.phoneHref },
    { label: t.contact.whatsappLabel, value: t.contact.whatsappCta, href: settings.whatsappUrl },
    { label: t.contact.officeLabel, value: settings.office },
  ];

  const page = (await getPageContent()).contact;

  return (
    <main>
      <JsonLd data={[pageLd("ContactPage", { name: page.title, description: page.intro, path: "/contact" }), breadcrumbLd([{ name: page.title, path: "/contact" }])]} />
      <section className="page-lead page-lead--light">
        <div className="wrap">
          <h1 className="page-lead__title">{page.title}</h1>
          <p className="page-lead__sub">{page.intro}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap contact-grid">
          <aside className="contact-details" aria-label="Contact details">
            {DETAILS.map((d) => (
              <div key={d.label} className="contact-details__item">
                <p className="contact-details__label">{d.label}</p>
                {d.href ? (
                  <a
                    href={d.href}
                    className="contact-details__value"
                    {...(d.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {d.value}
                  </a>
                ) : (
                  <p className="contact-details__value">{d.value}</p>
                )}
              </div>
            ))}
          </aside>

          <div className="contact-form">
            <ContactForm text={t.contact} />
          </div>
        </div>
      </section>
    </main>
  );
}
