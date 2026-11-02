import { Fragment } from "react";

// Plain paragraphs typed in Sanity, with two light touches an editor can use:
// **words** become bold, and a paragraph starting with "## " becomes a heading.
function withBold(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>
  );
}

export default function RichParagraphs({ paragraphs }: { paragraphs: string[] }) {
  return (
    <>
      {paragraphs
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) =>
          p.startsWith("## ") ? <h2 key={i}>{withBold(p.slice(3))}</h2> : <p key={i}>{withBold(p)}</p>
        )}
    </>
  );
}
