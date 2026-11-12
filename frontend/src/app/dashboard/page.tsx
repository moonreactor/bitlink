"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { QuickAddLink } from "@/components/dashboard/QuickAddLink";
import { SetupChecklist, type SetupStep } from "@/components/dashboard/SetupChecklist";
import { useToast } from "@/components/Toast";
import { analyticsApi, linksApi, profileApi, socialApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { displayPageUrl, hasSharedPage, sharePage } from "@/lib/share";
import type { AnalyticsSummary, LinkItem, Profile, SocialLink, Subscriber } from "@/lib/types";

const SETUP_HIDDEN_KEY = "bitlink_setup_hidden";

type Tab = "overview" | "clicks" | "audience";
type RangeKey = "7d" | "30d" | "90d" | "all";

const RANGES: { id: RangeKey; label: string }[] = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
  { id: "all", label: "All time" },
];

function rangeParams(key: RangeKey): { from?: string; to?: string } {
  if (key === "all") return {};
  const days = key === "7d" ? 7 : key === "30d" ? 30 : 90;
  const from = new Date();
  from.setUTCHours(0, 0, 0, 0);
  from.setUTCDate(from.getUTCDate() - (days - 1));
  return { from: from.toISOString() };
}

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => {
          const v = String(cell ?? "");
          if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
          return v;
        })
        .join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DashboardOverviewPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<AnalyticsSummary | null>(null);
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [tab, setTab] = useState<Tab>("overview");
  const [range, setRange] = useState<RangeKey>("30d");
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<LinkItem[] | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [shared, setShared] = useState(false);
  const [setupHidden, setSetupHidden] = useState(false);
  const { success, error: toastError } = useToast();

  const load = useCallback(async (rangeKey: RangeKey) => {
    const token = getAccessToken();
    if (!token) return;
    setLoading(true);
    try {
      const [p, s, sub] = await Promise.all([
        profileApi.get(token),
        analyticsApi.summary(token, rangeParams(rangeKey)),
        analyticsApi.subscribers(token),
      ]);
      setProfile(p);
      setStats(s);
      setSubs(sub);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSetup = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    const [l, so] = await Promise.all([
      linksApi.list(token).catch(() => [] as LinkItem[]),
      socialApi.list(token).catch(() => [] as SocialLink[]),
    ]);
    setLinks(l);
    setSocials(so);
  }, []);

  useEffect(() => {
    load(range);
  }, [load, range]);

  useEffect(() => {
    loadSetup();
    setShared(hasSharedPage());
    try {
      setSetupHidden(localStorage.getItem(SETUP_HIDDEN_KEY) === "1");
    } catch {
      /* ignore */
    }
    const onShared = () => setShared(true);
    window.addEventListener("bitlink:shared", onShared);
    return () => window.removeEventListener("bitlink:shared", onShared);
  }, [loadSetup]);

  async function onShare() {
    if (!profile) return;
    const res = await sharePage(profile.username, profile.display_name);
    if (res === "copied") success("Link copied — paste it in your Instagram or TikTok bio");
    else if (res === "failed") toastError("Couldn’t share — copy the link manually");
  }

  const realLinks = (links || []).filter((l) => l.link_type !== "header");
  const hasLinks = realLinks.length > 0;
  const steps: SetupStep[] = profile
    ? [
        {
          id: "link",
          title: "Add your first link",
          hint: "Instagram, WhatsApp, your shop… whatever you want people to tap.",
          done: hasLinks,
          // The quick-add box is already on screen when there are no links: point to it.
          cta: "Add it above ↑",
          onClick: () => {
            const el = document.getElementById("quick-add-url");
            el?.scrollIntoView({ behavior: "smooth", block: "center" });
            el?.focus({ preventScroll: true });
          },
        },
        {
          id: "profile",
          title: "Add a photo and a short bio",
          hint: "Pages with a photo get noticeably more clicks — people trust a face.",
          done: Boolean(profile.avatar_url && profile.bio),
          cta: "Edit profile",
          href: "/dashboard/settings#profile",
        },
        {
          id: "socials",
          title: "Add your social icons",
          hint: "Small icons under your name so people can follow you everywhere.",
          done: socials.length > 0,
          cta: "Add socials",
          href: "/dashboard/settings#socials",
        },
        {
          id: "share",
          title: "Share your page",
          hint: "Put it in your Instagram / TikTok bio — that’s where the clicks come from.",
          done: shared,
          cta: "Share my page",
          onClick: onShare,
        },
      ]
    : [];
  const setupComplete = steps.length > 0 && steps.every((s) => s.done);
  const showSetup = links !== null && steps.length > 0 && !setupComplete && !(setupHidden && hasLinks);
  // New, empty page: analytics full of zeros is noise — lead with the action instead.
  const showAnalytics = links !== null && (hasLinks || (stats?.total_views ?? 0) > 0);

  const rangeHint = useMemo(
    () => RANGES.find((r) => r.id === range)?.label || "All time",
    [range],
  );

  function exportSubscribers() {
    downloadCsv("bitlink-subscribers.csv", [
      ["email", "phone", "subscribed_at"],
      ...subs.map((s) => [s.email || "", s.phone || "", s.created_at]),
    ]);
  }

  function exportClicks() {
    downloadCsv("bitlink-link-clicks.csv", [
      ["link_id", "title", "clicks"],
      ...(stats?.links || []).map((l) => [l.link_id, l.title, String(l.clicks)]),
    ]);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {profile ? `Hi, ${profile.display_name.split(" ")[0]}` : "Your page"}
          </h1>
          <p className="mt-1 truncate text-sm text-meetup-muted">
            {profile ? displayPageUrl(profile.username) : "Loading…"}
          </p>
        </div>
        <div className="hidden flex-wrap gap-2 sm:flex">
          <Link href="/dashboard/links?add=1" className="mu-btn-primary">
            + Add link
          </Link>
          <Link href="/dashboard/appearance" className="mu-btn-secondary">
            Edit design
          </Link>
        </div>
      </div>

      {links !== null && !hasLinks && (
        <section className="mu-card overflow-hidden">
          <div className="bg-gradient-to-br from-meetup-lavender to-white p-5 md:p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-meetup-purple shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden /> Your page is live — but empty
            </span>
            <h2 className="mt-3 font-display text-xl font-bold text-ink md:text-2xl">
              Add your first link
            </h2>
            <p className="mt-1 text-sm text-meetup-muted">
              Tap a platform and type your handle, or paste any link. It shows up on your page instantly.
            </p>
            <div className="mt-4">
              <QuickAddLink onCreated={() => loadSetup()} />
            </div>
          </div>
        </section>
      )}

      {showSetup && (
        <SetupChecklist
          steps={steps}
          onDismiss={() => {
            setSetupHidden(true);
            try {
              localStorage.setItem(SETUP_HIDDEN_KEY, "1");
            } catch {
              /* ignore */
            }
          }}
        />
      )}

      {showAnalytics && (
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0">
          {(
            [
              ["overview", "Overview"],
              ["clicks", "Clicks"],
              ["audience", "Audience"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-pressed={tab === id}
              className={`mu-chip min-h-[40px] shrink-0 ${tab === id ? "mu-chip-active" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0">
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(r.id)}
              aria-pressed={range === r.id}
              className={`mu-chip min-h-[40px] shrink-0 ${range === r.id ? "mu-chip-active" : ""}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      )}

      {showAnalytics && (tab === "overview" || tab === "clicks") && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <StatCard
            label="Page views"
            value={loading ? "…" : (stats?.total_views ?? "—")}
            hint={rangeHint}
          />
          <StatCard
            label="Link clicks"
            value={loading ? "…" : (stats?.total_clicks ?? "—")}
            hint={rangeHint}
          />
        </div>
      )}

      {showAnalytics && (tab === "overview" || tab === "clicks") && (
        <DailyChart daily={stats?.daily || []} loading={loading} />
      )}

      {showAnalytics && (tab === "overview" || tab === "clicks") && (
        <section className="mu-card p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-ink">Clicks by link</h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={exportClicks}
                disabled={!stats?.links.length}
                className="text-sm font-semibold text-meetup-purple hover:underline disabled:opacity-40"
              >
                Export CSV
              </button>
              <Link href="/dashboard/links" className="text-sm font-semibold text-meetup-purple hover:underline">
                Manage
              </Link>
            </div>
          </div>
          <ul className="mt-4 divide-y divide-meetup-border">
            {(stats?.links || []).length === 0 && (
              <li className="py-6 text-center text-sm text-meetup-muted">
                No links yet.{" "}
                <Link href="/dashboard/links" className="font-semibold text-meetup-purple">
                  Add some →
                </Link>
              </li>
            )}
            {stats?.links.map((l) => (
              <li key={l.link_id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="truncate font-medium text-ink">{l.title}</span>
                <span className="rounded-full bg-meetup-lavender px-2.5 py-0.5 text-xs font-bold tabular-nums text-meetup-purple">
                  {l.clicks}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {showAnalytics && (tab === "overview" || tab === "audience") && (
        <div className="grid gap-4 md:grid-cols-3">
          <Breakdown
            title="Devices"
            rows={(stats?.devices || []).map((d) => [d.device, d.count])}
          />
          <Breakdown
            title="Referrers"
            rows={(stats?.referrers || []).map((d) => [d.referrer, d.count])}
          />
          <Breakdown
            title="Countries"
            rows={(stats?.countries || []).map((d) => [d.country, d.count])}
          />
        </div>
      )}

      {showAnalytics && (tab === "overview" || tab === "audience") && (
        <section className="mu-card p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-ink">Email subscribers</h2>
            <button
              type="button"
              onClick={exportSubscribers}
              disabled={subs.length === 0}
              className="text-sm font-semibold text-meetup-purple hover:underline disabled:opacity-40"
            >
              Export CSV
            </button>
          </div>
          <ul className="mt-4 divide-y divide-meetup-border">
            {subs.length === 0 && (
              <li className="py-6 text-center text-sm text-meetup-muted">No subscribers yet.</li>
            )}
            {subs.map((s) => (
              <li key={s.id} className="flex justify-between gap-4 py-3 text-sm">
                <span className="font-medium text-ink">
                  {[s.email, s.phone].filter(Boolean).join(" · ")}
                </span>
                <span className="text-meetup-muted">
                  {new Date(s.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="mu-card p-4 sm:p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-1">
        <p className="text-sm font-semibold text-meetup-muted">{label}</p>
        {hint && (
          <span className="rounded-full bg-mist px-2 py-0.5 text-[11px] font-semibold text-meetup-muted">
            {hint}
          </span>
        )}
      </div>
      <p className="mt-2 font-display text-3xl font-bold tabular-nums text-ink sm:mt-3 sm:text-4xl">{value}</p>
    </div>
  );
}

function DailyChart({
  daily,
  loading,
}: {
  daily: { date: string; views: number; clicks: number }[];
  loading: boolean;
}) {
  const max = Math.max(...daily.map((d) => Math.max(d.views, d.clicks)), 1);

  return (
    <section className="mu-card p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold text-ink">Daily activity</h2>
        <div className="flex gap-3 text-[11px] font-semibold text-meetup-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-meetup-purple" /> Views
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-meetup-pink" /> Clicks
          </span>
        </div>
      </div>
      {loading ? (
        <p className="mt-8 text-center text-sm text-meetup-muted">Loading…</p>
      ) : daily.length === 0 ? (
        <p className="mt-8 text-center text-sm text-meetup-muted">No activity in this range yet.</p>
      ) : (
        <div className="mt-6 flex h-40 items-end gap-1 overflow-x-auto pb-6 sm:gap-1.5">
          {daily.map((d) => {
            const viewsH = Math.max(4, Math.round((d.views / max) * 100));
            const clicksH = Math.max(d.clicks > 0 ? 4 : 0, Math.round((d.clicks / max) * 100));
            const label = d.date.slice(5);
            return (
              <div key={d.date} className="group flex min-w-[18px] flex-1 flex-col items-center gap-1">
                <div className="flex h-28 w-full items-end justify-center gap-0.5">
                  <div
                    className="w-[45%] rounded-t bg-meetup-purple/80"
                    style={{ height: `${viewsH}%` }}
                    title={`${d.date}: ${d.views} views`}
                  />
                  <div
                    className="w-[45%] rounded-t bg-meetup-pink/80"
                    style={{ height: `${clicksH}%` }}
                    title={`${d.date}: ${d.clicks} clicks`}
                  />
                </div>
                <span className="rotate-[-45deg] text-[9px] tabular-nums text-meetup-muted sm:text-[10px]">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function Breakdown({ title, rows }: { title: string; rows: [string, number][] }) {
  return (
    <section className="mu-card p-5 md:p-6">
      <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
      <ul className="mt-4 space-y-3">
        {rows.length === 0 && <li className="text-sm text-meetup-muted">No data yet.</li>}
        {rows.map(([k, v]) => {
          const max = Math.max(...rows.map((r) => r[1]), 1);
          const pct = Math.round((v / max) * 100);
          return (
            <li key={k}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="capitalize text-ink">{k}</span>
                <span className="font-semibold tabular-nums text-meetup-muted">{v}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-mist">
                <div className="h-full rounded-full bg-meetup-purple" style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
