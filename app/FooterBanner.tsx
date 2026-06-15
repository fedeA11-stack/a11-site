"use client";

export default function FooterBanner() {
  return (
    <section
      data-footer=""
      style={{
        margin:             "0 32px 32px",
        position:           "relative",
        display:            "flex",
        alignItems:         "center",
        justifyContent:     "center",
        minHeight:          "clamp(240px, 27.78vw, 400px)",
        backgroundImage:    "url('/assets/Footer.svg')",
        backgroundSize:     "100% 100%",
        backgroundRepeat:   "no-repeat",
        backgroundPosition: "center",
      }}
    >

      {/* Content */}
      <div
        style={{
          position:       "relative",
          zIndex:         1,
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          gap:            32,
          padding:        "clamp(48px, 6.67vw, 96px) 32px",
          textAlign:      "center",
        }}
      >
        <p
          style={{
            margin:        0,
            fontFamily:    "'TWK Continental', serif",
            fontWeight:    450,
            fontSize:      "clamp(28px, 2.78vw, 40px)",
            lineHeight:    0.95,
            letterSpacing: "-0.02em",
            color:         "#ffffff",
            maxWidth:      "min(741px, 100%)",
          }}
        >
          If you&apos;re ambitious <br />
          enough to work with us. <br />
          We should talk!
        </p>

        <a
          href="mailto:hello@a11studio.com"
          style={{
            display:        "inline-flex",
            alignItems:     "center",
            justifyContent: "center",
            height:         40,
            padding:        "6px 14px",
            borderRadius:   100,
            background:     "#ffffff",
            textDecoration: "none",
            fontFamily:     "'TWK Continental', serif",
            fontWeight:     400,
            fontSize:       14,
            lineHeight:     1.09,
            color:          "#282328",
            whiteSpace:     "nowrap",
            textTransform:  "capitalize",
            transition:     "opacity 0.18s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          Let&apos;s Talk
        </a>
      </div>
    </section>
  );
}
