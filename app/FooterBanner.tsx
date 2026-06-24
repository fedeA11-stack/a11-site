"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Reveal, itemVariants } from "./Reveal";
import { SOCIAL_LINKS } from "./socialLinks";

// ── Design tokens (Figma "Footer" — node 364:77140) ───────────────────────────
const FONT = "var(--font-system), sans-serif";
const PANEL = "#322324"; // dark band   (rgb 50,35,36)
const MUTED = "#8B7E7B"; // "Let's talk." underline (rgb 139,126,123)

// ── Link data ─────────────────────────────────────────────────────────────────
// Routes that don't exist yet (socials / Privacy) point at "#", matching the
// existing nav placeholders (NavMenu SOCIAL_LINKS).
type FooterLink = { label: string; href: string };
const NAV: FooterLink[] = [
  { label: "Works",   href: "/"        },
  { label: "Studio",  href: "/studio"  },
  { label: "Contact", href: "/contact" },
];

// ── Component ─────────────────────────────────────────────────────────────────
// Full-bleed dark footer band. Breaks out of whatever padded/centred container
// it's dropped into (all four pages wrap it differently) via the standard
// 100vw + left:50% technique — works for any horizontally-centred container.
//
// Two Figma frames drive the responsive split at 768px:
//   mobile  (393w): 48px headline, nav + social columns, legal stacked below
//   desktop (1512w): 92px headline, nav + social + legal as three columns
// Sizes are anchored to the design widths with vw-based clamps so the band
// scales smoothly between and past the reference widths.
export default function FooterBanner() {
  return (
    <Reveal amount={0.3}>
      <style>{`
        .fbn {
          position: relative;
          left: 50%;
          width: 100vw;
          margin-left: -50vw;
          margin-right: -50vw;
          background: ${PANEL};
        }
        /* Horizontal padding mirrors the work-grid gutters so the footer copy
           lines up with the cards above it: 10px (mobile) → 2rem (md, px-8) →
           --bleed (lg). Vertical padding follows the Figma footer proportions. */
        .fbn-inner {
          padding-inline: 10px;
          padding-top: clamp(80px, 11.9vw, 180px);
          padding-bottom: clamp(80px, 11.9vw, 180px);
        }
        .fbn-head {
          margin: 0;
          max-width: 12.2em;
          font-family: ${FONT};
          font-weight: 500;
          font-size: clamp(36px, 12.2vw, 48px);
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #fff;
          text-wrap: balance;
        }
        .fbn-cta { color: ${MUTED}; text-decoration: underline; text-underline-offset: 4px; }
        .fbn a { transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .fbn a:hover { opacity: 0.6; }

        .fbn-cols {
          display: grid;
          grid-template-columns: clamp(120px, 45.3vw, 178px) max-content;
          margin-top: clamp(68px, 7.94vw, 120px);
        }
        .fbn-col {
          display: flex;
          flex-direction: column;
          gap: 32px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .fbn-col li { line-height: 1; }
        .fbn-col a, .fbn-legal span, .fbn-legal a {
          font-family: ${FONT};
          font-weight: 500;
          font-size: 18px;
          line-height: 1;
          letter-spacing: -0.36px;
          color: #fff;
          text-decoration: none;
        }
        .fbn-legal {
          grid-column: 1 / -1;
          margin-top: clamp(56px, 17vw, 68px);
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        @media (min-width: 768px) {
          .fbn-inner {
            padding-inline: 2rem;
            padding-top: clamp(120px, 11.9vw, 180px);
            padding-bottom: clamp(120px, 11.9vw, 180px);
          }
          .fbn-head { font-size: clamp(48px, 6.085vw, 92px); }
          .fbn-cols {
            grid-template-columns: clamp(160px, 24.8vw, 375px) clamp(160px, 24.87vw, 376px) max-content;
          }
          .fbn-legal { grid-column: auto; margin-top: 0; }
        }

        /* lg: match the work-grid's --bleed gutter exactly. */
        @media (min-width: 1024px) {
          .fbn-inner { padding-inline: var(--bleed); }
        }
      `}</style>

      <motion.section data-footer="" className="fbn" variants={itemVariants} style={{ willChange: "transform, opacity" }}>
        <div className="fbn-inner">
          {/* Headline — "Let's talk." is the muted, underlined CTA to /contact */}
          <p className="fbn-head">
            It&rsquo;s time to fight for craft.{" "}
            <Link href="/contact" className="fbn-cta">Let&rsquo;s talk.</Link>
          </p>

          <div className="fbn-cols">
            {/* Column 1 — navigation */}
            <ul className="fbn-col">
              {NAV.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>

            {/* Column 2 — social */}
            <ul className="fbn-col">
              {SOCIAL_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>

            {/* Column 3 (desktop) / stacked below (mobile) — legal */}
            <div className="fbn-legal">
              <a href="#">Privacy Policy</a>
              <span>A11 © 2026</span>
            </div>
          </div>
        </div>
      </motion.section>
    </Reveal>
  );
}
