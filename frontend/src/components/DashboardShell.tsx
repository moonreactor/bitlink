"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BitlinkLogo } from "@/components/BitlinkLogo";
import { ToastProvider, useToast } from "@/components/Toast";
import { clearTokens, getAccessToken } from "@/lib/auth";
import { authApi, profileApi } from "@/lib/api";
import { copyPageUrl, displayPageUrl, sharePage } from "@/lib/share";

const NAV = [
  { href: "/dashboard", label: "Home", icon: OverviewIcon },
  { href: "/dashboard/links", label: "Links", icon: LinksIcon },
  { href: "/dashboard/appearance", label: "Design", icon: AppearIcon },
  { href: "/dashboard/products", label: "Products", icon: ProductsIcon },
  { href: "/dashboard/short-links", label: "Short links", icon: ShortIcon },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

/** Bottom tab bar (mobile): the three most frequent destinations + Add + More. */
const TAB_PRIMARY = NAV.slice(0, 3);
const TAB_MORE = NAV.slice(3);

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ShellInner>{children}</ShellInner>
    </ToastProvider>
  );
}

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [username, setUsername] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [ready, setReady] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

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

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen]);

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

  async function onShare() {
    if (!username) return;
    const res = await sharePage(username, displayName);
    if (res === "copied") success("Link copied — paste it in your bio");
    else if (res === "failed") toastError("Couldn’t share — copy the link manually");
  }

  async function onCopy() {
    if (!username) return;
    if (await copyPageUrl(username)) success("Link copied");
    else toastError("Couldn’t copy the link");
  }

  function logout() {
    clearTokens();
    router.push("/login");
  }

  function onAddClick(e: React.MouseEvent) {
    // Already on the editor: open the composer in place instead of navigating.
    if (pathname.startsWith("/dashboard/links")) {
      e.preventDefault();
      window.dispatchEvent(new Event("bitlink:add-link"));
    }
  }

  return (
    <div className="min-h-screen bg-meetup-bg">
      <header className="sticky top-0 z-40 border-b border-meetup-border bg-white/90 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-2.5 md:gap-4 md:px-6">
          <BitlinkLogo href="/dashboard" className="shrink-0" height={26} />

          {username && (
            <div className="mx-auto hidden max-w-md flex-1 md:block">
              <div className="flex items-center gap-2 rounded-full border border-meetup-border bg-white py-1.5 pl-4 pr-1.5 text-sm shadow-sm">
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />
                <span className="min-w-0 flex-1 truncate font-medium text-ink">
                  {displayPageUrl(username)}
                </span>
                <button
                  type="button"
                  onClick={onCopy}
                  className="rounded-full bg-mist px-3 py-1.5 text-xs font-semibold text-ink hover:bg-meetup-lavender hover:text-meetup-purple"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            {username && (
              <a
                href={`/${username}`}
                target="_blank"
                rel="noreferrer"
                className="hidden min-h-[40px] items-center rounded-full border border-meetup-border bg-white px-4 text-sm font-semibold text-ink hover:bg-mist sm:inline-flex"
              >
                View page
              </a>
            )}
            <button
              type="button"
              onClick={onShare}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-black px-4 text-sm font-semibold text-white hover:bg-ink"
            >
              <ShareIcon />
              Share
            </button>
            <div
              className="hidden h-9 w-9 items-center justify-center rounded-full bg-meetup-lavender text-xs font-bold text-meetup-purple md:flex"
              title={displayName}
            >
              {initials || "U"}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-6 px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-5 md:grid-cols-[240px_1fr] md:px-6 md:py-8">
        {/* Sidebar (desktop) */}
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
              <Link
                href="/dashboard/links?add=1"
                onClick={onAddClick}
                className="mu-btn-primary mt-4 w-full gap-1.5"
              >
                <PlusIcon /> Add link
              </Link>
            </div>

            <nav className="mu-card p-2" aria-label="Dashboard">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-meetup-lavender text-meetup-purple"
                        : "text-meetup-muted hover:bg-mist hover:text-ink"
                    }`}
                  >
                    <Icon />
                    <span className="flex-1">{item.label}</span>
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
                onClick={logout}
              >
                <LogoutIcon />
                Log out
              </button>
            </nav>
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>

      {/* Bottom tab bar (mobile) — primary nav lives in the thumb zone */}
      <nav
        aria-label="Dashboard"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-meetup-border bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        <div className="mx-auto grid h-16 max-w-md grid-cols-5 items-stretch px-1">
          {TAB_PRIMARY.slice(0, 2).map((item) => (
            <TabLink key={item.href} item={item} active={isActive(pathname, item.href)} />
          ))}
          <div className="flex items-center justify-center">
            <Link
              href="/dashboard/links?add=1"
              onClick={onAddClick}
              aria-label="Add link"
              className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-meetup-lg ring-4 ring-white transition active:scale-95"
            >
              <PlusIcon size={24} />
            </Link>
          </div>
          <TabLink item={TAB_PRIMARY[2]} active={isActive(pathname, TAB_PRIMARY[2].href)} />
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            aria-expanded={moreOpen}
            className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
              TAB_MORE.some((i) => isActive(pathname, i.href)) ? "text-meetup-purple" : "text-meetup-muted"
            }`}
          >
            <MenuIcon />
            More
          </button>
        </div>
      </nav>

      {/* "More" bottom sheet (mobile) */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/40 md:hidden"
          onClick={() => setMoreOpen(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="More"
            className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-meetup-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-meetup-border" aria-hidden />
            <div className="mb-3 flex items-center gap-3 px-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-meetup-lavender text-sm font-bold text-meetup-purple">
                {initials || "U"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">{displayName}</p>
                {username && (
                  <p className="truncate text-xs text-meetup-muted">{displayPageUrl(username)}</p>
                )}
              </div>
            </div>
            <ul className="space-y-1">
              {username && (
                <li>
                  <a
                    href={`/${username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-[48px] items-center gap-3 rounded-xl px-3 text-[15px] font-semibold text-ink active:bg-mist"
                  >
                    <EyeIcon /> View my page
                  </a>
                </li>
              )}
              {TAB_MORE.map((item) => {
                const Icon = item.icon;
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex min-h-[48px] items-center gap-3 rounded-xl px-3 text-[15px] font-semibold ${
                        active ? "bg-meetup-lavender text-meetup-purple" : "text-ink active:bg-mist"
                      }`}
                    >
                      <Icon /> {item.label}
                    </Link>
                  </li>
                );
              })}
              {isSuperuser && (
                <li>
                  <Link
                    href="/admin"
                    className="flex min-h-[48px] items-center gap-3 rounded-xl px-3 text-[15px] font-semibold text-meetup-purple"
                  >
                    <AdminIcon /> Admin
                  </Link>
                </li>
              )}
              <li className="border-t border-meetup-border pt-1">
                <button
                  type="button"
                  onClick={logout}
                  className="flex min-h-[48px] w-full items-center gap-3 rounded-xl px-3 text-[15px] font-semibold text-meetup-muted active:bg-mist"
                >
                  <LogoutIcon /> Log out
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function TabLink({
  item,
  active,
}: {
  item: (typeof NAV)[number];
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
        active ? "text-meetup-purple" : "text-meetup-muted"
      }`}
    >
      <Icon />
      {item.label}
    </Link>
  );
}

function PlusIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 15V3m0 0L8 7m4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
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

function ShortIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 7h6a5 5 0 0 1 0 10H9" strokeLinecap="round" />
      <path d="M11 12H4m0 0 2.5-2.5M4 12l2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 12h7m0 0-2.5-2.5M20 12l-2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProductsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" strokeLinejoin="round" />
      <path d="M8 7V5a4 4 0 0 1 8 0v2" strokeLinecap="round" />
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
