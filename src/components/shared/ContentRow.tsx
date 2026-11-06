import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import RichParagraphs from "@/components/magazines/RichParagraphs";

// A list item laid out as a wide row: the cover on the left; on the right a small
// label, the title, a line of detail, a short description and the buttons.
// Used by the Magazines and Hall of Fame pages.
export default function ContentRow({
  href,
  image,
  alt,
  label,
  title,
  meta,
  text,
  actions,
  priority = false,
}: {
  href: string;
  image: string;
  alt: string;
  label?: string;
  title: string;
  meta?: string;
  text?: string;
  actions: ReactNode;
  priority?: boolean;
}) {
  const firstParagraph = text?.split(/\n\s*\n/)[0];
  return (
    <article className="crow">
      <Link href={href} className="crow__cover" aria-label={title}>
        <Image src={image} alt={alt} width={713} height={1009} priority={priority} sizes="(max-width: 720px) 60vw, 260px" />
      </Link>
      <div className="crow__body">
        {label && <p className="crow__label">{label}</p>}
        <h3 className="crow__title">
          <Link href={href}>{title}</Link>
        </h3>
        {meta && <p className="crow__meta">{meta}</p>}
        {firstParagraph && (
          <div className="crow__text">
            <RichParagraphs paragraphs={[firstParagraph]} />
          </div>
        )}
        <div className="crow__actions">{actions}</div>
      </div>
    </article>
  );
}

/** A heading followed by a short line, like "Cover Story ———". */
export function RowHead({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <div className="rowhead" id={id}>
      <h2 className="rowhead__title">{children}</h2>
      <span className="rowhead__line" aria-hidden />
    </div>
  );
}
