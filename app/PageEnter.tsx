"use client";

import { useState, useEffect } from "react";

/**
 * Wraps page content with the same entrance animation used by case studies:
 * opacity 0 → 1 + blur(10px) → blur(0px) on mount.
 * NavMenu should sit OUTSIDE this wrapper so it stays visible immediately.
 */
export default function PageEnter({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        opacity: entered ? 1 : 0,
        filter: entered ? "blur(0px)" : "blur(10px)",
        transition: "opacity 0.9s cubic-bezier(0.22, 0.61, 0.36, 1), filter 0.9s cubic-bezier(0.22, 0.61, 0.36, 1)",
        willChange: "opacity, filter",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
