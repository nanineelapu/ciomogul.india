// Newsletter sign-up. Saves the address in Supabase and sends a welcome email
// through Resend. Each step runs only when its keys are configured.
//
// People who are already subscribed get the same friendly answer as new ones,
// so this form can't be used to find out who is on the list.
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getAnonClient, getServiceClient } from "@/lib/supabase/admin";
import { unsubscribeUrl } from "@/lib/newsletter";
import { welcomeEmail } from "@/lib/email/templates";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 5 attempts per address per 10 minutes. Resets when the server restarts.
const hits = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(req: Request) {
  let body: { email?: unknown; website?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Bots fill the hidden field. Pretend it worked.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (tooMany(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  const email = (typeof body.email === "string" ? body.email.trim().toLowerCase() : "").slice(0, 200);
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  const service = getServiceClient();
  const db = service ?? getAnonClient();
  const resendKey = process.env.RESEND_API_KEY;

  if (!db && !resendKey) {
    return NextResponse.json(
      { ok: false, error: "Sign-up isn't available right now. Please try again later." },
      { status: 503 }
    );
  }

  // 1. Save. `joined` is true only when this person was not already subscribed.
  let joined = !db; // without a database we can't tell, so welcome them
  let saved = false;

  if (db) {
    try {
      if (service) {
        const { data: existing, error } = await service
          .from("newsletter_subscribers")
          .select("status")
          .eq("email", email)
          .maybeSingle();
        if (error) throw error;

        if (!existing) {
          const { error: insertError } = await service.from("newsletter_subscribers").insert({ email });
          if (insertError) throw insertError;
          joined = true;
        } else if (existing.status === "unsubscribed") {
          const { error: updateError } = await service
            .from("newsletter_subscribers")
            .update({ status: "subscribed", unsubscribed_at: null })
            .eq("email", email);
          if (updateError) throw updateError;
          joined = true;
        }
      } else {
        // Only the public key: adding a row is allowed, anything else is not.
        const { error } = await db.from("newsletter_subscribers").insert({ email });
        if (error && error.code !== "23505") throw error; // 23505 = already on the list
        joined = !error;
      }
      saved = true;
    } catch (err) {
      console.error("[newsletter] save failed:", err);
    }
  }

  // 2. Welcome email, for new subscribers only
  let emailed = false;
  if (resendKey && joined) {
    try {
      const mail = welcomeEmail(unsubscribeUrl(email));
      const unsubscribe = unsubscribeUrl(email);
      const { error } = await new Resend(resendKey).emails.send({
        from: process.env.CONTACT_FROM_EMAIL || "CIO Mogul India <onboarding@resend.dev>",
        to: email,
        replyTo: process.env.CONTACT_TO_EMAIL || "info@ciomogulindia.com",
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        headers: unsubscribe
          ? { "List-Unsubscribe": `<${unsubscribe}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" }
          : undefined,
      });
      if (error) throw error;
      emailed = true;
    } catch (err) {
      console.error("[newsletter] welcome email failed:", err);
    }
  }

  // Already subscribed counts as success. Failing to save when we have a
  // database, or to email when that is all we have, is an error.
  const alreadyOnList = saved && !joined;
  if (!saved && !emailed && !alreadyOnList) {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
