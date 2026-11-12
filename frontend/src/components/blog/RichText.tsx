import Link from "next/link";
import type { ReactNode } from "react";

const TOKEN = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`)/g;

/** Renders the blog's tiny inline markup: **bold**, *italic*, [label](href), `code`. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => renderPart(part, i))}
    </>
  );
}

function renderPart(part: string, key: number): ReactNode {
  if (part.startsWith("**") && part.endsWith("**")) {
    return (
      <strong key={key} className="font-bold text-ink">
        {part.slice(2, -2)}
      </strong>
    );
  }
  if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
    return <em key={key}>{part.slice(1, -1)}</em>;
  }
  if (part.startsWith("`") && part.endsWith("`")) {
    return (
      <code key={key} className="rounded-md bg-mist px-1.5 py-0.5 font-mono text-[0.9em] text-ink">
        {part.slice(1, -1)}
      </code>
    );
  }
  const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
  if (link) {
    const [, label, href] = link;
    const cls = "font-semibold text-meetup-purple underline decoration-meetup-purple/30 underline-offset-2 hover:decoration-meetup-purple";
    if (href.startsWith("/")) {
      return (
        <Link key={key} href={href} className={cls}>
          {label}
        </Link>
      );
    }
    return (
      <a key={key} href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }
  return part;
}

/** Strips inline markup — for meta tags, JSON-LD and llms.txt. */
export function plain(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*\s][^*]*)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1");
}

/** Converts inline markup to Markdown with absolute links — for llms-full.txt. */
export function toMarkdown(text: string, origin: string): string {
  return text.replace(/\[([^\]]+)\]\((\/[^)]*)\)/g, (_m, label, href) => `[${label}](${origin}${href})`);
}
