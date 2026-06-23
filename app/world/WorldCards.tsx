"use client";

import Link from "next/link";
import { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";
import CoverImage from "../CoverImage";

// Default-state lifestyle photos — exported from Figma (004_World, 2× / 1232×760).
import worldMoneyCard from "../../public/assets/world/case/world-money-card.jpg";
import worldIdCard from "../../public/assets/world/case/world-id-card.jpg";
import worldChatCard from "../../public/assets/world/case/world-chat-card.jpg";
import worldOrbCard from "../../public/assets/world/case/world-orb-card.jpg";

const INK = "#282328";
const MUTED = "#989190";
// Two cards per row → each spans ~half the contained width.
const SIZES = "(max-width: 700px) 100vw, 50vw";

// ── Notch geometry ───────────────────────────────────────────────────────────
// objectBoundingBox clip-path (normalised 0–1 → responsive). Cards keep the
// Figma 616×380 aspect, so the elliptical arc radii (rx = r/616, ry = r/380)
// render as true circles at any size. The two `d`s share an identical command
// sequence so the shape MORPHS via a CSS `d` transition on hover: a plain
// rounded rect at rest peels open into the top-right notch.
const NOTCH_DEFAULT =
  "M 0.02597 0.00000 L 0.94805 0.00000 A 0.00000 0.00000 0 0 0 0.94805 0.00000 L 0.97403 0.00000 A 0.02597 0.04211 0 0 1 1.00000 0.04211 L 1.00000 0.08421 A 0.00000 0.00000 0 0 0 1.00000 0.08421 L 1.00000 0.95789 A 0.02597 0.04211 0 0 1 0.97403 1.00000 L 0.02597 1.00000 A 0.02597 0.04211 0 0 1 0.00000 0.95789 L 0.00000 0.04211 A 0.02597 0.04211 0 0 1 0.02597 0.00000 Z";
const NOTCH_HOVER =
  "M 0.02597 0.00000 L 0.73173 0.00000 A 0.02597 0.04211 0 0 1 0.75555 0.02529 L 0.80767 0.21930 A 0.03984 0.06458 0 0 0 0.83817 0.25736 L 0.97795 0.29198 A 0.02597 0.04211 0 0 1 1.00000 0.33361 L 1.00000 0.95789 A 0.02597 0.04211 0 0 1 0.97403 1.00000 L 0.02597 1.00000 A 0.02597 0.04211 0 0 1 0.00000 0.95789 L 0.00000 0.04211 A 0.02597 0.04211 0 0 1 0.02597 0.00000 Z";

type CaseCard = {
  img: StaticImageData;
  icon: string;
  iconScale: number; // icon px ÷ 48px badge
  title: string;
  sub: string;
  href: string;
};

const CARDS: CaseCard[] = [
  { img: worldMoneyCard, icon: "/assets/world/case/world-money-icon.svg", iconScale: 0.5625, title: "World Money", sub: "Manage your investments",            href: "/world/money" },
  { img: worldIdCard,    icon: "/assets/world/case/world-id-icon.svg",    iconScale: 0.5625, title: "World ID",    sub: "Prove you’re a real human",          href: "/world/id"    },
  { img: worldChatCard,  icon: "/assets/world/case/world-chat-icon.svg",  iconScale: 0.5625, title: "World Chat",  sub: "Chat for real humans in World Network", href: "/world/chat"  },
  { img: worldOrbCard,   icon: "/assets/world/case/world-orb-icon.svg",   iconScale: 0.6667, title: "Orb App",     sub: "Manage your Orb operations",         href: "/world/orb"   },
];

// ── Card ─────────────────────────────────────────────────────────────────────
function WorldCard({ card, index, priority }: { card: CaseCard; index: number; priority?: boolean }) {
  const clipId = `wcs-notch-${index}`;
  const tileRef = useRef<HTMLAnchorElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const reduced = useRef(false);

  // Cursor-following "View project" pill: a lerped trail toward the pointer,
  // matching the easing of the All-projects hover preview elsewhere on the site.
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => { if (raf.current !== null) cancelAnimationFrame(raf.current); };
  }, []);

  function place(x: number, y: number) {
    if (pillRef.current) pillRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  }
  function loop() {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const t = reduced.current ? 1 : 0.2; // no trailing motion under reduced-motion
    pos.current.x = lerp(pos.current.x, target.current.x, t);
    pos.current.y = lerp(pos.current.y, target.current.y, t);
    place(pos.current.x, pos.current.y);
    raf.current = requestAnimationFrame(loop);
  }
  function onEnter(e: React.MouseEvent) {
    const r = tileRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = e.clientX - r.left, y = e.clientY - r.top;
    pos.current = { x, y };
    target.current = { x, y };
    place(x, y); // snap on entry — no fly-in from the corner
    if (raf.current === null) raf.current = requestAnimationFrame(loop);
  }
  function onMove(e: React.MouseEvent) {
    const r = tileRef.current?.getBoundingClientRect();
    if (!r) return;
    target.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function onLeave() {
    if (raf.current !== null) { cancelAnimationFrame(raf.current); raf.current = null; }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Link
        ref={tileRef}
        href={card.href}
        aria-label={`${card.title} — ${card.sub}`}
        className="wcs-tile"
        onMouseEnter={onEnter}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ display: "block", position: "relative", width: "100%", aspectRatio: "616 / 380" }}
      >
        {/* Per-card clip definition — `d` morphs on :hover (see <style> in parent). */}
        <svg width="0" height="0" aria-hidden focusable="false" style={{ position: "absolute" }}>
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
              <path className="wcs-clip-path" d={NOTCH_DEFAULT} />
            </clipPath>
          </defs>
        </svg>

        {/* Media — clipped to the notch shape */}
        <div className="wcs-media" style={{ position: "absolute", inset: 0, clipPath: `url(#${clipId})` }}>
          <CoverImage src={card.img} alt="" sizes={SIZES} priority={priority} />
        </div>

        {/* Persistent white icon badge, bottom-left */}
        <div className="wcs-badge">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={card.icon} alt="" aria-hidden style={{ width: `${card.iconScale * 100}%`, height: `${card.iconScale * 100}%`, display: "block" }} />
        </div>

        {/* Cursor-following View project pill */}
        <div ref={pillRef} className="wcs-pill" aria-hidden>
          <span>View project</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3.71997 12.3822L12.3182 3.72882" stroke="currentColor" strokeWidth="1.33333" strokeMiterlimit="10" />
            <path d="M4.63403 3.74219L12.3352 3.74527L12.3444 11.3903" stroke="currentColor" strokeWidth="1.33333" strokeMiterlimit="10" />
          </svg>
        </div>
      </Link>

      {/* Label — title (INK) + subtitle (muted) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 16 }}>
        <span style={{ fontFamily: "var(--font-system), sans-serif", fontWeight: 500, fontSize: 16, lineHeight: 1.2, letterSpacing: "-0.02em", color: INK }}>
          {card.title}
        </span>
        <span style={{ fontFamily: "var(--font-system), sans-serif", fontWeight: 400, fontSize: 14, lineHeight: 1.2, color: MUTED }}>
          {card.sub}
        </span>
      </div>
    </div>
  );
}

// ── Grid ───────────────────────────────────────────────────────────────────--
export default function WorldCards() {
  return (
    <>
      <style>{`
        .wcs-grid { grid-template-columns: repeat(2, 1fr); }
        @media (max-width: 700px) { .wcs-grid { grid-template-columns: 1fr; } }

        .wcs-badge {
          position: absolute; left: 3.9%; bottom: 6.3%;
          width: 7.8%; aspect-ratio: 1 / 1;
          border-radius: 27%;
          background: #ffffff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          display: flex; align-items: center; justify-content: center;
        }

        .wcs-clip-path { transition: d 0.4s cubic-bezier(0.22, 0.61, 0.36, 1); }

        .wcs-pill {
          position: absolute; top: 0; left: 0;
          display: flex; align-items: center; gap: 4px;
          padding: 6px 14px;
          border-radius: 999px;
          background: #282328; color: #ffffff;
          font-family: var(--font-system), sans-serif;
          font-weight: 400; font-size: 14px; line-height: 1; white-space: nowrap;
          pointer-events: none;
          opacity: 0; scale: 0.85;
          transition: opacity 0.3s cubic-bezier(0.22, 0.61, 0.36, 1), scale 0.3s cubic-bezier(0.22, 0.61, 0.36, 1);
          will-change: transform;
          z-index: 2;
        }

        /* Hover affordances only on real pointer devices */
        @media (hover: hover) and (pointer: fine) {
          .wcs-tile { cursor: none; }
          .wcs-tile:hover .wcs-clip-path { d: path("${NOTCH_HOVER}"); }
          .wcs-tile:hover .wcs-pill { opacity: 1; scale: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .wcs-clip-path, .wcs-pill { transition: none; }
        }
      `}</style>

      <div className="wcs-grid" style={{ display: "grid", columnGap: "clamp(8px, 0.8vw, 12px)", rowGap: "clamp(32px, 3.4vw, 52px)", marginTop: 84 }}>
        {CARDS.map((c, i) => (
          <WorldCard key={c.title} card={c} index={i} priority={i < 2} />
        ))}
      </div>
    </>
  );
}
