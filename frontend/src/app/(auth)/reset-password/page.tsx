"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { BitlinkLogo } from "@/components/BitlinkLogo";
import { authApi } from "@/lib/api";
import { setTokens } from "@/lib/auth";

function ResetPasswordForm() {
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
      setError("Missing reset token. Request a new link.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const tokens = await authApi.resetPassword(token, password);
      setTokens(tokens.access_token, tokens.refresh_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-meetup-bg">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-12">
        <BitlinkLogo className="mb-8" height={30} />
        <div className="mu-card p-6 md:p-8">
          <h1 className="font-display text-2xl font-bold text-ink">Choose a new password</h1>
          <p className="mt-2 text-sm text-meetup-muted">Then you’ll be signed in automatically.</p>
          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <label className="block text-sm">
              <span className="mb-1.5 block font-semibold text-ink">New password</span>
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
              <span className="mb-1.5 block font-semibold text-ink">Confirm password</span>
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
              {loading ? "Please wait…" : "Update password"}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-meetup-muted">
          <Link href="/forgot-password" className="font-semibold text-meetup-purple hover:underline">
            Request a new link
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
