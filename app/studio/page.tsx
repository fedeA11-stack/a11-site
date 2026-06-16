"use client";

import NavMenu from "../NavMenu";
import FooterBanner from "../FooterBanner";

const FONT = "'System Unlicensed Trial', sans-serif";

const T = {
  heroBase: {
    fontFamily: FONT,
    fontWeight: 500,
    lineHeight: 0.95,
    letterSpacing: "-1.68px",
    color: "#282328",
    textTransform: "capitalize" as const,
    whiteSpace: "pre-wrap" as const,
    margin: 0,
  },
  body: {
    fontFamily: FONT,
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: 1.4,
    letterSpacing: "-0.32px",
    color: "#282328",
    margin: 0,
  },
  cta: {
    fontFamily: FONT,
    fontWeight: 500,
    fontSize: "15px",
    lineHeight: 0.95,
    letterSpacing: "-0.3px",
    color: "#ffffff",
    textTransform: "capitalize" as const,
    whiteSpace: "nowrap" as const,
  },
};

export default function StudioPage() {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavMenu />

      <main style={{ flex: 1 }}>
        {/* Responsive container: 16px mobile, 32px tablet, 0 desktop (max-width handles margins) */}
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 lg:px-0">

          {/* ── Hero section ──────────────────────────────────────────────── */}
          {/* Mobile: stacked, Tablet+: 2-col side by side */}
          <div className="flex flex-col md:flex-row pt-16 md:pt-24 lg:pt-[156px] pb-16 md:pb-24 lg:pb-[140px]">

            {/* Left column — headline */}
            <div className="md:flex-1 mb-8 md:mb-0 min-w-0">
              <h1
                style={T.heroBase}
                className="text-[32px] sm:text-[40px] md:text-[44px] lg:text-[56px]"
              >
                {"We are A11. \nProduct design studio. \nNine people who care \nwhat we ship."}
              </h1>
            </div>

            {/* Right column — body text + CTA */}
            {/* Desktop offset: body starts 236px below section top (from Figma) */}
            <div className="md:flex-1 md:pt-[80px] lg:pt-[236px] min-w-0">
              <div style={{ maxWidth: "461px" }}>
                <p style={{ ...T.body, marginBottom: "32px" }}>
                  We have been designing digital products together since 2019. Our longest engagement was five years with Tools for Humanity, where we designed World App from scratch – now one of the most widely used mobile wallets in the world.
                </p>
                <p style={{ ...T.body, marginBottom: "32px" }}>
                  We are not a vendor. We are not a production house. We are the team you bring in when the product has to be good and you need people who will fight for that. We work on a small number of projects at a time.
                </p>
                <p style={{ ...T.body, marginBottom: "32px" }}>
                  We embed with the founding team, work at their pace, and stay until the product is right. Our clients are founders. Usually at the stage where the product is real but not yet what it needs to be. Usually building something they genuinely believe in.
                </p>

                {/* CTA button */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    backgroundColor: "#282328",
                    padding: "10px 20px",
                    height: "44px",
                    gap: "16px",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <span style={T.cta}>Read our Manifesto</span>
                  <div
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "10px",
                      width: "4px",
                      height: "4px",
                      borderRadius: "1px",
                      backgroundColor: "#ffffff",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Image grid ────────────────────────────────────────────────── */}

          {/* Mobile + Tablet: flex-col, full-width images */}
          <div className="flex flex-col gap-4 mb-[80px] lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/Image 1.png"
              alt="Studio photo"
              style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "16px", display: "block" }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/Image 2.png"
              alt="Studio photo"
              style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "16px", display: "block" }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/Image 3.png"
              alt="Studio photo"
              style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "16px", display: "block" }}
            />
          </div>

          {/* Desktop: staggered grid — all values as % of container (1240×604 Figma frame) */}
          {/*
           *   img1 (col 2, row 1): left=25.16%, width=24.84%, top=0,      height=33.11%
           *   img2 (col 1, row 2): left=0,      width=24.84%, top=33.77%, height=33.11%
           *   img3 (cols 3-4, r2): left=50.32%, width=49.84%, top=33.77%, height=66.23%
           */}
          <div className="hidden lg:block relative mb-[120px]" style={{ aspectRatio: "1240 / 604" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/Image 1.png"
              alt="Studio photo"
              style={{ position: "absolute", top: 0, left: "25.16%", width: "24.84%", height: "33.11%", objectFit: "cover", borderRadius: "16px", display: "block" }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/Image 2.png"
              alt="Studio photo"
              style={{ position: "absolute", top: "33.77%", left: 0, width: "24.84%", height: "33.11%", objectFit: "cover", borderRadius: "16px", display: "block" }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/Image 3.png"
              alt="Studio photo"
              style={{ position: "absolute", top: "33.77%", left: "50.32%", width: "49.84%", height: "66.23%", objectFit: "cover", borderRadius: "16px", display: "block" }}
            />
          </div>

          {/* ── Footer ────────────────────────────────────────────────────── */}
          <div style={{ paddingBottom: "32px" }}>
            <FooterBanner />
          </div>

        </div>
      </main>
    </div>
  );
}
