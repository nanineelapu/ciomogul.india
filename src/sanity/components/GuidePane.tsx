import type { CSSProperties } from "react";

// "Start here" page of the Studio: which menu item changes which part of the
// live site. Plain elements with the Studio's own colour variables, so it
// follows light and dark themes.

const ROWS: { page: string; where: string; changes: string }[] = [
  {
    page: "Home page",
    where: "Home page → Magazine strips",
    changes: "Which magazine covers appear in the release block, the cover stories strip and the 'Get featured' block.",
  },
  {
    page: "Home page",
    where: "Home page → Headline ticker, Latest news, Vital updates, Featured articles, Industries, Women leaders, Testimonials",
    changes: "One item per row of the matching block. Add, edit, reorder or delete items.",
  },
  {
    page: "Magazines",
    where: "Magazines → Magazine editions",
    changes: "The archive cards and each edition page: cover, name, quote, PDF.",
  },
  { page: "Podcasts", where: "Podcasts → Episodes", changes: "Episode cards and the YouTube player." },
  { page: "Hall of Fame", where: "Hall of Fame → Inductees", changes: "The roll of honour and each person's page." },
  {
    page: "Women Spotlight",
    where: "Women Spotlight → Profiles",
    changes: "Each profile: photo, story, themes, milestones, sources. 'Under review' shows only a name card.",
  },
  { page: "Articles", where: "Articles → All articles", changes: "Article list, category tabs and each article page." },
  { page: "About", where: "About page", changes: "Every heading, paragraph, panel and button on the About page." },
  {
    page: "Terms and Privacy",
    where: "Terms of Service / Privacy Policy",
    changes: "The full legal text. Edit the sections inside; do not create new documents.",
  },
  {
    page: "Footer, Contact, 404",
    where: "Contact details and links → Site settings",
    changes: "Email, phone, office address, social links and the description Google shows.",
  },
  {
    page: "Top of every list page",
    where: "Whole site → Page headings",
    changes: "The heading and intro paragraph of Magazines, Podcasts, Hall of Fame, Women Spotlight, Articles and Contact.",
  },
  {
    page: "Menus, buttons, small labels",
    where: "Whole site → Site text",
    changes: "Menu names, button words, section titles, form messages and footer wording. Open a group to see its fields.",
  },
];

const box: CSSProperties = {
  border: "1px solid var(--card-border-color)",
  borderRadius: 6,
  padding: "14px 16px",
  marginBottom: 16,
};
const cell: CSSProperties = { padding: "10px 12px", borderTop: "1px solid var(--card-border-color)", verticalAlign: "top" };
const head: CSSProperties = { ...cell, borderTop: "none", textAlign: "left", fontWeight: 600, fontSize: 12 };

export function GuidePane() {
  return (
    <div style={{ padding: 24, maxWidth: 920, color: "var(--card-fg-color)", fontSize: 14, lineHeight: 1.6 }}>
      <h1 style={{ fontSize: 22, margin: "0 0 4px" }}>How to change the website</h1>
      <p style={{ margin: "0 0 20px", color: "var(--card-muted-fg-color)" }}>
        Everything on the live site is edited here. No code is needed.
      </p>

      <div style={box}>
        <b>Four steps</b>
        <ol style={{ margin: "8px 0 0", paddingLeft: 20 }}>
          <li>Pick the page you want to change in the menu on the left (the table below shows which one).</li>
          <li>Edit the text or picture. The grey line under each field says where it appears on the site.</li>
          <li>
            Click <b>Publish</b> (bottom right). Until you publish, nothing changes on the live site.
          </li>
          <li>Refresh the live page. Changes appear within a few minutes, often within seconds.</li>
        </ol>
      </div>

      <div style={{ ...box, padding: 0, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={head}>Live site page</th>
              <th style={head}>Open in the menu</th>
              <th style={head}>What it changes</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.where}>
                <td style={{ ...cell, fontWeight: 600, whiteSpace: "nowrap" }}>{r.page}</td>
                <td style={cell}>{r.where}</td>
                <td style={cell}>{r.changes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={box}>
        <b>Good to know</b>
        <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
          <li>If you clear a text field and publish, the site shows its built-in wording again, never a blank gap.</li>
          <li>Lists (articles, episodes, profiles) are sorted by their Order or date field. Lower numbers come first.</li>
          <li>Pictures: use the crop tool after uploading to choose the focus point.</li>
          <li>To remove something from the site, open it and choose Delete from the three-dot menu. Deleting takes effect straight away.</li>
          <li>Never change a web address (slug) after a page is live.</li>
        </ul>
      </div>
    </div>
  );
}
