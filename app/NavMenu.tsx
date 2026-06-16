"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// ── Design tokens ─────────────────────────────────────────────────────────────
const FONT = "'System Unlicensed Trial', sans-serif";

// Aligns nav edges to the 1240px content grid.
// On 1512px: (1512 − 1240) / 2 = 136px. Falls back to 32px on narrow screens.
const GRID = "max(32px, calc((100% - 1240px) / 2))";

const NAV_LINKS = [
  { label: "Work",       href: "/"        },
  { label: "Studio",     href: "/studio"  },
  { label: "Playground", href: "#"        },
  { label: "Contact",    href: "#"        },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function NavMenu() {
  const pathname = usePathname();
  const [time, setTime] = useState("SFO, --:--:-- --");

  // Active when the route matches. "Work" (/) also owns the project pages
  // (/world, /world/chat, …); placeholder "#" links never highlight.
  const isActive = (href: string) => {
    if (href === "#") return false;
    if (href === "/") return pathname === "/" || pathname.startsWith("/world");
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Live SFO clock
  useEffect(() => {
    const update = () => {
      const t = new Date().toLocaleTimeString("en-US", {
        timeZone: "America/Los_Angeles",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setTime(`SFO, ${t}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/*
       * Fixed header — mixBlendMode:difference inverts colors over dark imagery.
       * Height 80px = logo bottom (y=44 + h=36) from Figma frame.
       * pointerEvents:none on the shell; interactive elements re-enable per-element.
       */}
      <header
        style={{
          position:      "fixed",
          top:           0,
          left:          0,
          width:         "100%",
          height:        80,
          zIndex:        100,
          mixBlendMode:  "difference",
          pointerEvents: "none",
        }}
      >
        {/* Inner row — same container as page content for grid alignment */}
        <div className="max-w-[1240px] mx-auto w-full px-4 md:px-8 lg:px-0 flex items-center h-full">
          {/* ── Left: Logo mark 32×36px ────────────────────────────────── */}
          {/* flex:1 so the left/right slots carry equal weight — keeps the
              center nav optically centered on the page, not between the
              narrow logo and the wider clock. */}
          <Link
            href="/"
            style={{
              display:       "block",
              height:        36,
              flex:          "1 1 0",
              minWidth:      0,
              pointerEvents: "auto",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo.svg"
              alt="A11"
              style={{
                width:   32,
                height:  36,
                filter:  "brightness(0) invert(1)",
                display: "block",
              }}
            />
          </Link>

          {/* ── Center: Nav links — gap 48px, 14px, capitalize ─────────── */}
          <nav
            aria-label="Main navigation"
            style={{ flexShrink: 0, display: "flex", justifyContent: "center" }}
          >
            <div
              style={{
                display:       "flex",
                alignItems:    "center",
                gap:           48,
                fontFamily:    FONT,
                fontWeight:    500,
                fontSize:      14,
                lineHeight:    1,
                letterSpacing: "-0.14px",
                textTransform: "capitalize",
                whiteSpace:    "nowrap",
              }}
            >
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{
                      color:          "#ffffff",
                      opacity:        active ? 1 : 0.5,
                      textDecoration: "none",
                      pointerEvents:  "auto",
                      // ≥40px hit area (13px top/bottom + 14px line = 40px), no baseline shift
                      padding:        "13px 0",
                      transition:     "opacity 0.15s cubic-bezier(0.2, 0, 0, 1)",
                    }}
                    onMouseEnter={active ? undefined : e => (e.currentTarget.style.opacity = "0.8")}
                    onMouseLeave={active ? undefined : e => (e.currentTarget.style.opacity = "0.5")}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* ── Right: Location + live time ────────────────────────────── */}
          <p
            style={{
              margin:        0,
              fontFamily:    FONT,
              fontWeight:    500,
              fontSize:      14,
              lineHeight:    1,
              letterSpacing: "-0.14px",
              color:         "#ffffff",
              opacity:       0.5,
              textAlign:     "right",
              textTransform: "capitalize",
              whiteSpace:    "nowrap",
              flex:          "1 1 0",
              minWidth:      0,
            }}
          >
            {time}
          </p>
        </div>
      </header>

      {/* Spacer — matches header height so content starts below the fixed bar */}
      <div style={{ height: 80, flexShrink: 0 }} aria-hidden />
    </>
  );
}
