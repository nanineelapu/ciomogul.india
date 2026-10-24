"use client";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    setMsg({ text: ok ? "Thanks — you're on the list." : "Please enter a valid email address.", ok });
    if (ok) setEmail("");
    // A mailing service (Mailchimp, Resend, etc.) can be wired here later.
  }

  return (
    <section className="newsletter" id="subscribe" aria-labelledby="nl-title">
      <div className="wrap newsletter__inner">
        <div>
          <h2 className="s-title" id="nl-title">Subscribe to our newsletter</h2>
          <p>New editions, news and podcasts. Once a week.</p>
        </div>
        <form className="nl-form" noValidate onSubmit={onSubmit}>
          <label htmlFor="nl-email" className="sr-only">Email</label>
          <div className="nl-form__row">
            <input id="nl-email" type="email" placeholder="Your email address" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="btn btn-paper" type="submit">Subscribe</button>
          </div>
          {msg && <p className={`nl-form__msg ${msg.ok ? "is-ok" : "is-error"}`} role="status">{msg.text}</p>}
        </form>
      </div>
    </section>
  );
}
