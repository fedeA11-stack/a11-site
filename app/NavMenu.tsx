"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// ── Design tokens (from Figma "Nav" frame 2025:15162) ───────────────────────────
const FONT = "var(--font-system), sans-serif";

const DARK   = "#282328"; // logo, active label, CTA fill
const MUTED  = "#989190"; // inactive label
const PILL   = "rgba(40, 35, 40, 0.05)"; // soft hover/active pill behind a label

// Aligns nav edges to the 1240px content grid.
// On 1512px: (1512 − 1240) / 2 = 136px. Falls back to 32px on narrow screens.
const GRID = "max(32px, calc((100% - 1240px) / 2))";

// Replace with the real A11 Calendly link. The "let's talk" CTA opens this in
// Calendly's popup widget (falls back to a new tab if the widget hasn't loaded).
const CALENDLY_URL = "https://calendly.com/a11studio";

const NAV_LINKS = [
  { label: "work",       href: "/"        },
  { label: "playground", href: "#"        },
  { label: "studio",     href: "/studio"  },
];

// Pill slide — a snappy-but-soft spring; matches Figma's 0.3s smart-animate feel.
const PILL_SPRING = { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.8 };

// A breadcrumb trail rendered in place of the centered nav links (used by the
// case-study template). Last segment is the current page (full opacity); earlier
// segments are muted and optionally linked.
export type Crumb = { label: string; href?: string };

// ── Shared arrow glyph (the ↗ in the CTA / let's-talk row) ──────────────────────
function ArrowUpRight({ size = 12, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M3 9L9 3M9 3H4M9 3V8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
        <div className="max-w-[1240px] mx-auto w-full px-4 md:px-8 lg:px-0 flex items-center h-full">
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
                fontWeight: 500, fontSize: 14, lineHeight: 1, letterSpacing: "-0.14px",
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

          <div style={{ flex: "1 1 0", minWidth: 0 }} aria-hidden />
        </div>
      </header>
      <div style={{ height: 80, flexShrink: 0 }} aria-hidden />
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Main navigation — the redesign.
// ════════════════════════════════════════════════════════════════════════════
export default function NavMenu({ breadcrumb }: { breadcrumb?: Crumb[] } = {}) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Active when the route matches. "work" (/) also owns the project pages
  // (/world, /world/chat, …); placeholder "#" links never highlight.
  const isActive = (href: string) => {
    if (href === "#") return false;
    if (href === "/") return pathname === "/" || pathname.startsWith("/world");
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Whichever label the pill should sit on: the hovered one wins, else the
  // active route's. Null when nothing is hovered and no link matches.
  const activeLabel = NAV_LINKS.find((l) => isActive(l.href))?.label ?? null;
  const pillLabel = hovered ?? activeLabel;

  // Load Calendly's popup widget once (lazily, after mount).
  useEffect(() => {
    if (document.getElementById("calendly-widget-script")) return;
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(css);
    const js = document.createElement("script");
    js.id = "calendly-widget-script";
    js.src = "https://assets.calendly.com/assets/external/widget.js";
    js.async = true;
    document.body.appendChild(js);
  }, []);

  // Lock scroll while the mobile overlay is open.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [menuOpen]);

  // Close the overlay on route change.
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const openCalendly = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    const C = (window as unknown as { Calendly?: { initPopupWidget: (o: { url: string }) => void } }).Calendly;
    if (C?.initPopupWidget) C.initPopupWidget({ url: CALENDLY_URL });
    else window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
  };

  if (breadcrumb) return <BreadcrumbNav breadcrumb={breadcrumb} />;

  return (
    <>
      <header
        style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: 80,
          zIndex: 100, pointerEvents: "none",
        }}
      >
        <div className="max-w-[1240px] mx-auto w-full px-4 md:px-8 lg:px-0 flex items-center h-full">
          {/* ── Left: logo (flex:1 keeps the center nav optically centered) ── */}
          <Link href="/" style={{ display: "block", height: 36, flex: "1 1 0", minWidth: 0, pointerEvents: "auto" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo.svg"
              alt="A11"
              style={{ width: 32, height: 36, filter: "brightness(0)", display: "block" }}
            />
          </Link>

          {/* ── Center: pill nav with a single sliding indicator (desktop) ── */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex"
            onMouseLeave={() => setHovered(null)}
            style={{ flexShrink: 0, alignItems: "center", gap: 8, pointerEvents: "auto" }}
          >
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              const lit = pillLabel === link.label;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onMouseEnter={() => setHovered(link.label)}
                  aria-current={active ? "page" : undefined}
                  style={{
                    position: "relative", display: "inline-flex", alignItems: "center",
                    padding: "7px 14px", borderRadius: 999, textDecoration: "none",
                    fontFamily: FONT, fontWeight: 500, fontSize: 15, lineHeight: 1,
                    letterSpacing: "-0.15px", whiteSpace: "nowrap",
                  }}
                >
                  {lit && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={reduce ? { duration: 0 } : PILL_SPRING}
                      style={{ position: "absolute", inset: 0, borderRadius: 999, background: PILL, zIndex: 0 }}
                    />
                  )}
                  <span
                    style={{
                      position: "relative", zIndex: 1,
                      color: active || lit ? DARK : MUTED,
                      transition: "color 0.25s cubic-bezier(0.2, 0, 0, 1)",
                    }}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* ── Right (desktop): let's talk CTA ── */}
          <div className="hidden md:flex" style={{ flex: "1 1 0", minWidth: 0, justifyContent: "flex-end" }}>
            <a
              href={CALENDLY_URL}
              onClick={openCalendly}
              className="nav-cta"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "7px 14px", borderRadius: 999, background: DARK,
                color: "#fff", textDecoration: "none", fontFamily: FONT,
                fontWeight: 500, fontSize: 15, lineHeight: 1, letterSpacing: "-0.15px",
                whiteSpace: "nowrap", pointerEvents: "auto",
              }}
            >
              let&rsquo;s talk
              <span className="nav-cta-arrow" style={{ display: "inline-flex", transition: "transform 0.25s cubic-bezier(0.2, 0, 0, 1)" }}>
                <ArrowUpRight />
              </span>
            </a>
          </div>

          {/* ── Right (mobile): menu trigger ── */}
          <div className="flex md:hidden" style={{ flex: "1 1 0", minWidth: 0, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              style={{
                display: "inline-flex", alignItems: "center", padding: "9px 16px",
                borderRadius: 999, border: "none", background: PILL, color: DARK,
                fontFamily: FONT, fontWeight: 500, fontSize: 15, lineHeight: 1,
                letterSpacing: "-0.15px", cursor: "pointer", pointerEvents: "auto",
              }}
            >
              menu
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
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3, ease: [0.2, 0, 0, 1] }}
            style={{
              position: "fixed", inset: 0, zIndex: 200, background: DARK,
              display: "flex", flexDirection: "column",
            }}
          >
            {/* Overlay top bar — logo + close */}
            <div className="max-w-[1240px] mx-auto w-full px-4 flex items-center" style={{ height: 80, flexShrink: 0 }}>
              <Link href="/" onClick={() => setMenuOpen(false)} style={{ display: "block", height: 36, flex: "1 1 0" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/logo.svg" alt="A11" style={{ width: 32, height: 36, filter: "brightness(0) invert(1)", display: "block" }} />
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                style={{
                  display: "inline-flex", alignItems: "center", padding: "9px 16px",
                  borderRadius: 999, border: "none", background: "rgba(255,255,255,0.1)",
                  color: "#fff", fontFamily: FONT, fontWeight: 500, fontSize: 15,
                  lineHeight: 1, letterSpacing: "-0.15px", cursor: "pointer",
                }}
              >
                close
              </button>
            </div>

            {/* Links — staggered reveal */}
            <nav
              aria-label="Mobile navigation"
              className="max-w-[1240px] mx-auto w-full px-4"
              style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}
            >
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.06 * i, ease: [0.2, 0, 0, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      color: "#fff", textDecoration: "none", fontFamily: FONT,
                      fontWeight: 500, fontSize: 44, lineHeight: 1.1, letterSpacing: "-1px",
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.06 * NAV_LINKS.length, ease: [0.2, 0, 0, 1] }}
              >
                <a
                  href={CALENDLY_URL}
                  onClick={openCalendly}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8, color: "#fff",
                    textDecoration: "none", fontFamily: FONT, fontWeight: 500, fontSize: 44,
                    lineHeight: 1.1, letterSpacing: "-1px",
                  }}
                >
                  let&rsquo;s talk
                </a>
              </motion.div>
            </nav>

            {/* Social block */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 0.3, ease: [0.2, 0, 0, 1] }}
              className="max-w-[1240px] mx-auto w-full px-4"
              style={{
                flexShrink: 0, paddingBottom: 40, display: "flex", flexDirection: "column",
                gap: 6, fontFamily: FONT, fontSize: 16, lineHeight: 1.5,
              }}
            >
              <span style={{ color: "#fff", fontWeight: 500 }}>Social</span>
              {[
                { label: "Twitter / X", href: "#" },
                { label: "Cosmos", href: "#" },
                { label: "Linkedin", href: "#" },
              ].map((s) => (
                <a key={s.label} href={s.href} style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>
                  {s.label}
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nudge the CTA arrow on hover */}
      <style>{`.nav-cta:hover .nav-cta-arrow { transform: translate(2px, -2px); }`}</style>
    </>
  );
}
