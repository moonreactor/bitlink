"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { AdminMetrics } from "@/lib/types";

export default function AdminMetricsPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    adminApi
      .metrics(token)
      .then(setMetrics)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load metrics"));
  }, []);

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!metrics) {
    return <p className="text-sm text-ink/50">Loading metrics…</p>;
  }

  const maxDaily = Math.max(1, ...metrics.daily.map((d) => Math.max(d.views, d.clicks, d.users)));

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Platform metrics</h1>
        <p className="mt-1 text-sm text-ink/55">Overview of users, traffic and engagement across Bitlink.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Users" value={metrics.total_users} hint={`${metrics.active_users} active`} />
        <StatCard label="Links" value={metrics.total_links} hint={`${metrics.active_links} active`} />
        <StatCard label="Page views" value={metrics.total_views} hint={`${metrics.views_7d} last 7d`} />
        <StatCard label="Link clicks" value={metrics.total_clicks} hint={`${metrics.clicks_7d} last 7d`} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="New users (7d)" value={metrics.new_users_7d} />
        <StatCard label="New users (30d)" value={metrics.new_users_30d} />
        <StatCard label="Subscribers" value={metrics.total_subscribers} />
        <StatCard label="Superusers" value={metrics.superusers} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Create CTA clicks"
          value={metrics.cta_clicks_total}
          hint={`${metrics.cta_clicks_7d} last 7d`}
        />
        <StatCard
          label="Referred signups"
          value={metrics.referred_signups_total}
          hint={`${metrics.referred_signups_7d} last 7d`}
        />
      </div>

      {(metrics.top_referral_sources || []).length > 0 && (
        <section className="rounded-2xl border border-ink/10 bg-white/70 p-5 backdrop-blur">
          <h2 className="font-display text-lg font-semibold">Growth sources</h2>
          <p className="mt-1 text-sm text-ink/55">
            Profiles whose “Create your Bitlink” CTA drove clicks and signups.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/45">
                <tr>
                  <th className="py-2 pr-3 font-medium">Profile</th>
                  <th className="py-2 pr-3 font-medium">CTA clicks</th>
                  <th className="py-2 font-medium">Signups</th>
                </tr>
              </thead>
              <tbody>
                {metrics.top_referral_sources.map((row) => (
                  <tr key={row.username} className="border-t border-ink/5">
                    <td className="py-2.5 pr-3">
                      <a
                        href={`/${row.username}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-meetup-purple hover:underline"
                      >
                        @{row.username}
                      </a>
                    </td>
                    <td className="py-2.5 pr-3 tabular-nums">{row.cta_clicks}</td>
                    <td className="py-2.5 tabular-nums font-semibold">{row.signups}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-ink/10 bg-white/70 p-5 backdrop-blur">
        <h2 className="font-display text-lg font-semibold">Last 30 days</h2>
        <div className="mt-5 flex h-40 items-end gap-1">
          {metrics.daily.map((day) => (
            <div key={day.date} className="group relative flex flex-1 flex-col justify-end gap-0.5">
              <div
                className="rounded-t bg-accent/80 transition group-hover:bg-accent"
                style={{ height: `${(day.views / maxDaily) * 100}%`, minHeight: day.views ? 2 : 0 }}
                title={`${day.date}: ${day.views} views`}
              />
              <div
                className="rounded-t bg-ink/25 transition group-hover:bg-ink/40"
                style={{ height: `${(day.clicks / maxDaily) * 100}%`, minHeight: day.clicks ? 2 : 0 }}
                title={`${day.date}: ${day.clicks} clicks`}
              />
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-4 text-xs text-ink/50">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-accent/80" /> Views
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-ink/25" /> Clicks
          </span>
        </div>
      </section>

      <section className="rounded-2xl border border-ink/10 bg-white/70 p-5 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold">Top profiles</h2>
          <Link href="/admin/users" className="text-xs font-medium text-accent hover:underline">
            View all users
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-ink/45">
              <tr>
                <th className="pb-2 font-medium">Profile</th>
                <th className="pb-2 font-medium">Views</th>
                <th className="pb-2 font-medium">Clicks</th>
                <th className="pb-2 font-medium">Links</th>
              </tr>
            </thead>
            <tbody>
              {metrics.top_profiles.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-ink/50">
                    No profiles yet.
                  </td>
                </tr>
              )}
              {metrics.top_profiles.map((p) => (
                <tr key={p.user_id} className="border-t border-ink/5">
                  <td className="py-3">
                    <Link href={`/admin/users/${p.user_id}`} className="font-medium text-ink hover:text-accent">
                      @{p.username}
                    </Link>
                    <p className="text-xs text-ink/45">{p.display_name}</p>
                  </td>
                  <td className="py-3 tabular-nums">{p.views}</td>
                  <td className="py-3 tabular-nums">{p.clicks}</td>
                  <td className="py-3 tabular-nums">{p.links_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white/70 p-5 backdrop-blur">
      <p className="text-xs font-medium uppercase tracking-wide text-ink/45">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold tabular-nums">{value.toLocaleString()}</p>
      {hint && <p className="mt-1 text-xs text-ink/45">{hint}</p>}
    </div>
  );
}
