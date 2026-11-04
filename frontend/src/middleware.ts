import { NextRequest, NextResponse } from "next/server";

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

export async function middleware(request: NextRequest) {
  const rawHost = request.headers.get("host") || "";
  const host = rawHost.split(":")[0].toLowerCase();
  if (!host || isPlatformHost(host)) {
    return NextResponse.next();
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
