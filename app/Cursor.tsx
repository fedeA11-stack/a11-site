"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Global custom cursor.
 *
 * Two layers, both fixed / pointer-events-none and driven by one rAF loop:
 *   1. Dot — a small circle with `mix-blend-mode: difference`, so it inverts
 *      whatever is behind it (offmenu.design style). Always visible at rest.
 *   2. Pill — the "View project" label that appears over [data-cursor] elements.
 *      While the pill is shown the dot hides, so they never overlap.
 *
 * The native cursor is hidden (cursor: none) only on fine-pointer devices.
 * Disabled entirely on /world/* case study pages.
 */
const DOT_SIZE = 12; // px
const DOT_HOVER_SCALE = 1.6; // dot grows slightly over interactive elements

function CursorLayer() {
  const pathname  = usePathname();
  const dotRef    = useRef<HTMLDivElement>(null);
  const pillRef   = useRef<HTMLDivElement>(null);
  const labelRef  = useRef<HTMLSpanElement>(null);
  const posRef    = useRef({ x: -200, y: -200 }); // smoothed dot position
  const targetRef = useRef({ x: -200, y: -200 }); // raw mouse position
  const rafRef    = useRef<number | null>(null);
  const pillActive = useRef(false); // is the pill currently active
  const shownRef   = useRef(false); // has the cursor been revealed (first move)
  const hoverRef   = useRef(false); // pointer is over an interactive element
  const scaleRef   = useRef(1);     // smoothed dot scale (lerped toward target)

  // On route change, reset the pill and RESTORE the dot. Clicking a [data-cursor]
  // tile navigates client-side, so the element unmounts without firing
  // mouseleave — leaving the dot hidden forever. This brings it back.
  useEffect(() => {
    if (pillRef.current) pillRef.current.style.opacity = "0";
    pillActive.current = false;
    if (dotRef.current && shownRef.current) dotRef.current.style.opacity = "1";
  }, [pathname]);

  useEffect(() => {
    const dot  = dotRef.current;
    const pill = pillRef.current;
    if (!dot || !pill) return;

    const LERP = 0.18;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    function tick() {
      posRef.current.x = lerp(posRef.current.x, targetRef.current.x, LERP);
      posRef.current.y = lerp(posRef.current.y, targetRef.current.y, LERP);
      const { x, y } = posRef.current;
      // Grow the dot slightly while over interactive elements — a hover
      // affordance now that the native hand cursor is hidden. Scaling around the
      // dot's centre keeps it locked on the pointer.
      const targetScale = hoverRef.current && !pillActive.current ? DOT_HOVER_SCALE : 1;
      scaleRef.current = lerp(scaleRef.current, targetScale, 0.2);
      // Dot follows the smoothed position; pill snaps to the raw position.
      dot!.style.transform  = `translate3d(${x - DOT_SIZE / 2}px, ${y - DOT_SIZE / 2}px, 0) scale(${scaleRef.current})`;
      pill!.style.transform = `translate3d(${targetRef.current.x - pill!.offsetWidth / 2}px, ${targetRef.current.y - pill!.offsetHeight / 2}px, 0)`;
      rafRef.current = requestAnimationFrame(tick);
    }

    // Hide the OS cursor only on fine-pointer devices.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    function onMove(e: MouseEvent) {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      if (!shownRef.current) {
        // Snap on first move so the dot doesn't fly in from the corner, and
        // only NOW hide the native cursor — avoids a blank gap (native hidden
        // while the dot is still at opacity 0) on load / after navigation.
        posRef.current.x = e.clientX;
        posRef.current.y = e.clientY;
        if (fine) document.documentElement.style.cursor = "none";
        shownRef.current = true;
      }
      // Self-heal: any move re-shows the dot unless a pill is genuinely active.
      // Guards against the dot getting stuck hidden after navigation / odd events.
      if (!pillActive.current && dot!.style.opacity !== "1") dot!.style.opacity = "1";
      // Grow the dot when the pointer is over a link / button.
      hoverRef.current =
        e.target instanceof Element && !!e.target.closest('a, button, [role="button"]');
    }

    function onEnter(e: MouseEvent) {
      if (!(e.target instanceof Element)) return;
      const target = e.target.closest("[data-cursor]");
      if (!target) return;
      const label = (target as HTMLElement).dataset.cursor ?? "";
      if (labelRef.current) labelRef.current.textContent = label;
      pill!.style.opacity = "1";
      dot!.style.opacity  = "0"; // hide dot while pill is up
      pillActive.current = true;
    }

    function onLeave(e: MouseEvent) {
      if (!(e.target instanceof Element)) return;
      const target = e.target.closest("[data-cursor]");
      if (!target) return;
      pill!.style.opacity = "0";
      if (shownRef.current) dot!.style.opacity = "1";
      pillActive.current = false;
    }

    // Show / hide as the pointer leaves and re-enters the window, so the dot
    // isn't permanently parked on screen — it appears on move / page-enter only.
    const root = document.documentElement;
    function onWindowLeave() {
      dot!.style.opacity = "0";
      pill!.style.opacity = "0";
    }
    function onWindowEnter() {
      if (shownRef.current && !pillActive.current) dot!.style.opacity = "1";
    }

    document.addEventListener("mousemove",  onMove,  { passive: true });
    document.addEventListener("mouseenter", onEnter, { passive: true, capture: true });
    document.addEventListener("mouseleave", onLeave, { passive: true, capture: true });
    root.addEventListener("mouseleave", onWindowLeave, { passive: true });
    root.addEventListener("mouseenter", onWindowEnter, { passive: true });

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseenter", onEnter, true);
      document.removeEventListener("mouseleave", onLeave, true);
      root.removeEventListener("mouseleave", onWindowLeave);
      root.removeEventListener("mouseenter", onWindowEnter);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <>
      {/* Dot — inverts whatever is behind it via mix-blend-difference */}
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position:      "fixed",
          left:          0,
          top:           0,
          zIndex:        9999,
          width:         DOT_SIZE,
          height:        DOT_SIZE,
          borderRadius:  9999,
          background:    "#ffffff",
          mixBlendMode:  "difference",
          pointerEvents: "none",
          willChange:    "transform",
          opacity:       0,
          transition:    "opacity 0.25s ease",
        }}
      />

      {/* Pill — "View project" label over [data-cursor] elements */}
      <div
        ref={pillRef}
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
          height:        "40px",
          padding:       "0 14px",
          display:       "flex",
          alignItems:    "center",
          gap:           4,
          fontFamily:    "var(--font-system), sans-serif",
          fontSize:      14,
          fontWeight:    500,
          lineHeight:    1,
          letterSpacing: "-0.14px",
          color:         "#282328",
          whiteSpace:    "nowrap",
          boxShadow:     "0 8px 24px rgba(40,35,40,0.18)",
          userSelect:    "none",
        }}
      >
        <span ref={labelRef} />
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden style={{ display: "block", flexShrink: 0 }}>
          <path d="M5 11L11 5M11 5H5.5M11 5V10.5" stroke="#282328" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </>
  );
}

// Rendered once in the root layout — present on every page.
export default function Cursor() {
  return <CursorLayer />;
}
