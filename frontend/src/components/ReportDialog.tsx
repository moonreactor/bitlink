"use client";

import { FormEvent, useState } from "react";
import { ApiError, publicApi } from "@/lib/api";
import { REPORT_COPY, REPORT_REASONS } from "@/lib/i18n/report-copy";
import type { SiteLang } from "@/lib/i18n/site";
import type { ReportReason } from "@/lib/types";

type Props = {
  lang: SiteLang;
  /** Report a profile page (and optionally one of its links). */
  username?: string;
  links?: { id: string; title: string }[];
  /** Report a short link instead; the visitor types the code unless one is given. */
  shortCode?: string;
  onClose?: () => void;
  /** Render as a plain card (standalone page) instead of a modal. */
  inline?: boolean;
};

export function ReportForm({ lang, username, links = [], shortCode, onClose, inline }: Props) {
  const t = REPORT_COPY[lang];
  const isShort = !username;
  const [target, setTarget] = useState("");
  const [code, setCode] = useState(shortCode ?? "");
  const [reason, setReason] = useState<ReportReason>("phishing");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await publicApi.report({
        reason,
        details: details.trim() || undefined,
        ...(isShort
          ? { short_code: code.trim() }
          : { username, link_id: target || undefined }),
      });
      setDone(true);
    } catch (err) {
      const status = err instanceof ApiError ? err.status : 0;
      setError(status === 404 ? t.notFound : status === 429 ? t.tooMany : t.failed);
    } finally {
      setBusy(false);
    }
  }

  const field = "w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink";

  if (done) {
    return (
      <div className="space-y-3 text-ink">
        <h2 className="font-display text-lg font-semibold">{t.thanks}</h2>
        <p className="text-sm text-ink/70">{t.thanksText}</p>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white"
          >
            {t.close}
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3 text-ink">
      {!inline && (
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">{t.title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="px-2 text-xl leading-none"
          >
            ×
          </button>
        </div>
      )}
      {!inline && <p className="text-sm text-ink/65">{t.intro}</p>}

      {isShort ? (
        <label className="block text-sm font-medium">
          {t.shortCode}
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t.shortCodePlaceholder}
            maxLength={200}
            required
            className={`${field} mt-1 font-normal`}
          />
        </label>
      ) : (
        links.length > 0 && (
          <label className="block text-sm font-medium">
            {t.target}
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className={`${field} mt-1 font-normal`}
            >
              <option value="">{t.wholePage}</option>
              {links.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>
          </label>
        )
      )}

      <label className="block text-sm font-medium">
        {t.reason}
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value as ReportReason)}
          className={`${field} mt-1 font-normal`}
        >
          {REPORT_REASONS.map((r) => (
            <option key={r} value={r}>
              {t.reasons[r]}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium">
        {t.details}
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder={t.detailsPlaceholder}
          maxLength={1000}
          rows={3}
          className={`${field} mt-1 font-normal`}
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy ? t.sending : t.submit}
        </button>
        {onClose && !inline && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-ink/15 px-4 py-2.5 text-sm font-semibold"
          >
            {t.cancel}
          </button>
        )}
      </div>
    </form>
  );
}

export function ReportDialog(props: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && props.onClose?.()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-2xl bg-white p-5"
      >
        <ReportForm {...props} />
      </div>
    </div>
  );
}
