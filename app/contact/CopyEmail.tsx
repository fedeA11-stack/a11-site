"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function execCommandCopy(text: string) {
  const el = document.createElement("textarea");
  el.value = text;
  el.style.cssText = "position:fixed;opacity:0;pointer-events:none;";
  document.body.appendChild(el);
  el.focus();
  el.select();
  try { document.execCommand("copy"); } catch {}
  document.body.removeChild(el);
}

export default function CopyEmail({ email, fontFamily }: { email: string; fontFamily: string }) {
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // No "mounted" guard needed: the portal below is gated on `hovered`, which can
  // only become true via onMouseEnter (client-only, post-hydration). So SSR and
  // first client render both produce null — no hydration mismatch, no portal on
  // the server where document.body doesn't exist.
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleClick = useCallback(() => {
    const trigger = () => {
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(trigger).catch(() => {
        execCommandCopy(email);
        trigger();
      });
    } else {
      execCommandCopy(email);
      trigger();
    }
  }, [email]);

  const label = hovered ? createPortal(
    <span
      aria-hidden
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y + 18,
        transform: "translateX(-50%)",
        pointerEvents: "none",
        zIndex: 9999,
        fontFamily,
        fontWeight: 500,
        fontSize: 15,
        lineHeight: 1,
        letterSpacing: "-0.2px",
        color: "#ffffff",
      }}
    >
      {copied ? "Copied" : "Copy"}
    </span>,
    document.body
  ) : null;

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
        style={{
          color: hovered ? "#8ec5e6" : "#ffffff",
          transition: "color 0.2s ease",
          cursor: "none",
          fontFamily,
          fontWeight: 400,
          fontSize: 20,
          lineHeight: 1.4,
        }}
      >
        {email}
      </span>
      {label}
    </>
  );
}
