"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { VerifiedMark } from "@/components/VerifiedBadge";
import { adminApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type {
  AdminVerificationRequestItem,
  AdminVerificationSignals,
  VerificationRequestStatus,
} from "@/lib/types";
import { VERIFICATION_COPY, VERIFICATION_TYPES, type VerificationType } from "@/lib/verification";

const TABS: { key: VerificationRequestStatus | "all"; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
];

const STATUS_STYLE: Record<VerificationRequestStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-ink/10 text-ink/60",
};

const TYPE_LABEL = VERIFICATION_COPY.en.types;

export default function AdminVerificationPage() {
  const [tab, setTab] = useState<VerificationRequestStatus | "all">("pending");
  const [items, setItems] = useState<AdminVerificationRequestItem[]>([]);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [types, setTypes] = useState<Record<string, VerificationType>>({});
  const pageSize = 20;

  const load = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.verificationRequests(token, {
        status: tab === "all" ? undefined : tab,
        page,
        page_size: pageSize,
      });
      setItems(data.items);
      setTotal(data.total);
      setCounts({ pending: data.pending, approved: data.approved, rejected: data.rejected });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, [tab, page]);

  useEffect(() => {
    load();
  }, [load]);

  async function decide(r: AdminVerificationRequestItem, status: "approved" | "rejected") {
    const token = getAccessToken();
    if (!token) return;
    setBusyId(r.id);
    setError("");
    try {
      await adminApi.decideVerificationRequest(token, r.id, {
        status,
        verification_type: status === "approved" ? types[r.id] ?? r.verification_type : undefined,
        note: notes[r.id]?.trim() || undefined,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update request");
    } finally {
      setBusyId(null);
    }
  }

  async function recheck(r: AdminVerificationRequestItem) {
    const token = getAccessToken();
    if (!token) return;
    setBusyId(r.id);
    setError("");
    try {
      const updated = await adminApi.recheckVerificationProof(token, r.id);
      setItems((list) => list.map((i) => (i.id === r.id ? updated : i)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check proof");
    } finally {
      setBusyId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Verification</h1>
        <p className="mt-1 text-sm text-ink/55">
          Profiles waiting for the verified badge, oldest first. Automatic entries come from verified
          profiles that changed their name: approve to give the badge back.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const n = t.key === "all" ? counts.pending + counts.approved + counts.rejected : counts[t.key];
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
          No requests here.
        </p>
      )}

      <ul className="space-y-3">
        {items.map((r) => (
          <li key={r.id} className="rounded-2xl border border-ink/10 bg-white/70 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                {r.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.avatar_url} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
                ) : (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink/10 font-bold">
                    {r.display_name.slice(0, 1).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-medium text-ink">
                    <span className="truncate">{r.display_name}</span>
                    {r.is_verified && <VerifiedMark type={r.verification_type} lang="en" size={14} />}
                    <a
                      href={`/${r.username}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-normal text-ink/50 hover:text-accent"
                    >
                      @{r.username} ↗
                    </a>
                    <Link
                      href={`/admin/users/${r.user_id}`}
                      className="text-xs font-normal text-accent hover:underline"
                    >
                      User
                    </Link>
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    <span className={`rounded-full px-2 py-0.5 font-medium ${STATUS_STYLE[r.status]}`}>
                      {r.status}
                    </span>
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 font-medium text-sky-800">
                      Asks for: {TYPE_LABEL[r.verification_type]}
                    </span>
                    {r.source === "auto" && (
                      <span className="rounded-full bg-violet-50 px-2 py-0.5 font-medium text-violet-800">
                        Re-review
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="shrink-0 text-xs text-ink/45">{new Date(r.created_at).toLocaleString()}</p>
            </div>

            {r.reason && <p className="mt-3 text-sm text-ink/75">“{r.reason}”</p>}
            {r.evidence_urls.length > 0 && (
              <ul className="mt-2 space-y-0.5 text-xs">
                {r.evidence_urls.map((u) => (
                  <li key={u}>
                    <a href={u} target="_blank" rel="noreferrer noopener" className="break-all text-accent hover:underline">
                      {u}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            <Proof r={r} busy={busyId === r.id} onRecheck={() => recheck(r)} />
            <Signals s={r.signals} />

            {r.status !== "pending" ? (
              <p className="mt-3 text-xs text-ink/55">
                {r.status === "approved" ? "Approved" : "Rejected"}
                {r.reviewed_by_email ? ` by ${r.reviewed_by_email}` : ""}
                {r.reviewed_at ? ` on ${new Date(r.reviewed_at).toLocaleString()}` : ""}
                {r.decision_note ? ` — ${r.decision_note}` : ""}
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="sr-only" htmlFor={`type-${r.id}`}>
                  Kind of account
                </label>
                <select
                  id={`type-${r.id}`}
                  value={types[r.id] ?? r.verification_type}
                  onChange={(e) => setTypes((t) => ({ ...t, [r.id]: e.target.value as VerificationType }))}
                  className="rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-sm"
                >
                  {VERIFICATION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {TYPE_LABEL[type]}
                    </option>
                  ))}
                </select>
                <input
                  value={notes[r.id] ?? ""}
                  onChange={(e) => setNotes((n) => ({ ...n, [r.id]: e.target.value }))}
                  placeholder="Note (internal if approved, shown to the user if rejected)"
                  maxLength={500}
                  className="min-w-[220px] flex-1 rounded-lg border border-ink/10 bg-white px-3 py-1.5 text-sm"
                />
                <button
                  disabled={busyId === r.id || r.signals.is_suspicious}
                  title={r.signals.is_suspicious ? "Clear the suspicious flag first" : undefined}
                  onClick={() => decide(r, "approved")}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  disabled={busyId === r.id}
                  onClick={() => decide(r, "rejected")}
                  className="rounded-lg border border-ink/15 px-3 py-1.5 text-sm font-semibold disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            )}
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

/** Quick facts for deciding; red ones are reasons to look closer. */
function Signals({ s }: { s: AdminVerificationSignals }) {
  const chips: { label: string; tone: "good" | "bad" | "neutral" }[] = [
    { label: `${s.account_age_days} days old`, tone: s.account_age_days >= 30 ? "good" : "neutral" },
    { label: s.has_avatar ? "Avatar" : "No avatar", tone: s.has_avatar ? "good" : "bad" },
    { label: s.has_bio ? "Bio" : "No bio", tone: s.has_bio ? "good" : "bad" },
    s.verified_domain
      ? { label: `Owns ${s.verified_domain}`, tone: "good" }
      : { label: "No custom domain", tone: "neutral" },
    {
      label: s.social_profiles.length ? `Socials: ${s.social_profiles.join(", ")}` : "No social profiles",
      tone: s.social_profiles.length ? "good" : "bad",
    },
    { label: `${s.links_count} links`, tone: "neutral" },
    { label: `${s.views_count} views · ${s.clicks_count} clicks`, tone: "neutral" },
    { label: `${s.subscribers_count} subscribers`, tone: "neutral" },
  ];
  if (s.reports_total > 0) {
    chips.push({ label: `${s.reports_total} reports (${s.reports_pending} pending)`, tone: "bad" });
  }
  if (s.previously_revoked > 0) chips.push({ label: `Revoked ${s.previously_revoked}× before`, tone: "bad" });
  if (s.is_suspicious) chips.push({ label: "Flagged as suspicious", tone: "bad" });

  const tone = {
    good: "bg-emerald-50 text-emerald-800",
    bad: "bg-red-50 text-red-700",
    neutral: "bg-ink/5 text-ink/65",
  };
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5 text-xs" aria-label="Signals">
      {chips.map((c) => (
        <li key={c.label} className={`rounded-full px-2 py-0.5 ${tone[c.tone]}`}>
          {c.label}
        </li>
      ))}
    </ul>
  );
}

/** Where the automatic check found the owner's proof code. Not found ≠ fake: many networks hide bios. */
function Proof({
  r,
  busy,
  onRecheck,
}: {
  r: AdminVerificationRequestItem;
  busy: boolean;
  onRecheck: () => void;
}) {
  if (r.source === "auto") return null;
  const results = r.proof_results;
  const anyFound = results?.some((p) => p.found);
  return (
    <div className="mt-3 rounded-xl bg-ink/[0.03] p-3 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p>
          Proof code <code className="rounded bg-white px-1.5 py-0.5 font-mono text-ink">{r.proof_code}</code>
          {results === null ? (
            <span className="ml-2 text-ink/50">checking…</span>
          ) : anyFound ? (
            <span className="ml-2 font-semibold text-emerald-700">found</span>
          ) : (
            <span className="ml-2 font-semibold text-amber-700">not found automatically — open the links</span>
          )}
        </p>
        {r.status === "pending" && (
          <button
            disabled={busy}
            onClick={onRecheck}
            className="rounded-lg border border-ink/15 bg-white px-2.5 py-1 font-semibold disabled:opacity-50"
          >
            Check again
          </button>
        )}
      </div>
      {results && results.length > 0 && (
        <ul className="mt-2 space-y-1">
          {results.map((p) => (
            <li key={`${p.kind}-${p.target}`} className="flex flex-wrap items-center gap-1.5">
              <span className={p.found ? "text-emerald-700" : "text-ink/45"}>{p.found ? "✓" : "✗"}</span>
              <span className="text-ink/50">{p.kind === "dns" ? "DNS TXT" : "Page"}</span>
              <span className="break-all text-ink/75">{p.target}</span>
              {p.error && <span className="text-ink/45">({p.error})</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
