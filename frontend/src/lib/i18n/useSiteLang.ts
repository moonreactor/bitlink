"use client";

import { useEffect, useState } from "react";
import { DEFAULT_LANG, LANG_LABEL, readLangCookie, type SiteLang } from "./site";

/** Language the visitor was browsing in (cookie), applied after mount to stay hydration-safe. */
export function useSiteLang(): SiteLang {
  const [lang, setLang] = useState<SiteLang>(DEFAULT_LANG);
  useEffect(() => {
    const l = readLangCookie() ?? DEFAULT_LANG;
    setLang(l);
    document.documentElement.lang = LANG_LABEL[l].html;
  }, []);
  return lang;
}
