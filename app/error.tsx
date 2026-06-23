"use client";

import { useEffect } from "react";
import Link from "next/link";

// Root error boundary. Catches render/runtime errors in the route tree, logs
// them (org rule: no hidden failures — errors must be observable), and shows a
// branded recovery UI with a retry. `reset` re-renders the segment.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error] route render failed", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: 24,
        background: "#fff",
        color: "#282328",
        fontFamily: "var(--font-system), sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ margin: 0, fontWeight: 500, fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.02em" }}>
        Something went wrong
      </h1>
      <p style={{ margin: 0, maxWidth: 480, opacity: 0.7 }}>
        An unexpected error occurred. You can try again, or head back to our work.
      </p>
      <div style={{ display: "flex", gap: 16 }}>
        <button
          onClick={reset}
          style={{
            fontFamily: "inherit", fontSize: 16, padding: "12px 24px",
            borderRadius: 999, border: "1px solid #282328", background: "#282328",
            color: "#fff", cursor: "pointer",
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            fontFamily: "inherit", fontSize: 16, padding: "12px 24px",
            borderRadius: 999, border: "1px solid #282328", color: "#282328",
            textDecoration: "none",
          }}
        >
          Back to work
        </Link>
      </div>
    </main>
  );
}
