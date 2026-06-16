"use client";

// ── Design tokens ─────────────────────────────────────────────────────────────
const FONT = "'System Unlicensed Trial', sans-serif";

// ── Component ─────────────────────────────────────────────────────────────────
// Renders the footer banner + bottom bar.
// Parent is responsible for horizontal container (max-w-[1240px] mx-auto).
export default function FooterBanner() {
  return (
    <div>
      {/*
       * Dark banner — 422.146px tall, bg #282328, rounded 8.887px.
       * Text positions are absolute within this container, exact from Figma:
       *   body copy  → top: 77.76px,  left: 6.45%
       *   CTA link   → top: 297.72px, left: 6.45%, underlined
       */}
      <section
        data-footer=""
        style={{
          position:           "relative",
          width:              "100%",
          height:             "422.146px",
          borderRadius:       "8.887px",
          overflow:           "hidden",
          backgroundImage:    "url('/assets/footer.png')",
          backgroundSize:     "cover",
          backgroundPosition: "center",
          backgroundRepeat:   "no-repeat",
        }}
      >
        {/* "If you're ambitious enough to work with us." */}
        <p
          style={{
            position:      "absolute",
            top:           "77.76px",
            left:          "6.45%",
            right:         "27.15%",
            margin:        0,
            fontFamily:    FONT,
            fontWeight:    500,
            fontSize:      "42px",
            lineHeight:    0.95,
            letterSpacing: "-0.84px",
            color:         "#ffffff",
            whiteSpace:    "pre-wrap",
          }}
        >
          {`If you're ambitious\nenough to work with us.`}
        </p>

        {/* "We should talk." — underlined CTA */}
        <a
          href="mailto:hello@a11studio.com"
          style={{
            position:      "absolute",
            top:           "297.72px",
            left:          "6.45%",
            right:         "27.15%",
            fontFamily:    FONT,
            fontWeight:    500,
            fontSize:      "42px",
            lineHeight:    0.95,
            letterSpacing: "-0.84px",
            color:         "#ffffff",
            textDecoration: "underline",
            textUnderlineOffset: "4px",
            display:       "block",
          }}
        >
          We should talk.
        </a>
      </section>

      {/*
       * Bottom bar — gap 81px below banner (from Figma: gap-[81px] in parent flex).
       * Layout: justify-between
       *   Left group (w-459px, justify-between): A11 © 2026 | Social links
       *   Right: Privacy Policy
       * Font: 16px, leading 1.4, tracking -0.32px
       */}
      <div
        style={{
          marginTop:     "81px",
          display:       "flex",
          alignItems:    "center",
          justifyContent: "space-between",
          whiteSpace:    "nowrap",
        }}
      >
        {/* Left group — fixed 459px, space-between A11 © 2026 and Social links */}
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            width:          "459px",
          }}
        >
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

          <div
            style={{
              display:    "flex",
              alignItems: "center",
              gap:        "4px",
              fontFamily: FONT,
              fontSize:   "16px",
              lineHeight: 1.4,
              letterSpacing: "-0.32px",
              color:      "#282328",
            }}
          >
            {/* "Social" label — Medium weight */}
            <span style={{ fontWeight: 500 }}>Social</span>
            {/* Individual links — Regular weight */}
            <span style={{ fontWeight: 400 }}>Twitter,</span>
            <span style={{ fontWeight: 400 }}>Cosmos,</span>
            <span style={{ fontWeight: 400 }}>Linkedin</span>
          </div>
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
      </div>
    </div>
  );
}
