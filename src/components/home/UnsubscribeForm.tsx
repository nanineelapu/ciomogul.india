"use client";
import { useState } from "react";

export default function UnsubscribeForm({ email, token }: { email: string; token: string }) {
  const [state, setState] = useState<"idle" | "working" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function unsubscribe() {
    setState("working");
    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setMessage(data.error || "Something went wrong. Please try again.");
        setState("error");
        return;
      }
      setState("done");
    } catch {
      setMessage("Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return <p className="page-lead__sub">You have been unsubscribed. You won&apos;t receive any more emails from us.</p>;
  }

  return (
    <>
      <p className="page-lead__sub">
        Stop sending the newsletter to <b>{email}</b>?
      </p>
      <p style={{ marginTop: 24 }}>
        <button type="button" className="btn btn-ink" onClick={unsubscribe} disabled={state === "working"}>
          {state === "working" ? "Working…" : "Unsubscribe"}
        </button>
      </p>
      {state === "error" && <p className="cform__error" role="alert" style={{ marginTop: 12 }}>{message}</p>}
    </>
  );
}
