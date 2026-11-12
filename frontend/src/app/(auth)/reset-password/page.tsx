"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { BitlinkLogo } from "@/components/BitlinkLogo";
import { authApi } from "@/lib/api";
import { setTokens } from "@/lib/auth";
import { AUTH } from "@/lib/i18n/auth-copy";
import { homePath } from "@/lib/i18n/site";
import { useSiteLang } from "@/lib/i18n/useSiteLang";

function ResetPasswordForm() {
  const lang = useSiteLang();
  const t = AUTH[lang];
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!token) {
      setError(t.missingToken);
      return;
    }
    if (password.length < 8) {
      setError(t.passwordShort);
      return;
    }
    if (password !== confirm) {
      setError(t.mismatch);
      return;
    }
    setLoading(true);
    try {
      const tokens = await authApi.resetPassword(token, password);
      setTokens(tokens.access_token, tokens.refresh_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : t.resetFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-meetup-bg">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-12">
        <BitlinkLogo className="mb-8" height={30} href={homePath(lang)} />
        <div className="mu-card p-6 md:p-8">
          <h1 className="font-display text-2xl font-bold text-ink">{t.chooseTitle}</h1>
          <p className="mt-2 text-sm text-meetup-muted">{t.chooseSub}</p>
          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <label className="block text-sm">
              <span className="mb-1.5 block font-semibold text-ink">{t.newPassword}</span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mu-input"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-semibold text-ink">{t.confirmPassword}</span>
              <input
                type="password"
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mu-input"
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading || !token} className="mu-btn-primary w-full py-3">
              {loading ? t.wait : t.updatePassword}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-meetup-muted">
          <Link href="/forgot-password" className="font-semibold text-meetup-purple hover:underline">
            {t.requestNew}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6">
          <p className="text-sm text-ink/60">Loading…</p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
