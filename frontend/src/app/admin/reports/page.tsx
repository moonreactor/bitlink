"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { AdminReportItem, ReportStatus } from "@/lib/types";

const TABS: { key: ReportStatus | "all"; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "resolved", label: "Resolved" },
  { key: "dismissed", label: "Dismissed" },
  { key: "all", label: "All" },
];

const STATUS_STYLE: Record<ReportStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  resolved: "bg-emerald-100 text-emerald-800",
  dismissed: "bg-ink/10 text-ink/60",
};

const STATUS_LABEL: Record<ReportStatus, string> = {
  pending: "Pending",
  resolved: "Resolved",
  dismissed: "Dismissed",
};

const REASON_LABEL: Record<string, string> = {
  phishing: "Phishing",
  malware: "Malware",
  scam: "Scam",
  spam: "Spam",
  adult: "Adult",
  illegal: "Illegal",
  other: "Other",
};

export default function AdminReportsPage() {
  const [tab, setTab] = useState<ReportStatus | "all">("pending");
  const [items, setItems] = useState<AdminReportItem[]>([]);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState({ pending: 0, resolved: 0, dismissed: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const pageSize = 20;

  const load = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.reports(token, {
        status: tab === "all" ? undefined : tab,
        page,
        page_size: pageSize,
      });
      setItems(data.items);
      setTotal(data.total);
      setCounts({ pending: data.pending, resolved: data.resolved, dismissed: data.dismissed });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [tab, page]);

  useEffect(() => {
    load();
  }, [load]);

  async function act(
    r: AdminReportItem,
    status: ReportStatus,
    opts: { disable?: boolean } = {},
  ) {
    const token = getAccessToken();
    if (!token) return;
    setBusyId(r.id);
    setError("");
    try {
      await adminApi.updateReport(token, r.id, {
        status,
        resolution_note: notes[r.id] ?? r.resolution_note ?? undefined,
        disable_target: opts.disable,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update report");
    } finally {
      setBusyId(null);
    }
  }

  async function flagOwner(r: AdminReportItem) {
    const token = getAccessToken();
    if (!token || !r.owner_user_id) return;
    setBusyId(r.id);
    setError("");
    try {
      await adminApi.updateUser(token, r.owner_user_id, {
        is_suspicious: true,
        suspicious_note: notes[r.id] || undefined,
      });
      await act(r, "resolved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to flag profile");
      setBusyId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canDisable = (r: AdminReportItem) =>
    r.target_type !== "profile" && r.target_active === true;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Reports</h1>
        <p className="mt-1 text-sm text-ink/55">
          Abuse reports filed by visitors against profiles, links and short links.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const n =
            t.key === "all" ? counts.pending + counts.resolved + counts.dismissed : counts[t.key];
          return (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setPage(1);
              }}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                tab === t.key ? "bg-ink text-white" : "border border-ink/10 bg-white/70 text-ink/70"
              }`}
            >
              {t.label} <span className="tabular-nums opacity-60">{n}</span>
            </button>
          );
        })}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading && <p className="text-sm text-ink/50">Loading…</p>}
      {!loading && items.length === 0 && (
        <p className="rounded-2xl border border-ink/10 bg-white/70 px-4 py-8 text-sm text-ink/50">
          No reports here.
        </p>
      )}

      <ul className="space-y-3">
        {items.map((r) => (
          <li key={r.id} className="rounded-2xl border border-ink/10 bg-white/70 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[r.status]}`}
                  >
                    {STATUS_LABEL[r.status]}
                  </span>
                  <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                    {REASON_LABEL[r.reason] ?? r.reason}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-ink/40">
                    {r.target_type.replace("_", " ")}
                  </span>
                  {r.reports_for_target > 1 && (
                    <span className="text-xs font-semibold text-red-600">
                      {r.reports_for_target} reports on this target
                    </span>
                  )}
                </div>
                <p className="font-medium text-ink">
                  {r.username && r.target_type === "profile" ? (
                    <a
                      href={`/${r.username}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-accent"
                    >
                      {r.target_label}
                    </a>
                  ) : (
                    r.target_label
                  )}
                  {r.owner_user_id && (
                    <Link
                      href={`/admin/users/${r.owner_user_id}`}
                      className="ml-2 text-xs font-normal text-accent hover:underline"
                    >
                      Owner
                    </Link>
                  )}
                </p>
                {r.target_url && (
                  <p className="max-w-xl break-all text-xs text-ink/50">
                    {r.target_url}
                    {r.target_active === false && (
                      <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 font-medium text-red-700">
                        disabled
                      </span>
                    )}
                  </p>
                )}
                {r.details && <p className="text-sm text-ink/75">“{r.details}”</p>}
              </div>
              <p className="shrink-0 text-xs text-ink/45">
                {new Date(r.created_at).toLocaleString()}
              </p>
            </div>

            {r.status !== "pending" && (
              <p className="mt-3 text-xs text-ink/55">
                {STATUS_LABEL[r.status]}
                {r.resolved_by_email ? ` by ${r.resolved_by_email}` : ""}
                {r.resolved_at ? ` on ${new Date(r.resolved_at).toLocaleString()}` : ""}
                {r.resolution_note ? ` — ${r.resolution_note}` : ""}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {r.status === "pending" && (
                <input
                  value={notes[r.id] ?? ""}
                  onChange={(e) => setNotes((n) => ({ ...n, [r.id]: e.target.value }))}
                  placeholder="Note (optional)"
                  maxLength={1000}
                  className="min-w-[180px] flex-1 rounded-lg border border-ink/10 bg-white px-3 py-1.5 text-sm"
                />
              )}
              {canDisable(r) && (
                <button
                  disabled={busyId === r.id}
                  onClick={() => act(r, "resolved", { disable: true })}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Disable &amp; resolve
                </button>
              )}
              {r.owner_user_id && r.status === "pending" && (
                <button
                  disabled={busyId === r.id}
                  onClick={() => flagOwner(r)}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Flag profile &amp; resolve
                </button>
              )}
              {r.status !== "resolved" && (
                <button
                  disabled={busyId === r.id}
                  onClick={() => act(r, "resolved")}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Mark resolved
                </button>
              )}
              {r.status !== "dismissed" && (
                <button
                  disabled={busyId === r.id}
                  onClick={() => act(r, "dismissed")}
                  className="rounded-lg border border-ink/15 px-3 py-1.5 text-sm font-semibold disabled:opacity-50"
                >
                  Dismiss
                </button>
              )}
              {r.status !== "pending" && (
                <button
                  disabled={busyId === r.id}
                  onClick={() => act(r, "pending")}
                  className="rounded-lg border border-ink/15 px-3 py-1.5 text-sm font-semibold disabled:opacity-50"
                >
                  Reopen
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between text-sm">
        <p className="text-ink/50">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-ink/10 px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-ink/10 px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
