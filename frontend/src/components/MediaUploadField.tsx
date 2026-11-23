"use client";

import { useEffect, useRef, useState } from "react";
import { ApiError, mediaApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

type Props = {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  hint?: string;
  allowUrl?: boolean;
};

/** Uploaded files are served under /media/… — those should not fill the paste-URL input. */
function isUploadedMediaUrl(url: string): boolean {
  try {
    return new URL(url).pathname.startsWith("/media/");
  } catch {
    return url.startsWith("/media/");
  }
}

function manualUrlFromValue(value: string | null): string {
  if (!value || isUploadedMediaUrl(value)) return "";
  return value;
}

export function MediaUploadField({
  label,
  value,
  onChange,
  hint,
  allowUrl = true,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [manualUrl, setManualUrl] = useState(() => manualUrlFromValue(value));

  useEffect(() => {
    setManualUrl(manualUrlFromValue(value));
  }, [value]);

  async function onFile(file: File | undefined) {
    if (!file) return;
    const token = getAccessToken();
    if (!token) {
      setError("Not authenticated");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const res = await mediaApi.upload(token, file);
      setManualUrl("");
      onChange(res.url);
    } catch (err) {
      setError(err instanceof ApiError || err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function clear() {
    setManualUrl("");
    onChange(null);
  }

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium">{label}</span>
      <div className="flex items-start gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-14 w-14 rounded-xl object-cover ring-1 ring-ink/10" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-dashed border-meetup-border text-[10px] text-meetup-muted">
            Preview
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="rounded-xl border border-meetup-border bg-white px-3 py-2 text-sm font-semibold hover:border-meetup-purple/40 disabled:opacity-60"
            >
              {uploading ? "Uploading…" : "Upload image"}
            </button>
            {value && (
              <button
                type="button"
                onClick={clear}
                className="rounded-xl px-3 py-2 text-sm font-medium text-meetup-muted hover:text-ink"
              >
                Remove
              </button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          {allowUrl && (
            <input
              className="w-full rounded-xl border border-meetup-border px-3 py-2 text-sm"
              placeholder="or paste https://…/image.jpg"
              value={manualUrl}
              onChange={(e) => {
                const next = e.target.value;
                setManualUrl(next);
                onChange(next.trim() || null);
              }}
            />
          )}
          {hint && <p className="text-[11px] text-ink/40">{hint}</p>}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
