import type { Metadata } from "next";
import NavMenu from "../NavMenu";
import FooterBanner from "../FooterBanner";
import PageEnter from "../PageEnter";
import PhotoCarousel from "../PhotoCarousel";
import CtaButton from "../CtaButton";

const FONT = "var(--font-system), sans-serif";

const T = {
  heroBase: {
    fontFamily: FONT,
    fontWeight: 500,
    // 0.95, not 0.90: at 0.90 the descender of "thin​gs" overlapped the
    // ascenders of "like" on the line below (~1px) on phones. 0.95 matches the
    // site's other heroes and clears descender-over-ascender at every size.
    lineHeight: 0.95,
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
    "A11 is a global product design studio of nine people, designing digital products together since 2019, from World App to Bitcoin wallets and tokenized real-world assets.",
  alternates: { canonical: "/studio" },
  openGraph: {
    type: "profile",
    title: "Studio · A11 Studio",
    description:
      "A11 is a global product design studio of nine people, designing digital products together since 2019.",
    url: "/studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio · A11 Studio",
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
                  We have been designing digital products together since 2019. For over five years, we&apos;ve been embedded with Tools for Humanity, designing World App from scratch. It&apos;s now one of the most widely used mobile wallets in the world.
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

        {/* ── Photo carousel (full-bleed) ───────────────────────────────── */}
        {/* Two rows of portrait photos auto-scrolling in opposite directions at
            different speeds. Replaces the earlier static collage; spans the
            viewport width (.bleed-root on the page clips overflow). */}
        <div className="mb-16 md:mb-24 lg:mb-[120px]">
          <PhotoCarousel />
        </div>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <div className="w-full px-4 md:px-8 lg:px-[var(--bleed)]">
          <FooterBanner />
        </div>
      </main>
      </PageEnter>
    </div>
  );
}
