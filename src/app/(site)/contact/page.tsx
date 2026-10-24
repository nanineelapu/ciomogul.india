import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { getPageContent } from "@/lib/data";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact — CIO Mogul India",
  description:
    "Get in touch with the CIO Mogul India editorial team for enquiries, story pitches and partnerships.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const DETAILS: { label: string; value: string; href?: string }[] = [
    { label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { label: "Phone", value: settings.phone, href: settings.phoneHref },
    { label: "WhatsApp", value: "Start a chat", href: settings.whatsappUrl },
    { label: "Office", value: settings.office },
  ];

  const page = (await getPageContent()).contact;

  return (
    <main>
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
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
