import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Share card (1200×630) for any page: /og?title=…&kicker=…&image=…
// Every page's Open Graph and Twitter image points here (see lib/seo.ts), so
// links shared on LinkedIn, WhatsApp, X or Facebook show a branded card with
// the page's own title and photo.

const SIZE = { width: 1200, height: 630 };
const NAVY = "#0B1F3A";
const NAVY_2 = "#1B3A6B";
const NAVY_LIGHT = "#C9D6EC";

// The site fonts (OFL licensed), so cards match the pages.
const FONT_DIR = join(process.cwd(), "src/app/og/fonts");
const fonts = Promise.all([
  readFile(join(FONT_DIR, "playfair-display-800.ttf")),
  readFile(join(FONT_DIR, "poppins-600.ttf")),
  readFile(join(FONT_DIR, "poppins-400.ttf")),
]);

const clip = (v: string | null, max: number) => {
  const s = (v ?? "").replace(/\s+/g, " ").trim();
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
};

// Only images from this site's /assets folder or Sanity's image CDN, so the
// route can't be used to fetch arbitrary addresses.
function imageSource(raw: string | null): { file?: string; url?: string } | null {
  if (!raw) return null;
  if (/^\/assets\/[\w./-]+$/.test(raw) && !raw.includes("..")) return { file: raw };
  try {
    const u = new URL(raw);
    if (u.protocol === "https:" && u.hostname === "cdn.sanity.io") {
      // The card renderer reads JPEG and PNG, not WebP/AVIF.
      u.searchParams.delete("auto");
      u.searchParams.set("fm", "jpg");
      u.searchParams.set("w", "900");
      return { url: u.toString() };
    }
  } catch {
    // not a URL
  }
  return null;
}

const MIME: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png" };

// Loads the photo as a data URI. Local files are read from /public (fetching
// the site from itself is unreliable); anything that fails or is slow simply
// leaves the photo out, so the card always renders.
async function loadImage(raw: string | null, origin: string): Promise<string | null> {
  const src = imageSource(raw);
  if (!src) return null;
  try {
    if (src.file) {
      const ext = src.file.split(".").pop()?.toLowerCase() ?? "";
      if (!MIME[ext]) return null;
      try {
        const data = await readFile(join(process.cwd(), "public", src.file));
        return `data:${MIME[ext]};base64,${data.toString("base64")}`;
      } catch {
        src.url = new URL(src.file, origin).toString();
      }
    }
    const res = await fetch(src.url!, { signal: AbortSignal.timeout(4000) });
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !/image\/(jpeg|png)/.test(type)) return null;
    const data = Buffer.from(await res.arrayBuffer());
    return `data:${type.split(";")[0]};base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const title = clip(searchParams.get("title"), 110) || "CIO Mogul India";
  const kicker = clip(searchParams.get("kicker"), 40);
  const subtitle = clip(searchParams.get("subtitle"), 120);
  const image = await loadImage(searchParams.get("image"), origin);
  const host = new URL(origin).host;

  const titleSize = title.length > 70 ? 46 : title.length > 40 ? 56 : 66;
  const [playfair, poppinsSemi, poppins] = await fonts;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: NAVY, color: "#fff", fontFamily: "Poppins" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 64px",
            borderTop: `8px solid ${NAVY_2}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 14, height: 14, background: "#fff" }} />
            <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase" }}>
              CIO Mogul India
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {kicker && (
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: 5, textTransform: "uppercase", color: NAVY_LIGHT }}>
                {kicker}
              </div>
            )}
            <div style={{ fontFamily: "Playfair Display", fontSize: titleSize, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
            {subtitle && <div style={{ fontSize: 26, lineHeight: 1.35, color: NAVY_LIGHT }}>{subtitle}</div>}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, color: NAVY_LIGHT }}>
            <div style={{ width: 56, height: 3, background: "#fff" }} />
            {host}
          </div>
        </div>

        {image && (
          <div style={{ width: 430, height: "100%", display: "flex", background: NAVY_2 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="" width={430} height={630} style={{ width: 430, height: 630, objectFit: "cover" }} />
          </div>
        )}
      </div>
    ),
    {
      ...SIZE,
      fonts: [
        { name: "Playfair Display", data: playfair, weight: 800, style: "normal" },
        { name: "Poppins", data: poppinsSemi, weight: 600, style: "normal" },
        { name: "Poppins", data: poppins, weight: 400, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" },
    }
  );
}
