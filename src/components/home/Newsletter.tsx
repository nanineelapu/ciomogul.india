"use client";
import { useState } from "react";
import type { SiteText } from "@/data/siteText";

export default function Newsletter({ text }: { text: SiteText["home"] }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setMsg({ text: text.newsletterInvalid, ok: false });
      return;
    }

    setSending(true);
    setMsg(null);
    try {
      const website = (new FormData(e.currentTarget).get("website") as string) ?? "";
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setMsg({ text: data.error || text.newsletterError, ok: false });
        return;
      }
      setMsg({ text: text.newsletterSuccess, ok: true });
      setEmail("");
    } catch {
      setMsg({ text: text.newsletterError, ok: false });
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="newsletter" id="subscribe" aria-labelledby="nl-title">
      <div className="wrap newsletter__inner">
        <div>
          <h2 className="s-title" id="nl-title">{text.newsletterTitle}</h2>
          <p>{text.newsletterText}</p>
        </div>
        <form className="nl-form" noValidate onSubmit={onSubmit}>
          <label htmlFor="nl-email" className="sr-only">Email</label>
          <div className="nl-form__row">
            <input
              id="nl-email"
              type="email"
              placeholder={text.newsletterPlaceholder}
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-ink" type="submit" disabled={sending}>
              {sending ? text.newsletterSending : text.newsletterButton}
            </button>
          </div>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="cform__trap" />
          {msg && (
            <p className={`nl-form__msg ${msg.ok ? "is-ok" : "is-error"}`} role="status">
              {msg.text}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
