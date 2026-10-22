import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { WHATSAPP_URL } from "@/data/social";
import { CONTACT_FAQ, CONTACT_TOPICS } from "@/data/contact";

export const metadata: Metadata = {
  title: "Contact — CIO Mogul India",
  description:
    "Get in touch with the CIO Mogul India editorial team for enquiries, story pitches and partnerships.",
};

const DETAILS = [
  {
    label: "Email",
    value: "info@ciomogulindia.com",
    href: "mailto:info@ciomogulindia.com",
    note: "For enquiries and story pitches.",
  },
  {
    label: "Phone",
    value: "+91 95292 03836",
    href: "tel:+919529203836",
  },
  {
    label: "WhatsApp",
    value: "Start a chat",
    href: WHATSAPP_URL,
    note: "Message us directly.",
  },
  {
    label: "Office",
    value: "Mumbai, Maharashtra, India",
  },
];

export default function ContactPage() {
  return (
    <main>
      <section className="page-lead page-lead--light">
        <div className="wrap">
          <span className="page-lead__eyebrow">Contact</span>
          <h1 className="page-lead__title">Let&apos;s start a conversation.</h1>
          <p className="page-lead__sub">
            Whether you have an enquiry, a story to pitch, or simply want to
            connect, we would love to hear from you.
          </p>
        </div>
      </section>

      <section className="section contact-topics-section">
        <div className="wrap">
          <ul className="contact-topics">
            {CONTACT_TOPICS.map((t) => (
              <li key={t.title} className="contact-topics__item">
                <h2 className="contact-topics__title">{t.title}</h2>
                <p>{t.text}</p>
              </li>
            ))}
          </ul>
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
                {d.note && <p className="contact-details__note">{d.note}</p>}
              </div>
            ))}
          </aside>

          <div className="contact-form">
            <h2 className="section-head__title">Send a message</h2>
            <span className="section-head__rule" aria-hidden />
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <header className="section-head">
            <h2 className="section-head__title">Common questions</h2>
            <span className="section-head__rule" aria-hidden />
          </header>
          <div className="faq">
            {CONTACT_FAQ.map((f) => (
              <details key={f.q} className="faq__item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
