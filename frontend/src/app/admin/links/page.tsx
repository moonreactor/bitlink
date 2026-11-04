"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { AdminLinkItem } from "@/lib/types";

export default function AdminLinksPage() {
  const [items, setItems] = useState<AdminLinkItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pageSize = 20;

  const load = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.links(token, { q: search || undefined, page, page_size: pageSize });
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load links");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(q.trim());
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Links</h1>
          <p className="mt-1 text-sm text-ink/55">
            {total.toLocaleString()} link{total === 1 ? "" : "s"} across all profiles.
          </p>
        </div>
        <form onSubmit={onSearch} className="flex w-full max-w-md gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, URL, username…"
            className="w-full rounded-xl border border-ink/10 bg-white/80 px-3 py-2.5 text-sm outline-none ring-accent/30 focus:ring-2"
          />
          <button
            type="submit"
            className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink/90"
          >
            Search
          </button>
        </form>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white/70 backdrop-blur">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-ink/10 bg-ink/[0.03] text-xs uppercase tracking-wide text-ink/45">
              <tr>
                <th className="px-4 py-3 font-medium">Link</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Clicks</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-ink/50">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-ink/50">
                    No links found.
                  </td>
                </tr>
              )}
              {!loading &&
                items.map((link) => (
                  <tr key={link.id} className="border-t border-ink/5 hover:bg-ink/[0.02]">
                    <td className="px-4 py-3">
                      <p className="font-medium">{link.title}</p>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block max-w-md truncate text-xs text-ink/45 hover:text-accent"
                      >
                        {link.url}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      {link.user_id ? (
                        <Link href={`/admin/users/${link.user_id}`} className="text-accent hover:underline">
                          @{link.username}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          link.is_active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {link.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums">{link.clicks_count}</td>
                    <td className="px-4 py-3 text-ink/55">
                      {new Date(link.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <p className="text-ink/50">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-ink/10 px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-ink/10 px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
