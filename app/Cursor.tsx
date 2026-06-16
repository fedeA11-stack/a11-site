"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Global custom cursor — white pill that follows the mouse.
 * Appears on any element with data-cursor="<label>" attribute.
 * Disabled on /world/* case study pages.
 */
function CursorPill() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef    = useRef({ x: -200, y: -200 });
  const targetRef = useRef({ x: -200, y: -200 });
  const rafRef    = useRef<number | null>(null);
  const visRef    = useRef(false);

  useEffect(() => {
    const el = cursorRef.current as HTMLDivElement | null;
    if (!el) return;
    const div = el;

    const LERP = 0.14;
    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

    function tick() {
      posRef.current.x = lerp(posRef.current.x, targetRef.current.x, LERP);
      posRef.current.y = lerp(posRef.current.y, targetRef.current.y, LERP);
      const w = div.offsetWidth;
      const h = div.offsetHeight;
      div.style.transform = `translate3d(${posRef.current.x - w / 2}px, ${posRef.current.y - h / 2}px, 0)`;
      rafRef.current = requestAnimationFrame(tick);
    }

    function onMove(e: MouseEvent) {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    }

    function onEnter(e: MouseEvent) {
      if (!(e.target instanceof Element)) return;
      const target = e.target.closest("[data-cursor]");
      if (!target) return;
      const label = (target as HTMLElement).dataset.cursor ?? "";
      div.textContent = label;
      div.style.opacity = "1";
      div.style.pointerEvents = "none";
      visRef.current = true;
    }

    function onLeave(e: MouseEvent) {
      if (!(e.target instanceof Element)) return;
      const target = e.target.closest("[data-cursor]");
      if (!target) return;
      div.style.opacity = "0";
      visRef.current = false;
    }

    document.addEventListener("mousemove",  onMove,  { passive: true });
    document.addEventListener("mouseenter", onEnter, { passive: true, capture: true });
    document.addEventListener("mouseleave", onLeave, { passive: true, capture: true });

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseenter", onEnter, true);
      document.removeEventListener("mouseleave", onLeave, true);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden
      style={{
        position:      "fixed",
        left:          0,
        top:           0,
        zIndex:        9999,
        pointerEvents: "none",
        willChange:    "transform",
        opacity:       0,
        transition:    "opacity 0.18s ease",
        background:    "#ffffff",
        borderRadius:  9999,
        padding:       "6px 16px",
        fontFamily:    "'System Unlicensed Trial', sans-serif",
        fontSize:      14,
        fontWeight:    400,
        lineHeight:    1,
        color:         "#282328",
        whiteSpace:    "nowrap",
        boxShadow:     "0 1px 2px rgba(40,35,40,0.08), 0 4px 14px rgba(40,35,40,0.12)",
        userSelect:    "none",
      }}
    />
  );
}

// Wrapper reads the route — no hooks conditionally skipped
export default function Cursor() {
  const pathname = usePathname();
  if (pathname.startsWith("/world")) return null;
  return <CursorPill />;
}
