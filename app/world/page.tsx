"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { type StaticImageData } from "next/image";
import NavMenu from "../NavMenu";
import CoverImage from "../CoverImage";

import worldMoneyCase from "../../public/assets/world/case/world-money.jpg";
import worldIdCase from "../../public/assets/world/case/world-id.jpg";
import worldChatCase from "../../public/assets/world/case/world-chat.jpg";
import worldOrbCase from "../../public/assets/world/case/world-orb.jpg";

// ── Cards — Figma World_CaseStudy (1725:10129 / hover 1725:10175) ──────────
// Photos are badge-free; the icon badge is a floating element so the card can
// scoop a cove around it on hover. iconScale = icon px ÷ 48px badge.
type CaseCard = {
  img: StaticImageData;
  icon: string;
  iconScale: number;
  solid: boolean;
  title: string;
  sub: string;
  href?: string;
};

const CARDS: CaseCard[] = [
  { img: worldMoneyCase, icon: "/assets/world/case/world-money-icon.svg", iconScale: 0.5625, solid: true,  title: "World Money", sub: "Manage your investments",   href: "/world/money" },
  { img: worldIdCase,    icon: "/assets/world/case/world-id-icon.svg",    iconScale: 0.5625, solid: false, title: "World ID",    sub: "Prove you’re a real human", href: undefined      },
  { img: worldChatCase,  icon: "/assets/world/case/world-chat-icon.svg",  iconScale: 0.5625, solid: false, title: "World Chat",  sub: "Chat with real humans",      href: "/world/chat"  },
  { img: worldOrbCase,   icon: "/assets/world/case/world-orb-icon.svg",   iconScale: 0.6667, solid: false, title: "Orb App",     sub: "Manage your Orb operations", href: undefined      },
];

const INK = "#282328";
const MUTE = "#989190";

// ── Card-shape cove (Figma 1725:10209 mask, normalised to the 370px frame) ──
// The other three card corners stay at r16. D→E→F is the top-right notch the
// photo scoops out on hover; at rest (t=0) they collapse into a plain r16
// corner so the morph runs from rounded-rectangle → cove. (Figma coordinates
// are 180°-rotated, so the mask's bottom-left notch lands on the top-right.)
const S = 370;
const R = 16 / S; // 0.0432 — card corner radius
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function buildCovePath(t: number): string {
  // [x, y, cornerRadius] in objectBoundingBox units (0–1)
  const pts: [number, number, number][] = [
    [0, 0, R],                                                                       // top-left
    [lerp(1 - R, 1 - 90.1 / S, t), 0, lerp(0, 20 / S, t)],                            // D — top edge
    [lerp(1, 1 - 73.2 / S, t), lerp(0, 1 - 292.1 / S, t), lerp(R, 24.5 / S, t)],      // E — notch peak
    [1, lerp(R, 1 - 277 / S, t), lerp(0, 20 / S, t)],                                 // F — right edge
    [1, 1, R],                                                                        // bottom-right
    [0, 1, R],                                                                        // bottom-left
  ];
  const n = pts.length;
  let d = "";
  for (let i = 0; i < n; i++) {
    const [x, y, r] = pts[i];
    const [px, py] = pts[(i - 1 + n) % n];
    const [nx, ny] = pts[(i + 1) % n];
    const vpx = px - x, vpy = py - y, lp = Math.hypot(vpx, vpy) || 1;
    const vnx = nx - x, vny = ny - y, ln = Math.hypot(vnx, vny) || 1;
    const rr = Math.min(r, lp / 2, ln / 2);
    const ix = x + (vpx / lp) * rr, iy = y + (vpy / lp) * rr; // arrival tangent
    const ox = x + (vnx / ln) * rr, oy = y + (vny / ln) * rr; // departure tangent
    d += `${i === 0 ? "M" : "L"} ${ix.toFixed(4)} ${iy.toFixed(4)} Q ${x.toFixed(4)} ${y.toFixed(4)} ${ox.toFixed(4)} ${oy.toFixed(4)} `;
  }
  return d + "Z";
}

// ── ↗ arrow for the hover pill ─────────────────────────────────────────────
function ArrowUpRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden style={{ display: "block" }}>
      <path d="M5 11L11 5M11 5H5.5M11 5V10.5" stroke={INK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────
function Card({ card, priority }: { card: CaseCard; priority?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const clipId = `wcs-cove-${useId().replace(/:/g, "")}`;

  // Cove morph — spring-driven 0→1, written straight onto the clip path's d.
  const covePath = useRef<SVGPathElement>(null);
  const target = useMotionValue(0);
  const prog = useSpring(target, { stiffness: 260, damping: 30, mass: 0.5 });
  useEffect(() => {
    target.set(hovered ? 1 : 0);
  }, [hovered, target]);
  useEffect(() => {
    const write = (v: number) => covePath.current?.setAttribute("d", buildCovePath(v));
    write(prog.get());
    return prog.on("change", write);
  }, [prog]);

  // Cursor-following pill (spring-smoothed position relative to the card).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 700, damping: 45, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 700, damping: 45, mass: 0.4 });

  const setFromEvent = (e: React.MouseEvent, jump = false) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    mx.set(x);
    my.set(y);
    if (jump) {
      sx.jump(x);
      sy.jump(y);
    }
  };

  const media = (
    <div
      onMouseEnter={(e) => {
        setFromEvent(e, true);
        setHovered(true);
      }}
      onMouseMove={(e) => setFromEvent(e)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
        cursor: card.href ? "pointer" : "default",
      }}
    >
      {/* clip-path geometry (objectBoundingBox → scales with the card) */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path ref={covePath} d={buildCovePath(0)} />
          </clipPath>
        </defs>
      </svg>

      {/* Photo — clipped to the card/cove shape (clipPath survives next/image's
          generated <img>; the objectBoundingBox clip scales with the card). */}
      <CoverImage
        src={card.img}
        alt={card.title}
        sizes="(max-width: 520px) 100vw, (max-width: 880px) 50vw, 25vw"
        priority={priority}
        clipPath={`url(#${clipId})`}
      />

      {/* Floating icon badge (stays put while the photo scoops away on hover) */}
      <div
        style={{
          position: "absolute",
          left: "6.5%",
          bottom: "6.5%",
          width: "12.97%",
          aspectRatio: "1 / 1",
          borderRadius: "27%",
          background: card.solid ? "#ffffff" : "rgba(255,255,255,0.9)",
          backdropFilter: "blur(21px)",
          WebkitBackdropFilter: "blur(21px)",
          boxShadow: "0 8.4px 31px rgba(40,35,40,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={card.icon} alt="" aria-hidden style={{ width: `${card.iconScale * 100}%`, height: `${card.iconScale * 100}%`, display: "block" }} />
      </div>

      {/* Cursor-following "View project ↗" pill.
          Follower sits at the cursor (springed x/y); a static wrapper does the
          -50%/-50% centering so framer's scale animation can't clobber it. */}
      <motion.div style={{ position: "absolute", top: 0, left: 0, x: sx, y: sy, pointerEvents: "none", zIndex: 2 }}>
        <div style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
          <motion.div
            initial={false}
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.85 }}
            transition={{ type: "tween", duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
            style={{
              transformOrigin: "center",
              display: "flex",
              alignItems: "center",
              gap: 4,
              height: 40,
              padding: "0 14px",
              borderRadius: 100,
              background: "#ffffff",
              boxShadow: "0 8px 24px rgba(40,35,40,0.18)",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontFamily: "var(--font-system), sans-serif", fontWeight: 500, fontSize: 14, lineHeight: 1, letterSpacing: "-0.14px", color: INK }}>
              View project
            </span>
            <ArrowUpRight />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {card.href ? (
        <Link href={card.href} style={{ display: "block" }}>
          {media}
        </Link>
      ) : (
        media
      )}

      {/* Label — title + subtitle, 20px System Unlicensed Trial Medium, 6px gap */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 20 }}>
        <span style={{ fontFamily: "var(--font-system), sans-serif", fontWeight: 500, fontSize: 20, lineHeight: 0.9, letterSpacing: "-0.4px", color: INK }}>
          {card.title}
        </span>
        <span style={{ fontFamily: "var(--font-system), sans-serif", fontWeight: 500, fontSize: 20, lineHeight: 0.9, letterSpacing: "-0.4px", color: MUTE }}>
          {card.sub}
        </span>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function WorldPage() {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <style>{`
        .wcs-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 880px) { .wcs-grid { grid-template-columns: repeat(2, 1fr); row-gap: 28px; } }
        @media (max-width: 520px) { .wcs-grid { grid-template-columns: 1fr; row-gap: 28px; } }
      `}</style>

      <NavMenu />

      {/* Headline — same 1240px container as NavMenu */}
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 lg:px-0">
        <h1
          style={{
            margin: "104px 0 0",
            maxWidth: 616,
            fontFamily: "var(--font-system), sans-serif",
            fontWeight: 500,
            fontSize: "clamp(34px, 3.8vw, 56px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: INK,
          }}
        >
          Five years, nine people,
          <br />
          four apps, number one
          <br />
          crypto wallet.
        </h1>
      </div>

      {/* Card grid — near full-bleed: 10px gutters, 4px column gaps */}
      <div className="wcs-grid" style={{ display: "grid", columnGap: 4, padding: "84px 10px 0", margin: 0 }}>
        {CARDS.map((c, i) => (
          <Card key={c.title} card={c} priority={i === 0} />
        ))}
      </div>

      <div style={{ height: 120 }} aria-hidden />
    </div>
  );
}
