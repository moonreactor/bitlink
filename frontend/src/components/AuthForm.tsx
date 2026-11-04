"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { authApi } from "@/lib/api";
import { setTokens } from "@/lib/auth";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode !== "register") return;
    const fromQuery = searchParams.get("username");
    if (!fromQuery) return;
    const clean = fromQuery
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 30);
    if (clean) setUsername(clean);
  }, [mode, searchParams]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
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
            });
      setTokens(tokens.access_token, tokens.refresh_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <Link href="/" className="font-display mb-8 text-2xl font-bold text-ink">
        Bitlink
      </Link>
      <h1 className="font-display text-3xl font-bold text-ink">
        {mode === "login" ? "Welcome back" : "Create your page"}
      </h1>
      <p className="mt-2 text-sm text-ink/60">
        {mode === "login" ? "Log in to edit your links." : "Free forever. No credit card."}
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {mode === "register" && (
          <>
            <Field label="Username" value={username} onChange={setUsername} placeholder="yourname" required />
            <Field
              label="Display name"
              value={displayName}
              onChange={setDisplayName}
              placeholder="Your Name"
            />
          </>
        )}
        <Field label="Email" type="email" value={email} onChange={setEmail} required />
        <Field label="Password" type="password" value={password} onChange={setPassword} required />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-ink py-3 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:opacity-60"
        >
          {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        {mode === "login" ? (
          <>
            No account?{" "}
            <Link href="/register" className="font-semibold text-accent">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have one?{" "}
            <Link href="/login" className="font-semibold text-accent">
              Log in
            </Link>
          </>
        )}
      </p>
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
      <span className="mb-1.5 block font-medium text-ink/80">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-ink/10 bg-white/80 px-3 py-2.5 outline-none ring-accent/30 focus:ring-2"
      />
    </label>
  );
}
