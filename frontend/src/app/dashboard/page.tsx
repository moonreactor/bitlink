"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { analyticsApi, profileApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { AnalyticsSummary, Profile, Subscriber } from "@/lib/types";

type Tab = "overview" | "clicks" | "audience";

export default function DashboardOverviewPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<AnalyticsSummary | null>(null);
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [tab, setTab] = useState<Tab>("overview");

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
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Your page</h1>
          <p className="mt-1 text-sm text-meetup-muted">
            {profile
              ? `Hi ${profile.display_name} — here’s how bitlink.app/${profile.username} is doing.`
              : "Loading…"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/links" className="mu-btn-primary">
            + Add link
          </Link>
          <Link href="/dashboard/appearance" className="mu-btn-secondary">
            Edit appearance
          </Link>
        </div>
      </div>

      {/* Meetup-style filter pills */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["overview", "Overview"],
            ["clicks", "Clicks"],
            ["audience", "Audience"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`mu-chip ${tab === id ? "mu-chip-active" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      {(tab === "overview" || tab === "clicks") && (
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="Page views" value={stats?.total_views ?? "—"} hint="All time" />
          <StatCard label="Link clicks" value={stats?.total_clicks ?? "—"} hint="All time" />
        </div>
      )}

      {(tab === "overview" || tab === "clicks") && (
        <section className="mu-card p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-ink">Clicks by link</h2>
            <Link href="/dashboard/links" className="text-sm font-semibold text-meetup-purple hover:underline">
              Manage
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-meetup-border">
            {(stats?.links || []).length === 0 && (
              <li className="py-6 text-center text-sm text-meetup-muted">
                No links yet.{" "}
                <Link href="/dashboard/links" className="font-semibold text-meetup-purple">
                  Add some →
                </Link>
              </li>
            )}
            {stats?.links.map((l) => (
              <li key={l.link_id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="truncate font-medium text-ink">{l.title}</span>
                <span className="rounded-full bg-meetup-lavender px-2.5 py-0.5 text-xs font-bold tabular-nums text-meetup-purple">
                  {l.clicks}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(tab === "overview" || tab === "audience") && (
        <div className="grid gap-4 md:grid-cols-2">
          <Breakdown
            title="Devices"
            rows={(stats?.devices || []).map((d) => [d.device, d.count])}
          />
          <Breakdown
            title="Referrers"
            rows={(stats?.referrers || []).map((d) => [d.referrer, d.count])}
          />
        </div>
      )}

      {(tab === "overview" || tab === "audience") && (
        <section className="mu-card p-5 md:p-6">
          <h2 className="font-display text-lg font-bold text-ink">Email subscribers</h2>
          <ul className="mt-4 divide-y divide-meetup-border">
            {subs.length === 0 && (
              <li className="py-6 text-center text-sm text-meetup-muted">No subscribers yet.</li>
            )}
            {subs.map((s) => (
              <li key={s.id} className="flex justify-between gap-4 py-3 text-sm">
                <span className="font-medium text-ink">{s.email}</span>
                <span className="text-meetup-muted">
                  {new Date(s.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="mu-card p-5 md:p-6">
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold text-meetup-muted">{label}</p>
        {hint && (
          <span className="rounded-full bg-mist px-2 py-0.5 text-[11px] font-semibold text-meetup-muted">
            {hint}
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-4xl font-bold tabular-nums text-ink">{value}</p>
    </div>
  );
}

function Breakdown({ title, rows }: { title: string; rows: [string, number][] }) {
  return (
    <section className="mu-card p-5 md:p-6">
      <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
      <ul className="mt-4 space-y-3">
        {rows.length === 0 && <li className="text-sm text-meetup-muted">No data yet.</li>}
        {rows.map(([k, v]) => {
          const max = Math.max(...rows.map((r) => r[1]), 1);
          const pct = Math.round((v / max) * 100);
          return (
            <li key={k}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="capitalize text-ink">{k}</span>
                <span className="font-semibold tabular-nums text-meetup-muted">{v}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-mist">
                <div className="h-full rounded-full bg-meetup-purple" style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
