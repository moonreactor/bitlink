"use client";

import { useEffect, useState } from "react";

const WORDS = ["musicians", "chefs", "creators", "coaches", "shops", "podcasters"];

export function RotatingWord({ className = "" }: { className?: string }) {
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
