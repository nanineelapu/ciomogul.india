import type { Image as SanityImage } from "sanity";
import { sanityConfigured } from "@/sanity/env";
import { sanityFetch } from "@/sanity/lib/client";
import { urlForOrDefault } from "@/sanity/lib/image";
import { SPOTLIGHT_QUERY } from "@/sanity/lib/queries";
import {
  WOMEN_SPOTLIGHT_DATA,
  type PendingProfile,
  type PublishedProfile,
  type SpotlightProfile,
} from "@/data/womenSpotlightData";

// Women Spotlight profiles. Sanity wins; the built-in profiles in
// data/womenSpotlightData.ts are used until Sanity has any, and they fill in
// any field an editor leaves empty on a profile with the same address.

type Raw = {
  id: string;
  status?: "published" | "pending";
  name?: string;
  designation?: string;
  organization?: string;
  sector?: string;
  tags?: string[];
  image?: SanityImage;
  cover?: SanityImage;
  intro?: string;
  story?: string[];
  summary?: string;
  voice?: string;
  themes?: string[];
  milestones?: { when?: string; event?: string }[];
  honours?: string;
  achievements?: { title?: string; desc?: string }[];
  sources?: { label?: string; href?: string }[];
  quote?: { text?: string; sourceLabel?: string; sourceHref?: string };
  edition?: { label?: string; month?: string; href?: string };
  statusLabel?: string;
  note?: string;
  teaser?: string;
};

const text = (v: unknown, fallback = "") => (typeof v === "string" && v.trim() ? v.trim() : fallback);
const list = (v: unknown, fallback: string[]) => {
  const items = Array.isArray(v) ? v.map((x) => text(x)).filter(Boolean) : [];
  return items.length ? items : fallback;
};

function fromRaw(r: Raw, fallbackImage: string): SpotlightProfile {
  const base = WOMEN_SPOTLIGHT_DATA.find((p) => p.id === r.id);
  const image = urlForOrDefault(r.image, base?.image ?? fallbackImage);

  if (r.status === "pending") {
    return {
      status: "pending",
      id: r.id,
      name: text(r.name, base?.name),
      sector: text(r.sector, base?.sector),
      image,
      statusLabel: text(r.statusLabel, base?.status === "pending" ? base.statusLabel : "Profile under review"),
      note: text(r.note, base?.status === "pending" ? base.note : ""),
      teaser: text(r.teaser, base?.status === "pending" ? base.teaser : ""),
    } satisfies PendingProfile;
  }

  const b = base?.status === "published" ? base : undefined;
  const milestones = (r.milestones ?? [])
    .filter((m) => text(m.event))
    .map((m) => ({ ...(text(m.when) ? { when: text(m.when) } : {}), event: text(m.event) }));
  const achievements = (r.achievements ?? [])
    .filter((a) => text(a.title))
    .map((a) => ({ title: text(a.title), desc: text(a.desc) }));
  const sources = (r.sources ?? [])
    .filter((s) => text(s.label) && text(s.href))
    .map((s) => ({ label: text(s.label), href: text(s.href) }));
  const quote =
    text(r.quote?.text) && text(r.quote?.sourceHref)
      ? { text: text(r.quote?.text), source: { label: text(r.quote?.sourceLabel, "Source"), href: text(r.quote?.sourceHref) } }
      : b?.quote;
  const edition =
    text(r.edition?.label) && text(r.edition?.href)
      ? { label: text(r.edition?.label), month: text(r.edition?.month), href: text(r.edition?.href) }
      : b?.edition;

  return {
    status: "published",
    id: r.id,
    name: text(r.name, b?.name),
    designation: text(r.designation, b?.designation),
    organization: text(r.organization, b?.organization),
    sector: text(r.sector, b?.sector),
    tags: list(r.tags, b?.tags ?? []),
    image,
    cover: urlForOrDefault(r.cover, b?.cover ?? image),
    intro: text(r.intro, b?.intro),
    story: list(r.story, b?.story ?? []),
    summary: text(r.summary, b?.summary),
    voice: text(r.voice, b?.voice),
    themes: list(r.themes, b?.themes ?? []),
    milestones: milestones.length ? milestones : (b?.milestones ?? []),
    honours: text(r.honours, b?.honours),
    achievements: achievements.length ? achievements : (b?.achievements ?? []),
    sources: sources.length ? sources : (b?.sources ?? []),
    ...(quote ? { quote } : {}),
    ...(edition ? { edition } : {}),
  } satisfies PublishedProfile;
}

export async function getAllProfiles(): Promise<SpotlightProfile[]> {
  if (!sanityConfigured) return WOMEN_SPOTLIGHT_DATA;
  try {
    const rows = await sanityFetch<Raw[]>({ query: SPOTLIGHT_QUERY });
    const profiles = rows.filter((r) => r.name).map((r) => fromRaw(r, WOMEN_SPOTLIGHT_DATA[0].image));
    // The page needs at least one full profile to show.
    return profiles.some((p) => p.status === "published") ? profiles : WOMEN_SPOTLIGHT_DATA;
  } catch (err) {
    console.warn("[data] Sanity fetch failed, using fallback:", err);
    return WOMEN_SPOTLIGHT_DATA;
  }
}

export async function getPublishedProfiles(): Promise<PublishedProfile[]> {
  return (await getAllProfiles()).filter((p): p is PublishedProfile => p.status === "published");
}

export async function isPublishedProfile(id: string) {
  return (await getPublishedProfiles()).some((p) => p.id === id);
}

// Unknown, missing or still-pending ids fall back to the first published profile.
export async function getProfileById(id?: string): Promise<PublishedProfile> {
  const published = await getPublishedProfiles();
  return published.find((p) => p.id === id) ?? published[0];
}

// Exact lookup for the story page: no fallback, so unknown ids can 404.
export async function findPublishedProfile(id: string): Promise<PublishedProfile | undefined> {
  return (await getPublishedProfiles()).find((p) => p.id === id);
}

// Previous / next published profile for the pager. Wraps around; with only
// two profiles both directions point at the same person, so `prev` is null.
export async function getAdjacentProfiles(id: string) {
  const all = await getPublishedProfiles();
  const i = Math.max(0, all.findIndex((p) => p.id === id));
  const prev = all[(i - 1 + all.length) % all.length];
  const next = all[(i + 1) % all.length];
  return {
    prev: prev.id === id || prev.id === next.id ? null : prev,
    next: next.id === id ? null : next,
  };
}
