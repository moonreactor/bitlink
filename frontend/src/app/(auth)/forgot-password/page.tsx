"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { BitlinkLogo } from "@/components/BitlinkLogo";
import { authApi } from "@/lib/api";
import { AUTH } from "@/lib/i18n/auth-copy";
import { homePath } from "@/lib/i18n/site";
import { useSiteLang } from "@/lib/i18n/useSiteLang";

export default function ForgotPasswordPage() {
  const lang = useSiteLang();
  const t = AUTH[lang];
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setResetUrl(null);
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      setMessage(res.message);
      if (res.reset_url) setResetUrl(res.reset_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.resetStartFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-meetup-bg">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-12">
        <BitlinkLogo className="mb-8" height={30} href={homePath(lang)} />
        <div className="mu-card p-6 md:p-8">
          <h1 className="font-display text-2xl font-bold text-ink">{t.resetTitle}</h1>
          <p className="mt-2 text-sm text-meetup-muted">
            {t.resetSub}
          </p>
          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <label className="block text-sm">
              <span className="mb-1.5 block font-semibold text-ink">{t.email}</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mu-input"
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {message && <p className="text-sm text-ink">{message}</p>}
            {resetUrl && (
              <p className="rounded-xl bg-meetup-lavender p-3 text-sm text-meetup-purple">
                {t.devLink}{" "}
                <a href={resetUrl} className="font-semibold underline break-all">
                  {resetUrl}
                </a>
              </p>
            )}
            <button type="submit" disabled={loading} className="mu-btn-primary w-full py-3">
              {loading ? t.wait : t.sendReset}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-meetup-muted">
          <Link href="/login" className="font-semibold text-meetup-purple hover:underline">
            {t.backToLogin}
          </Link>
        </p>
      </div>
    </div>
  );
}
