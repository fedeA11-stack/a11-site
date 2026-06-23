import type { Metadata } from "next";
import Image from "next/image";
import NavMenu from "../NavMenu";
import FooterBanner from "../FooterBanner";
import PageEnter from "../PageEnter";
import CoverImage from "../CoverImage";
import CtaButton from "../CtaButton";

// Studio collage — six scattered photos (exported from the "Studio of the
// Ambitious" Figma frame). Square-cornered (radius 0) to match the design.
import collage1 from "../../public/assets/studio-collage-1.jpg"; // barista / coffee bar
import collage2 from "../../public/assets/studio-collage-2.jpg"; // laptop in café
import collage3 from "../../public/assets/studio-collage-3.jpg"; // "Where Creators Meet Coffee"
import collage4 from "../../public/assets/studio-collage-4.jpg"; // holding the orb
import collage5 from "../../public/assets/studio-collage-5.jpg"; // team around the table
import collage6 from "../../public/assets/studio-collage-6.jpg"; // talk / presentation

const FONT = "var(--font-system), sans-serif";

const T = {
  heroBase: {
    fontFamily: FONT,
    fontWeight: 500,
    lineHeight: 0.9,
    letterSpacing: "-0.05em",
    color: "#282328",
    whiteSpace: "pre-wrap" as const,
    margin: 0,
    textWrap: "balance" as const,
  },
  body: {
    fontFamily: FONT,
    fontWeight: 400,
    fontSize: "clamp(17px, 1.9vw, 24px)",
    lineHeight: 1.4,
    letterSpacing: "0",
    color: "#282328",
    marginTop: 0,
    marginBottom: 0,
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
          {/* Mobile: stacked. Tablet+: 2-col, both columns top-aligned. */}
          <div className="flex flex-col md:flex-row md:gap-12 lg:gap-[118px] pt-16 md:pt-24 lg:pt-[156px] pb-16 md:pb-24 lg:pb-[140px]">

            {/* Left column — headline + CTA */}
            <div className="md:flex-1 mb-10 md:mb-0 min-w-0">
              <h1
                style={T.heroBase}
                className="text-[34px] sm:text-[42px] md:text-[48px] lg:text-[64px]"
              >
                {"We make things \nthat feel like \nsomeone cared."}
              </h1>

              {/* CTA button — sits below the headline */}
              <div className="mt-8 lg:mt-[60px]">
                <CtaButton label="Read Manifesto" href="/manifesto" />
              </div>
            </div>

            {/* Right column — body text (top-aligned with the headline) */}
            <div className="md:flex-1 min-w-0">
              <div style={{ maxWidth: "595px" }}>
                <p style={{ ...T.body, marginBottom: "32px" }}>
                  We have been designing digital products together since 2019. Our longest engagement was five years with Tools for Humanity, where we designed World App from scratch – now one of the most widely used mobile wallets in the world.
                </p>
                <p style={{ ...T.body, marginBottom: "32px" }}>
                  We are not a vendor. We are not a production house. We are the team you bring in when the product has to be good and you need people who will fight for that. We work on a small number of projects at a time.
                </p>
                <p style={{ ...T.body }}>
                  We embed with the founding team, work at their pace, and stay until the product is right. Our clients are founders. Usually at the stage where the product is real but not yet what it needs to be. Usually building something they genuinely believe in.
                </p>
              </div>
            </div>
          </div>
        </div>{/* /hero content container */}

        {/* ── Image collage (full-bleed) ────────────────────────────────── */}
        {/* Pulled out of the page content gutters so it spans the viewport
            width — matching the design's near edge-to-edge collage. A 16px
            hairline inset keeps photos off the very edge on every device. */}
        <div className="w-full px-4">

          {/* ── (images) ──────────────────────────────────────────────────── */}
          {/* Six scattered photos. Each exported frame already carries the
              design's crop, so its box's aspect-ratio matches the source —
              CoverImage `cover` won't crop further. */}

          {/* Mobile (<sm): single column. Tablet (sm–lg): two-column masonry.
              Both full-width with intrinsic aspect ratio. Ordered top-to-bottom
              by the photos' vertical position in the design. */}
          <div className="lg:hidden mb-16 md:mb-24 [column-fill:balance] columns-1 sm:columns-2 gap-4">
            {[
              { src: collage2, alt: "Working on a laptop in a café" },
              { src: collage3, alt: "“Where Creators Meet Coffee” signage" },
              { src: collage1, alt: "At the coffee bar" },
              { src: collage4, alt: "Holding the orb" },
              { src: collage5, alt: "The team working around a table" },
              { src: collage6, alt: "Speaking at a talk" },
            ].map((img, i) => (
              <Image
                key={i}
                src={img.src}
                alt={img.alt}
                sizes="(max-width: 639px) 100vw, 50vw"
                className="w-full h-auto block mb-4 break-inside-avoid"
              />
            ))}
          </div>

          {/* Desktop (lg+): scattered collage. Positions are % of the collage's
              bounding box (1492×876 in the 1512-wide Figma frame). */}
          <div className="hidden lg:block relative mb-[120px]" style={{ aspectRatio: "1492 / 876" }}>
            <div style={{ position: "absolute", left: "0%", top: "8.01%", width: "26.81%", height: "54.78%", overflow: "hidden" }}>
              <CoverImage src={collage1} alt="At the coffee bar" sizes="28vw" />
            </div>
            <div style={{ position: "absolute", left: "81.77%", top: "0%", width: "18.23%", height: "37.66%", overflow: "hidden" }}>
              <CoverImage src={collage2} alt="Working on a laptop in a café" sizes="19vw" />
            </div>
            <div style={{ position: "absolute", left: "54.62%", top: "7.66%", width: "20.57%", height: "26.58%", overflow: "hidden" }}>
              <CoverImage src={collage3} alt="“Where Creators Meet Coffee” signage" sizes="21vw" />
            </div>
            <div style={{ position: "absolute", left: "31.43%", top: "32.08%", width: "18.23%", height: "37.66%", overflow: "hidden" }}>
              <CoverImage src={collage4} alt="Holding the orb" sizes="19vw" />
            </div>
            <div style={{ position: "absolute", left: "58.41%", top: "45.22%", width: "26.81%", height: "54.78%", overflow: "hidden" }}>
              <CoverImage src={collage5} alt="The team working around a table" sizes="28vw" />
            </div>
            <div style={{ position: "absolute", left: "12.61%", top: "72.71%", width: "14.21%", height: "18.25%", overflow: "hidden" }}>
              <CoverImage src={collage6} alt="Speaking at a talk" sizes="15vw" />
            </div>
          </div>
        </div>{/* /full-bleed collage */}

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <div className="w-full px-4 md:px-8 lg:px-[var(--bleed)]">
          <FooterBanner />
        </div>
      </main>
      </PageEnter>
    </div>
  );
}
