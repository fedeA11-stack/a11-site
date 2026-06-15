"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

const imgLogoMark = "/assets/logo.svg";
const imgLogoText = "/assets/A11 Product Studio of the Ambitious.svg";

const navLinks    = ["Work", "Studio", "Playground", "Book a Call"];
const socialLinks = ["Twitter / X", "LinkedIn", "Cosmos"];

// ── 9-dot grid ────────────────────────────────────────────────────────────────
// default → all full
// hover   → corners fade (0.2) → reveals + shape
// open    → edges fade (0.2), corners + center stay full → reveals X shape
const DOTS = [
  { cx: 4,  cy: 4  }, // 0  TL corner
  { cx: 4,  cy: 12 }, // 1  left-mid
  { cx: 4,  cy: 20 }, // 2  BL corner
  { cx: 12, cy: 4  }, // 3  top-mid
  { cx: 12, cy: 12 }, // 4  center
  { cx: 12, cy: 20 }, // 5  bottom-mid
  { cx: 20, cy: 4  }, // 6  TR corner
  { cx: 20, cy: 12 }, // 7  right-mid
  { cx: 20, cy: 20 }, // 8  BR corner
] as const;

const CORNERS = new Set([0, 2, 6, 8]);
const CENTER  = 4;

function dotOpacity(state: "default" | "hover" | "open", i: number): number {
  if (state === "open")  return (CORNERS.has(i) || i === CENTER) ? 1 : 0.2;
  if (state === "hover") return CORNERS.has(i) ? 0.2 : 1;
  return 1;
}

function MenuIcon({ state }: { state: "default" | "hover" | "open" }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      {DOTS.map((d, i) => (
        <motion.circle
          key={i}
          cx={d.cx}
          cy={d.cy}
          r={2}
          fill="white"
          animate={{ opacity: dotOpacity(state, i) }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function NavMenu() {
  const [open,    setOpen]    = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => setOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  const iconState = open ? "open" : hovered ? "hover" : "default";

  return (
    <>
      {/* ── Navbar — fixed, no background, blend mode over content ── */}
      <header style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: 90,
        zIndex: 100,
        mixBlendMode: "difference",
        pointerEvents: "none",
      }}>

        {/* Logo mark — 48×53, left:32, top:32 */}
        <Link href="/" style={{ position: "absolute", left: 32, top: 32, display: "block", width: 48, height: 53, pointerEvents: "auto" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgLogoMark} alt="A11" style={{ width: 48, height: 53, filter: "brightness(0) invert(1)" }} />
        </Link>

        {/* Wordmark — centered, 97×40, top:38.5 */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(calc(-50% + 0.5px))",
            top: 38.5,
            width: 97,
            height: 40,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgLogoText}
            alt="A11 Product Studio of the Ambitious"
            style={{ width: "100%", height: "100%", filter: "brightness(0) invert(1)" }}
          />
        </div>

        {/* Right group — CTA pill + 44×44 menu button, gap:20, top:36.5 */}
        <div
          style={{
            position: "absolute",
            right: 32,
            top: 36.5,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* Menu trigger — 44×44 hit area */}
          <button
            onClick={() => setOpen((v) => !v)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              flexShrink: 0,
              position: "relative",
              pointerEvents: "auto",
            }}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <MenuIcon state={iconState} />
          </button>
        </div>
      </header>

      {/* Spacer — reserves 90px so page content starts below the fixed header */}
      <div style={{ height: 90, flexShrink: 0 }} aria-hidden />

      {/* ── Backdrop ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 40 }}
          />
        )}
      </AnimatePresence>

      {/* ── Menu panel — clips open from top-right corner ───────────────────── */}
      {/*   Panel right:28 → button right edge (32) sits 4px inside panel.      */}
      {/*   clip-path starts at top-right corner, matching the button position.  */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ type: "tween", duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: "fixed",
              top: 33,
              right: 28,
              zIndex: 50,
              width: 268,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.4)",
              background: "rgba(239,234,229,0.4)",
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
              // top padding clears the 44px button (button bottom ≈ 47.5px from panel top)
              padding: "52px 24px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Nav links */}
            <motion.nav
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.055, delayChildren: 0.08 } },
              }}
              initial="hidden"
              animate="show"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                fontFamily: "'TWK Continental', serif",
                fontWeight: 400,
                fontSize: 24,
                lineHeight: 1.1,
                letterSpacing: "-0.48px",
                color: "#282328",
              }}
            >
              {navLinks.map((link, i) => (
                <motion.a
                  key={link}
                  href="#"
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    show:   { opacity: 1, y: 0,
                              transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] } },
                  }}
                  style={{ display: "block", color: "#282328", textDecoration: "none" }}
                  whileHover={{ opacity: 0.5 }}
                >
                  {link}
                </motion.a>
              ))}
            </motion.nav>

            {/* Divider */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show:   { opacity: 1, transition: { delay: 0.28, duration: 0.2 } },
              }}
              initial="hidden"
              animate="show"
              style={{ width: "100%", height: 1, background: "rgba(40,35,40,0.12)", flexShrink: 0 }}
            />

            {/* Keep in touch */}
            <motion.div
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.05, delayChildren: 0.32 } },
              }}
              initial="hidden"
              animate="show"
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 6 },
                  show:   { opacity: 1, y: 0, transition: { duration: 0.24, ease: [0.25, 0.1, 0.25, 1] } },
                }}
                style={{
                  margin: 0,
                  fontFamily: "'TWK Continental', serif",
                  fontWeight: 400,
                  fontSize: 11,
                  lineHeight: 1.1,
                  letterSpacing: "0.22px",
                  textTransform: "uppercase",
                  color: "#989190",
                }}
              >
                Keep in touch
              </motion.p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  fontFamily: "'TWK Continental', serif",
                  fontWeight: 400,
                  fontSize: 15,
                  lineHeight: 1.1,
                  letterSpacing: "-0.15px",
                  color: "#282328",
                }}
              >
                {socialLinks.map((link) => (
                  <motion.a
                    key={link}
                    href="#"
                    variants={{
                      hidden: { opacity: 0, y: 6 },
                      show:   { opacity: 1, y: 0, transition: { duration: 0.24, ease: [0.25, 0.1, 0.25, 1] } },
                    }}
                    style={{ display: "block", color: "#282328", textDecoration: "none" }}
                    whileHover={{ opacity: 0.5 }}
                    transition={{ duration: 0.15 }}
                  >
                    {link}
                  </motion.a>
                ))}
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
