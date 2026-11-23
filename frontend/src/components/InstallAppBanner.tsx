"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "bitlink_pwa_banner";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function hidden(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

function remember(value: "installed" | "dismissed") {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* storage unavailable: the banner just comes back next visit */
  }
}

/**
 * Optional "install the app" banner for the logged-in dashboard. Once the user clicks the install
 * button (or closes the banner) it never shows again; it is also hidden when the app is already
 * running installed. Mounted only inside the authenticated shell.
 */
export function InstallAppBanner() {
  const [deferred, setDeferred] = useState<InstallPromptEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    if (isStandalone() || hidden()) return;

    // iOS Safari has no install prompt: show the manual "Add to Home Screen" steps instead.
    if (isIos()) {
      setIosHint(true);
      setVisible(true);
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as InstallPromptEvent);
      setVisible(true);
    };
    const onInstalled = () => {
      remember("installed");
      setVisible(false);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!visible) return null;

  async function install() {
    remember("installed");
    setVisible(false);
    if (deferred) {
      await deferred.prompt();
      setDeferred(null);
    }
  }

  function dismiss() {
    remember("dismissed");
    setVisible(false);
  }

  return (
    <div className="mb-5 flex items-center gap-3 rounded-2xl bg-white/80 p-3 pr-2 ring-1 ring-meetup-border md:p-3.5" role="region" aria-label="Install app">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/icon-192.png" alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-ink">Install Bitlink</p>
        <p className="text-xs text-meetup-muted">
          {iosHint && !deferred
            ? "Tap Share, then “Add to Home Screen” to get quick access."
            : "Add it to your device for quick access, like a regular app."}
        </p>
      </div>
      <button type="button" onClick={install} className="mu-btn-primary shrink-0 !min-h-[40px] px-4 text-sm">
        {iosHint && !deferred ? "Got it" : "Install"}
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-meetup-muted hover:bg-mist hover:text-ink"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
          <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
