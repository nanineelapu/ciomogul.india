// Keeps site-relative links and http(s)/mailto/tel; anything else (for example
// javascript: or data:) becomes the fallback. Used on every link that comes
// from the CMS. Safe to import in browser code (no Node-only imports).
export function safeHref(value: unknown, fallback = "/"): string {
  if (typeof value !== "string") return fallback;
  const v = value.trim();
  if (!v) return fallback;
  if (v.startsWith("/") && !v.startsWith("//")) return v;
  if (v.startsWith("#")) return v;
  try {
    const u = new URL(v);
    return ["http:", "https:", "mailto:", "tel:"].includes(u.protocol) ? v : fallback;
  } catch {
    return fallback;
  }
}
