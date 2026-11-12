"use client";

import { useEffect, useState } from "react";

export function RotatingWord({ words, className = "" }: { words: string[]; className?: string }) {
  const WORDS = words;
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 220);
    }, 2400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span
      className={`inline-block transition-all duration-200 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      } ${className}`}
    >
      {WORDS[index]}
    </span>
  );
}
