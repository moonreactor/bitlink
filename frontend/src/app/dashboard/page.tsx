"use client";

import { useEffect, useState } from "react";
import { analyticsApi, profileApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { AnalyticsSummary, Profile, Subscriber } from "@/lib/types";

export default function DashboardOverviewPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<AnalyticsSummary | null>(null);
  const [subs, setSubs] = useState<Subscriber[]>([]);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    Promise.all([
      profileApi.get(token),
      analyticsApi.summary(token),
      analyticsApi.subscribers(token),
    ]).then(([p, s, sub]) => {
      setProfile(p);
      setStats(s);
      setSubs(sub);
    });
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Overview</h1>
        <p className="mt-1 text-sm text-ink/55">
          {profile ? `Hi ${profile.display_name} — here’s how your page is doing.` : "Loading…"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Page views" value={stats?.total_views ?? "—"} />
        <StatCard label="Link clicks" value={stats?.total_clicks ?? "—"} />
      </div>

      <section className="rounded-2xl border border-ink/10 bg-white/70 p-5 backdrop-blur">
        <h2 className="font-display text-lg font-semibold">Clicks by link</h2>
        <ul className="mt-4 space-y-2">
          {(stats?.links || []).length === 0 && (
            <li className="text-sm text-ink/50">No links yet. Add some in Links.</li>
          )}
          {stats?.links.map((l) => (
            <li key={l.link_id} className="flex items-center justify-between text-sm">
              <span className="truncate pr-4">{l.title}</span>
              <span className="font-semibold tabular-nums">{l.clicks}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Breakdown title="Devices" rows={(stats?.devices || []).map((d) => [d.device, d.count])} />
        <Breakdown title="Referrers" rows={(stats?.referrers || []).map((d) => [d.referrer, d.count])} />
      </div>

      <section className="rounded-2xl border border-ink/10 bg-white/70 p-5 backdrop-blur">
        <h2 className="font-display text-lg font-semibold">Email subscribers</h2>
        <ul className="mt-4 space-y-2">
          {subs.length === 0 && <li className="text-sm text-ink/50">No subscribers yet.</li>}
          {subs.map((s) => (
            <li key={s.id} className="flex justify-between text-sm">
              <span>{s.email}</span>
              <span className="text-ink/40">{new Date(s.created_at).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white/70 p-5 backdrop-blur">
      <p className="text-xs font-medium uppercase tracking-wide text-ink/45">{label}</p>
      <p className="mt-2 font-display text-4xl font-bold tabular-nums">{value}</p>
    </div>
  );
}

function Breakdown({ title, rows }: { title: string; rows: [string, number][] }) {
  return (
    <section className="rounded-2xl border border-ink/10 bg-white/70 p-5 backdrop-blur">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <ul className="mt-4 space-y-2">
        {rows.length === 0 && <li className="text-sm text-ink/50">No data yet.</li>}
        {rows.map(([k, v]) => (
          <li key={k} className="flex justify-between text-sm">
            <span className="truncate pr-3 capitalize">{k}</span>
            <span className="font-semibold tabular-nums">{v}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
