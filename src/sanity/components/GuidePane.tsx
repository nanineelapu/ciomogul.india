import type { CSSProperties } from "react";

// "Start here" page of the Studio: which menu item changes which part of the
// live site. Plain elements with the Studio's own colour variables, so it
// follows light and dark themes.

const ROWS: { page: string; where: string; changes: string }[] = [
  { page: "Home page", where: "1. Home page", changes: "Each section in order: headline ticker, magazine covers, industries, latest news, vital updates, featured articles, women leaders and testimonials." },
  { page: "Magazines", where: "2. Magazines", changes: "Each edition: cover, name, headline and PDF." },
  { page: "Hall of Fame", where: "3. Hall of Fame", changes: "Each inductee and their profile page." },
  { page: "Women Spotlight", where: "4. Women Spotlight", changes: "Each profile: photo, story, themes and sources." },
  { page: "Podcasts", where: "5. Podcasts", changes: "Each episode and its YouTube link." },
  { page: "Articles", where: "6. Articles", changes: "Each article and its category." },
  { page: "About Us", where: "7. About Us", changes: "Every heading, paragraph and button on the page." },
  { page: "Contact Us", where: "8. Contact Us: details and social links", changes: "Email, phone, WhatsApp, office and social links. They also appear in the top menu and footer." },
  { page: "Terms and Privacy", where: "9. Terms and Privacy", changes: "The full legal text, section by section." },
  { page: "Title at the top of a page", where: "Page titles and intros", changes: "The big title and the line under it on Magazines, Hall of Fame, Women Spotlight, Podcasts, Articles and Contact Us." },
  { page: "Menu, buttons and footer", where: "Menus, buttons and labels", changes: "Menu names, button words, section headings and footer text. One tab per page, in the same order as the website." },
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
