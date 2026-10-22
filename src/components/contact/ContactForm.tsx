"use client";
import { useState } from "react";

type Fields = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { name: "", email: "", subject: "", message: "" };

function validate(v: Fields): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (!v.subject.trim()) e.subject = "Please add a subject.";
  if (v.message.trim().length < 10) e.message = "Please write at least a short message.";
  return e;
}

// Validates in the browser only. Sending is not wired up yet; when the backend
// is ready, replace the body of onSubmit with the request. Fields already match
// what the contact intake needs (name, email, subject, message).
export default function ContactForm() {
  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function set<K extends keyof Fields>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setSent(true);
    setValues(EMPTY);
  }

  if (sent) {
    return (
      <div className="cform__done" role="status">
        <b>Thank you. Your message is on its way.</b>
        <p>Our editorial team will get back to you shortly.</p>
        <button type="button" className="btn btn-line" onClick={() => setSent(false)}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="cform" noValidate onSubmit={onSubmit}>
      <div className="cform__row">
        <Field label="Name" error={errors.name}>
          <input
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
          />
        </Field>
      </div>

      <Field label="Subject" error={errors.subject}>
        <input
          type="text"
          value={values.subject}
          onChange={(e) => set("subject", e.target.value)}
          aria-invalid={!!errors.subject}
        />
      </Field>

      <Field label="Message" error={errors.message}>
        <textarea
          rows={6}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={!!errors.message}
        />
      </Field>

      <button type="submit" className="btn btn-ink">Send message</button>
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
