"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// ── Design tokens (from Figma "Navigation" frame 221:24055) ──────────────────────
const FONT = "var(--font-system), sans-serif";

const DARK = "#282328"; // logo, labels, active dot, CTA text
const DARKBG = "#282328"; // mobile overlay background

// The "Let's Talk" (desktop) and "Contact" (mobile) CTAs route to the contact page.
const CONTACT_HREF = "/contact";

const NAV_LINKS = [
  { label: "Work",       href: "/"       },
  { label: "Studio",     href: "/studio" },
  // Manifesto lives as the Studio-page CTA, not a nav link.
];

const SOCIAL_LINKS = [
  { label: "Twitter/X", href: "#" },
  { label: "Cosmos",    href: "#" },
  { label: "LinkedIn",  href: "#" },
];

// A breadcrumb trail rendered in place of the centered nav links (used by the
// case-study template). Last segment is the current page (full opacity); earlier
// segments are muted and optionally linked.
export type Crumb = { label: string; href?: string };

// ── 3×3 dot-grid glyph (sits beside "Let's Talk"/"Menu"/"Close") ─────────────────
// Nine fixed 4px dots on an 8px pitch in a 24×24 box. At rest the four corners are
// lit and everything else sits at 10% (an "X"); on hover the lit set crossfades to
// the four edge-midpoints (a "+"), so the brightness appears to pivot 45° around
// the always-dim center. Matches the Figma asset — per-dot opacity, no rotation.
const DOT_DIM = 0.1;

// Row-major 3×3 classification of each cell.
const DOT_KIND = [
  "corner", "edge",   "corner",
  "edge",   "center", "edge",
  "corner", "edge",   "corner",
] as const;

function dotOpacity(kind: (typeof DOT_KIND)[number], active: boolean) {
  if (kind === "center") return DOT_DIM;           // always dim
  if (kind === "corner") return active ? DOT_DIM : 1; // lit at rest
  return active ? 1 : DOT_DIM;                      // edge — lit on hover
}

function DotGrid({ color = DARK, active = false, reduce = false }: { color?: string; active?: boolean; reduce?: boolean }) {
  return (
    <span aria-hidden style={{ position: "relative", display: "inline-block", width: 24, height: 24, flexShrink: 0 }}>
      {DOT_KIND.map((kind, i) => {
        const r = Math.floor(i / 3), c = i % 3;
        return (
          <span
            key={i}
            style={{
              position: "absolute", width: 4, height: 4, borderRadius: "50%",
              background: color, left: 2 + c * 8, top: 2 + r * 8,
              opacity: dotOpacity(kind, active),
              transition: reduce ? "none" : "opacity 0.18s ease",
            }}
          />
        );
      })}
    </span>
  );
}

// ── Active-page dot — a 4px rounded square that precedes the current link ────────
function ActiveDot({ color = DARK }: { color?: string }) {
  return <span aria-hidden style={{ width: 4, height: 4, borderRadius: 1, background: color, flexShrink: 0 }} />;
}

// ── "Let's Talk" CTA — text + dot-grid that morphs on hover; routes to /contact ──
// Shared by the main nav (dark) and the case-study breadcrumb (white). Owns its
// own hover state so each instance animates independently.
function ContactCta({ color = DARK }: { color?: string }) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={CONTACT_HREF}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 20,
        color, textDecoration: "none", fontFamily: FONT,
        fontWeight: 500, fontSize: 18, lineHeight: 1, letterSpacing: "-0.36px",
        whiteSpace: "nowrap", pointerEvents: "auto",
      }}
    >
      Let&rsquo;s Talk
      <DotGrid color={color} active={hover} reduce={!!reduce} />
    </Link>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Breadcrumb header — case-study pages (dark heroes). Kept on the original
// white-text + mixBlendMode:difference treatment so it stays legible on imagery.
// ════════════════════════════════════════════════════════════════════════════
function BreadcrumbNav({ breadcrumb }: { breadcrumb: Crumb[] }) {
  return (
    <>
      <header
        style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: 80,
          zIndex: 100, mixBlendMode: "difference", pointerEvents: "none",
        }}
      >
        <div className="w-full px-4 md:px-8 lg:px-5 flex items-center h-full">
          <Link
            href="/"
            style={{ display: "block", height: 36, flex: "1 1 0", minWidth: 0, pointerEvents: "auto" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo.svg"
              alt="A11"
              style={{ width: 32, height: 36, filter: "brightness(0) invert(1)", display: "block" }}
            />
          </Link>

          <nav aria-label="Breadcrumb" style={{ flexShrink: 0, display: "flex", justifyContent: "center" }}>
            <div
              style={{
                display: "flex", alignItems: "center", gap: 8, fontFamily: FONT,
                fontWeight: 500, fontSize: 18, lineHeight: 1, letterSpacing: "-0.36px",
                textTransform: "capitalize", whiteSpace: "nowrap",
              }}
            >
              {breadcrumb.map((crumb, i) => {
                const isLast = i === breadcrumb.length - 1;
                const label = (
                  <span style={{ color: "#ffffff", opacity: isLast ? 1 : 0.5 }}>{crumb.label}</span>
                );
                return (
                  <span key={crumb.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {crumb.href && !isLast ? (
                      <Link href={crumb.href} style={{ textDecoration: "none", pointerEvents: "auto", padding: "13px 0" }}>
                        {label}
                      </Link>
                    ) : (
                      label
                    )}
                    {!isLast && <span style={{ color: "#ffffff", opacity: 0.3 }}>/</span>}
                  </span>
                );
              })}
            </div>
          </nav>

          <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", justifyContent: "flex-end" }}>
            <ContactCta color="#fff" />
          </div>
        </div>
      </header>
      <div style={{ height: 80, flexShrink: 0 }} aria-hidden />
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Main navigation — the redesign.
// ════════════════════════════════════════════════════════════════════════════
export default function NavMenu({ breadcrumb, theme }: { breadcrumb?: Crumb[]; theme?: "dark" } = {}) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  // Active when the route matches. "Works" (/) also owns the project pages
  // (/world, /world/chat, …); placeholder "#" links never highlight.
  const isActive = (href: string) => {
    if (href === "#") return false;
    if (href === "/") return pathname === "/" || pathname.startsWith("/world");
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Lock scroll while the mobile overlay is open.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [menuOpen]);

  // Close the overlay on route change. Deriving this during render (the React
  // "adjust state while rendering" pattern) avoids the extra render pass that
  // set-state-in-effect causes, and covers every navigation cause — link click,
  // back button, programmatic — not just clicks.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  if (breadcrumb) return <BreadcrumbNav breadcrumb={breadcrumb} />;

  return (
    <>
      <header
        style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: 80,
          zIndex: 100, ...(theme !== "dark" && { mixBlendMode: "difference" }), pointerEvents: "none",
        }}
      >
        <div className="w-full px-4 md:px-8 lg:px-5 flex items-center h-full">
          {/* ── Left: logo (flex:1 keeps the center nav optically centered) ── */}
          <Link href="/" style={{ display: "block", height: 36, flex: "1 1 0", minWidth: 0, pointerEvents: "auto" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo.svg"
              alt="A11"
              style={{ width: 32, height: 36, filter: "brightness(0) invert(1)", display: "block" }}
            />
          </Link>

          {/* ── Center: plain text links; active page carries a leading dot (desktop) ── */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex"
            style={{ flexShrink: 0, alignItems: "center", gap: 48, pointerEvents: "auto" }}
          >
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    textDecoration: "none", color: "#ffffff", fontFamily: FONT,
                    fontWeight: 500, fontSize: 18, lineHeight: 1,
                    letterSpacing: "-0.36px", whiteSpace: "nowrap",
                    // Vertical padding grows the hit area to ~40px (>WCAG 2.2 24px
                    // minimum); flex-centering keeps the label visually in place.
                    padding: "11px 0",
                  }}
                >
                  {active && <ActiveDot color="#fff" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ── Right (desktop): Let's Talk + animated dot-grid ── */}
          <div className="hidden md:flex" style={{ flex: "1 1 0", minWidth: 0, justifyContent: "flex-end" }}>
            <ContactCta color="#ffffff" />
          </div>

          {/* ── Right (mobile): Menu trigger ── */}
          <div className="flex md:hidden" style={{ flex: "1 1 0", minWidth: 0, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              style={{
                display: "inline-flex", alignItems: "center", gap: 12,
                border: "none", background: "transparent", color: "#ffffff",
                fontFamily: FONT, fontWeight: 500, fontSize: 18, lineHeight: 1,
                letterSpacing: "-0.36px", cursor: "none", pointerEvents: "auto",
                // ~48px tall tap target; flex-centering keeps it visually unchanged.
                padding: "12px 0",
              }}
            >
              Menu
              <DotGrid color="#ffffff" reduce={!!reduce} />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer — matches header height so content starts below the fixed bar */}
      <div style={{ height: 80, flexShrink: 0 }} aria-hidden />

      {/* ── Mobile full-screen overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            // Exit ~20% faster than entrance — dismissal should feel immediate.
            exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.25, ease: [0.2, 0, 0, 1] } }}
            transition={{ duration: reduce ? 0 : 0.3, ease: [0.2, 0, 0, 1] }}
            style={{
              position: "fixed", inset: 0, zIndex: 200, background: DARKBG,
              display: "flex", flexDirection: "column",
            }}
          >
            {/* Overlay top bar — logo + Close + dot-grid */}
            <div className="w-full px-4 md:px-8 lg:px-5 flex items-center" style={{ height: 80, flexShrink: 0 }}>
              <Link href="/" onClick={() => setMenuOpen(false)} style={{ display: "block", height: 36, flex: "1 1 0" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/logo.svg" alt="A11" style={{ width: 32, height: 36, filter: "brightness(0) invert(1)", display: "block" }} />
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 16, border: "none",
                  background: "transparent", color: "#fff", fontFamily: FONT, fontWeight: 500,
                  fontSize: 18, lineHeight: 1, letterSpacing: "-0.36px", cursor: "none",
                  // ~48px tall tap target; flex-centering keeps it visually unchanged.
                  padding: "12px 0",
                }}
              >
                Close
                <DotGrid color="#fff" reduce={!!reduce} />
              </button>
            </div>

            {/* Links — staggered reveal */}
            <nav
              aria-label="Mobile navigation"
              className="w-full px-4 md:px-8 lg:px-5"
              style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}
            >
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : 0.06 * i, ease: [0.2, 0, 0, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      color: "#fff", textDecoration: "none", fontFamily: FONT,
                      fontWeight: 500, fontSize: 42, lineHeight: 1, letterSpacing: "-1px",
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : 0.06 * NAV_LINKS.length, ease: [0.2, 0, 0, 1] }}
              >
                <Link
                  href={CONTACT_HREF}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "inline-flex", alignItems: "center", color: "#fff",
                    textDecoration: "none", fontFamily: FONT, fontWeight: 500, fontSize: 42,
                    lineHeight: 1, letterSpacing: "-1px",
                  }}
                >
                  Contact
                </Link>
              </motion.div>
            </nav>

            {/* Resources block */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.3, ease: [0.2, 0, 0, 1] }}
              className="w-full px-4 md:px-8 lg:px-5"
              style={{ flexShrink: 0, paddingBottom: 40, fontFamily: FONT }}
            >
              <div style={{ height: 1, background: "rgba(255,255,255,0.1)", marginBottom: 32 }} aria-hidden />
              <span
                style={{
                  display: "block", marginBottom: 16, color: "#989190",
                  fontWeight: 500, fontSize: 10, lineHeight: 1, letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Resources
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {SOCIAL_LINKS.map((s) => (
                  <a key={s.label} href={s.href} style={{ color: "#fff", textDecoration: "none", fontSize: 16, lineHeight: 1 }}>
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
