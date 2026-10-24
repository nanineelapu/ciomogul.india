"use client";
import { useState } from "react";
import type { SiteText } from "@/data/siteText";

type Fields = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { name: "", email: "", subject: "", message: "" };

function validate(v: Fields, t: SiteText["contact"]): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = t.nameRequired;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = t.emailInvalid;
  if (!v.subject.trim()) e.subject = t.subjectRequired;
  if (v.message.trim().length < 10) e.message = t.messageShort;
  return e;
}

// Validates in the browser, then posts to /api/contact, which saves the message
// and emails the team.
export default function ContactForm({ text }: { text: SiteText["contact"] }) {
  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function set<K extends keyof Fields>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(values, text);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSending(true);
    setServerError(null);
    try {
      const website = (new FormData(e.currentTarget).get("website") as string) ?? "";
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setServerError(data.error || text.genericError);
        return;
      }
      setSent(true);
      setValues(EMPTY);
    } catch {
      setServerError(text.genericError);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="cform__done" role="status">
        <b>{text.successTitle}</b>
        <p>{text.successText}</p>
        <button type="button" className="btn btn-line" onClick={() => setSent(false)}>
          {text.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form className="cform" noValidate onSubmit={onSubmit}>
      <div className="cform__row">
        <Field label={text.nameLabel} error={errors.name}>
          <input
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
          />
        </Field>
        <Field label={text.formEmailLabel} error={errors.email}>
          <input
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
          />
        </Field>
      </div>

      <Field label={text.subjectLabel} error={errors.subject}>
        <input
          type="text"
          value={values.subject}
          onChange={(e) => set("subject", e.target.value)}
          aria-invalid={!!errors.subject}
        />
      </Field>

      <Field label={text.messageLabel} error={errors.message}>
        <textarea
          rows={6}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={!!errors.message}
        />
      </Field>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="cform__trap" />

      {serverError && <p className="cform__error" role="alert">{serverError}</p>}

      <button type="submit" className="btn btn-ink" disabled={sending}>
        {sending ? text.sendingButton : text.sendButton}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`cform__field${error ? " has-error" : ""}`}>
      <span className="cform__label">{label}</span>
      {children}
      {error && <span className="cform__error" role="alert">{error}</span>}
    </label>
  );
}
