"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { VerifiedMark } from "@/components/VerifiedBadge";
import type { AdminUserDetail } from "@/lib/types";
import {
  VERIFICATION_COPY,
  VERIFICATION_TYPES,
  verificationType,
  type VerificationType,
} from "@/lib/verification";

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [flagNote, setFlagNote] = useState("");
  const [verifyType, setVerifyType] = useState<VerificationType>("creator");

  const load = useCallback(async () => {
    const token = getAccessToken();
    if (!token || !params.id) return;
    try {
      const data = await adminApi.user(token, params.id);
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user");
    }
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function patch(body: Parameters<typeof adminApi.updateUser>[2]) {
    const token = getAccessToken();
    if (!token || !user) return;
    setSaving(true);
    setError("");
    try {
      const updated = await adminApi.updateUser(token, user.id, body);
      setUser(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (error && !user) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!user) {
    return <p className="text-sm text-ink/50">Loading user…</p>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link href="/admin/users" className="text-xs font-medium text-ink/50 hover:text-ink">
          ← Users
        </Link>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">
          {user.username ? `@${user.username}` : user.email}
        </h1>
        <p className="mt-1 text-sm text-ink/55">
          {user.display_name || "No display name"} · {user.email}
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Views" value={user.views_count} />
        <Stat label="Clicks" value={user.clicks_count} />
        <Stat label="Links" value={user.links_count} />
        <Stat label="Subscribers" value={user.subscribers_count} />
      </div>

      {user.is_suspicious && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold">Profile flagged as suspicious</p>
          <p className="mt-1">
            {user.suspicious_at ? `Since ${new Date(user.suspicious_at).toLocaleString()}. ` : ""}
            {user.suspicious_note ? `Note shown to the user: “${user.suspicious_note}”` : "No note."}
          </p>
        </div>
      )}

      <section className="rounded-2xl border border-ink/10 bg-white/70 p-5 backdrop-blur">
        <h2 className="font-display text-lg font-semibold">Account</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <Row label="Email" value={user.email} />
          <Row label="Joined" value={new Date(user.created_at).toLocaleString()} />
          <Row label="Username" value={user.username ? `@${user.username}` : "—"} />
          <Row
            label="Referred from"
            value={user.referred_by_username ? `@${user.referred_by_username}` : "—"}
          />
          <Row label="Bio" value={user.bio || "—"} />
        </dl>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            disabled={saving}
            onClick={() => patch({ is_active: !user.is_active })}
            className="rounded-xl border border-ink/10 px-4 py-2 text-sm font-medium hover:bg-ink/5 disabled:opacity-50"
          >
            {user.is_active ? "Deactivate account" : "Activate account"}
          </button>
          <button
            disabled={saving}
            onClick={() => patch({ is_superuser: !user.is_superuser })}
            className="rounded-xl border border-ink/10 px-4 py-2 text-sm font-medium hover:bg-ink/5 disabled:opacity-50"
          >
            {user.is_superuser ? "Remove superuser" : "Make superuser"}
          </button>
          <div className="inline-flex overflow-hidden rounded-xl border border-ink/10">
            <label className="sr-only" htmlFor="verification-type">
              Kind of verified account
            </label>
            <select
              id="verification-type"
              disabled={saving || !user.profile_id}
              value={user.is_verified ? verificationType(user.verification_type) : verifyType}
              onChange={(e) => {
                const value = e.target.value as VerificationType;
                if (user.is_verified) patch({ verification_type: value });
                else setVerifyType(value);
              }}
              className="border-r border-ink/10 bg-white px-3 py-2 text-sm disabled:opacity-50"
            >
              {VERIFICATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {VERIFICATION_COPY.en.types[type]}
                </option>
              ))}
            </select>
            <button
              disabled={saving || !user.profile_id}
              onClick={() =>
                patch(
                  user.is_verified
                    ? { is_verified: false }
                    : { is_verified: true, verification_type: verifyType },
                )
              }
              className="px-4 py-2 text-sm font-medium hover:bg-ink/5 disabled:opacity-50"
            >
              {user.is_verified ? "Remove verified badge" : "Verify profile"}
            </button>
          </div>
          {user.profile_id && !user.is_suspicious && (
            <input
              value={flagNote}
              onChange={(e) => setFlagNote(e.target.value)}
              placeholder="Note for the user (optional)"
              maxLength={500}
              className="min-w-[220px] rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm"
            />
          )}
          <button
            disabled={saving || !user.profile_id}
            onClick={() =>
              patch(
                user.is_suspicious
                  ? { is_suspicious: false }
                  : { is_suspicious: true, suspicious_note: flagNote.trim() || undefined },
              )
            }
            className={`rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-50 ${
              user.is_suspicious
                ? "border border-ink/10 hover:bg-ink/5"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {user.is_suspicious ? "Clear suspicious flag" : "Flag as suspicious"}
          </button>
          {user.username && (
            <a
              href={`/${user.username}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink/90"
            >
              Open public page ↗
            </a>
          )}
        </div>
        <div className="mt-3 flex gap-2 text-xs">
          <Badge ok={user.is_active}>{user.is_active ? "Active" : "Disabled"}</Badge>
          {user.is_superuser && <Badge ok>Superuser</Badge>}
          {user.is_verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-800">
              <VerifiedMark type={user.verification_type} lang="en" size={12} />
              Verified · {VERIFICATION_COPY.en.types[verificationType(user.verification_type)]}
              {user.verified_at && ` · since ${new Date(user.verified_at).toLocaleDateString()}`}
            </span>
          )}
          {user.is_suspicious && <Badge>Suspicious</Badge>}
        </div>
      </section>

      <section className="rounded-2xl border border-ink/10 bg-white/70 p-5 backdrop-blur">
        <h2 className="font-display text-lg font-semibold">Links</h2>
        <ul className="mt-4 divide-y divide-ink/5">
          {user.links.length === 0 && <li className="py-3 text-sm text-ink/50">No links yet.</li>}
          {user.links.map((link) => (
            <li key={link.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {link.title}
                  {!link.is_active && <span className="ml-2 text-xs font-normal text-ink/40">inactive</span>}
                  {link.is_featured && <span className="ml-2 text-xs font-normal text-accent">featured</span>}
                </p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-xs text-ink/45 hover:text-accent"
                >
                  {link.url}
                </a>
              </div>
              <p className="shrink-0 text-sm tabular-nums text-ink/70">{link.clicks_count} clicks</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white/70 p-5 backdrop-blur">
      <p className="text-xs font-medium uppercase tracking-wide text-ink/45">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold tabular-nums">{value.toLocaleString()}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-ink/45">{label}</dt>
      <dd className="mt-1 text-ink">{value}</dd>
    </div>
  );
}

function Badge({ children, ok }: { children: React.ReactNode; ok?: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 font-medium ${
        ok ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
      }`}
    >
      {children}
    </span>
  );
}
