import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { WHATSAPP_URL } from "@/data/social";

export const metadata: Metadata = {
  title: "Contact — CIO Mogul India",
  description:
    "Get in touch with the CIO Mogul India editorial team for enquiries, story pitches and partnerships.",
};

const DETAILS = [
  { label: "Email", value: "info@ciomogulindia.com", href: "mailto:info@ciomogulindia.com" },
  { label: "Phone", value: "+91 95292 03836", href: "tel:+919529203836" },
  { label: "WhatsApp", value: "Start a chat", href: WHATSAPP_URL },
  { label: "Office", value: "Mumbai, Maharashtra, India" },
];

export default function ContactPage() {
  return (
    <main>
      <section className="page-lead page-lead--light">
        <div className="wrap">
          <h1 className="page-lead__title">Contact us</h1>
          <p className="page-lead__sub">
            Have an enquiry or a story to share? Send us a message and our team
            will get back to you.
          </p>
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
