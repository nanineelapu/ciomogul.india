import defaults from "./siteText.default.json";

// Every fixed word on the site (menus, buttons, section titles, form labels,
// messages). The JSON file is the single source: this type, the built-in
// fallback text, the Sanity editor and the seed script are all built from it.
export type SiteText = typeof defaults;

export const SITE_TEXT: SiteText = defaults;

// Layers values from Sanity over the built-in text. Anything left empty in
// Sanity keeps the built-in wording, so a half-filled editor never breaks a page.
export function mergeSiteText<T>(base: T, remote: unknown): T {
  if (typeof base === "string") {
    return (typeof remote === "string" && remote.trim() ? remote : base) as T;
  }
  if (Array.isArray(base)) {
    if (!Array.isArray(remote) || remote.length === 0) return base;
    const keys = base[0] && typeof base[0] === "object" ? Object.keys(base[0] as object) : null;
    if (!keys) return remote as T;
    // Keep only the fields we know about (drops Sanity's internal _key).
    return remote.map((item) =>
      Object.fromEntries(keys.map((k) => [k, (item as Record<string, unknown>)?.[k] ?? ""]))
    ) as T;
  }
  if (base && typeof base === "object") {
    const r = remote && typeof remote === "object" ? (remote as Record<string, unknown>) : {};
    return Object.fromEntries(
      Object.entries(base as Record<string, unknown>).map(([k, v]) => [k, mergeSiteText(v, r[k])])
    ) as T;
  }
  return base;
}
