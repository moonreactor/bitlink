"use client";

import { FormEvent, useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { VerifiedMark } from "@/components/VerifiedBadge";
import { verificationApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { MyVerification, VerificationRequirementKey } from "@/lib/types";
import {
  VERIFICATION_COPY,
  VERIFICATION_TYPES,
  verificationType,
  verifiedSince,
  type VerificationType,
} from "@/lib/verification";

const REQUIREMENT_LABEL: Record<VerificationRequirementKey, { label: string; hint: string }> = {
  avatar: { label: "Profile photo", hint: "Add one in Profile above." },
  bio: { label: "Bio", hint: "Say who you are in Profile above." },
  social_profile: { label: "At least one social profile", hint: "Add a social icon in Links." },
  account_age: { label: "Account at least 7 days old", hint: "New accounts have to wait a week." },
  not_flagged: { label: "No policy warnings", hint: "Profiles under review cannot ask." },
  custom_domain: { label: "Your own domain (optional)", hint: "A verified domain makes your request stronger." },
};

const TYPE_HINT: Record<VerificationType, string> = {
  creator: "You make content: music, videos, photos, writing…",
  public_figure: "You are widely known by name: artist, athlete, journalist, politician…",
  brand: "A company, shop or product.",
  organization: "A non-profit, school, government body, community…",
};

const TYPES = VERIFICATION_COPY.en.types;

/** Owner's side of the badge: requirements, proof code, request form and its status. */
export function VerificationSection() {
  const { success, error: toastError } = useToast();
  const [data, setData] = useState<MyVerification | null>(null);
  const [type, setType] = useState<VerificationType>("creator");
  const [links, setLinks] = useState<string[]>([""]);
  const [reason, setReason] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    verificationApi.get(token).then(setData).catch(() => {});
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    setSending(true);
    try {
      const updated = await verificationApi.request(token, {
        verification_type: type,
        reason: reason.trim() || undefined,
        evidence_urls: links.map((l) => l.trim()).filter(Boolean),
      });
      setData(updated);
      success("Request sent — we will review it soon");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Could not send the request");
    } finally {
      setSending(false);
    }
  }

  async function copyCode() {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.proof_code);
      success("Code copied");
    } catch {
      toastError("Could not copy");
    }
  }

  if (!data) return null;
  const latest = data.latest_request;

  return (
    <section id="verification" className="mu-dash-block scroll-mt-24">
      <header>
        <h2 className="mu-dash-h2">Verification</h2>
        <p className="mu-dash-lead">
          A verified badge tells visitors your page really is you. The Bitlink team reviews every request.
        </p>
      </header>

      {data.is_verified ? (
        <p className="flex items-center gap-2 text-sm">
          <VerifiedMark type={data.verification_type} lang="en" size={20} />
          <span className="font-semibold">
            Verified · {TYPES[verificationType(data.verification_type)]}
          </span>
          {data.verified_at && (
            <span className="text-ink/55">since {verifiedSince(data.verified_at, "en")}</span>
          )}
        </p>
      ) : (
        <div className="space-y-5">
          <Status data={data} />

          <div>
            <p className="mb-2 text-sm font-medium">Requirements</p>
            <ul className="space-y-1.5 text-sm">
              {data.requirements.map((r) => (
                <li key={r.key} className="flex items-start gap-2">
                  <span
                    aria-hidden
                    className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      r.met
                        ? "bg-emerald-500 text-white"
                        : r.required
                          ? "border border-ink/25 text-ink/40"
                          : "border border-dashed border-ink/25 text-ink/40"
                    }`}
                  >
                    {r.met ? "✓" : ""}
                  </span>
                  <span>
                    <span className={r.met ? "" : "font-medium"}>{REQUIREMENT_LABEL[r.key].label}</span>
                    <span className="sr-only">{r.met ? " — done" : " — missing"}</span>
                    {!r.met && (
                      <span className="block text-xs text-ink/55">{REQUIREMENT_LABEL[r.key].hint}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {(data.can_request || data.blocked_reason === "requirements") && (
            <form onSubmit={submit} className="space-y-4">
              <div className="rounded-2xl border border-ink/10 bg-white/70 p-4 text-sm">
                <p className="font-medium">1. Prove the accounts are yours</p>
                <p className="mt-1 text-xs text-ink/60">
                  Put this code in the bio of one of your social profiles or on your website (you can
                  remove it after we review). If you have your own domain you can add it as a DNS TXT
                  record instead.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <code className="rounded-lg bg-ink/5 px-2.5 py-1.5 font-mono text-sm">{data.proof_code}</code>
                  <button type="button" onClick={copyCode} className="mu-btn-ghost">
                    Copy
                  </button>
                </div>
              </div>

              <fieldset className="space-y-2">
                <legend className="mb-1.5 text-sm font-medium">2. What kind of account is this?</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {VERIFICATION_TYPES.map((t) => (
                    <label
                      key={t}
                      className={`flex cursor-pointer items-start gap-2 rounded-xl border p-3 text-sm ${
                        type === t ? "border-ink/40 bg-white" : "border-ink/10"
                      }`}
                    >
                      <input
                        type="radio"
                        name="verification-type"
                        value={t}
                        checked={type === t}
                        onChange={() => setType(t)}
                        className="mt-1"
                      />
                      <span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <VerifiedMark type={t} lang="en" size={14} />
                          {TYPES[t]}
                        </span>
                        <span className="block text-xs text-ink/55">{TYPE_HINT[t]}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="space-y-2">
                <p className="text-sm font-medium">3. Links where we can see the code</p>
                {links.map((value, i) => (
                  <div key={i} className="flex gap-2">
                    <label className="sr-only" htmlFor={`evidence-${i}`}>
                      Link {i + 1}
                    </label>
                    <input
                      id={`evidence-${i}`}
                      className="mu-input"
                      type="url"
                      inputMode="url"
                      placeholder="https://instagram.com/yourname"
                      value={value}
                      onChange={(e) => setLinks((l) => l.map((x, j) => (j === i ? e.target.value : x)))}
                    />
                    {links.length > 1 && (
                      <button
                        type="button"
                        aria-label={`Remove link ${i + 1}`}
                        className="mu-btn-ghost"
                        onClick={() => setLinks((l) => l.filter((_, j) => j !== i))}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                {links.length < 5 && (
                  <button type="button" className="text-xs font-semibold text-meetup-purple" onClick={() => setLinks((l) => [...l, ""])}>
                    + Add another link
                  </button>
                )}
              </div>

              <label className="block text-sm">
                <span className="mb-1.5 block font-medium">Anything else we should know? (optional)</span>
                <textarea
                  className="mu-input"
                  rows={3}
                  maxLength={1000}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Press coverage, official website, other accounts…"
                />
              </label>

              <button
                type="submit"
                className="mu-btn-primary"
                disabled={!data.can_request || sending || !links.some((l) => l.trim())}
              >
                {sending ? "Sending…" : "Ask for verification"}
              </button>
              {!data.can_request && (
                <p className="text-xs text-ink/55">Complete the requirements above to send your request.</p>
              )}
            </form>
          )}

          {latest && latest.status === "rejected" && latest.reviewed_at && (
            <p className="text-xs text-ink/50">
              Last request reviewed {new Date(latest.reviewed_at).toLocaleDateString()}.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

function Status({ data }: { data: MyVerification }) {
  const latest = data.latest_request;
  if (data.blocked_reason === "pending" && latest) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">
          {latest.source === "auto" ? "Your badge is being reviewed again" : "Your request is under review"}
        </p>
        <p className="mt-1 text-xs">
          {latest.source === "auto"
            ? "You changed your name, so the team checks the page again before giving the badge back."
            : `Sent ${new Date(latest.created_at).toLocaleDateString()} as ${TYPES[latest.verification_type]}. Keep the code where we can see it until we answer.`}
        </p>
      </div>
    );
  }
  if (data.blocked_reason === "cooldown" && latest) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white/70 p-4 text-sm">
        <p className="font-semibold">Your last request was not approved</p>
        {latest.decision_note && <p className="mt-1">“{latest.decision_note}”</p>}
        {data.cooldown_until && (
          <p className="mt-1 text-xs text-ink/55">
            You can ask again on {new Date(data.cooldown_until).toLocaleDateString()}.
          </p>
        )}
      </div>
    );
  }
  if (data.blocked_reason === "flagged") {
    return (
      <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        Your page has a policy warning. It cannot be verified until that is resolved.
      </p>
    );
  }
  if (latest?.status === "rejected" && latest.decision_note) {
    return (
      <p className="rounded-2xl border border-ink/10 bg-white/70 p-4 text-sm">
        Last time we said: “{latest.decision_note}”
      </p>
    );
  }
  return null;
}
