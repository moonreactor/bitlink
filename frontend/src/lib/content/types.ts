/**
 * Content model for the Bitlink blog (/blog).
 *
 * Inline text in any `text` / `items` string supports a tiny markup:
 *   **bold**   *italic*   [label](/internal-or-https-url)   `code`
 */

export type Lang = "en" | "es" | "pt";

export type CategoryId = "novedades" | "guias" | "comparativas" | "casos-de-uso";

export type Category = {
  id: CategoryId;
  /** URL segment for this language (/blog/category/{slug}, /es/blog/categoria/{slug}, /pt/blog/categoria/{slug}) */
  slug: string;
  name: string;
  /** Plural label used in headings ("Guías", "Novedades") */
  title: string;
  description: string;
};

export type Block =
  | { type: "h2"; text: string; id?: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; caption?: string; head: string[]; rows: string[][] }
  | { type: "callout"; tone?: "tip" | "note" | "warn"; title?: string; text: string }
  /** Numbered how-to steps — also emitted as HowTo structured data. */
  | { type: "steps"; name: string; items: { title: string; text: string }[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "cta"; title?: string; text?: string; href?: string; label?: string };

export type Faq = { q: string; a: string };

export type Article = {
  lang: Lang;
  /** Shared id across translations — used for hreflang alternates. */
  key: string;
  slug: string;
  category: CategoryId;
  /** On-page H1 */
  title: string;
  /** <title> override (≤ 60 chars ideally). Falls back to title. */
  seoTitle?: string;
  /** Meta description (≤ 155 chars ideally) */
  description: string;
  /** ISO date YYYY-MM-DD */
  published: string;
  updated?: string;
  keywords: string[];
  /** Answer-first summary shown at the top — written to be quoted by AI answers. */
  tldr: string;
  takeaways: string[];
  cover: { src: string; alt: string };
  body: Block[];
  faqs: Faq[];
  related?: string[];
};
