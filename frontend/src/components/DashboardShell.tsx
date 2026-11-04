"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastProvider } from "@/components/Toast";
import { clearTokens, getAccessToken } from "@/lib/auth";
import { authApi, profileApi } from "@/lib/api";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/links", label: "Links" },
  { href: "/dashboard/appearance", label: "Appearance" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    Promise.all([profileApi.get(token), authApi.me(token)])
      .then(([p, user]) => {
        setUsername(p.username);
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
      <div className="flex min-h-screen items-center justify-center text-sm text-ink/50">
        Loading…
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
        <aside className="border-b border-ink/10 bg-white/70 backdrop-blur md:border-b-0 md:border-r">
          <div className="flex items-center justify-between px-5 py-5 md:block">
            <Link href="/dashboard" className="font-display text-xl font-bold text-ink">
              Bitlink
            </Link>
            <button
              className="text-sm text-ink/50 md:mt-6 md:block"
              onClick={() => {
                clearTokens();
                router.push("/login");
              }}
            >
              Log out
            </button>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-6">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active ? "bg-ink text-white" : "text-ink/70 hover:bg-ink/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {isSuperuser && (
              <Link
                href="/admin"
                className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-accent hover:bg-accent/10"
              >
                Admin
              </Link>
            )}
          </nav>
          {username && (
            <div className="hidden px-5 pb-6 md:block">
              <a
                href={`/${username}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-accent hover:underline"
              >
                bitlink/{username} ↗
              </a>
            </div>
          )}
        </aside>
        <main className="px-5 py-8 md:px-10">{children}</main>
      </div>
    </ToastProvider>
  );
}
