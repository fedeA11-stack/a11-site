"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import NavMenu from "../NavMenu";

// ── Dock icons — dark SVG symbols on white cells ───────────────────────────
const DOCK_ICONS = [
  { label: "World Money", src: "/assets/world/world-money-icon.svg", href: "/world/money" },
  { label: "World ID",    src: "/assets/world/world-id-icon.svg",    href: undefined },
  { label: "World Chat",  src: "/assets/world/world-chat-icon.svg",  href: "/world/chat" },
  { label: "World Orb",   src: "/assets/world/world-org-icon.svg",   href: undefined },
] as const;

// ── Fluid sizes (Figma: 82.5px cell, 18.75px gap/pad, 41.25px radius) ──────
// scales from 82.5px @ 1440vw → 60px @ 375vw
const CELL        = "clamp(60px, calc(3.7vw + 47px), 82.5px)";
const ICON_SIZE   = "calc(clamp(60px, calc(3.7vw + 47px), 82.5px) * 0.56)";
const DOCK_GAP    = "clamp(12px, 1.3vw, 18.75px)";
const DOCK_PAD    = "clamp(12px, 1.3vw, 18.75px)";
const DOCK_RADIUS = "clamp(30px, 2.86vw, 41.25px)";
const ICON_RADIUS = "clamp(15px, 1.55vw, 22.286px)";

// ── × separator ───────────────────────────────────────────────────────────
function CrossSeparator() {
  return (
    <div style={{ position: "relative", width: 15, height: 15, flexShrink: 0 }}>
      {[45, -45].map((deg) => (
        <div
          key={deg}
          style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div style={{ width: 1, height: 20, background: "#282328", transform: `rotate(${deg}deg)` }} />
        </div>
      ))}
    </div>
  );
}

// ── Icon cell ─────────────────────────────────────────────────────────────
function DockIcon({
  icon, hovered, onEnter, onLeave,
}: {
  icon: (typeof DOCK_ICONS)[number];
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const inner = (
    <motion.div
      animate={{ y: hovered ? -2 : 0 }}
      transition={{ type: "tween", duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position: "absolute", inset: 0,
        background: "#ffffff",
        borderRadius: ICON_RADIUS,
        boxShadow: "0px 2px 8px rgba(40,35,40,0.06), 0px 8px 24px rgba(40,35,40,0.08)",
        overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: icon.href ? "pointer" : "default",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={icon.src}
        alt={icon.label}
        style={{ width: ICON_SIZE, height: ICON_SIZE, display: "block" }}
      />
    </motion.div>
  );

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ position: "relative", width: CELL, height: CELL, flexShrink: 0 }}
    >
      {icon.href ? (
        <Link href={icon.href} style={{ display: "block", position: "absolute", inset: 0 }}>
          {inner}
        </Link>
      ) : inner}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function WorldPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div style={{
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>
      <NavMenu />

      {/* Hero — vertically centred in remaining viewport height */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 32px 0",
        position: "relative",
      }}>
        {/* Center content group (logos + text + dock) */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
          width: "100%",
        }}>

          {/* Logo lockup: World × A11  — Figma gap: 25px, sizes 52×52 / 48×53 */}
          <div style={{ display: "flex", alignItems: "center", gap: 25 }}>
            {/* World logo — invert to dark (SVG has white fill) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/world/world-mark-white.svg"
              alt="World"
              style={{ width: 52, height: 52, flexShrink: 0, filter: "invert(1)" }}
            />
            <CrossSeparator />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo.svg"
              alt="A11 Product Studio"
              style={{ width: 48, height: 53, flexShrink: 0 }}
            />
          </div>

          {/* Tagline — Figma: 24px, TWK Continental, center, max-w 627px, lh 1.3, ls -0.48px */}
          <p style={{
            margin: 0,
            fontFamily: "'TWK Continental', serif",
            fontWeight: 400,
            fontSize: "clamp(18px, 1.8vw, 24px)",
            lineHeight: 1.3,
            letterSpacing: "-0.48px",
            textAlign: "center",
            color: "#282328",
            maxWidth: "min(627px, 100%)",
          }}>
            Not just one app, we built the whole ecosystem for proof of human.
            {" "}5 years, 9 designers and thousands of explorations.{"\n"}
            We don&apos;t regret a single one.
          </p>

          {/* Dock — Figma: backdrop-blur 28.125px, bg rgba(239,234,229,0.4),
               border 0.938px rgba(235,235,235,0.42), gap/pad 18.75px, radius 41.25px */}
          <div style={{
            display: "flex",
            alignItems: "flex-end",
            gap: DOCK_GAP,
            padding: DOCK_PAD,
            borderRadius: DOCK_RADIUS,
            border: "0.938px solid rgba(235,235,235,0.42)",
            background: "rgba(239,234,229,0.4)",
            backdropFilter: "blur(28.125px)",
            WebkitBackdropFilter: "blur(28.125px)",
            // overflow visible so tooltip can escape the dock container
            overflow: "visible",
            flexShrink: 0,
          }}>
            {DOCK_ICONS.map((icon, i) => (
              <DockIcon
                key={icon.label}
                icon={icon}
                hovered={hoveredIndex === i}
                onEnter={() => setHoveredIndex(i)}
                onLeave={() => setHoveredIndex(null)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Read Full Story — Figma: 20px TWK Continental, chevron, ls -0.4px
           pinned to bottom of viewport with fixed padding */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        padding: "56px 32px",
      }}>
        <button style={{
          background: "none", border: "none", padding: 0,
          cursor: "pointer",
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <span style={{
            fontFamily: "'TWK Continental', serif",
            fontWeight: 400,
            fontSize: 20,
            lineHeight: 0.96,
            letterSpacing: "-0.4px",
            color: "#282328",
            whiteSpace: "nowrap",
            textTransform: "capitalize",
          }}>
            Read Full Story
          </span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 8l5 5 5-5" stroke="#282328" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
