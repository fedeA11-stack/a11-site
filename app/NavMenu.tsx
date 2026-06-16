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
          <Link
            href="/"
            style={{
              display:       "block",
              width:         32,
              height:        36,
              flexShrink:    0,
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
            style={{ flex: 1, display: "flex", justifyContent: "center" }}
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
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    color:          "#ffffff",
                    opacity:        pathname === link.href ? 1 : 0.5,
                    textDecoration: "none",
                    pointerEvents:  "auto",
                  }}
                >
                  {link.label}
                </Link>
              ))}
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
              flexShrink:    0,
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
