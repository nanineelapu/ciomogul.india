// Copies everything the site shows today into Sanity, so the Studio opens already
// filled in: magazine editions, Hall of Fame, podcasts, articles, the home page
// lists, legal pages, settings, page headings, About page and all the fixed
// site text. Images and the sample PDF are uploaded too.
//
//   npm run seed            add anything that is missing (never overwrites edits)
//   npm run seed -- --force replace everything with the built-in content
//   npm run seed -- --dry   show what would be created, without writing
//   npm run seed -- --only=aboutPage --force   replace just one document or type
//   npm run seed:about      shortcut for the line above (re-fills the About page)
//
// Needs SANITY_API_WRITE_TOKEN (Sanity > API > Tokens > Editor) in .env.local.
// The content is read from the same data files the website uses, so the two match.
import { createClient } from "@sanity/client";
import ts from "typescript";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { randomBytes } from "node:crypto";
import path from "node:path";

const root = process.cwd();
const FORCE = process.argv.includes("--force");
const DRY = process.argv.includes("--dry");
const ONLY = (process.argv.find((a) => a.startsWith("--only=")) || "").slice(7).split(",").map((x) => x.trim()).filter(Boolean);

// ── environment ────────────────────────────────────────────────────────────
function loadEnv(file) {
  if (!existsSync(file)) return {};
  const out = {};
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}
const env = { ...loadEnv(path.join(root, ".env.local")), ...process.env };
const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-03-01";
const token = env.SANITY_API_WRITE_TOKEN;

if (!DRY) {
  if (!projectId) { console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local"); process.exit(1); }
  if (!token) {
    console.error(
      "Missing SANITY_API_WRITE_TOKEN in .env.local.\n" +
        "Create one at sanity.io/manage > your project > API > Tokens > Add API token (role: Editor),\n" +
        "paste it after SANITY_API_WRITE_TOKEN= and run this again. (Use --dry to preview without it.)"
    );
    process.exit(1);
  }
}
const client = DRY ? null : createClient({ projectId, dataset, apiVersion, token, useCdn: false });

// ── load the website's own TypeScript data files ───────────────────────────
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file);
  if (file.endsWith(".json")) {
    const json = JSON.parse(readFileSync(file, "utf8"));
    cache.set(file, json);
    return json;
  }
  const js = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const mod = { exports: {} };
  const req = (id) => {
    let target;
    if (id.startsWith("@/")) target = path.join(root, "src", id.slice(2));
    else if (id.startsWith(".")) target = path.resolve(path.dirname(file), id);
    else return createRequire(file)(id);
    for (const ext of ["", ".ts", ".json"]) {
      if (existsSync(target + ext) && statSync(target + ext).isFile()) return load(target + ext);
    }
    throw new Error(`Cannot resolve ${id} from ${file}`);
  };
  new Function("exports", "require", "module", js)(mod.exports, req, mod);
  cache.set(file, mod.exports);
  return mod.exports;
}
const data = (name) => load(path.join(root, "src", "data", name));

const { HEADLINES } = data("headlines.ts");
const { RELEASE_COVERS, GET_FEATURED_COVERS } = data("magazines.ts");
const { MAGAZINE_EDITIONS } = data("magazineEditions.ts");
const { COVER_STORIES } = data("coverStories.ts");
const { NEWS_CARDS, VITAL_UPDATES, FEATURED_ARTICLES } = data("news.ts");
const { WOMEN_LEADERS } = data("womenLeaders.ts");
const { WOMEN_SPOTLIGHT_DATA } = data("womenSpotlightData.ts");
const { PODCASTS } = data("podcasts.ts");
const { TESTIMONIALS } = data("testimonials.ts");
const { INDUSTRIES } = data("industries.ts");
const { HALL_OF_FAME } = data("hallOfFame.ts");
const { ARTICLES } = data("articles.ts");
const { TERMS } = data("terms.ts");
const { PRIVACY } = data("privacy.ts");
const { PAGE_CONTENT } = data("pageContent.ts");
const { SOCIAL } = data("social.ts");
const about = data("about.default.json");
const siteText = data("siteText.default.json");
const { DEFAULT_DESCRIPTION } = load(path.join(root, "src", "lib", "seo.ts"));

// ── helpers ────────────────────────────────────────────────────────────────
const key = () => randomBytes(6).toString("hex");
const ref = (id) => ({ _type: "reference", _ref: id, _key: key() });
const slugOf = (s) => ({ _type: "slug", current: s });
const articleRef = (href) => (href && href.startsWith("/articles/") ? { article: ref(`article-${href.slice(10)}`) } : {});
const withKeys = (items) => items.map((it) => ({ _key: key(), ...it }));

const assetCache = new Map();
async function upload(kind, relPath, contentType) {
  const abs = path.join(root, "public", relPath);
  if (!existsSync(abs)) { console.warn("  ! missing file, skipped:", relPath); return null; }
  if (DRY) return `dry-${relPath}`;
  if (assetCache.has(relPath)) return assetCache.get(relPath);
  const asset = await client.assets.upload(kind, createReadStream(abs), { filename: path.basename(abs), contentType });
  assetCache.set(relPath, asset._id);
  console.log("  uploaded", relPath);
  return asset._id;
}
async function image(relPath, alt) {
  if (!relPath) return undefined;
  const id = await upload("image", relPath);
  if (!id) return undefined;
  return { _type: "image", asset: { _type: "reference", _ref: id }, ...(alt ? { alt } : {}) };
}
async function pdf(relPath) {
  if (!relPath) return undefined;
  const id = await upload("file", relPath, "application/pdf");
  return id ? { _type: "file", asset: { _type: "reference", _ref: id } } : undefined;
}

const docs = [];
const add = (doc) => docs.push(doc);

// ── 1. magazine editions (the home page strips point at these) ─────────────
// The cover stories name the real people on four of the covers; use those names
// and job titles so the edition, the home page and the cover all agree.
const storyByImage = new Map(COVER_STORIES.map((s) => [s.image, s]));
const altByImage = new Map(RELEASE_COVERS.concat(GET_FEATURED_COVERS).map((c) => [c.coverImage, c.alt]).filter(([, a]) => a));
const editionIdByImage = new Map();
const editionId = (slug) => `magazineEdition-${slug}`;

console.log("Preparing magazine editions…");
for (const [i, e] of MAGAZINE_EDITIONS.entries()) {
  const story = storyByImage.get(e.coverImage);
  editionIdByImage.set(e.coverImage, editionId(e.slug));
  const pdfUrl = e.pdfUrl && e.pdfUrl.startsWith("/") ? e.pdfUrl : null;
  add({
    _id: editionId(e.slug),
    _type: "magazineEdition",
    editionLabel: e.editionLabel,
    featuredPersonName: story ? story.name : e.featuredPersonName,
    title: e.title,
    subtitle: story ? story.tag : e.subtitle,
    slug: slugOf(e.slug),
    cover: await image(e.coverImage, altByImage.get(e.coverImage) || e.coverAlt),
    pullQuote: e.pullQuote,
    pullQuoteAttribution: e.pullQuoteAttribution,
    roleTags: story ? [story.role, ...e.roleTags] : e.roleTags,
    ...(pdfUrl ? { pdfFile: await pdf(pdfUrl) } : {}),
    publishedOn: e.publishedOn,
    publishedYear: e.publishedYear,
    body: e.body,
    order: i + 1,
  });
}

// ── 2. home page settings: which editions fill the three cover rows ─────────
const refsFor = (list) =>
  list.map((c) => editionIdByImage.get(c.coverImage || c.image)).filter(Boolean).map(ref);
add({
  _id: "homepageConfig",
  _type: "homepageConfig",
  releaseCovers: refsFor(RELEASE_COVERS),
  coverStories: refsFor(COVER_STORIES),
  getFeaturedCovers: refsFor(GET_FEATURED_COVERS),
});

// ── 3. Hall of Fame ─────────────────────────────────────────────────────────
console.log("Preparing Hall of Fame…");
for (const h of HALL_OF_FAME) {
  add({
    _id: `hallOfFame-${h.slug}`,
    _type: "hallOfFame",
    name: h.name,
    slug: slugOf(h.slug),
    serial: h.serial,
    inductionYear: h.inductionYear,
    inductedOn: h.inductedOn,
    edition: { _type: "reference", _ref: editionId(h.editionSlug) },
    role: h.role,
    organization: h.organization,
    portrait: await image(h.portrait, h.name),
    pullQuote: h.pullQuote,
    profileBody: h.profileBody,
  });
}

// ── 4. home page lists: headlines, news, updates, featured, testimonials ────
HEADLINES.forEach((h, i) =>
  add({ _id: `headline-${h.slug}`, _type: "headline", text: h.text, slug: slugOf(h.slug), ...articleRef(h.href), order: i + 1 })
);

console.log("Preparing home page lists…");
for (const [i, n] of NEWS_CARDS.entries()) {
  add({
    _id: `newsCard-${n.slug}`,
    _type: "newsCard",
    title: n.title,
    slug: slugOf(n.slug),
    ...articleRef(n.href),
    category: n.category,
    date: n.date,
    ...(n.image ? { image: await image(n.image, n.alt) } : {}),
    order: i + 1,
  });
}
VITAL_UPDATES.forEach((u, i) =>
  add({
    _id: `vitalUpdate-${u.slug}`,
    _type: "vitalUpdate",
    title: u.title,
    slug: slugOf(u.slug),
    ...articleRef(u.href),
    ...(u.description ? { description: u.description } : {}),
    order: i + 1,
  })
);
for (const [i, a] of FEATURED_ARTICLES.entries()) {
  add({
    _id: `featuredArticle-${a.slug}`,
    _type: "featuredArticle",
    title: a.title,
    slug: slugOf(a.slug),
    ...articleRef(a.href),
    description: a.description,
    image: await image(a.image, a.alt),
    order: i + 1,
  });
}
for (const [i, t] of TESTIMONIALS.entries()) {
  add({
    _id: `testimonial-${i + 1}`,
    _type: "testimonial",
    name: t.name,
    role: t.role,
    quote: t.quote,
    avatar: await image(t.avatar, t.name),
    order: i + 1,
  });
}

for (const [i, ind] of INDUSTRIES.entries()) {
  add({
    _id: `industry-${ind.slug}`,
    _type: "industry",
    name: ind.name,
    slug: slugOf(ind.slug),
    description: ind.description,
    order: i + 1,
  });
}

// ── 5. women leaders (home page "Wall of fame") and podcasts ────────────────
for (const [i, w] of WOMEN_LEADERS.entries()) {
  add({
    _id: `womanLeader-${w.slug}`,
    _type: "womanLeader",
    name: w.name,
    slug: slugOf(w.slug),
    role: w.role,
    organization: w.organization,
    image: await image(w.image, w.name),
    featuredYear: w.featuredYear,
    featuredOn: w.featuredOn,
    bio: w.bio,
    order: i + 1,
  });
}
console.log("Preparing Women Spotlight profiles…");
for (const [i, w] of WOMEN_SPOTLIGHT_DATA.entries()) {
  const base = {
    _id: `spotlightProfile-${w.id}`,
    _type: "spotlightProfile",
    status: w.status,
    name: w.name,
    slug: slugOf(w.id),
    order: i + 1,
    sector: w.sector,
    image: await image(w.image, w.name),
  };
  if (w.status === "pending") {
    add({ ...base, statusLabel: w.statusLabel, note: w.note, teaser: w.teaser });
    continue;
  }
  add({
    ...base,
    designation: w.designation,
    organization: w.organization,
    tags: w.tags,
    cover: await image(w.cover, w.name),
    intro: w.intro,
    story: w.story,
    summary: w.summary,
    voice: w.voice,
    themes: w.themes,
    milestones: withKeys(w.milestones),
    honours: w.honours,
    achievements: withKeys(w.achievements),
    sources: withKeys(w.sources),
    ...(w.quote ? { quote: { text: w.quote.text, sourceLabel: w.quote.source.label, sourceHref: w.quote.source.href } } : {}),
    ...(w.edition ? { edition: w.edition } : {}),
  });
}
console.log("Preparing podcasts…");
for (const [i, p] of PODCASTS.entries()) {
  add({
    _id: `podcast-${p.slug}`,
    _type: "podcast",
    title: p.title,
    slug: slugOf(p.slug),
    date: p.date,
    publishedYear: p.publishedYear,
    duration: p.duration,
    description: p.description,
    youtubeUrl: p.youtubeUrl,
    thumbnail: await image(p.thumbnail, p.title),
    order: i + 1,
  });
}

// ── 6. articles ─────────────────────────────────────────────────────────────
console.log("Preparing articles…");
for (const a of ARTICLES) {
  add({
    _id: `article-${a.slug}`,
    _type: "article",
    title: a.title,
    slug: slugOf(a.slug),
    excerpt: a.excerpt,
    body: a.body,
    category: a.category,
    author: a.author,
    publishDate: a.isoDate,
    readTime: a.readTime,
    image: await image(a.image, a.alt || a.title),
    isTopStory: Boolean(a.isTopStory),
  });
}

// ── 7. Terms and Privacy ────────────────────────────────────────────────────
for (const [kind, page] of [["terms", TERMS], ["privacy", PRIVACY]]) {
  add({
    _id: `legalPage-${kind}`,
    _type: "legalPage",
    kind,
    title: page.title,
    intro: page.intro,
    sections: page.sections.map((s) => ({
      _key: key(),
      title: s.title,
      paragraphs: s.paragraphs.map((p) => (typeof p === "string" ? { _key: key(), text: p } : { _key: key(), ref: p.ref, text: p.text })),
      ...(s.email ? { email: s.email } : {}),
    })),
  });
}

// ── 8. settings, page headings, About page, site text ───────────────────────
const social = Object.fromEntries(SOCIAL.map((s) => [s.key, s.href]));
add({
  _id: "siteSettings",
  _type: "siteSettings",
  siteDescription: DEFAULT_DESCRIPTION,
  email: "info@ciomogulindia.com",
  phone: "+91 95292 03836",
  office: "Mumbai, Maharashtra, India",
  instagram: social.instagram,
  facebook: social.facebook,
  linkedin: social.linkedin,
  x: social.x,
  whatsapp: social.whatsapp,
});
add({
  _id: "pageContent",
  _type: "pageContent",
  ...Object.fromEntries(Object.entries(PAGE_CONTENT).map(([k, v]) => [k, { title: v.title, intro: v.intro }])),
});
add({
  _id: "aboutPage",
  _type: "aboutPage",
  ...about,
  whatWeCover: withKeys(about.whatWeCover),
});
add({
  _id: "siteText",
  _type: "siteText",
  ...Object.fromEntries(
    Object.entries(siteText).map(([group, fields]) => [
      group,
      Object.fromEntries(
        Object.entries(fields).map(([k, v]) => [k, Array.isArray(v) ? withKeys(v) : v])
      ),
    ])
  ),
});

// ── write ───────────────────────────────────────────────────────────────────
const selected = ONLY.length ? docs.filter((d) => ONLY.includes(d._type) || ONLY.includes(d._id)) : docs;
if (ONLY.length && selected.length === 0) {
  console.error(`Nothing matches --only=${ONLY.join(",")}`);
  process.exit(1);
}
const byType = selected.reduce((acc, d) => ((acc[d._type] = (acc[d._type] || 0) + 1), acc), {});
console.log(`\n${selected.length} documents ${ONLY.length ? "selected" : "prepared"}:`);
for (const [t, n] of Object.entries(byType)) console.log(`  ${String(n).padStart(3)}  ${t}`);

if (DRY) {
  const hc = docs.find((d) => d._id === "homepageConfig");
  const name = (r) => docs.find((d) => d._id === r._ref)?.featuredPersonName;
  console.log("\nHome page links:");
  console.log("  Magazine release covers :", hc.releaseCovers.map(name).join(" | "));
  console.log("  Cover stories           :", hc.coverStories.map(name).join(" | "));
  console.log("  Get-featured covers     :", hc.getFeaturedCovers.map(name).join(" | "));
  console.log("\nDry run: nothing was written.");
  process.exit(0);
}

const BATCH = 40;
let written = 0;
for (let i = 0; i < selected.length; i += BATCH) {
  const tx = client.transaction();
  for (const d of selected.slice(i, i + BATCH)) {
    if (FORCE) tx.createOrReplace(d);
    else tx.createIfNotExists(d);
  }
  await tx.commit();
  written += Math.min(BATCH, selected.length - i);
  console.log(`  saved ${written}/${selected.length}`);
}
console.log(
  FORCE
    ? "\nDone. Everything was replaced with the built-in content."
    : "\nDone. Anything that did not already exist was added; existing documents were left alone."
);
console.log(`Open /studio to see it (${projectId} / ${dataset}).`);
