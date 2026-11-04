"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, publicApi } from "@/lib/api";

type Status = "idle" | "checking" | "available" | "taken" | "invalid";

function sanitize(raw: string) {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 30);
}

export function ClaimUsername({
  variant = "hero",
  buttonLabel = "Get started for free",
}: {
  variant?: "hero" | "footer";
  buttonLabel?: string;
}) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (!username) {
      setStatus("idle");
      return;
    }
    if (username.length < 3) {
      setStatus("invalid");
      return;
    }

    setStatus("checking");
    const t = window.setTimeout(async () => {
      try {
        await publicApi.getProfile(username);
        setStatus("taken");
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setStatus("available");
        } else {
          setStatus("idle");
        }
      }
    }, 450);

    return () => window.clearTimeout(t);
  }, [username]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const clean = sanitize(username);
    if (clean.length < 3) {
      setStatus("invalid");
      return;
    }
    router.push(`/register?username=${encodeURIComponent(clean)}`);
  }

  const isDark = variant === "footer";
  const hint =
    status === "checking"
      ? "Checking…"
      : status === "available"
        ? "Looking good — that name is free"
        : status === "taken"
          ? "Taken — try another"
          : status === "invalid"
            ? "Use 3+ letters, numbers or _"
            : "Claim your Bitlink username";

  return (
    <form onSubmit={onSubmit} className="w-full max-w-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <label
          className={`flex min-h-[52px] flex-1 items-center overflow-hidden rounded-full bg-white px-4 text-[15px] shadow-meetup ring-1 ${
            status === "taken"
              ? "ring-red-400"
              : status === "available"
                ? "ring-emerald-500"
                : "ring-meetup-border"
          }`}
        >
          <span className="shrink-0 font-medium text-meetup-muted">bitlink.app/</span>
          <input
            value={username}
            onChange={(e) => setUsername(sanitize(e.target.value))}
            placeholder="yourname"
            aria-label="Claim your Bitlink username"
            className="w-full min-w-0 bg-transparent py-3 text-ink outline-none placeholder:text-meetup-muted/60"
            autoComplete="username"
            spellCheck={false}
          />
        </label>
        <button
          type="submit"
          className={`min-h-[52px] shrink-0 rounded-full px-6 text-[15px] font-semibold transition hover:scale-[1.02] active:scale-[0.98] ${
            isDark
              ? "bg-white text-ink hover:bg-meetup-lavender"
              : "bg-black text-white hover:bg-ink"
          }`}
        >
          {buttonLabel}
        </button>
      </div>
      <p
        className={`mt-2.5 text-sm ${
          status === "taken"
            ? isDark
              ? "text-red-300"
              : "text-red-600"
            : status === "available"
              ? isDark
                ? "text-emerald-300"
                : "text-emerald-700"
              : isDark
                ? "text-white/70"
                : "text-meetup-muted"
        }`}
        aria-live="polite"
      >
        {hint}
      </p>
    </form>
  );
}
