import type {
  AdminLinkListResponse,
  AdminMetrics,
  AdminUserDetail,
  AdminUserListResponse,
  AnalyticsSummary,
  AuthUser,
  DomainInfo,
  LinkItem,
  ProductItem,
  Profile,
  PublicProfile,
  ShortenerFunnel,
  ShortLinkStats,
  ShortLinkItem,
  SocialLink,
  Subscriber,
  TokenResponse,
} from "./types";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "./auth";

const BROWSER_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const SERVER_API = process.env.INTERNAL_API_URL || BROWSER_API;

function apiBase() {
  return typeof window === "undefined" ? SERVER_API : BROWSER_API;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function humanizeValidationMsg(msg: string, loc?: unknown): string {
  const cleaned = msg.replace(/^Value error,\s*/i, "").trim();
  const field = Array.isArray(loc) ? String(loc[loc.length - 1] || "") : "";

  if (/email/i.test(cleaned) || field === "email") {
    return "Please enter a valid email address.";
  }
  if (/at least \d+ characters/i.test(cleaned) && field === "password") {
    return "Password must be at least 8 characters.";
  }
  if (/at least \d+ characters/i.test(cleaned) && field === "display_name") {
    return "Display name cannot be empty.";
  }

  return cleaned;
}

function formatApiDetail(detail: unknown, status: number): string {
  if (typeof detail === "string" && detail.trim()) return detail.trim();

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "msg" in item) {
          const entry = item as { msg: unknown; loc?: unknown };
          return humanizeValidationMsg(String(entry.msg), entry.loc);
        }
        return "";
      })
      .filter(Boolean);

    if (messages.length) return [...new Set(messages)].join(" ");
  }

  if (status === 401) return "Incorrect email or password.";
  if (status === 422) return "Please check the form and try again.";
  if (status >= 500) return "Something went wrong on our side. Please try again.";
  return "Request failed. Please try again.";
}

let refreshPromise: Promise<string | null> | null = null;

async function tryRefreshAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const refresh = getRefreshToken();
  if (!refresh) return null;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${BROWSER_API}/api/v1/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refresh }),
          cache: "no-store",
        });
        if (!res.ok) {
          clearTokens();
          return null;
        }
        const data = (await res.json()) as TokenResponse;
        setTokens(data.access_token, data.refresh_token);
        return data.access_token;
      } catch {
        clearTokens();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
  retry = true,
): Promise<T> {
  const headers = new Headers(options.headers || {});
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  if (!headers.has("Content-Type") && options.body && !isFormData) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${apiBase()}/api/v1${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (res.status === 401 && retry && token && typeof window !== "undefined") {
    const next = await tryRefreshAccessToken();
    if (next) {
      return request<T>(path, options, next, false);
    }
  }

  if (!res.ok) {
    let detail: unknown = null;
    try {
      const data = await res.json();
      detail = data.detail;
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, formatApiDetail(detail, res.status));
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const authApi = {
  register: (body: {
    email: string;
    password: string;
    username: string;
    display_name: string;
    referred_by_username?: string | null;
  }) => request<TokenResponse>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request<TokenResponse>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: (token: string) => request<AuthUser>("/auth/me", {}, token),
  forgotPassword: (email: string) =>
    request<{ ok: boolean; message: string; reset_url?: string | null }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, password: string) =>
    request<TokenResponse>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),
  changePassword: (token: string, body: { current_password: string; new_password: string }) =>
    request<void>(
      "/auth/change-password",
      { method: "POST", body: JSON.stringify(body) },
      token,
    ),
};

export const adminApi = {
  metrics: (token: string) => request<AdminMetrics>("/admin/metrics", {}, token),
  users: (token: string, params?: { q?: string; page?: number; page_size?: number }) => {
    const sp = new URLSearchParams();
    if (params?.q) sp.set("q", params.q);
    if (params?.page) sp.set("page", String(params.page));
    if (params?.page_size) sp.set("page_size", String(params.page_size));
    const qs = sp.toString();
    return request<AdminUserListResponse>(`/admin/users${qs ? `?${qs}` : ""}`, {}, token);
  },
  user: (token: string, id: string) => request<AdminUserDetail>(`/admin/users/${id}`, {}, token),
  updateUser: (
    token: string,
    id: string,
    body: { is_active?: boolean; is_superuser?: boolean; is_verified?: boolean },
  ) =>
    request<AdminUserDetail>(
      `/admin/users/${id}`,
      { method: "PATCH", body: JSON.stringify(body) },
      token,
    ),
  shortenerFunnel: (token: string, days = 30) =>
    request<ShortenerFunnel>(`/admin/shortener-funnel?days=${days}`, {}, token),
  links: (token: string, params?: { q?: string; page?: number; page_size?: number }) => {
    const sp = new URLSearchParams();
    if (params?.q) sp.set("q", params.q);
    if (params?.page) sp.set("page", String(params.page));
    if (params?.page_size) sp.set("page_size", String(params.page_size));
    const qs = sp.toString();
    return request<AdminLinkListResponse>(`/admin/links${qs ? `?${qs}` : ""}`, {}, token);
  },
};

export const profileApi = {
  get: (token: string) => request<Profile>("/me/profile", {}, token),
  update: (token: string, body: Record<string, unknown>) =>
    request<Profile>("/me/profile", { method: "PATCH", body: JSON.stringify(body) }, token),
  qrUrl: () => `${BROWSER_API}/api/v1/me/qr`,
};

export type LinkMeta = {
  url: string;
  title: string;
  favicon_url: string | null;
  domain: string | null;
};

export const linksApi = {
  list: (token: string) => request<LinkItem[]>("/me/links", {}, token),
  meta: (token: string, url: string) =>
    request<LinkMeta>(`/me/links/meta?url=${encodeURIComponent(url)}`, {}, token),
  create: (token: string, body: Record<string, unknown>) =>
    request<LinkItem>("/me/links", { method: "POST", body: JSON.stringify(body) }, token),
  update: (token: string, id: string, body: Record<string, unknown>) =>
    request<LinkItem>(`/me/links/${id}`, { method: "PATCH", body: JSON.stringify(body) }, token),
  remove: (token: string, id: string) =>
    request<void>(`/me/links/${id}`, { method: "DELETE" }, token),
  reorder: (token: string, items: { id: string; position: number }[]) =>
    request<LinkItem[]>("/me/links/reorder", { method: "PUT", body: JSON.stringify({ items }) }, token),
};

export const socialApi = {
  list: (token: string) => request<SocialLink[]>("/me/social-links", {}, token),
  replace: (token: string, items: SocialLink[]) =>
    request<SocialLink[]>("/me/social-links", { method: "PUT", body: JSON.stringify({ items }) }, token),
};

export const mediaApi = {
  upload: (token: string, file: File) => {
    const body = new FormData();
    body.append("file", file);
    return request<{ url: string; content_type: string; size: number }>(
      "/me/media",
      { method: "POST", body },
      token,
    );
  },
};

export const analyticsApi = {
  summary: (token: string, params?: { from?: string; to?: string }) => {
    const sp = new URLSearchParams();
    if (params?.from) sp.set("from", params.from);
    if (params?.to) sp.set("to", params.to);
    const qs = sp.toString();
    return request<AnalyticsSummary>(`/me/analytics/summary${qs ? `?${qs}` : ""}`, {}, token);
  },
  subscribers: (token: string) => request<Subscriber[]>("/me/subscribers", {}, token),
};

export const shortLinksApi = {
  stats: (token: string, id: string, days = 30) =>
    request<ShortLinkStats>(`/me/short-links/${id}/stats?days=${days}`, {}, token),
  claim: (token: string, tokens: string[]) =>
    request<{ claimed: number }>(
      "/me/short-links/claim",
      { method: "POST", body: JSON.stringify({ tokens }) },
      token,
    ),
  list: (token: string) => request<ShortLinkItem[]>("/me/short-links", {}, token),
  check: (token: string, code: string) =>
    request<{ code: string; available: boolean }>(
      `/me/short-links/check?code=${encodeURIComponent(code)}`,
      {},
      token,
    ),
  create: (token: string, body: Record<string, unknown>) =>
    request<ShortLinkItem>("/me/short-links", { method: "POST", body: JSON.stringify(body) }, token),
  update: (token: string, id: string, body: Record<string, unknown>) =>
    request<ShortLinkItem>(
      `/me/short-links/${id}`,
      { method: "PATCH", body: JSON.stringify(body) },
      token,
    ),
  remove: (token: string, id: string) =>
    request<void>(`/me/short-links/${id}`, { method: "DELETE" }, token),
  qrUrl: (id: string, fmt: "png" | "svg" = "png") =>
    `${BROWSER_API}/api/v1/me/short-links/${id}/qr?fmt=${fmt}`,
};

export const domainApi = {
  get: (token: string) => request<DomainInfo>("/me/domain", {}, token),
  set: (token: string, domain: string) =>
    request<DomainInfo>("/me/domain", { method: "PUT", body: JSON.stringify({ domain }) }, token),
  clear: (token: string) => request<DomainInfo>("/me/domain", { method: "DELETE" }, token),
  verify: (token: string) =>
    request<DomainInfo & { verified: boolean; message: string }>(
      "/me/domain/verify",
      { method: "POST" },
      token,
    ),
};

export const productsApi = {
  list: (token: string) => request<ProductItem[]>("/me/products", {}, token),
  create: (token: string, body: Record<string, unknown>) =>
    request<ProductItem>("/me/products", { method: "POST", body: JSON.stringify(body) }, token),
  update: (token: string, id: string, body: Record<string, unknown>) =>
    request<ProductItem>(`/me/products/${id}`, { method: "PATCH", body: JSON.stringify(body) }, token),
  remove: (token: string, id: string) =>
    request<void>(`/me/products/${id}`, { method: "DELETE" }, token),
  reorder: (token: string, items: { id: string; position: number }[]) =>
    request<ProductItem[]>("/me/products/reorder", {
      method: "PUT",
      body: JSON.stringify({ items }),
    }, token),
};

export const publicApi = {
  createShortLink: (destination_url: string, source?: string) =>
    request<{ code: string; short_url: string; destination_url: string; claim_token: string }>(
      "/public/short-links",
      { method: "POST", body: JSON.stringify({ destination_url, source }) },
    ),
  trackShortenerEvent: (event: string, source?: string) =>
    request<void>("/public/shortener-events", {
      method: "POST",
      body: JSON.stringify({ event, source }),
    }).catch(() => undefined),
  getProfile: (username: string, unlockToken?: string) =>
    request<PublicProfile>(`/public/${username}`, {
      headers: unlockToken ? { "X-Profile-Unlock": unlockToken } : {},
    }),
  trackView: (username: string, body?: { referrer?: string; visitor_id?: string }) =>
    request<void>(`/public/${username}/view`, {
      method: "POST",
      body: JSON.stringify(body || {}),
    }),
  trackCtaClick: (username: string, body?: { referrer?: string; visitor_id?: string }) =>
    request<void>(`/public/${username}/cta-click`, {
      method: "POST",
      body: JSON.stringify(body || {}),
    }),
  click: (
    username: string,
    linkId: string,
    body?: { referrer?: string; visitor_id?: string; unlock_code?: string },
  ) =>
    request<{ url: string }>(`/public/${username}/links/${linkId}/click`, {
      method: "POST",
      body: JSON.stringify(body || {}),
    }),
  subscribe: (username: string, body: { email?: string; phone?: string }) =>
    request<{ ok: boolean }>(`/public/${username}/subscribe`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  unlock: (username: string, password: string) =>
    request<{ unlocked: boolean; unlock_token?: string }>(`/public/${username}/unlock`, {
      method: "POST",
      body: JSON.stringify({ password }),
    }),
};

/** Helper for authenticated calls that always use the latest access token. */
export function withAuthToken(): string | null {
  return getAccessToken();
}
