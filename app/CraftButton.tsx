"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed "Let's craft together" pill — bottom-left, 32px from edges.
 * When a [data-footer] element enters the viewport the button lifts
 * so it stays 32px above the footer instead of overlapping it.
 */
export default function CraftButton() {
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const update = () => {
      const footer = document.querySelector<HTMLElement>("[data-footer]");
      if (!footer) {
        btn.style.bottom = "32px";
        return;
      }
      const footerTop = footer.getBoundingClientRect().top;
      const viewportH = window.innerHeight;
      const overlap   = viewportH - footerTop; // positive when footer is visible
      btn.style.bottom = overlap > 0 ? `${overlap + 32}px` : "32px";
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <a
      ref={btnRef}
      href="#"
      style={{
        position:       "fixed",
        bottom:         32,
        left:           32,
        zIndex:         200,
        display:        "flex",
        alignItems:     "center",
        gap:            8,
        padding:        "10px 16px 10px 10px",
        borderRadius:   100,
        background:     "#282328",
        textDecoration: "none",
        whiteSpace:     "nowrap",
        cursor:         "pointer",
        transition:     "bottom 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/craft-icon.svg"
        alt=""
        aria-hidden
        style={{ width: 24, height: 24, display: "block", flexShrink: 0 }}
      />
      <span
        style={{
          fontFamily: "'System Unlicensed Trial', sans-serif",
          fontWeight: 400,
          fontSize:   12,
          lineHeight: 1,
          color:      "#ffffff",
        }}
      >
        Let&apos;s craft together
      </span>
    </a>
  );
}
