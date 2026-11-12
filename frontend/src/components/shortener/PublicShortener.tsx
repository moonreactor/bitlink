"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ApiError, publicApi } from "@/lib/api";
import { addClaimToken } from "@/lib/claims";

const COPY = {
  en: {
    placeholder: "Paste a long link…",
    button: "Shorten",
    loading: "Shortening…",
    copy: "Copy",
    copied: "Copied",
    note: "Want to see how many people click it?",
    cta: "Create a free account to track clicks",
    login: "I already have an account",
    error: "Could not shorten this link. Please try again.",
    label: "Long URL",
    askTitle: "Want to track this link?",
    askBody: "Add your email to create a free account and see clicks, countries and devices. Or keep it anonymous.",
    emailLabel: "Your email",
    emailPlaceholder: "you@email.com",
    withAccount: "Create account & track",
    anonymous: "Keep it anonymous",
    back: "Edit link",
    invalidEmail: "Please enter a valid email.",
  },
  es: {
    placeholder: "Pegá un link largo…",
    button: "Acortar",
    loading: "Acortando…",
    copy: "Copiar",
    copied: "Copiado",
    note: "¿Querés ver cuánta gente hace clic?",
    cta: "Creá una cuenta gratis para ver las métricas",
    login: "Ya tengo cuenta",
    error: "No pudimos acortar el link. Intentá de nuevo.",
    label: "URL larga",
    askTitle: "¿Querés seguir las métricas de este link?",
    askBody: "Dejá tu email para crear una cuenta gratis y ver clics, países y dispositivos. O seguí de forma anónima.",
    emailLabel: "Tu email",
    emailPlaceholder: "vos@email.com",
    withAccount: "Crear cuenta y ver métricas",
    anonymous: "Seguir anónimo",
    back: "Editar link",
    invalidEmail: "Ingresá un email válido.",
  },
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function PublicShortener({
  lang = "en",
  source,
}: {
  lang?: "en" | "es";
  /** Where the widget lives, for funnel analytics: landing | en | es. */
  source?: "landing" | "en" | "es";
}) {
  const src = source ?? lang;
  const track = (event: string) => void publicApi.trackShortenerEvent(event, src);
  const rootRef = useRef<HTMLDivElement>(null);
  const t = COPY[lang];
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [asking, setAsking] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          publicApi.trackShortenerEvent("view", src);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setError("");
    setResult(null);
    setCopied(false);
    track("submit");
    // Ask first: track with an account, or stay anonymous.
    setAsking(true);
  }

  async function create(): Promise<string | null> {
    setError("");
    setLoading(true);
    try {
      const res = await publicApi.createShortLink(url.trim(), src);
      addClaimToken(res.claim_token);
      return res.short_url;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function stayAnonymous() {
    track("choose_anonymous");
    const short = await create();
    if (short) {
      setResult(short);
      setAsking(false);
    }
  }

  async function withAccount() {
    const clean = email.trim();
    if (!EMAIL_RE.test(clean)) {
      setError(t.invalidEmail);
      return;
    }
    track("choose_account");
    // Create the link first so it is claimed automatically once the account exists.
    const short = await create();
    if (short) router.push(`/register?email=${encodeURIComponent(clean)}`);
  }

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      track("copy");
    } catch {
      /* ignore */
    }
  }

  return (
    <div ref={rootRef} className="w-full max-w-2xl">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setAsking(false);
          }}
          placeholder={t.placeholder}
          aria-label={t.label}
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          className="min-h-[52px] flex-1 rounded-full bg-white px-5 text-[15px] text-ink shadow-meetup outline-none ring-1 ring-meetup-border placeholder:text-meetup-muted/60 focus:ring-meetup-purple"
        />
        <button
          type="submit"
          disabled={loading}
          className="min-h-[52px] rounded-full bg-black px-6 text-[15px] font-semibold text-white transition hover:bg-ink disabled:opacity-60"
        >
          {t.button}
        </button>
      </form>

      <div aria-live="polite">
        {asking && (
          <div className="mt-4 rounded-2xl bg-white p-5 text-left shadow-meetup ring-1 ring-meetup-border">
            <p className="font-display text-lg font-bold text-ink">{t.askTitle}</p>
            <p className="mt-1 text-sm text-meetup-muted">{t.askBody}</p>
            <label className="mt-4 block text-sm">
              <span className="mb-1.5 block font-semibold text-ink">{t.emailLabel}</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                autoComplete="email"
                className="mu-input"
              />
            </label>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={withAccount}
                disabled={loading}
                className="min-h-[48px] flex-1 rounded-full bg-meetup-purple px-5 text-[15px] font-semibold text-white disabled:opacity-60"
              >
                {loading ? t.loading : t.withAccount}
              </button>
              <button
                type="button"
                onClick={stayAnonymous}
                disabled={loading}
                className="min-h-[48px] flex-1 rounded-full bg-meetup-lavender px-5 text-[15px] font-semibold text-meetup-purple disabled:opacity-60"
              >
                {t.anonymous}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setAsking(false)}
              className="mt-3 text-sm font-semibold text-meetup-muted hover:underline"
            >
              {t.back}
            </button>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {result && (
          <div className="mt-4 rounded-2xl bg-white p-4 text-left shadow-meetup ring-1 ring-meetup-border">
            <div className="flex items-center justify-between gap-3">
              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate font-display text-lg font-bold text-meetup-purple hover:underline"
              >
                {result.replace(/^https?:\/\//, "")}
              </a>
              <button
                type="button"
                onClick={copy}
                className="shrink-0 rounded-full bg-meetup-lavender px-4 py-2 text-sm font-semibold text-meetup-purple"
              >
                {copied ? t.copied : t.copy}
              </button>
            </div>
            <p className="mt-3 text-sm text-meetup-muted">{t.note}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
              <Link href="/register" className="text-meetup-purple hover:underline">
                {t.cta}
              </Link>
              <Link href="/login" className="text-meetup-muted hover:underline">
                {t.login}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
