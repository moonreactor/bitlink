"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { analyticsApi, profileApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { AnalyticsSummary, Profile, Subscriber } from "@/lib/types";

type Tab = "overview" | "clicks" | "audience";
type RangeKey = "7d" | "30d" | "90d" | "all";

const RANGES: { id: RangeKey; label: string }[] = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
  { id: "all", label: "All time" },
];

function rangeParams(key: RangeKey): { from?: string; to?: string } {
  if (key === "all") return {};
  const days = key === "7d" ? 7 : key === "30d" ? 30 : 90;
  const from = new Date();
  from.setUTCHours(0, 0, 0, 0);
  from.setUTCDate(from.getUTCDate() - (days - 1));
  return { from: from.toISOString() };
}

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => {
          const v = String(cell ?? "");
          if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
          return v;
        })
        .join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DashboardOverviewPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<AnalyticsSummary | null>(null);
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [tab, setTab] = useState<Tab>("overview");
  const [range, setRange] = useState<RangeKey>("30d");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (rangeKey: RangeKey) => {
    const token = getAccessToken();
    if (!token) return;
    setLoading(true);
    try {
      const [p, s, sub] = await Promise.all([
        profileApi.get(token),
        analyticsApi.summary(token, rangeParams(rangeKey)),
        analyticsApi.subscribers(token),
      ]);
      setProfile(p);
      setStats(s);
      setSubs(sub);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(range);
  }, [load, range]);

  const rangeHint = useMemo(
    () => RANGES.find((r) => r.id === range)?.label || "All time",
    [range],
  );

  function exportSubscribers() {
    downloadCsv("bitlink-subscribers.csv", [
      ["email", "phone", "subscribed_at"],
      ...subs.map((s) => [s.email || "", s.phone || "", s.created_at]),
    ]);
  }

  function exportClicks() {
    downloadCsv("bitlink-link-clicks.csv", [
      ["link_id", "title", "clicks"],
      ...(stats?.links || []).map((l) => [l.link_id, l.title, String(l.clicks)]),
    ]);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Your page</h1>
          <p className="mt-1 text-sm text-meetup-muted">
            {profile
              ? `Hi ${profile.display_name} — here’s how bitlink.click/${profile.username} is doing.`
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

      <div className="flex flex-wrap items-center justify-between gap-3">
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
        <div className="flex flex-wrap gap-2">
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(r.id)}
              className={`mu-chip ${range === r.id ? "mu-chip-active" : ""}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {(tab === "overview" || tab === "clicks") && (
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Page views"
            value={loading ? "…" : (stats?.total_views ?? "—")}
            hint={rangeHint}
          />
          <StatCard
            label="Link clicks"
            value={loading ? "…" : (stats?.total_clicks ?? "—")}
            hint={rangeHint}
          />
        </div>
      )}

      {(tab === "overview" || tab === "clicks") && (
        <DailyChart daily={stats?.daily || []} loading={loading} />
      )}

      {(tab === "overview" || tab === "clicks") && (
        <section className="mu-card p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-ink">Clicks by link</h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={exportClicks}
                disabled={!stats?.links.length}
                className="text-sm font-semibold text-meetup-purple hover:underline disabled:opacity-40"
              >
                Export CSV
              </button>
              <Link href="/dashboard/links" className="text-sm font-semibold text-meetup-purple hover:underline">
                Manage
              </Link>
            </div>
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
        <div className="grid gap-4 md:grid-cols-3">
          <Breakdown
            title="Devices"
            rows={(stats?.devices || []).map((d) => [d.device, d.count])}
          />
          <Breakdown
            title="Referrers"
            rows={(stats?.referrers || []).map((d) => [d.referrer, d.count])}
          />
          <Breakdown
            title="Countries"
            rows={(stats?.countries || []).map((d) => [d.country, d.count])}
          />
        </div>
      )}

      {(tab === "overview" || tab === "audience") && (
        <section className="mu-card p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-ink">Email subscribers</h2>
            <button
              type="button"
              onClick={exportSubscribers}
              disabled={subs.length === 0}
              className="text-sm font-semibold text-meetup-purple hover:underline disabled:opacity-40"
            >
              Export CSV
            </button>
          </div>
          <ul className="mt-4 divide-y divide-meetup-border">
            {subs.length === 0 && (
              <li className="py-6 text-center text-sm text-meetup-muted">No subscribers yet.</li>
            )}
            {subs.map((s) => (
              <li key={s.id} className="flex justify-between gap-4 py-3 text-sm">
                <span className="font-medium text-ink">
                  {[s.email, s.phone].filter(Boolean).join(" · ")}
                </span>
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

function DailyChart({
  daily,
  loading,
}: {
  daily: { date: string; views: number; clicks: number }[];
  loading: boolean;
}) {
  const max = Math.max(...daily.map((d) => Math.max(d.views, d.clicks)), 1);

  return (
    <section className="mu-card p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold text-ink">Daily activity</h2>
        <div className="flex gap-3 text-[11px] font-semibold text-meetup-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-meetup-purple" /> Views
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-meetup-pink" /> Clicks
          </span>
        </div>
      </div>
      {loading ? (
        <p className="mt-8 text-center text-sm text-meetup-muted">Loading…</p>
      ) : daily.length === 0 ? (
        <p className="mt-8 text-center text-sm text-meetup-muted">No activity in this range yet.</p>
      ) : (
        <div className="mt-6 flex h-40 items-end gap-1 overflow-x-auto pb-6 sm:gap-1.5">
          {daily.map((d) => {
            const viewsH = Math.max(4, Math.round((d.views / max) * 100));
            const clicksH = Math.max(d.clicks > 0 ? 4 : 0, Math.round((d.clicks / max) * 100));
            const label = d.date.slice(5);
            return (
              <div key={d.date} className="group flex min-w-[18px] flex-1 flex-col items-center gap-1">
                <div className="flex h-28 w-full items-end justify-center gap-0.5">
                  <div
                    className="w-[45%] rounded-t bg-meetup-purple/80"
                    style={{ height: `${viewsH}%` }}
                    title={`${d.date}: ${d.views} views`}
                  />
                  <div
                    className="w-[45%] rounded-t bg-meetup-pink/80"
                    style={{ height: `${clicksH}%` }}
                    title={`${d.date}: ${d.clicks} clicks`}
                  />
                </div>
                <span className="rotate-[-45deg] text-[9px] tabular-nums text-meetup-muted sm:text-[10px]">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
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
