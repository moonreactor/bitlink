"use client";

import { useEffect, useState } from "react";
import { shortLinksApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { ShortLinkStats as Stats } from "@/lib/types";

const RANGES = [7, 30, 90];

function Breakdown({ title, rows }: { title: string; rows: { label: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-meetup-muted">{title}</p>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm text-meetup-muted">No data yet</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {rows.map((r) => (
            <li key={r.label} className="text-sm">
              <div className="flex justify-between gap-2">
                <span className="truncate text-ink">{r.label}</span>
                <span className="tabular-nums text-meetup-muted">{r.count}</span>
              </div>
              <div className="mt-0.5 h-1.5 rounded bg-meetup-lavender">
                <div className="h-1.5 rounded bg-meetup-purple" style={{ width: `${(r.count / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ShortLinkStats({ linkId }: { linkId: string }) {
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    let cancelled = false;
    setError("");
    shortLinksApi
      .stats(token, linkId, days)
      .then((s) => !cancelled && setStats(s))
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Could not load stats"));
    return () => {
      cancelled = true;
    };
  }, [linkId, days]);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!stats) return <p className="text-sm text-meetup-muted">Loading stats…</p>;

  const maxDay = Math.max(1, ...stats.daily.map((d) => d.clicks));

  return (
    <div className="space-y-4 rounded-xl bg-meetup-bg p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-ink">
          <span className="font-display text-2xl font-bold tabular-nums">{stats.total}</span>{" "}
          <span className="text-meetup-muted">clicks in the last {stats.days} days</span>
        </p>
        <div className="flex gap-1 rounded-full bg-white p-1 text-xs font-semibold">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setDays(r)}
              className={`rounded-full px-3 py-1 ${days === r ? "bg-meetup-purple text-white" : "text-meetup-muted"}`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-20 items-end gap-px" role="img" aria-label="Clicks per day">
        {stats.daily.map((d) => (
          <div
            key={d.date}
            title={`${d.date}: ${d.clicks}`}
            className="flex-1 rounded-t bg-meetup-purple/70"
            style={{ height: `${(d.clicks / maxDay) * 100}%`, minHeight: d.clicks ? 3 : 1 }}
          />
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Breakdown title="Countries" rows={stats.countries} />
        <Breakdown title="Devices" rows={stats.devices} />
        <Breakdown title="Sources" rows={stats.referrers} />
      </div>
    </div>
  );
}
