"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  adminEmailsApi,
  type AdminEmailLog,
  type AdminEmailStats,
  type LifecycleRunResult,
} from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

const KINDS: { key: string; label: string; group: "account" | "tip" }[] = [
  { key: "welcome", label: "Welcome", group: "account" },
  { key: "password_reset", label: "Password reset", group: "account" },
  { key: "verification_approved", label: "Badge approved", group: "account" },
  { key: "verification_rejected", label: "Badge rejected", group: "account" },
  { key: "identity_alert", label: "Impersonation alert", group: "account" },
  { key: "complete_profile", label: "Complete profile", group: "tip" },
  { key: "verification_invite", label: "Badge invite", group: "tip" },
  { key: "add_links", label: "Add links", group: "tip" },
  { key: "weekly_summary", label: "Weekly summary", group: "tip" },
];
const KIND_LABEL = Object.fromEntries(KINDS.map((k) => [k.key, k.label]));

const RANGES = [7, 30, 90, 365];
const LANGS = ["es", "en", "pt"];

const STATUS_STYLE: Record<string, string> = {
  sent: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-700",
  rejected: "bg-orange-100 text-orange-800",
  skipped: "bg-ink/10 text-ink/60",
};
const DELIVERY_STYLE: Record<string, string> = {
  delivered: "bg-sky-100 text-sky-800",
  opened: "bg-indigo-100 text-indigo-800",
  clicked: "bg-violet-100 text-violet-800",
  delayed: "bg-amber-100 text-amber-800",
  bounced: "bg-red-100 text-red-700",
  complained: "bg-red-100 text-red-700",
  failed: "bg-red-100 text-red-700",
};

function fmt(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function pct(n: number, of: number) {
  return of > 0 ? `${Math.round((n / of) * 100)}%` : "—";
}

function Chip({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        ok ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
      }`}
    >
      <span aria-hidden>{ok ? "●" : "○"}</span>
      {label}
    </span>
  );
}

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white/70 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-ink/45">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold tabular-nums text-ink">{value}</p>
      {sub && <p className="text-xs text-ink/45">{sub}</p>}
    </div>
  );
}

export default function AdminEmailsPage() {
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<AdminEmailStats | null>(null);
  const [logs, setLogs] = useState<AdminEmailLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ kind: "", status: "", delivery: "", q: "" });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const pageSize = 50;

  const loadStats = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    try {
      setStats(await adminEmailsApi.stats(token, days));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stats");
    }
  }, [days]);

  const loadLogs = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    setLoading(true);
    try {
      const data = await adminEmailsApi.logs(token, { ...filters, page, page_size: pageSize });
      setLogs(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load emails");
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);
  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  function setFilter(key: keyof typeof filters, value: string) {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  }

  const t = stats?.totals;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="space-y-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Emails</h1>
          <p className="mt-1 text-sm text-ink/55">
            Every email Bitlink sent, what happened after (from the Resend webhook) and the periodic tips.
          </p>
        </div>
        {stats && (
          <div className="flex flex-wrap gap-2">
            <Chip ok={stats.configured} label={stats.configured ? "Resend connected" : "No RESEND_API_KEY"} />
            <Chip
              ok={stats.webhook_configured}
              label={stats.webhook_configured ? "Delivery webhook on" : "Delivery webhook off"}
            />
            <Chip
              ok={stats.lifecycle_enabled}
              label={
                stats.lifecycle_enabled
                  ? `Periodic tips on (max ${stats.lifecycle_max_per_run}/run)`
                  : "Periodic tips off"
              }
            />
            <span className="rounded-full border border-ink/10 bg-white/70 px-2.5 py-1 text-xs text-ink/60">
              From: {stats.sender}
            </span>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Overview */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">Overview</h2>
          <div className="flex gap-1 rounded-full border border-ink/10 bg-white/70 p-1">
            {RANGES.map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  days === d ? "bg-ink text-white" : "text-ink/60"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
        {t && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Emails" value={t.total} sub={`last ${days} days`} />
            <Stat label="Accepted by Resend" value={t.sent} sub={`${t.failed} failed · ${t.rejected} bad address · ${t.skipped} not sent`} />
            <Stat
              label="Delivered"
              value={stats?.webhook_configured ? t.delivered : "—"}
              sub={stats?.webhook_configured ? pct(t.delivered, t.sent) : "needs webhook"}
            />
            <Stat
              label="Opened / clicked"
              value={stats?.webhook_configured ? `${t.opened} / ${t.clicked}` : "—"}
              sub={stats?.webhook_configured ? `${pct(t.opened, t.delivered)} open rate` : "needs webhook"}
            />
            <Stat label="Bounced" value={t.bounced} />
            <Stat label="Spam complaints" value={t.complained} />
            <Stat label="Unsubscribed users" value={stats?.unsubscribed_users ?? 0} sub="no tips or summaries" />
            <Stat label="First email" value={stats?.first_email_at ? fmt(stats.first_email_at).split(",")[0] : "—"} />
          </div>
        )}

        {stats && stats.by_kind.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white/70">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-ink/45">
                <tr>
                  {["Email", "Total", "Sent", "Failed", "Bad address", "Delivered", "Opened", "Clicked", "Bounced"].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {stats.by_kind.map((r) => (
                  <tr key={r.kind}>
                    <td className="px-4 py-2.5">
                      <button
                        className="font-medium text-ink hover:text-accent"
                        onClick={() => setFilter("kind", r.kind)}
                      >
                        {KIND_LABEL[r.kind] ?? r.kind}
                      </button>
                    </td>
                    {[r.total, r.sent, r.failed, r.rejected, r.delivered, r.opened, r.clicked, r.bounced].map((n, i) => (
                      <td key={i} className="px-4 py-2.5 tabular-nums text-ink/70">
                        {n}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Activity */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">
          Activity <span className="text-sm font-normal text-ink/45">{total} emails</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setFilter("q", search);
            }}
            className="flex-1 sm:max-w-xs"
          >
            <input
              className="mu-input"
              placeholder="Search email or @username"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <select className="mu-input w-auto" value={filters.kind} onChange={(e) => setFilter("kind", e.target.value)}>
            <option value="">All emails</option>
            {KINDS.map((k) => (
              <option key={k.key} value={k.key}>
                {k.label}
              </option>
            ))}
          </select>
          <select
            className="mu-input w-auto"
            value={filters.status}
            onChange={(e) => setFilter("status", e.target.value)}
          >
            <option value="">Any send status</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed (retried)</option>
            <option value="rejected">Bad address</option>
            <option value="skipped">Not sent (no key)</option>
          </select>
          <select
            className="mu-input w-auto"
            value={filters.delivery}
            onChange={(e) => setFilter("delivery", e.target.value)}
          >
            <option value="">Any delivery</option>
            <option value="pending">No event yet</option>
            <option value="delivered">Delivered</option>
            <option value="opened">Opened</option>
            <option value="clicked">Clicked</option>
            <option value="bounced">Bounced</option>
            <option value="complained">Spam complaint</option>
            <option value="delayed">Delayed</option>
          </select>
          {(filters.kind || filters.status || filters.delivery || filters.q) && (
            <button
              className="text-sm font-medium text-accent"
              onClick={() => {
                setSearch("");
                setFilters({ kind: "", status: "", delivery: "", q: "" });
                setPage(1);
              }}
            >
              Clear
            </button>
          )}
        </div>

        {loading && <p className="text-sm text-ink/50">Loading…</p>}
        {!loading && logs.length === 0 && (
          <p className="rounded-2xl border border-ink/10 bg-white/70 px-4 py-8 text-sm text-ink/50">
            No emails here yet.
          </p>
        )}

        <ul className="divide-y divide-ink/5 overflow-hidden rounded-2xl border border-ink/10 bg-white/70">
          {logs.map((log) => (
            <li key={log.id}>
              <button
                className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-left hover:bg-ink/[0.02]"
                onClick={() => setOpen(open === log.id ? null : log.id)}
                aria-expanded={open === log.id}
              >
                <span className="w-36 shrink-0 text-xs tabular-nums text-ink/45">{fmt(log.created_at)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink">
                    {log.subject || KIND_LABEL[log.kind] || log.kind}
                  </span>
                  <span className="block truncate text-xs text-ink/50">
                    {log.email}
                    {log.username && ` · @${log.username}`} · {KIND_LABEL[log.kind] ?? log.kind} ·{" "}
                    {log.language.toUpperCase()}
                  </span>
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[log.status]}`}>
                  {log.status === "skipped" ? "not sent" : log.status === "rejected" ? "bad address" : log.status}
                </span>
                {log.delivery_status && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      DELIVERY_STYLE[log.delivery_status] ?? "bg-ink/10 text-ink/60"
                    }`}
                  >
                    {log.delivery_status}
                  </span>
                )}
              </button>
              {open === log.id && (
                <div className="space-y-3 border-t border-ink/5 bg-ink/[0.02] px-4 py-4 text-sm">
                  <ol className="flex flex-wrap gap-x-6 gap-y-2">
                    {[
                      ["Sent", log.created_at],
                      ["Delivered", log.delivered_at],
                      ["Opened", log.opened_at],
                      ["Clicked", log.clicked_at],
                      ["Bounced", log.bounced_at],
                    ]
                      .filter(([label, at]) => at || label !== "Bounced")
                      .map(([label, at]) => (
                        <li key={label as string} className={at ? "text-ink" : "text-ink/35"}>
                          <span className="block text-xs uppercase tracking-wide">{label}</span>
                          <span className="tabular-nums">{fmt(at as string | null)}</span>
                        </li>
                      ))}
                  </ol>
                  {log.error && (
                    <p className="rounded-lg bg-red-50 px-3 py-2 text-red-700">
                      <b>Error:</b> {log.error}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 text-xs text-ink/55">
                    <Link href={`/admin/users/${log.user_id}`} className="font-medium text-accent hover:underline">
                      Open user
                    </Link>
                    <button className="font-medium text-accent hover:underline" onClick={() => { setSearch(log.email); setFilter("q", log.email); }}>
                      All emails to this user
                    </button>
                    {log.provider_id && <span>Resend ID: {log.provider_id}</span>}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-full border border-ink/10 px-3 py-1.5 disabled:opacity-40"
            >
              ← Newer
            </button>
            <span className="text-ink/50">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full border border-ink/10 px-3 py-1.5 disabled:opacity-40"
            >
              Older →
            </button>
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <LifecycleTool configured={!!stats?.configured} onSent={() => { loadStats(); loadLogs(); }} />
        <PreviewTool onSent={() => { loadStats(); loadLogs(); }} />
      </div>
    </div>
  );
}

function LifecycleTool({ configured, onSent }: { configured: boolean; onSent: () => void }) {
  const [result, setResult] = useState<LifecycleRunResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(dryRun: boolean) {
    const token = getAccessToken();
    if (!token) return;
    if (!dryRun && !window.confirm("Send this round of periodic emails to real users now?")) return;
    setBusy(true);
    setError("");
    try {
      setResult(await adminEmailsApi.runLifecycle(token, dryRun));
      if (!dryRun) onSent();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Run failed");
    } finally {
      setBusy(false);
    }
  }

  const entries = result ? Object.entries(result.by_kind) : [];
  return (
    <section className="space-y-3 rounded-2xl border border-ink/10 bg-white/70 p-5">
      <div>
        <h2 className="text-lg font-semibold text-ink">Periodic tips</h2>
        <p className="text-sm text-ink/55">
          See who would get a tip in the next round (nothing is sent), or send the round now.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => run(true)} disabled={busy} className="mu-btn-primary disabled:opacity-60">
          {busy ? "Checking…" : "Dry run"}
        </button>
        <button
          onClick={() => run(false)}
          disabled={busy || !configured}
          className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink disabled:opacity-40"
        >
          Send now
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {result && (
        <div className="rounded-xl bg-ink/[0.03] p-3 text-sm">
          <p className="font-medium text-ink">
            {result.dry_run ? "Would send" : "Sent"} {entries.reduce((a, [, n]) => a + n, 0)} of{" "}
            {result.checked} users checked{result.capped ? " (hit the per-run cap)" : ""}
            {!result.dry_run && result.failed > 0 ? ` · ${result.failed} failed` : ""}
          </p>
          {entries.length > 0 && (
            <ul className="mt-2 space-y-1 text-ink/70">
              {entries.map(([kind, n]) => (
                <li key={kind} className="flex justify-between">
                  <span>{KIND_LABEL[kind] ?? kind}</span>
                  <span className="tabular-nums">{n}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

function PreviewTool({ onSent }: { onSent: () => void }) {
  const [kind, setKind] = useState("welcome");
  const [lang, setLang] = useState("es");
  const [html, setHtml] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    adminEmailsApi
      .previewHtml(token, kind, lang)
      .then(setHtml)
      .catch(() => setHtml(""));
  }, [kind, lang]);

  async function sendTest() {
    const token = getAccessToken();
    if (!token) return;
    setBusy(true);
    setMsg("");
    try {
      const res = await adminEmailsApi.sendTest(token, kind, lang);
      setMsg(res.status === "sent" ? `Sent to ${res.to}` : `Not sent: ${res.error || res.status}`);
      onSent();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-3 rounded-2xl border border-ink/10 bg-white/70 p-5">
      <div>
        <h2 className="text-lg font-semibold text-ink">Preview & test</h2>
        <p className="text-sm text-ink/55">How each email looks, with sample data. Test emails go only to you.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <select className="mu-input w-auto" value={kind} onChange={(e) => setKind(e.target.value)}>
          {KINDS.map((k) => (
            <option key={k.key} value={k.key}>
              {k.label}
            </option>
          ))}
        </select>
        <select className="mu-input w-auto" value={lang} onChange={(e) => setLang(e.target.value)}>
          {LANGS.map((l) => (
            <option key={l} value={l}>
              {l.toUpperCase()}
            </option>
          ))}
        </select>
        <button
          onClick={sendTest}
          disabled={busy}
          className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink disabled:opacity-40"
        >
          {busy ? "Sending…" : "Send me a test"}
        </button>
      </div>
      {msg && <p className="text-sm text-ink/70">{msg}</p>}
      <iframe
        title="Email preview"
        srcDoc={html}
        sandbox=""
        className="h-[520px] w-full rounded-xl border border-ink/10 bg-white"
      />
    </section>
  );
}
