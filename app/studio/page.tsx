import type { Metadata } from "next";
import Image from "next/image";
import NavMenu from "../NavMenu";
import FooterBanner from "../FooterBanner";
import PageEnter from "../PageEnter";
import WordReveal from "../WordReveal";
import CoverImage from "../CoverImage";
// import CtaButton from "../CtaButton"; // hidden with the Manifesto CTA below

import studio1 from "../../public/assets/Image 1.png";
import studio2 from "../../public/assets/Image 2.png";
import studio3 from "../../public/assets/Image 3.png";

const FONT = "var(--font-system), sans-serif";

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
    textWrap: "balance" as const,
  },
  body: {
    fontFamily: FONT,
    fontWeight: 400,
    fontSize: "clamp(17px, 1.77vw, 22px)",
    lineHeight: 1.3,
    letterSpacing: "-0.02em",
    color: "#282328",
    margin: 0,
    textWrap: "pretty" as const,
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

export const metadata: Metadata = {
  title: "Studio",
  description:
    "A11 is a product design studio — nine people designing digital products together since 2019, from World App to Bitcoin wallets and tokenized real-world assets.",
  alternates: { canonical: "/studio" },
  openGraph: {
    type: "profile",
    title: "Studio — A11 Product Studio",
    description:
      "A11 is a product design studio — nine people designing digital products together since 2019.",
    url: "/studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio — A11 Product Studio",
    description: "Nine people designing digital products together since 2019.",
  },
};

export default function StudioPage() {
  return (
    <div className="bleed-root" style={{ backgroundColor: "#ffffff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavMenu />

      <PageEnter style={{ flex: 1 }}>
      <main style={{ flex: 1 }}>
        {/* Responsive container: 16px mobile, 32px tablet, 0 desktop (max-width handles margins) */}
        <div className="w-full px-4 md:px-8 lg:px-[var(--bleed)]">

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

                {/* CTA button — Manifesto hidden for now; restore to re-enable. */}
                {/* <CtaButton label="Read our Manifesto" href="/manifesto" /> */}
              </div>
            </div>
          </div>

          {/* ── Image grid ────────────────────────────────────────────────── */}

          {/* Mobile + Tablet: flex-col, full-width images (intrinsic aspect ratio) */}
          <div className="flex flex-col gap-4 mb-[80px] lg:hidden">
            <Image
              src={studio1}
              alt="Studio photo"
              sizes="(max-width: 1024px) 100vw, 1240px"
              style={{ width: "100%", height: "auto", borderRadius: "16px", display: "block" }}
            />
            <Image
              src={studio2}
              alt="Studio photo"
              sizes="(max-width: 1024px) 100vw, 1240px"
              style={{ width: "100%", height: "auto", borderRadius: "16px", display: "block" }}
            />
            <Image
              src={studio3}
              alt="Studio photo"
              sizes="(max-width: 1024px) 100vw, 1240px"
              style={{ width: "100%", height: "auto", borderRadius: "16px", display: "block" }}
            />
          </div>

          {/* Desktop: staggered grid — all values as % of container (1240×604 Figma frame) */}
          {/*
           *   img1 (col 2, row 1): left=25.16%, width=24.84%, top=0,      height=33.11%
           *   img2 (col 1, row 2): left=0,      width=24.84%, top=33.77%, height=33.11%
           *   img3 (cols 3-4, r2): left=50.32%, width=49.84%, top=33.77%, height=66.23%
           */}
          <div className="hidden lg:block relative mb-[120px]" style={{ aspectRatio: "1240 / 604" }}>
            {/* Each cell is a positioned box; CoverImage fills + crops it. */}
            <div style={{ position: "absolute", top: 0, left: "25.16%", width: "24.84%", height: "33.11%", borderRadius: "16px", overflow: "hidden" }}>
              <CoverImage src={studio1} alt="Studio photo" sizes="25vw" />
            </div>
            <div style={{ position: "absolute", top: "33.77%", left: 0, width: "24.84%", height: "33.11%", borderRadius: "16px", overflow: "hidden" }}>
              <CoverImage src={studio2} alt="Studio photo" sizes="25vw" />
            </div>
            <div style={{ position: "absolute", top: "33.77%", left: "50.32%", width: "49.84%", height: "66.23%", borderRadius: "16px", overflow: "hidden" }}>
              <CoverImage src={studio3} alt="Studio photo" sizes="50vw" />
            </div>
          </div>

          {/* ── Footer ────────────────────────────────────────────────────── */}
          <div>
            <FooterBanner />
          </div>

        </div>
      </main>
      </PageEnter>
    </div>
  );
}
