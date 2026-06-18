"use client";

import NavMenu from "../NavMenu";
import PageEnter from "../PageEnter";
import FooterBanner from "../FooterBanner";
import WordReveal from "../WordReveal";

const FONT = "var(--font-system), sans-serif";

// Figma: flex-col, label text on top, 6×6 dot below, gap: 10px
function FloatingLabel({
  text,
  style,
  className,
}: {
  text: string;
  style: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
        pointerEvents: "none",
        ...style,
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: FONT,
          fontWeight: 400,
          fontSize: "16px",
          lineHeight: 1.4,
          letterSpacing: "0px",
          color: "#d2d3d6",
          whiteSpace: "nowrap",
          textTransform: "capitalize",
        }}
      >
        {text}
      </p>
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "1px",
          backgroundColor: "#282828",
          flexShrink: 0,
        }}
      />
    </div>
  );
}

export default function ManifestoPage() {
  return (
    <div className="bg-white min-h-screen">
      <style>{`
        @keyframes mf-float-a {
          0%, 100% { transform: translate(0px, 0px);    opacity: 1; }
          50%       { transform: translate(4px, -20px);  opacity: 0.78; }
        }
        @keyframes mf-float-b {
          0%, 100% { transform: translate(0px, 0px);    opacity: 1; }
          50%       { transform: translate(-5px, -16px); opacity: 0.80; }
        }
        @keyframes mf-float-c {
          0%, 100% { transform: translate(0px, 0px);    opacity: 1; }
          50%       { transform: translate(6px, -22px);  opacity: 0.76; }
        }
        @keyframes mf-float-d {
          0%, 100% { transform: translate(0px, 0px);    opacity: 1; }
          50%       { transform: translate(-4px, -18px); opacity: 0.80; }
        }
        .mf-a { animation: mf-float-a 6s   ease-in-out infinite 0s; }
        .mf-b { animation: mf-float-b 7s   ease-in-out infinite 1.4s; }
        .mf-c { animation: mf-float-c 8s   ease-in-out infinite 2.8s; }
        .mf-d { animation: mf-float-d 5.5s ease-in-out infinite 0.7s; }
      `}</style>
      <NavMenu />

      <PageEnter>
      {/*
       * Outer shell: clips the oversized shape but does NOT anchor labels.
       * Labels are anchored inside the 1240px grid container below.
       */}
      <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>

        {/* ── Background shape ────────────────────────────────────────────
         * manifesto shape.svg: 746×885 card, fill #F0F0F0. Centered via
         * left:50%/translateX. top: 422px = Figma 502px − 80px nav.
         * 900px wide so it overflows the grid edges, text floats inside.
         */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: "422px",
            width: "780px",
            height: "auto",
            aspectRatio: "746 / 885",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/manifesto shape.svg"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "fill", display: "block" }}
          />
        </div>

        {/*
         * Grid container — same max-width as every other page section.
         * position: relative → anchor for ALL absolutely-placed labels.
         *
         * Label positions converted from Figma 1512px frame to this 1240px grid:
         *   grid left edge = frame left 136px
         *
         *   Ambition:  frame x=384  → grid left + 248px  | frame y=180  → top 100px
         *   Precision: frame x=1220 → grid right − 156px | frame y=343  → top 263px
         *   Vision:    frame x=135  → grid left + 0px    | frame y=595  → top 515px
         *   Challenge: frame x=1306 → grid right − 70px  | frame y=577  → top 497px
         *
         * All top values = Figma frame y − 80px (nav spacer height).
         */}
        <div
          className="max-w-[1240px] mx-auto"
          style={{ position: "relative" }}
        >
          {/* ── Floating decorative labels ──────────────────────────────── */}
          <FloatingLabel
            text="Ambition"
            className="mf-a"
            style={{ left: "248px", top: "100px" }}
          />
          <FloatingLabel
            text="Precision"
            className="mf-b"
            style={{ right: "80px", top: "180px" }}
          />
          <FloatingLabel
            text="Vision"
            className="mf-c"
            style={{ left: "0px", top: "515px" }}
          />
          <FloatingLabel
            text="Challenge"
            className="mf-d"
            style={{ right: "0px", top: "497px" }}
          />

          {/* ── Headline ──────────────────────────────────────────────────
           * Figma: top 304px from frame = 224px from nav bottom.
           * 662px wide, centered, 56px Medium, lh 0.95, tracking −1.68px.
           */}
          <div
            style={{
              paddingTop: "224px",
              display: "flex",
              justifyContent: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <h1
              style={{
                margin: 0,
                fontFamily: FONT,
                fontWeight: 500,
                fontSize: "clamp(36px, 4.667vw, 56px)",
                lineHeight: 0.95,
                letterSpacing: "-1.68px",
                color: "#282828",
                textAlign: "center",
                width: "662px",
                maxWidth: "calc(100% - 32px)",
              }}
            >
              Design Got Lazy.
              <br />
              We Didn&apos;t.
            </h1>
          </div>

          {/* ── Body text column ──────────────────────────────────────────
           * Figma: top 653px from frame = 573px from nav bottom.
           * Headline at 224px + ~106px height → gap to body: ~243px.
           * Width 370px centered. Paragraphs: margin-bottom 40px.
           */}
          <div
            style={{
              paddingTop: "243px",
              paddingBottom: "400px",
              display: "flex",
              justifyContent: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: "370px",
                maxWidth: "calc(100% - 32px)",
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: 1.4,
                color: "#282828",
              }}
            >
              <p style={{ margin: "0 0 40px" }}>
                Design is deciding what a product should do, and what it should
                refuse to do. These decisions do not have templates. They require
                people who care enough to keep asking. We&rsquo;re nine people who
                care a lot.
              </p>

              <p style={{ margin: "0 0 40px" }}>
                Hundreds of millions of people are interacting with our designs
                every day, and yet they do not notice the design. That is the
                goal. Because the best products feel inevitable. You only notice
                them when they are gone. That&rsquo;s how we&rsquo;ve built the
                World from zero.
              </p>

              <p style={{ margin: "0 0 40px" }}>
                We are not for everyone. Nine people cannot be. We take limited
                number of projects at a time and give each one the full attention
                of a team that has nowhere else to be. We move fast. Not because
                we skip the thinking, but because clarity is what makes us fast.
              </p>

              <p style={{ margin: 0 }}>
                We work with founders who have felt that gap. Who shipped
                something and knew, the moment it launched, that it was not right.
                Who understand the difference between a product people use and a
                product people return to.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-[1240px] mx-auto pb-[10px]">
        <FooterBanner />
      </div>
      </PageEnter>
    </div>
  );
}
