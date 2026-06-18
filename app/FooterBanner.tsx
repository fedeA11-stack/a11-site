"use client";

import { motion } from "framer-motion";
import { Reveal, itemVariants } from "./Reveal";

// ── Design tokens ─────────────────────────────────────────────────────────────
const FONT = "var(--font-system), sans-serif";

// ── Component ─────────────────────────────────────────────────────────────────
// Renders the footer banner + bottom bar.
// Parent is responsible for horizontal container (max-w-[1240px] mx-auto).
export default function FooterBanner() {
  return (
    <Reveal amount={0.3}>
      {/*
       * Dark banner — 406px tall, bg #282328, rounded 8.887px (Figma).
       * Text positions are absolute within this container, exact from Figma:
       *   body copy  → top: 80px,  left: 6.45%
       *   CTA link   → top: 276px, left: 6.45%, underlined
       */}
      <motion.section
        data-footer=""
        variants={itemVariants}
        style={{
          position:           "relative",
          width:              "100%",
          height:             "406px",
          willChange:         "transform, opacity",
        }}
      >
        {/* Banner shape — vector dark panel with notched feet (Figma footer.svg) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/footer.svg"
          alt=""
          aria-hidden
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
        />

        {/* "If you're ambitious enough to work with us." */}
        <motion.p
          variants={itemVariants}
          style={{
            position:      "absolute",
            top:           "80px",
            left:          "6.45%",
            right:         "27.15%",
            margin:        0,
            fontFamily:    FONT,
            fontWeight:    500,
            fontSize:      "44px",
            lineHeight:    0.9,
            letterSpacing: "-0.03em",
            color:         "#ffffff",
            whiteSpace:    "pre-wrap",
          }}
        >
          {`If you're ambitious\nenough to work with us.`}
        </motion.p>

        {/* "We should talk." — underlined CTA */}
        <motion.a
          variants={itemVariants}
          href="mailto:hello@a11studio.com"
          style={{
            position:      "absolute",
            top:           "276px",
            left:          "6.45%",
            right:         "27.15%",
            fontFamily:    FONT,
            fontWeight:    500,
            fontSize:      "44px",
            lineHeight:    0.9,
            letterSpacing: "-0.03em",
            color:         "#ffffff",
            textDecoration: "underline",
            textUnderlineOffset: "4px",
            display:       "block",
            transition:    "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          We should talk.
        </motion.a>
      </motion.section>

      {/*
       * Bottom bar — gap 20px below banner (Figma: banner 406 → bottom bar 426).
       * Layout: justify-between
       *   Left group (w-459px, justify-between): A11 © 2026 | Social links
       *   Right: Privacy Policy
       * Font: 16px, leading 1.4, tracking -0.32px
       */}
      <motion.div
        variants={itemVariants}
        style={{
          marginTop:      "20px",
          position:       "relative",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          whiteSpace:     "nowrap",
        }}
      >
        {/* Left: A11 © 2026 */}
        <p
          style={{
            margin:        0,
            fontFamily:    FONT,
            fontWeight:    500,
            fontSize:      "16px",
            lineHeight:    1.4,
            letterSpacing: "-0.32px",
            color:         "#282328",
          }}
        >
          A11 © 2026
        </p>

        {/* Center: Social links — absolutely centered */}
        <div
          style={{
            position:      "absolute",
            left:          "50%",
            transform:     "translateX(-50%)",
            display:       "flex",
            alignItems:    "center",
            gap:           "4px",
            fontFamily:    FONT,
            fontSize:      "16px",
            lineHeight:    1.4,
            letterSpacing: "-0.32px",
            color:         "#282328",
          }}
        >
          <span style={{ fontWeight: 500 }}>Social</span>
          <span style={{ fontWeight: 400 }}>Twitter,</span>
          <span style={{ fontWeight: 400 }}>Cosmos,</span>
          <span style={{ fontWeight: 400 }}>Linkedin</span>
        </div>

        {/* Right: Privacy Policy */}
        <p
          style={{
            margin:        0,
            fontFamily:    FONT,
            fontWeight:    500,
            fontSize:      "16px",
            lineHeight:    1.4,
            letterSpacing: "-0.32px",
            color:         "#282328",
          }}
        >
          Privacy Policy
        </p>
      </motion.div>
    </Reveal>
  );
}
