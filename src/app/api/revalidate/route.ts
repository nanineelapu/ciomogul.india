// Called by a Sanity webhook when content is published, so the site refreshes.
//
// Preferred: set the webhook's "Secret" in Sanity to SANITY_REVALIDATE_SECRET.
// Sanity then signs every call (sanity-webhook-signature header) and the
// signature is verified against the raw body; a signed call with a bad
// signature is always rejected.
// Fallback (older setup): the same secret in the x-sanity-secret header or the
// ?secret= query, compared in constant time.
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { clientIp, rateLimited, safeEqual } from "@/lib/security";

const SIGNATURE_HEADER = "sanity-webhook-signature";

export async function POST(req: NextRequest) {
  const expected = process.env.SANITY_REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json({ ok: false, error: "Not configured." }, { status: 503 });
  }

  if (rateLimited("revalidate", clientIp(req), 30, 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }

  if (Number(req.headers.get("content-length") ?? "0") > 64 * 1024) {
    return NextResponse.json({ ok: false, error: "Request is too large." }, { status: 413 });
  }

  let authorised = false;
  if (req.headers.get(SIGNATURE_HEADER)) {
    try {
      // `false` skips the 3 s consistency wait; the tag is revalidated lazily anyway.
      const { isValidSignature } = await parseBody(req, expected, false);
      authorised = isValidSignature === true;
    } catch {
      authorised = false;
    }
  } else {
    const given = req.headers.get("x-sanity-secret") ?? new URL(req.url).searchParams.get("secret") ?? "";
    authorised = given !== "" && safeEqual(given, expected);
  }

  if (!authorised) {
    return NextResponse.json({ ok: false, error: "Unauthorised." }, { status: 401 });
  }

  // "max" = serve stale while the next request triggers a background refresh.
  revalidateTag("sanity", "max");
  return NextResponse.json({ ok: true, revalidated: "sanity" });
}
