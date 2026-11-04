"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BitlinkLogo } from "@/components/BitlinkLogo";
import { ToastProvider } from "@/components/Toast";
import { authApi } from "@/lib/api";
import { clearTokens, getAccessToken } from "@/lib/auth";

const NAV = [
  { href: "/admin", label: "Metrics" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/links", label: "Links" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    authApi
      .me(token)
      .then((user) => {
        if (!user.is_superuser) {
          router.replace("/dashboard");
          return;
        }
        setEmail(user.email);
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
        Loading admin…
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
        <aside className="border-b border-ink/10 bg-[#0b1220] text-white md:border-b-0 md:border-r md:border-ink/10">
          <div className="flex items-center justify-between px-5 py-5 md:block">
            <div>
              <BitlinkLogo href="/admin" onDark height={26} />
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300/90">
                Superuser
              </p>
            </div>
            <button
              className="text-sm text-white/50 md:mt-6 md:block"
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
              const active =
                item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active ? "bg-white text-ink" : "text-white/70 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="hidden space-y-3 px-5 pb-6 md:block">
            <Link href="/dashboard" className="block text-xs font-medium text-white/55 hover:text-white">
              ← Back to dashboard
            </Link>
            {email && <p className="truncate text-xs text-white/35">{email}</p>}
          </div>
        </aside>
        <main className="px-5 py-8 md:px-10">{children}</main>
      </div>
    </ToastProvider>
  );
}
