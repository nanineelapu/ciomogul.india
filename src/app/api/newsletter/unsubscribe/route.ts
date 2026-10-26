// Unsubscribe. Changes only happen on POST, because mail programs sometimes open
// links in the background, which must never unsubscribe anyone by accident. The
// signed token in the link proves the request came from that email.
import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/admin";
import { verifyEmailToken } from "@/lib/newsletter";
import { clientIp, rateLimited, readJson } from "@/lib/security";

export async function POST(req: Request) {
  if (rateLimited("unsubscribe", clientIp(req), 20, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  const url = new URL(req.url);
  let email = url.searchParams.get("email") ?? "";
  let token = url.searchParams.get("token") ?? "";

  // The page sends JSON; a mail program's one-click unsubscribe uses the URL.
  if (!email) {
    try {
      const body = await readJson<{ email?: unknown; token?: unknown }>(req, 2 * 1024);
      email = typeof body.email === "string" ? body.email : "";
      token = typeof body.token === "string" ? body.token : "";
    } catch {
      /* no body */
    }
  }

  email = email.trim().toLowerCase().slice(0, 200);
  token = token.slice(0, 128);
  if (!email || !verifyEmailToken(email, token)) {
    return NextResponse.json({ ok: false, error: "This link is not valid." }, { status: 400 });
  }

  const service = getServiceClient();
  if (!service) {
    return NextResponse.json(
      { ok: false, error: "Unsubscribing isn't available right now. Please email us and we will remove you." },
      { status: 503 }
    );
  }

  const { error } = await service
    .from("newsletter_subscribers")
    .update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
    .eq("email", email);

  if (error) {
    console.error("[newsletter] unsubscribe failed:", error);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
