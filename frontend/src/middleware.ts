import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LANG, detectLang, homePath, isSiteLang, LANG_COOKIE } from "@/lib/i18n/site";

const PLATFORM_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "bitlink.click",
  "www.bitlink.click",
]);

function isPlatformHost(host: string): boolean {
  if (PLATFORM_HOSTS.has(host)) return true;
  if (host.endsWith(".localhost")) return true;
  if (host.endsWith(".railway.app")) return true;
  if (host.endsWith(".vercel.app")) return true;
  return false;
}

function apiBase(): string {
  return (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000"
  );
}

const BOT_RE =
  /bot|crawl|spider|slurp|mediapartners|facebookexternalhit|embedly|preview|whatsapp|telegram|discord|linkedin|pinterest|lighthouse|headless|curl|wget|python-requests/i;

/** Country of the visitor as reported by the hosting edge / CDN, if any. */
function visitorCountry(request: NextRequest): string | null {
  const h = request.headers;
  return (
    h.get("x-vercel-ip-country") ||
    h.get("cf-ipcountry") ||
    h.get("cloudfront-viewer-country") ||
    h.get("x-appengine-country") ||
    h.get("x-country-code")
  );
}

/**
 * First visit to the English home page: send Portuguese/Spanish speakers to their language.
 * An explicit choice (cookie set by the language switcher) always wins, and crawlers are never
 * redirected so every language version stays indexable on its own URL.
 */
function redirectToLocalizedHome(request: NextRequest): NextResponse | null {
  if (request.nextUrl.pathname !== "/") return null;
  if (request.method !== "GET" && request.method !== "HEAD") return null;

  const saved = request.cookies.get(LANG_COOKIE)?.value;
  let target = DEFAULT_LANG;
  if (isSiteLang(saved)) {
    target = saved;
  } else {
    if (BOT_RE.test(request.headers.get("user-agent") || "")) return null;
    target = detectLang(request.headers.get("accept-language"), visitorCountry(request));
  }
  if (target === DEFAULT_LANG) return null;

  const url = request.nextUrl.clone();
  url.pathname = homePath(target);
  const res = NextResponse.redirect(url, 307);
  // The answer depends on request headers: never let a shared cache serve it to someone else.
  res.headers.set("Vary", "Accept-Language, Cookie");
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export async function middleware(request: NextRequest) {
  const rawHost = request.headers.get("host") || "";
  const host = rawHost.split(":")[0].toLowerCase();
  if (!host || isPlatformHost(host)) {
    return redirectToLocalizedHome(request) ?? NextResponse.next();
  }

  // Only rewrite document navigations for the profile root (and keep assets intact).
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  try {
    const res = await fetch(`${apiBase()}/api/v1/public/by-domain/${encodeURIComponent(host)}`, {
      headers: { Accept: "application/json" },
      // Avoid caching failed lookups forever in edge.
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.next();
    }
    const data = (await res.json()) as { username?: string };
    if (!data.username) {
      return NextResponse.next();
    }
    const url = request.nextUrl.clone();
    // Serve the public profile at the domain root; keep deeper paths as-is under username.
    if (pathname === "/" || pathname === "") {
      url.pathname = `/${data.username}`;
    } else if (!pathname.startsWith(`/${data.username}`)) {
      url.pathname = `/${data.username}${pathname}`;
    }
    return NextResponse.rewrite(url);
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
