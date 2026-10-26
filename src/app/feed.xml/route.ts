// RSS feed of the latest articles. News readers and search engines use it to
// find new articles quickly.
import { getArticles } from "@/lib/data";
import { SITE_NAME, DEFAULT_DESCRIPTION, absoluteUrl } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const xml = (v: string) =>
  v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET() {
  const articles = (await getArticles()).slice(0, 30);

  const items = articles
    .map((a) => {
      const link = xml(absoluteUrl(`/articles/${encodeURIComponent(a.slug)}`));
      const pubDate = a.isoDate ? `<pubDate>${new Date(`${a.isoDate}T00:00:00Z`).toUTCString()}</pubDate>` : "";
      return `<item>
  <title>${xml(a.title)}</title>
  <link>${link}</link>
  <guid isPermaLink="true">${link}</guid>
  ${pubDate}
  <category>${xml(a.category)}</category>
  <description>${xml(a.excerpt)}</description>
</item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${xml(SITE_NAME)}</title>
  <link>${SITE_URL}</link>
  <description>${xml(DEFAULT_DESCRIPTION)}</description>
  <language>en-in</language>
  <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
</channel>
</rss>`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
