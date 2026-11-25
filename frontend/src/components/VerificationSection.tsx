"use client";

import { FormEvent, useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { VerifiedMark } from "@/components/VerifiedBadge";
import { verificationApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { BadgeTheme } from "@/lib/badgeSvg";
import type { SiteLang } from "@/lib/i18n/site";
import { siteUrl } from "@/lib/site";
import type { IdentityAlert, IdentityAlertList, MyVerification, VerificationRequirementKey } from "@/lib/types";
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
export function VerificationSection({ username }: { username: string }) {
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

  // The page scrolls to #verification before this section has loaded; finish the job once it has.
  const loaded = data !== null;
  useEffect(() => {
    if (!loaded || window.location.hash !== "#verification") return;
    // After this render and the router's own scroll handling, which would otherwise undo it.
    const id = window.setTimeout(
      () => document.getElementById("verification")?.scrollIntoView({ block: "start" }),
      50,
    );
    return () => window.clearTimeout(id);
  }, [loaded]);

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

  async function copyText(text: string, done = "Copied") {
    try {
      await navigator.clipboard.writeText(text);
      success(done);
    } catch {
      toastError("Could not copy");
    }
  }

  async function copyCode() {
    if (data) await copyText(data.proof_code, "Code copied");
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
      ) : null}
      {data.is_verified && <IdentityAlerts />}
      {data.is_verified && username ? (
        <EmbedKit username={username} onCopy={copyText} />
      ) : data.is_verified ? null : (
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

/** "Verified on Bitlink" badge for the owner's website or README, linking back to their page. */
function EmbedKit({ username, onCopy }: { username: string; onCopy: (text: string) => void }) {
  const [theme, setTheme] = useState<BadgeTheme>("light");
  const [lang, setLang] = useState<SiteLang>("en");
  const base = siteUrl();
  const page = `${base}/${username}`;
  const params = new URLSearchParams();
  if (theme === "dark") params.set("theme", "dark");
  if (lang !== "en") params.set("lang", lang);
  const qs = params.toString();
  const img = `${base}/${username}/badge.svg${qs ? `?${qs}` : ""}`;
  const alt = `@${username} — Verified on Bitlink`;
  const html = `<a href="${page}" target="_blank" rel="noopener"><img src="${img}" alt="${alt}" height="28"></a>`;
  const markdown = `[![${alt}](${img})](${page})`;

  return (
    <div className="mt-5 space-y-3 rounded-2xl border border-ink/10 bg-white/70 p-4 text-sm">
      <div>
        <p className="font-medium">Show your badge elsewhere</p>
        <p className="mt-0.5 text-xs text-ink/60">
          Put it on your website, newsletter or GitHub README. It links to your page and updates by
          itself: if the badge is ever removed, it turns into a plain “on Bitlink” label.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <label className="flex items-center gap-1.5">
          Style
          <select value={theme} onChange={(e) => setTheme(e.target.value as BadgeTheme)} className="mu-input !w-auto !py-1">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label className="flex items-center gap-1.5">
          Language
          <select value={lang} onChange={(e) => setLang(e.target.value as SiteLang)} className="mu-input !w-auto !py-1">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="pt">Português</option>
          </select>
        </label>
      </div>
      <div className={`flex justify-center rounded-xl p-4 ${theme === "dark" ? "bg-slate-800" : "bg-slate-50"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={alt} height={28} />
      </div>
      {[
        { label: "HTML", value: html },
        { label: "Markdown", value: markdown },
      ].map((s) => (
        <div key={s.label}>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-ink/70">{s.label}</span>
            <button type="button" className="text-xs font-semibold text-meetup-purple" onClick={() => onCopy(s.value)}>
              Copy
            </button>
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-ink/5 p-2 font-mono text-[11px] text-ink/80">
            {s.value}
          </pre>
        </div>
      ))}
    </div>
  );
}

const REPORT_REASON_LABEL: Record<string, string> = {
  impersonation: "pretending to be someone else",
  phishing: "phishing",
  malware: "malware",
  scam: "a scam",
  spam: "spam",
  adult: "adult content",
  illegal: "illegal content",
  other: "another reason",
};

function alertText(a: IdentityAlert): { title: string; detail: string } {
  if (a.kind === "blocked_username") {
    return {
      title: `Someone tried to take the username @${a.subject}`,
      detail: "It looks too much like yours, so we didn't allow it.",
    };
  }
  if (a.kind === "blocked_display_name") {
    return {
      title: `Someone tried to use the name “${a.subject}”`,
      detail: "It's your verified name, so we didn't allow it.",
    };
  }
  return {
    title: `${a.subject} was reported`,
    detail: `A visitor reported this profile, which looks like yours, for ${
      REPORT_REASON_LABEL[a.report_reason ?? "other"] ?? "another reason"
    }. Our team is reviewing it.`,
  };
}

/** Impersonation alerts: names like yours we refused, and reported look-alike profiles. */
function IdentityAlerts() {
  const [data, setData] = useState<IdentityAlertList | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    verificationApi.alerts(token).then(setData).catch(() => {});
  }, []);

  async function markSeen() {
    const token = getAccessToken();
    if (!token) return;
    try {
      setData(await verificationApi.markAlertsSeen(token));
      window.dispatchEvent(new Event("bitlink:identity-alerts-seen"));
    } catch {
      /* keep the list as is */
    }
  }

  if (!data) return null;
  return (
    <div className="mt-5 rounded-2xl border border-ink/10 bg-white/70 p-4 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium">
          Impersonation alerts
          {data.unseen > 0 && (
            <span className="ml-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {data.unseen} new
            </span>
          )}
        </p>
        {data.unseen > 0 && (
          <button type="button" className="text-xs font-semibold text-meetup-purple" onClick={markSeen}>
            Mark all as seen
          </button>
        )}
      </div>
      {data.items.length === 0 ? (
        <p className="mt-1 text-xs text-ink/60">
          Nothing so far. We block usernames that look like yours and let you know here if someone tries,
          or if a look-alike profile gets reported.
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-ink/5">
          {data.items.map((a) => {
            const t = alertText(a);
            return (
              <li key={a.id} className="flex gap-2 py-2">
                <span
                  aria-hidden
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.seen ? "bg-ink/15" : "bg-red-500"}`}
                />
                <div className="min-w-0">
                  <p className={`break-words ${a.seen ? "" : "font-semibold"}`}>
                    {t.title}
                    {!a.seen && <span className="sr-only"> (new)</span>}
                  </p>
                  <p className="text-xs text-ink/60">{t.detail}</p>
                  <p className="text-[11px] text-ink/45">{new Date(a.created_at).toLocaleString()}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
