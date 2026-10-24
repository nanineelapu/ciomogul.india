// Called by a Sanity webhook on any document publish. The secret must match
// SANITY_REVALIDATE_SECRET; everything else is advisory. We revalidate the
// shared "sanity" tag which every data-layer fetch is tagged with.
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret") ?? req.headers.get("x-sanity-secret");
  const expected = process.env.SANITY_REVALIDATE_SECRET;

  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "SANITY_REVALIDATE_SECRET is not set" },
      { status: 500 }
    );
  }

  if (secret !== expected) {
    return NextResponse.json({ ok: false, error: "Invalid secret" }, { status: 401 });
  }

  // "max" = serve stale while the next request triggers a background refresh.
  revalidateTag("sanity", "max");
  return NextResponse.json({ ok: true, revalidated: "sanity" });
}
