import type {
  AdminLinkListResponse,
  AdminMetrics,
  AdminUserDetail,
  AdminUserListResponse,
  AnalyticsSummary,
  AuthUser,
  LinkItem,
  Profile,
  PublicProfile,
  SocialLink,
  Subscriber,
  TokenResponse,
} from "./types";

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

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${apiBase()}/api/v1${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

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
  }) => request<TokenResponse>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request<TokenResponse>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: (token: string) => request<AuthUser>("/auth/me", {}, token),
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
  updateUser: (token: string, id: string, body: { is_active?: boolean; is_superuser?: boolean }) =>
    request<AdminUserDetail>(
      `/admin/users/${id}`,
      { method: "PATCH", body: JSON.stringify(body) },
      token,
    ),
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

export const analyticsApi = {
  summary: (token: string) => request<AnalyticsSummary>("/me/analytics/summary", {}, token),
  subscribers: (token: string) => request<Subscriber[]>("/me/subscribers", {}, token),
};

export const publicApi = {
  getProfile: (username: string, unlockToken?: string) =>
    request<PublicProfile>(`/public/${username}`, {
      headers: unlockToken ? { "X-Profile-Unlock": unlockToken } : {},
    }),
  trackView: (username: string, body?: { referrer?: string; visitor_id?: string }) =>
    request<void>(`/public/${username}/view`, {
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
  subscribe: (username: string, email: string) =>
    request<{ ok: boolean }>(`/public/${username}/subscribe`, {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  unlock: (username: string, password: string) =>
    request<{ unlocked: boolean; unlock_token?: string }>(`/public/${username}/unlock`, {
      method: "POST",
      body: JSON.stringify({ password }),
    }),
};
