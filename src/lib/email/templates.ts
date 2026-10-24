// HTML emails for the contact form, in the website's light theme: white page,
// white card, dark text, and navy only as an accent. Email programs ignore most
// CSS, so these use tables, inline styles, and fonts every program has
// (Georgia for headings, Arial for text).
import { SITE_URL } from "@/lib/site";
import { SOCIAL } from "@/data/social";

const WHITE = "#ffffff";
const PAPER = "#F4F6F9";
const NAVY = "#0B1F3A";
const INK = "#141414";
const INK_2 = "#3A3A3A";
const MUTED = "#6B6B6B";
const RULE = "#E3E7EE";

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Arial, Helvetica, sans-serif";

// Anything a visitor typed must be escaped before it goes into HTML.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const withBreaks = (value: string) => escapeHtml(value).replace(/\r?\n/g, "<br>");

const siteHost = SITE_URL.replace(/^https?:\/\//, "");

function layout(opts: {
  preheader: string;
  title: string;
  body: string;
  button?: { label: string; href: string };
  footerNote?: string;
}) {
  const button = opts.button
    ? `<tr><td style="padding:4px 40px 40px;">
         <a href="${opts.button.href}" style="display:inline-block;background:${NAVY};color:${WHITE};font-family:${SANS};font-size:13px;font-weight:bold;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;padding:15px 30px;">${escapeHtml(opts.button.label)}</a>
       </td></tr>`
    : `<tr><td style="padding:0 40px 24px;font-size:0;line-height:0;">&nbsp;</td></tr>`;

  const social = SOCIAL.filter((s) => s.key !== "whatsapp")
    .map((s) => `<a href="${s.href}" style="color:${NAVY};text-decoration:none;font-weight:bold;">${escapeHtml(s.label)}</a>`)
    .join(`<span style="color:${RULE};">&nbsp;&nbsp;|&nbsp;&nbsp;</span>`);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:${WHITE};">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;color:${WHITE};">${escapeHtml(opts.preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${WHITE};padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${WHITE};border:1px solid ${RULE};">
        <tr><td style="padding:34px 40px 22px;">
          <div style="font-family:${SERIF};font-size:24px;font-weight:bold;line-height:1.2;color:${INK};letter-spacing:.01em;">CIO Mogul India</div>
          <div style="font-family:${SANS};font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:${MUTED};margin-top:6px;">Magazine</div>
        </td></tr>
        <tr><td style="padding:0 40px;"><div style="height:2px;background:${NAVY};line-height:2px;font-size:0;">&nbsp;</div></td></tr>
        <tr><td style="padding:34px 40px 8px;">
          <h1 style="margin:0 0 20px;font-family:${SERIF};font-size:28px;line-height:1.25;font-weight:bold;color:${INK};">${escapeHtml(opts.title)}</h1>
          ${opts.body}
        </td></tr>
        ${button}
        <tr><td style="padding:24px 40px 30px;border-top:1px solid ${RULE};font-family:${SANS};font-size:12px;line-height:1.7;color:${MUTED};">
          <div style="margin-bottom:10px;">${social}</div>
          CIO Mogul India &middot; Digital magazine and media platform for technology leaders in India.<br>
          <a href="${SITE_URL}" style="color:${NAVY};">${siteHost}</a>
          ${opts.footerNote ? `<div style="margin-top:14px;padding-top:14px;border-top:1px solid ${RULE};">${opts.footerNote}</div>` : ""}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const paragraph = (html: string) =>
  `<p style="margin:0 0 18px;font-family:${SANS};font-size:15px;line-height:1.75;color:${INK_2};">${html}</p>`;

const quoteBox = (label: string, html: string) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 22px;">
     <tr><td style="background:${PAPER};border-left:3px solid ${NAVY};padding:18px 20px;">
       <div style="font-family:${SANS};font-size:10px;font-weight:bold;letter-spacing:.2em;text-transform:uppercase;color:${MUTED};margin-bottom:10px;">${escapeHtml(label)}</div>
       <div style="font-family:${SANS};font-size:14px;line-height:1.75;color:${INK};">${html}</div>
     </td></tr>
   </table>`;

type Submission = { name: string; email: string; subject: string; message: string };

// Sent to the person who filled in the form.
export function confirmationEmail(s: Submission) {
  const first = s.name.split(/\s+/)[0] || s.name;
  const html = layout({
    preheader: "We have received your message and will get back to you shortly.",
    title: `Thank you, ${first}.`,
    body:
      paragraph("We have received your message. Our editorial team will read it and get back to you shortly.") +
      quoteBox(`Your message  /  ${s.subject}`, withBreaks(s.message)) +
      paragraph("If you did not send this message, you can safely ignore this email."),
    button: { label: "Visit CIO Mogul India", href: SITE_URL },
  });

  const text = `Thank you, ${first}.\n\nWe have received your message. Our editorial team will read it and get back to you shortly.\n\nYour message (${s.subject}):\n${s.message}\n\nIf you did not send this message, you can safely ignore this email.\n\nCIO Mogul India - ${SITE_URL}`;

  return { subject: "We have received your message | CIO Mogul India", html, text };
}

// Sent to the team inbox.
export function notificationEmail(s: Submission) {
  const row = (label: string, value: string) =>
    `<tr>
       <td style="padding:11px 0;border-bottom:1px solid ${RULE};font-family:${SANS};font-size:10px;font-weight:bold;letter-spacing:.2em;text-transform:uppercase;color:${MUTED};width:92px;vertical-align:top;">${label}</td>
       <td style="padding:11px 0;border-bottom:1px solid ${RULE};font-family:${SANS};font-size:15px;color:${INK};">${value}</td>
     </tr>`;

  const html = layout({
    preheader: `New message from ${s.name}: ${s.subject}`,
    title: "New message from the website",
    body:
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px;border-top:1px solid ${RULE};">` +
      row("Name", escapeHtml(s.name)) +
      row("Email", `<a href="mailto:${escapeHtml(s.email)}" style="color:${NAVY};">${escapeHtml(s.email)}</a>`) +
      row("Subject", escapeHtml(s.subject)) +
      `</table>` +
      quoteBox("Message", withBreaks(s.message)) +
      paragraph("Press Reply to answer this person directly."),
  });

  const text = `New message from the website\n\nName: ${s.name}\nEmail: ${s.email}\nSubject: ${s.subject}\n\n${s.message}`;

  return { subject: `[Website contact] ${s.subject}`, html, text };
}

// Sent to someone who has just joined the newsletter.
export function welcomeEmail(unsubscribe: string | null) {
  const html = layout({
    preheader: "You're on the list. New editions, news and podcasts, once a week.",
    title: "Welcome to the newsletter.",
    body:
      paragraph("Thank you for subscribing to CIO Mogul India. Once a week, we will send you new editions, news and podcasts for India's technology and business leaders.") +
      paragraph("Until then, you can browse the latest magazine editions and episodes on the website."),
    button: { label: "Read the latest edition", href: `${SITE_URL}/magazines` },
    footerNote: unsubscribe
      ? `You are receiving this because you subscribed on our website. <a href="${unsubscribe}" style="color:${NAVY};">Unsubscribe</a>`
      : "You are receiving this because you subscribed on our website.",
  });

  const text = `Welcome to the newsletter.\n\nThank you for subscribing to CIO Mogul India. Once a week, we will send you new editions, news and podcasts for India's technology and business leaders.\n\nRead the latest edition: ${SITE_URL}/magazines\n${unsubscribe ? `\nUnsubscribe: ${unsubscribe}\n` : ""}`;

  return { subject: "Welcome to the CIO Mogul India newsletter", html, text };
}
