"use client";

const KEY = "bitlink_claim_tokens";

export function getClaimTokens(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((t): t is string => typeof t === "string").slice(-50) : [];
  } catch {
    return [];
  }
}

export function addClaimToken(token: string) {
  try {
    const next = [...new Set([...getClaimTokens(), token])].slice(-50);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function clearClaimTokens() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
