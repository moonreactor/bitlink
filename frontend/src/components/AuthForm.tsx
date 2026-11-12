"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { BitlinkLogo } from "@/components/BitlinkLogo";
import { authApi, shortLinksApi } from "@/lib/api";
import { setTokens } from "@/lib/auth";
import { clearClaimTokens, getClaimTokens } from "@/lib/claims";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [referredBy, setReferredBy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasPendingLinks, setHasPendingLinks] = useState(false);

  useEffect(() => {
    setHasPendingLinks(getClaimTokens().length > 0);
  }, []);

  useEffect(() => {
    if (mode !== "register") return;
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailFromQuery)) {
      setEmail(emailFromQuery);
    }
    const fromQuery = searchParams.get("username");
    if (fromQuery) {
      const clean = fromQuery
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "")
        .slice(0, 30);
      if (clean) setUsername(clean);
    }

    const refParam = searchParams.get("ref");
    let ref =
      refParam
        ?.toLowerCase()
        .replace(/[^a-z0-9_]/g, "")
        .slice(0, 30) || "";
    if (!ref) {
      try {
        ref = (localStorage.getItem("bitlink_ref") || "")
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, "")
          .slice(0, 30);
      } catch {
        ref = "";
      }
    }
    if (ref.length >= 3) {
      setReferredBy(ref);
      try {
        localStorage.setItem("bitlink_ref", ref);
      } catch {
        /* ignore */
      }
    }
  }, [mode, searchParams]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (mode === "register") {
      if (username.trim().length < 3) {
        setError("Username must be at least 3 characters.");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
    }

    setLoading(true);
    try {
      const tokens =
        mode === "login"
          ? await authApi.login({ email, password })
          : await authApi.register({
              email,
              password,
              username,
              display_name: displayName || username,
              referred_by_username: referredBy || undefined,
            });
      setTokens(tokens.access_token, tokens.refresh_token);
      try {
        localStorage.removeItem("bitlink_ref");
      } catch {
        /* ignore */
      }
      let claimed = 0;
      const pending = getClaimTokens();
      if (pending.length) {
        try {
          claimed = (await shortLinksApi.claim(tokens.access_token, pending)).claimed;
          clearClaimTokens();
        } catch {
          /* keep tokens; they can be claimed on the next login */
        }
      }
      router.push(claimed > 0 ? "/dashboard/short-links" : "/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : mode === "login"
            ? "Could not log in. Please try again."
            : "Could not create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-meetup-bg">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-12">
        <BitlinkLogo className="mb-8" height={30} />

        <div className="mu-card p-6 md:p-8">
          <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">
            {mode === "login" ? "Welcome back" : "Create your page"}
          </h1>
          <p className="mt-2 text-sm text-meetup-muted">
            {mode === "login"
              ? "Log in to edit your links."
              : referredBy
                ? `Free forever. Invited from @${referredBy}.`
                : "Free forever. No credit card."}
          </p>

          {hasPendingLinks && (
            <p className="mt-4 rounded-xl bg-meetup-lavender px-3 py-2 text-sm font-semibold text-meetup-purple">
              {mode === "register"
                ? "Your short link is waiting — create your account to see its clicks."
                : "Log in to add your short link to your account and see its clicks."}
            </p>
          )}

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            {mode === "register" && (
              <>
                <Field
                  label="Username"
                  value={username}
                  onChange={setUsername}
                  placeholder="yourname"
                  required
                />
                <Field
                  label="Display name"
                  value={displayName}
                  onChange={setDisplayName}
                  placeholder="Your Name"
                />
              </>
            )}
            <Field label="Email" type="email" value={email} onChange={setEmail} required />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              required
            />

            {mode === "login" && (
              <div className="-mt-2 text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-meetup-purple hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={loading} className="mu-btn-primary w-full py-3">
              {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-meetup-muted">
          {mode === "login" ? (
            <>
              No account?{" "}
              <Link href="/register" className="font-semibold text-meetup-purple hover:underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have one?{" "}
              <Link href="/login" className="font-semibold text-meetup-purple hover:underline">
                Log in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-semibold text-ink">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mu-input"
      />
    </label>
  );
}
