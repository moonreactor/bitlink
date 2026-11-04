"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function TrackingPixels({
  googleAnalyticsId,
  metaPixelId,
}: {
  googleAnalyticsId?: string | null;
  metaPixelId?: string | null;
}) {
  useEffect(() => {
    const ga = googleAnalyticsId?.trim();
    if (!ga || document.getElementById("bitlink-ga")) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", ga);

    const script = document.createElement("script");
    script.id = "bitlink-ga";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga)}`;
    document.head.appendChild(script);
  }, [googleAnalyticsId]);

  useEffect(() => {
    const pixel = metaPixelId?.trim();
    if (!pixel || document.getElementById("bitlink-meta-pixel")) return;

    const stub = function (...args: unknown[]) {
      const fn = stub as typeof stub & { callMethod?: (...a: unknown[]) => void; queue: unknown[] };
      if (fn.callMethod) fn.callMethod(...args);
      else fn.queue.push(args);
    } as typeof window.fbq & { queue: unknown[]; loaded?: boolean; version?: string };
    stub.queue = [];
    stub.loaded = true;
    stub.version = "2.0";
    window.fbq = stub;
    window.fbq("init", pixel);
    window.fbq("track", "PageView");

    const script = document.createElement("script");
    script.id = "bitlink-meta-pixel";
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }, [metaPixelId]);

  return null;
}
