const SHARED_KEY = "bitlink_page_shared";

export function publicPageUrl(username: string) {
  if (typeof window === "undefined") return `https://bitlink.click/${username}`;
  return `${window.location.origin}/${username}`;
}

export function displayPageUrl(username: string) {
  return publicPageUrl(username).replace(/^https?:\/\//, "");
}

export function hasSharedPage(): boolean {
  try {
    return localStorage.getItem(SHARED_KEY) === "1";
  } catch {
    return false;
  }
}

function markShared() {
  try {
    localStorage.setItem(SHARED_KEY, "1");
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event("bitlink:shared"));
}

export async function copyPageUrl(username: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(publicPageUrl(username));
    markShared();
    return true;
  } catch {
    return false;
  }
}

/**
 * Native share sheet on mobile (WhatsApp, Instagram, etc.), clipboard fallback on desktop.
 * Returns "shared" | "copied" | "failed".
 */
export async function sharePage(
  username: string,
  displayName?: string,
): Promise<"shared" | "copied" | "failed"> {
  const url = publicPageUrl(username);
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title: displayName || username, url });
      markShared();
      return "shared";
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return "failed";
    }
  }
  return (await copyPageUrl(username)) ? "copied" : "failed";
}
