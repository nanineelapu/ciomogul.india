// Receives the contact form. Saves the message to Supabase, emails the team,
// and sends the visitor a confirmation at the address they gave. Each step runs
// only when its keys are configured; the request succeeds if the message was
// saved or the team was emailed. The visitor's confirmation is best effort.
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { confirmationEmail, notificationEmail } from "@/lib/email/templates";
import { BadRequest, EMAIL_RE, clientIp, isSameOrigin, rateLimited, readJson } from "@/lib/security";

type Body = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown; // honeypot: real people leave this empty
};

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 403 });
  }

  let body: Body;
  try {
    body = await readJson<Body>(req, 16 * 1024);
  } catch (err) {
    const status = err instanceof BadRequest ? err.status : 400;
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status });
  }

  // Bots fill the hidden field. Pretend it worked and do nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // 5 messages per visitor per 10 minutes.
  if (rateLimited("contact", clientIp(req), 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please try again later." },
      { status: 429 }
    );
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const subject = clean(body.subject, 200).replace(/[\r\n]+/g, " ");
  const message = clean(body.message, 5000);

  if (!name || !EMAIL_RE.test(email) || !subject || message.length < 10) {
    return NextResponse.json({ ok: false, error: "Please check the form fields." }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  if (!(supabaseUrl && supabaseKey) && !resendKey) {
    return NextResponse.json(
      { ok: false, error: "Messages can't be sent right now. Please email us directly." },
      { status: 503 }
    );
  }

  let saved = false;
  let emailed = false;

  // 1. Save to Supabase (schema cio_india, table contacts)
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey, { db: { schema: "cio_india" } });
      const [firstName, ...rest] = name.split(/\s+/);
      const { error } = await supabase.from("contacts").insert({
        first_name: firstName,
        last_name: rest.join(" ") || null,
        email,
        subject,
        message,
      });
      if (error) throw error;
      saved = true;
    } catch (err) {
      console.error("[contact] save failed:", err);
    }
  }

  // 2. Email the team and confirm to the visitor
  if (resendKey) {
    const resend = new Resend(resendKey);
    const from = process.env.CONTACT_FROM_EMAIL || "CIO Mogul India <onboarding@resend.dev>";
    const teamInbox = process.env.CONTACT_TO_EMAIL || "info@ciomogulindia.com";
    const submission = { name, email, subject, message };

    // Team copy. Reply-To is the visitor, so replying goes straight to them.
    try {
      const mail = notificationEmail(submission);
      const { error } = await resend.emails.send({
        from,
        to: teamInbox,
        replyTo: email,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      });
      if (error) throw error;
      emailed = true;
    } catch (err) {
      console.error("[contact] team email failed:", err);
    }

    // Visitor copy. Replies go to the team inbox. Until a domain is verified in
    // Resend, it can only deliver to the Resend account's own address.
    try {
      const mail = confirmationEmail(submission);
      const { error } = await resend.emails.send({
        from,
        to: email,
        replyTo: teamInbox,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      });
      if (error) throw error;
    } catch (err) {
      console.error("[contact] confirmation email failed:", err);
    }
  }

  if (!saved && !emailed) {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again or email us directly." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
