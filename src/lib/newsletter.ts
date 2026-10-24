import { createHmac, timingSafeEqual } from "node:crypto";
import { SITE_URL } from "@/lib/site";

// Unsubscribe links are signed with a secret, so nobody can unsubscribe someone
// else by guessing the address. NEWSLETTER_SECRET is best; the Resend key is
// used if it isn't set.
function secret(): string | null {
  return process.env.NEWSLETTER_SECRET || process.env.RESEND_API_KEY || null;
}

export function signEmail(email: string): string | null {
  const key = secret();
  if (!key) return null;
  return createHmac("sha256", key).update(email.toLowerCase()).digest("hex");
}

export function verifyEmailToken(email: string, token: string): boolean {
  const expected = signEmail(email);
  if (!expected || !token) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function unsubscribeUrl(email: string): string | null {
  const token = signEmail(email);
  if (!token) return null;
  return `${SITE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}
