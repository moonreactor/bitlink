"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BitlinkLogo } from "@/components/BitlinkLogo";
import { ToastProvider } from "@/components/Toast";
import { clearTokens, getAccessToken } from "@/lib/auth";
import { authApi, profileApi } from "@/lib/api";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: OverviewIcon },
  { href: "/dashboard/links", label: "Links", icon: LinksIcon },
  { href: "/dashboard/appearance", label: "Appearance", icon: AppearIcon },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [ready, setReady] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    Promise.all([profileApi.get(token), authApi.me(token)])
      .then(([p, user]) => {
        setUsername(p.username);
        setDisplayName(p.display_name || p.username);
        setIsSuperuser(user.is_superuser);
        setReady(true);
      })
      .catch(() => {
        clearTokens();
        router.replace("/login");
      });
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-meetup-bg text-sm text-meetup-muted">
        Loading…
      </div>
    );
  }

  const initials = displayName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <ToastProvider>
      <div className="min-h-screen bg-meetup-bg">
        {/* Top bar — Meetup style */}
        <header className="sticky top-0 z-40 border-b border-meetup-border bg-white">
          <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-2.5 md:gap-4 md:px-6">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-mist md:hidden"
              aria-label="Open menu"
              onClick={() => setMobileNav(true)}
            >
              <MenuIcon />
            </button>

            <BitlinkLogo href="/dashboard" className="shrink-0" height={26} />

            <div className="mx-auto hidden max-w-xl flex-1 md:block">
              <div className="flex items-center rounded-full border border-meetup-border bg-white px-4 py-2 text-sm shadow-sm">
                <span className="text-meetup-muted">Search links…</span>
                <span className="mx-3 h-4 w-px bg-meetup-border" />
                <span className="flex-1 truncate text-meetup-muted">
                  {username ? `bitlink.app/${username}` : "your page"}
                </span>
                <span className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                  <SearchIcon />
                </span>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              {username && (
                <a
                  href={`/${username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mu-btn-secondary hidden sm:inline-flex"
                >
                  View page
                </a>
              )}
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full bg-meetup-lavender text-xs font-bold text-meetup-purple"
                title={displayName}
              >
                {initials || "U"}
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-6 md:grid-cols-[240px_1fr] md:px-6 md:py-8">
          {/* Sidebar card */}
          <aside className="hidden md:block">
            <div className="sticky top-[4.5rem] space-y-4">
              <div className="mu-card p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-meetup-lavender text-sm font-bold text-meetup-purple">
                    {initials || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink">{displayName}</p>
                    {username && (
                      <p className="truncate text-xs text-meetup-muted">@{username}</p>
                    )}
                  </div>
                </div>
              </div>

              <nav className="mu-card p-2">
                {NAV.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                        active
                          ? "bg-meetup-lavender text-meetup-purple"
                          : "text-meetup-muted hover:bg-mist hover:text-ink"
                      }`}
                    >
                      <Icon />
                      <span className="flex-1">{item.label}</span>
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-meetup-purple" aria-hidden />
                      )}
                    </Link>
                  );
                })}
                {isSuperuser && (
                  <Link
                    href="/admin"
                    className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-meetup-purple hover:bg-meetup-lavender"
                  >
                    <AdminIcon />
                    Admin
                  </Link>
                )}
                <div className="my-2 border-t border-meetup-border" />
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-meetup-muted hover:bg-mist hover:text-ink"
                  onClick={() => {
                    clearTokens();
                    router.push("/login");
                  }}
                >
                  <LogoutIcon />
                  Log out
                </button>
              </nav>
            </div>
          </aside>

          <main className="min-w-0">{children}</main>
        </div>

        {/* Mobile drawer */}
        {mobileNav && (
          <div
            className="fixed inset-0 z-50 bg-ink/40 md:hidden"
            onClick={() => setMobileNav(false)}
          >
            <div
              className="absolute left-0 top-0 h-full w-[280px] bg-meetup-bg p-4 shadow-meetup-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display text-lg font-bold">Menu</span>
                <button
                  type="button"
                  className="rounded-full bg-white px-3 py-1 text-sm font-semibold"
                  onClick={() => setMobileNav(false)}
                >
                  Close
                </button>
              </div>
              <nav className="mu-card space-y-1 p-2">
                {NAV.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileNav(false)}
                      className={`block rounded-xl px-3 py-2.5 text-sm font-semibold ${
                        active ? "bg-meetup-lavender text-meetup-purple" : "text-ink"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                {isSuperuser && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileNav(false)}
                    className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-meetup-purple"
                  >
                    Admin
                  </Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </ToastProvider>
  );
}

function OverviewIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 19V5M4 19h16M8 16V9m4 7V7m4 9v-5" strokeLinecap="round" />
    </svg>
  );
}

function LinksIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        d="M10 14a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L11 6"
        strokeLinecap="round"
      />
      <path
        d="M14 10a5 5 0 0 0-7.07 0L4.8 12.12a5 5 0 0 0 7.07 7.07L13 18"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AppearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6l1.4 1.4m10 10 1.4 1.4m0-12.8-1.4 1.4m-10 10-1.4 1.4" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path
        d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 4 7v5c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V7l-8-4z" strokeLinejoin="round" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5" strokeLinecap="round" />
      <path d="M15 12H8m7 0 3-3m-3 3 3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
