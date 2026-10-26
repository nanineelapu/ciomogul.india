import { timingSafeEqual } from "node:crypto";

// Small, dependency-free guards shared by the public API routes.

// ── Request body ───────────────────────────────────────────────────────────

export class BadRequest extends Error {
  constructor(public status: 400 | 413 | 415, message: string) {
    super(message);
  }
}

// Reads a JSON body, refusing anything that is not JSON or is larger than
// `maxBytes`. Requiring application/json also stops plain HTML forms on other
// sites from posting here (a browser can't send JSON cross-site without CORS).
export async function readJson<T>(req: Request, maxBytes = 16 * 1024): Promise<T> {
  const type = req.headers.get("content-type") ?? "";
  if (!type.toLowerCase().startsWith("application/json")) {
    throw new BadRequest(415, "Unsupported request.");
  }
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (declared > maxBytes) throw new BadRequest(413, "Request is too large.");

  const text = await req.text();
  if (Buffer.byteLength(text, "utf8") > maxBytes) throw new BadRequest(413, "Request is too large.");
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new BadRequest(400, "Invalid request.");
  }
}

// ── Origin ─────────────────────────────────────────────────────────────────

// Browsers always send Origin on cross-site POSTs. If it is present it must be
// this site; requests without it come from non-browser clients, which can't
// be used for cross-site request forgery.
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// ── Client IP + rate limiting ──────────────────────────────────────────────

export function clientIp(req: Request): string {
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

const MAX_TRACKED = 5000;
const buckets = new Map<string, number[]>();

// Fixed-window limiter kept in memory. It is per server instance and resets on
// restart, so it is a first line of defence, not a guarantee. Memory is bounded:
// the oldest keys are dropped once MAX_TRACKED is reached.
export function rateLimited(bucket: string, key: string, limit: number, windowMs: number): boolean {
  const id = `${bucket}:${key}`;
  const now = Date.now();
  const recent = (buckets.get(id) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  buckets.delete(id);
  buckets.set(id, recent);
  while (buckets.size > MAX_TRACKED) {
    const oldest = buckets.keys().next().value;
    if (oldest === undefined) break;
    buckets.delete(oldest);
  }
  return recent.length > limit;
}

// ── Secrets ────────────────────────────────────────────────────────────────

export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

// ── Links that come from the CMS ───────────────────────────────────────────

export { safeHref } from "@/lib/safeHref";

// Email addresses without characters that could break out of HTML or headers.
export const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
