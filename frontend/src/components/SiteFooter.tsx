import Link from "next/link";
import { BitlinkLogo } from "@/components/BitlinkLogo";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/#product", label: "Link in bio" },
      { href: "/#how", label: "Short links & QR" },
      { href: "/#faq", label: "FAQ" },
      { href: "/register", label: "Sign up free" },
      { href: "/login", label: "Log in" },
    ],
  },
  {
    title: "Guides",
    links: [
      { href: "/blog/what-is-a-link-in-bio", label: "What is a link in bio" },
      { href: "/blog/how-to-add-multiple-links-on-instagram", label: "Multiple links on Instagram" },
      { href: "/blog/what-are-utm-parameters", label: "UTM parameters" },
            { href: "/blog/bitlink-vs-linktree", label: "Bitlink vs Linktree" },
      { href: "/blog/bitlink-vs-bitly", label: "Bitlink vs Bitly" },
    ],
  },
  {
    title: "Blog",
    links: [
      { href: "/blog", label: "All articles" },
      { href: "/blog/category/news", label: "News" },
      { href: "/blog/link-in-bio-glossary", label: "Glossary" },
      { href: "/es/blog", label: "Blog en español" },
      { href: "/es/blog/que-es-un-link-en-bio", label: "Qué es un link en bio" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#1a1a1a] px-5 py-12 text-white md:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <BitlinkLogo onDark height={26} />
          <p className="mt-4 max-w-xs text-sm text-white/55">
            Link in bio + short links, free forever. No plans, no monthly caps.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="text-xs font-bold uppercase tracking-wider text-white/40">{col.title}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/65 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-xs text-white/35">
        © {new Date().getFullYear()} Bitlink · Example pages and photos are for illustration.
      </p>
    </footer>
  );
}
