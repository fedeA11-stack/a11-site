"use client";

import { useRef } from "react";
import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import NavMenu from "./NavMenu";
import FooterBanner from "./FooterBanner";
import CoverImage from "./CoverImage";
import CtaButton from "./CtaButton";
import { Reveal, ImageReveal, surfaceVariants, itemVariants } from "./Reveal";

// ─────────────────────────────────────────────────────────────────────────────
// Home / Work — pellmell.fr-style pinned-hero reveal.
//
// The signature effect: the hero is PINNED full-screen, and on the first scroll
// the work grid slides up and over it (HeroReveal). The hero drifts + fades as
// it's covered, then re-reveals when you scroll back to the top. The first case
// study (ZoomScale) starts scaled down and grows to full size as it enters — the
// rest of the cards are static. Lenis (SmoothScroll) supplies the inertia glide
// that makes the hand-off feel continuous. All motion respects reduced-motion.
// ─────────────────────────────────────────────────────────────────────────────

// Case photos + project logos — static imports give next/image the intrinsic
// dimensions and a build-time blur placeholder (zero CLS).
import worldCase from "../public/assets/World-Case.png";
import freeholdCase from "../public/assets/Freehold-Case.png";
import districtCase from "../public/assets/District-case.png";
import tokenStudioCase from "../public/assets/Token studio-case.png";
import atlansCase from "../public/assets/Atlans-case.png";
import relaiCase from "../public/assets/Relai-case.png";
import nousCase from "../public/assets/Nous-case.png";
// Card wordmarks — vector (SVG) exports traced from the Figma work frame (1:89),
// one per case-study section. freeholdLogo here is the Token Studio section's
// mark (1:151), which in the design is the Freehold wordmark in brown.
import worldLogo from "../public/assets/world-logo.svg";
import freeholdLogoGrey from "../public/assets/freehold-logo.svg";
import districtLogo from "../public/assets/districts-logo.svg";
import freeholdLogo from "../public/assets/tokenstudio-logo.svg";
import atlansLogo from "../public/assets/atlans-logo.svg";
import PageEnter from "./PageEnter";
import WordReveal from "./WordReveal";

// Mobile-only card tiles — portrait (373×490) compositions exported from the
// Figma mobile frame (panel + device mockup, with text/logo layers hidden so we
// can overlay real DOM text + the shared logo PNGs for crispness + SEO).
import worldTile from "../public/assets/mobile/world.jpg";
import freeholdTile from "../public/assets/mobile/freehold.jpg";
import districtsTile from "../public/assets/mobile/districts.jpg";
import tokenStudioTile from "../public/assets/mobile/tokenstudio.jpg";
import atlansTile from "../public/assets/mobile/atlans.jpg";
import relaiTile from "../public/assets/mobile/relai.jpg";

// ─── Project data ─────────────────────────────────────────────────────────────
type Project = {
  num: string;
  image: StaticImageData;
  name: string;
  description: string;
  textColor: string;
  /** Cove silhouette — `url(#clip-<name>)` into CARD_CLIPS, applied to the image
   *  fill via CoverImage's clipPath. See CardClipDefs. */
  clip: string;
  href?: string;
  labelPx: number;
  labelTracking: string;
  labelTop: number;
  descTop: number;
  logo?: StaticImageData;
  logoHeight: number;
  logoLeft: number;
};

const PROJECTS: Project[] = [
  {
    num: "01",
    image: worldCase,
    name: "World",
    description: "Five years,\nnine people.\nFour Apps for\nreal humans",
    // White reads against the new dark-green-couch fill (near-black failed: ~1.0:1 → 7:1).
    textColor: "#ffffff",
    clip: "url(#clip-world)",
    href: "/world",
    labelPx: 16,
    labelTracking: "-0.32px",
    labelTop: 56,
    descTop: 112,
    logo: worldLogo,
    logoHeight: 31,
    logoLeft: 72,
  },
  {
    num: "02",
    image: freeholdCase,
    name: "Freehold",
    description: "A non-custodial,\nmulti-chain DeFi\nwallet app",
    textColor: "#282328",
    clip: "url(#clip-freehold)",
    href: "/freehold",
    labelPx: 18,
    labelTracking: "-0.36px",
    labelTop: 62,
    descTop: 124,
    logo: freeholdLogoGrey,
    logoHeight: 31,
    logoLeft: 174,
  },
  {
    num: "03",
    image: districtCase,
    name: "Districts",
    description: "RWA tokenization,\nstart to finish",
    // Near-black over the light lavander blur reads stronger than the mid-gray (4.3→7.1:1).
    textColor: "#282328",
    clip: "url(#clip-districts)",
    href: "/districts",
    labelPx: 18,
    labelTracking: "-0.36px",
    labelTop: 147,
    descTop: 209,
    logo: districtLogo,
    logoHeight: 31,
    logoLeft: 72,
  },
  {
    num: "04",
    image: tokenStudioCase,
    name: "Token Studio",
    description: "Tokenize, launch,\nmanage. On-chain\nRWAs",
    // White over the dark wood paneling — brown was unreadable (1.9→10:1 on the copy).
    textColor: "#ffffff",
    clip: "url(#clip-tokenstudio)",
    href: "/tokenstudio",
    labelPx: 18,
    labelTracking: "-0.36px",
    labelTop: 80,
    descTop: 142,
    logo: freeholdLogo,
    logoHeight: 31,
    logoLeft: 80,
  },
  {
    num: "05",
    image: atlansCase,
    name: "Atlans",
    description: "Athletic platform\nof Discovery and\nconnection",
    textColor: "#ffffff",
    clip: "url(#clip-atlans)",
    href: "/atlans",
    labelPx: 18,
    labelTracking: "-0.36px",
    labelTop: 123,
    descTop: 186,
    logo: atlansLogo,
    logoHeight: 31,
    logoLeft: 80,
  },
  {
    num: "06",
    image: relaiCase,
    name: "Relai",
    description: "Bitcoin-only savings\napp focused on\nsimple self-custody.",
    textColor: "#282328",
    clip: "url(#clip-relai)",
    href: "/relai",
    labelPx: 18,
    labelTracking: "-0.36px",
    labelTop: 80,
    descTop: 142,
    logoHeight: 31,
    logoLeft: 80,
  },
  {
    num: "07",
    image: nousCase,
    name: "Nous",
    description: "One Personal AI\nfor your whole life",
    // White over the warm red/orange gradient (5.5:1; near-black was 2.9).
    textColor: "#ffffff",
    clip: "url(#clip-nous)",
    href: "/nous",
    // No Nous wordmark in the design → no overlay logo (like Relai).
    labelPx: 18,
    labelTracking: "-0.36px",
    labelTop: 62,
    descTop: 124,
    logoHeight: 31,
    logoLeft: 80,
  },
];

// ─── Featured scroll-zoom ──────────────────────────────────────────────────────
// pellmell-style entrance — used ONLY on the first case study. The ENTIRE card
// (image + label + description + logo) starts scaled down and grows to full size
// as the card travels up toward the viewport center. Because the scale is applied
// to the card wrapper, every child — typography included — scales as one unit.
function ZoomScale({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // Bind directly to scroll progress — Lenis already smooths the scroll input, so
  // an extra spring here just lags the scale behind the content (double-smoothing).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const scaleMV = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  return (
    <motion.div
      ref={ref}
      // transform-origin: top anchors the card's top edge — the part that peeks at
      // rest — so it grows downward into place instead of ballooning from center.
      style={{ scale: reduce ? 1 : scaleMV, transformOrigin: "center top", willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}

// Card overlay POSITIONS are expressed in cqw — percent of the card's own width
// — so the label / description / logo stay at their designed spot on the image
// as the full-bleed card scales (the logo lands on the right part of the photo
// instead of drifting toward the corner). SIZES stay fixed px so the text and
// logo render at their normal, intended size, not scaled up with the card.
// The card opts in with container-type: inline-size. 1cqw = 12.4px at the
// 1240px design width.
const CARD_DESIGN_W = 1240;
function cq(px: number): string {
  return `${((px / CARD_DESIGN_W) * 100).toFixed(4)}cqw`;
}

// Middle-ground SIZING for overlay text / logo: grows with the card from the
// design size up to CARD_MAX_SCALE×, then holds. Fixed px looked too small on
// wide cards; the full ~2× proportional scale looked huge. This splits the
// difference — design size at a 1240px card, capped at 1.5× (reached ~1860px).
const CARD_MAX_SCALE = 1.5;
function cqMid(px: number): string {
  return `clamp(${px}px, ${((px / CARD_DESIGN_W) * 100).toFixed(4)}cqw, ${(px * CARD_MAX_SCALE).toFixed(2)}px)`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Chevron({ color }: { color: string }) {
  // Inline so the slash stroke inherits the card's label color (the static
  // slash.svg was fixed dark — invisible on the white-text cards).
  return (
    <svg
      viewBox="0 0 12 19"
      fill="none"
      aria-hidden
      style={{ height: cqMid(18), width: "auto", flexShrink: 0 }}
    >
      <path d="M0.72168 18.1915L10.984 0.416992" stroke={color} strokeWidth="1.66636" />
    </svg>
  );
}

// ─── Project card ──────────────────────────────────────────────────────────────
// Static by default; `zoom` enables the featured pellmell-style scroll-zoom (used
// only on the first case study).
function ProjectCard({ project, priority, zoom }: { project: Project; priority?: boolean; zoom?: boolean }) {
  const c = project.textColor;

  const card = (
    <motion.div
      data-cursor={project.href ? "View project" : undefined}
      className="relative w-full overflow-hidden rounded-[4.444px]"
      variants={surfaceVariants}
      style={{
        // Shape matches the source frame exactly (intrinsic dims of the Figma
        // export) so the full composition shows uncropped. Overlay values below
        // are %-of-width (cqw), so they stay put as the per-card height varies.
        aspectRatio: `${project.image.width} / ${project.image.height}`,
        // Container for the cqw-based overlays below — the label / description /
        // logo scale with the card so they stay locked to the image shape.
        containerType: "inline-size",
        cursor: project.href ? "none" : "default",
        willChange: "transform, opacity, clip-path",
      }}
    >
      {/* Featured (zoom) card is owned by ScrollZoom; everything else gets the
          parallax settle. The box's overflow:hidden clips the over-scaled image. */}
      {zoom ? (
        <CoverImage
          src={project.image}
          alt={project.name}
          sizes="100vw"
          priority={priority}
          clipPath={project.clip}
        />
      ) : (
        <ImageReveal>
          <CoverImage
            src={project.image}
            alt={project.name}
            sizes="100vw"
            priority={priority}
            clipPath={project.clip}
          />
        </ImageReveal>
      )}

      {/* Overlays positioned in cqw (% of card width) so the composition scales
          with the full-bleed card — text and logo stay on the image shape,
          exactly reproducing the 1240px design at any width. */}
      <div
        className="absolute flex items-center whitespace-nowrap capitalize"
        style={{
          top: cq(project.labelTop),
          left: cq(72),
          gap: cqMid(9),
          fontFamily: "var(--font-system), sans-serif",
          fontWeight: 500,
          fontSize: cqMid(project.labelPx),
          lineHeight: 1,
          letterSpacing: project.labelTracking,
          color: c,
        }}
      >
        <span>{project.num}</span>
        <Chevron color={c} />
        <span>{project.name}</span>
      </div>

      <p
        className="absolute m-0 whitespace-pre-wrap capitalize"
        style={{
          // Top tracks the label proportionally; the label→copy gap scales with
          // the (middle-ground) type so the spacing stays right at any card size.
          top: `calc(${cq(project.labelTop)} + ${cqMid(project.descTop - project.labelTop)})`,
          left: cq(72),
          fontFamily: "var(--font-system), sans-serif",
          fontWeight: 500,
          fontSize: cqMid(42),
          lineHeight: 0.95,
          letterSpacing: "-1.26px",
          color: c,
          maxWidth: cqMid(521),
          textWrap: "pretty",
        }}
      >
        {project.description}
      </p>

      {project.logo && (
        <div
          style={{
            position: "absolute",
            bottom: cq(64),
            left: cq(project.logoLeft),
            height: cqMid(project.logoHeight),
          }}
        >
          <Image
            src={project.logo}
            alt=""
            aria-hidden
            style={{ height: "100%", width: "auto", display: "block" }}
          />
        </div>
      )}
    </motion.div>
  );

  const content = zoom ? <ZoomScale>{card}</ZoomScale> : card;

  if (project.href) {
    return (
      <Link href={project.href} className="block">
        {content}
      </Link>
    );
  }
  return content;
}

// ─── CTA interstitial ─────────────────────────────────────────────────────────
// Vertical spacing scales with the (full-bleed) card width so the gap between
// cards stays proportional on big screens — a fixed 147px felt cramped between
// the much taller full-bleed cards. 147/1240 = 0.11855; min 147px (≤1280px),
// capped at ~2× (294px).
const CTA_PAD = "clamp(147px, calc((100vw - 40px) * 0.11855), 294px)";

function CTASection({
  text,
  buttonLabel,
  textGap = 36,
  href,
}: {
  text: string;
  buttonLabel: string;
  textGap?: number;
  href?: string;
}) {
  return (
    <Reveal className="w-full" amount={0.4}>
      <div className="flex flex-col items-center" style={{ gap: textGap, paddingTop: CTA_PAD, paddingBottom: CTA_PAD }}>
        <motion.p
          variants={itemVariants}
          className="m-0 text-center whitespace-pre-wrap"
          style={{
            fontFamily: "var(--font-system), sans-serif",
            fontWeight: 500,
            fontSize: "44.436px",
            lineHeight: 0.94,
            letterSpacing: "-0.8887px",
            color: "#282328",
            width: "714.315px",
            maxWidth: "100%",
            textWrap: "balance",
          }}
        >
          {text}
        </motion.p>
        <motion.div variants={itemVariants}>
          <CtaButton label={buttonLabel} href={href} />
        </motion.div>
      </div>
    </Reveal>
  );
}

// ─── Hero pin + reveal ─────────────────────────────────────────────────────────
// The hero is fixed full-screen (z-0). A sentinel reserves the scroll distance
// for the reveal. The work grid (z-1, opaque) follows the sentinel, so the first
// scroll slides it up and over the pinned hero. We read the sentinel's scroll
// progress to drift + fade the hero as it gets covered — and it all plays in
// reverse when you scroll back up.
function HeroReveal() {
  const reduce = useReducedMotion();
  const sentinel = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sentinel,
    offset: ["start start", "end start"],
  });

  // Paired transforms all finish together at progress 0.85 so the hero fades and
  // drifts as one unit (not opacity-then-drift).
  const opacityMV = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const scaleMV = useTransform(scrollYProgress, [0, 0.85], [1, 0.92]);
  const yMV = useTransform(scrollYProgress, [0, 0.85], [0, -60]);

  return (
    <>
      <motion.section
        className="hero-pinned"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // Centre the headline in the gap between the nav bar and the peeking
          // card. The card top sits at (80vh - 9.3vw) at rest, the nav bar is
          // 80px tall; padding the flex box to exactly [80px, 80vh - 9.3vw] makes
          // align-items:center land the headline at that region's midpoint.
          paddingTop: "80px",
          paddingBottom: "calc(20vh + 9.3vw)",
          opacity: reduce ? 1 : opacityMV,
          scale: reduce ? 1 : scaleMV,
          y: reduce ? 0 : yMV,
          willChange: "transform, opacity",
        }}
      >
        <motion.p
          className="m-0 text-center whitespace-pre-wrap"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1], delay: 0.08 }}
          style={{
            fontFamily: "var(--font-system), sans-serif",
            fontWeight: 500,
            fontSize: "clamp(32px, 4.6vw, 64px)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            color: "#282328",
            maxWidth: "90vw",
            textWrap: "balance",
          }}
        >
          {"We are A11.\nProduct Studio Built on\nPassion and Craft."}
        </motion.p>
      </motion.section>

      {/*
       * Reserves scroll distance for the reveal — but stops well short of a full
       * viewport so the first case study peeks at rest. The base 9.3vw is ~15% of
       * the full-bleed card's height (1240/769); the extra 20vh raises the whole
       * at-rest composition (with the hero's 40vh bottom padding) so the headline
       * and the card's peek sit higher. We add back the 80px nav spacer + 10px
       * grid top (90px) that sit above the grid.
       */}
      <div
        ref={sentinel}
        style={{ height: "calc(80vh - 90px - 9.3vw)" }}
        aria-hidden
      />
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MOBILE (< md) — a distinct, static layout from the Figma mobile frame (393px).
// No pinned-hero reveal; portrait tiles stack full-width with real DOM overlays.
// Desktop is left entirely untouched. Specs mirror the Figma frame 3:201:
//   • 10px side margins (cards), 20/30px insets for hero + footer rows
//   • cards: 373/490 portrait, 4.444px radius, logo+desc overlaid at (32, 32)
//   • desc 28px / 0.95 lh / -3% tracking; quotes 28px centered; hero 44px
// ════════════════════════════════════════════════════════════════════════════
const MFONT = "var(--font-system), sans-serif";

type MobileCardData = {
  tile: StaticImageData;
  name: string;
  description: string;
  color: string;
  href: string;
  logo?: StaticImageData;
  logoHeight: number;
};

const MOBILE_CARDS: MobileCardData[] = [
  { tile: worldTile,       name: "World",        description: "Five years,\nnine people.\nFour Apps for\nreal humans", color: "#282328", href: "/world",       logo: worldLogo,        logoHeight: 20 },
  { tile: freeholdTile,    name: "Freehold",     description: "A non-custodial,\nmulti-chain DeFi\nwallet app",        color: "#282328", href: "/freehold",    logo: freeholdLogoGrey, logoHeight: 18 },
  { tile: districtsTile,   name: "Districts",    description: "RWA tokenization,\nstart to finish",                   color: "#45474a", href: "/districts",   logo: districtLogo,     logoHeight: 20 },
  { tile: tokenStudioTile, name: "Token Studio", description: "Tokenize, launch,\nmanage. On-chain\nRWAs",            color: "#4d2820", href: "/tokenstudio", logo: freeholdLogo,     logoHeight: 18 },
  { tile: atlansTile,      name: "Atlans",       description: "Athletic platform\nof Discovery and\nconnection",       color: "#ffffff", href: "/atlans",      logo: atlansLogo,       logoHeight: 16 },
  { tile: relaiTile,       name: "Relai",        description: "Bitcoin-only savings\napp focused on\nsimple self-custody.", color: "#282328", href: "/relai",   logoHeight: 19 },
];

function MobileCard({ card, priority }: { card: MobileCardData; priority?: boolean }) {
  return (
    <Reveal className="w-full">
      <Link href={card.href} className="block" data-cursor="View project" style={{ cursor: "none" }}>
        <motion.div
          variants={surfaceVariants}
          className="relative w-full overflow-hidden rounded-[4.444px]"
          style={{ aspectRatio: "373 / 490", willChange: "transform, opacity, clip-path" }}
        >
          <Image
            src={card.tile}
            alt={card.name}
            fill
            sizes="100vw"
            priority={priority}
            style={{ objectFit: "cover" }}
          />

          {/* Brand mark + description, overlaid at (32, 32) — matches Figma. */}
          <div style={{ position: "absolute", top: 32, left: 32, right: 24, display: "flex", flexDirection: "column", gap: 24 }}>
            <motion.div variants={itemVariants} style={{ height: card.logoHeight }}>
              {card.logo ? (
                <Image src={card.logo} alt="" aria-hidden style={{ height: "100%", width: "auto", display: "block" }} />
              ) : (
                <span style={{ fontFamily: MFONT, fontWeight: 500, fontSize: card.logoHeight, lineHeight: 1, letterSpacing: "-0.03em", color: card.color }}>
                  {card.name}
                </span>
              )}
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="m-0 whitespace-pre-wrap"
              style={{ fontFamily: MFONT, fontWeight: 500, fontSize: 28, lineHeight: 0.95, letterSpacing: "-0.03em", color: card.color }}
            >
              {card.description}
            </motion.p>
          </div>
        </motion.div>
      </Link>
    </Reveal>
  );
}

function MobileQuote({ text, buttonLabel, href, maxWidth }: { text: string; buttonLabel: string; href?: string; maxWidth: number }) {
  return (
    <Reveal className="w-full" amount={0.4}>
      <div className="flex flex-col items-center" style={{ gap: 36 }}>
        <motion.p
          variants={itemVariants}
          className="m-0 text-center"
          style={{ fontFamily: MFONT, fontWeight: 500, fontSize: 28, lineHeight: 0.96, letterSpacing: "-0.02em", color: "#282328", maxWidth }}
        >
          {text}
        </motion.p>
        <motion.div variants={itemVariants}>
          <CtaButton label={buttonLabel} href={href} />
        </motion.div>
      </div>
    </Reveal>
  );
}

function MobileFooter() {
  return (
    <Reveal className="w-full" amount={0.3}>
      <motion.div
        variants={itemVariants}
        style={{
          position: "relative", width: "100%", borderRadius: 5, overflow: "hidden",
          background: "#282328", padding: "50px 40px", minHeight: 220,
        }}
      >
        <p
          className="m-0 whitespace-pre-wrap"
          style={{ fontFamily: MFONT, fontWeight: 500, fontSize: 28, lineHeight: 0.9, letterSpacing: "-0.02em", color: "#fff" }}
        >
          {"If you're ambitious\nenough to work with us."}
        </p>
        <a
          href="mailto:hello@a11studio.com"
          style={{
            display: "inline-block", marginTop: 24, fontFamily: MFONT, fontWeight: 500,
            fontSize: 28, lineHeight: 0.9, letterSpacing: "-0.03em", color: "#fff",
            textDecoration: "underline", textUnderlineOffset: 4,
          }}
        >
          We should talk.
        </a>
      </motion.div>

      <motion.div
        variants={itemVariants}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: 20, padding: "0 20px", whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontFamily: MFONT, fontWeight: 500, fontSize: 16, lineHeight: 1.4, letterSpacing: "-0.02em", color: "#282328" }}>A11 © 2026</span>
        <span style={{ fontFamily: MFONT, fontWeight: 500, fontSize: 16, lineHeight: 1.4, letterSpacing: "-0.02em", color: "#282328" }}>Privacy Policy</span>
      </motion.div>
    </Reveal>
  );
}

function MobileHome() {
  return (
    <div className="md:hidden" style={{ position: "relative", zIndex: 1, background: "#fff" }}>
      {/* Static hero — lets the title wrap naturally to ~4 lines like the mockup */}
      <section style={{ paddingTop: 96, paddingBottom: 112, paddingLeft: 20, paddingRight: 20 }}>
        <p
          className="m-0 text-center"
          style={{
            fontFamily: MFONT, fontWeight: 500, fontSize: 44, lineHeight: 0.9,
            letterSpacing: "-0.05em", color: "#282328", opacity: 0.95,
            maxWidth: 353, marginInline: "auto", textWrap: "balance",
          }}
        >
          We are A11. Product Studio Built on Passion and Craft.
        </p>
      </section>

      {/* Stacked tiles + interstitials. Pairs sit 10px apart; quotes get ~80px air. */}
      <div style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10, display: "flex", flexDirection: "column" }}>
        <MobileCard card={MOBILE_CARDS[0]} priority />
        <div style={{ height: 10 }} />
        <MobileCard card={MOBILE_CARDS[1]} />

        <div style={{ height: 80 }} />
        <MobileQuote text={"Built with craft. Driven by passion. Shipped without excuses."} buttonLabel="Discover Studio" href="/studio" maxWidth={360} />
        <div style={{ height: 80 }} />

        <MobileCard card={MOBILE_CARDS[2]} />
        <div style={{ height: 10 }} />
        <MobileCard card={MOBILE_CARDS[3]} />

        <div style={{ height: 80 }} />
        <MobileQuote text={"Looking designed is easy now. Caring enough to craft it isn't."} buttonLabel="Read Manifesto" href="/manifesto" maxWidth={323} />
        <div style={{ height: 80 }} />

        <MobileCard card={MOBILE_CARDS[4]} />
        <div style={{ height: 10 }} />
        <MobileCard card={MOBILE_CARDS[5]} />

        <div style={{ height: 10 }} />
        <MobileFooter />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
// Cove silhouettes — normalized (objectBoundingBox) clip paths traced from each
// Figma frame's vector mask, including its per-vertex corner rounding + squircle
// smoothing. Referenced by the cards via clip-path: url(#clip-<name>). Rendered
// once; the hidden <svg> just carries the <defs>.
const CARD_CLIPS: Record<string, string> = {
  world: "M0.99032 0.90654L0.93778 0.98208C0.93325 0.98858 0.93099 0.99184 0.92842 0.99415C0.92613 0.99622 0.92368 0.99772 0.92112 0.99863C0.91825 0.99967 0.91522 0.99967 0.90916 0.99967L0.01434 0.99967C0.00932 0.99967 0.00681 0.99967 0.00489 0.99809C0.00321 0.9967 0.00184 0.99449 0.00098 0.99178C0 0.98869 0 0.98464 0 0.97655L0 0.18355L0 0.02395C0 0.01586 0 0.01181 0.00098 0.00872C0.00184 0.006 0.00321 0.00379 0.00489 0.00241C0.00681 0.00083 0.00932 0.00083 0.01434 0.00083L0.18278 0.00083L0.40163 0.00083L0.50798 0.00083L0.61729 0.00083L0.77041 0.00001C0.77657 0 0.77965 0 0.78256 0.001C0.78542 0.00202 0.78816 0.00379 0.79066 0.00623C0.79322 0.00872 0.79544 0.01216 0.79988 0.01904C0.81463 0.04187 0.822 0.05329 0.83047 0.06157C0.83878 0.06969 0.84785 0.07558 0.85734 0.079C0.867 0.08249 0.87723 0.08249 0.89767 0.08249L0.98557 0.08249C0.99059 0.08249 0.9931 0.08249 0.99502 0.08406C0.99671 0.08545 0.99808 0.08766 0.99894 0.09038C0.99991 0.09347 0.99991 0.09751 0.99991 0.1056L0.99991 0.13761L0.99991 0.17683L0.99991 0.87204C0.99991 0.87966 0.99991 0.88348 0.99934 0.88703C0.99883 0.89018 0.998 0.89317 0.99688 0.89588C0.99562 0.89893 0.99385 0.90147 0.99032 0.90654Z",
  freehold: "M0.0002 0.02288V0.15356L0.00006 0.55151L0 0.75811C0 0.76362 0 0.76638 0.00055 0.76877C0.00103 0.77088 0.00183 0.77278 0.00286 0.77431C0.00403 0.77605 0.00562 0.77711 0.0088 0.77923L0.0088 0.77923L0.03295 0.79535L0.03295 0.79535C0.04758 0.80511 0.05489 0.80999 0.06079 0.81754C0.06602 0.82423 0.07041 0.83243 0.07376 0.8417C0.07753 0.85217 0.07943 0.86447 0.08324 0.88906L0.09808 0.98496L0.09808 0.98496C0.0989 0.99025 0.09931 0.9929 0.10023 0.99487C0.10105 0.99661 0.10213 0.99797 0.10339 0.99882C0.1048 0.99977 0.10651 0.99977 0.10992 0.99977H0.91615H0.98568C0.99069 0.99977 0.99319 0.99977 0.99511 0.99821C0.99679 0.99684 0.99816 0.99465 0.99902 0.99196C1 0.9889 1 0.9849 1 0.97689V0.96497V0.62176V0.54003V0.41192V0.09687C1 0.09048 1 0.08729 0.99958 0.08425C0.99921 0.08156 0.99859 0.07897 0.99776 0.07656C0.99682 0.07384 0.9955 0.07144 0.99286 0.06665L0.96472 0.01553C0.96157 0.00982 0.96 0.00696 0.9581 0.00491C0.95642 0.00309 0.95455 0.00174 0.95259 0.00092C0.95037 0 0.94799 0 0.94322 0H0.10038H0.01452C0.00951 0 0.007 0 0.00509 0.00156C0.0034 0.00293 0.00203 0.00512 0.00117 0.00781C0.0002 0.01087 0.0002 0.01487 0.0002 0.02288Z",
  districts: "M0.00485 0.90124L0.06828 0.99156C0.07053 0.99477 0.07166 0.99638 0.07294 0.99752C0.07408 0.99854 0.0753 0.99928 0.07656 0.99973C0.07799 1 0.0795 1 0.08251 1L0.99283 1C0.99534 1 0.9966 1 0.99755 0.99945C0.9984 0.99876 0.99908 0.99766 0.99951 0.9963C1 0.99475 1 0.99273 1 0.98869L1 0.1815L1 0.01205C1 0.00801 1 0.00599 0.99951 0.00444C0.99908 0.00308 0.9984 0.00198 0.99755 0.00128C0.9966 0.0005 0.99534 0.0005 0.99283 0.0005L0.81721 0.0005L0.59833 0.0005L0.49198 0.0005L0.38265 0.0005L0.22103 0L0.22103 0C0.21784 0 0.21625 0 0.21474 0.00017C0.2134 0.00067 0.21212 0.00149 0.21094 0.00261C0.20961 0.00387 0.20845 0.00564 0.20614 0.00919L0.20614 0.00919L0.17982 0.04956C0.17215 0.06132 0.16832 0.0672 0.1639 0.07139C0.15998 0.07512 0.15573 0.07786 0.1513 0.07952C0.1463 0.08139 0.14101 0.08139 0.13043 0.08139L0.00717 0.08139C0.00466 0.08139 0.0034 0.08139 0.00245 0.08217C0.0016 0.08287 0.00092 0.08397 0.00049 0.08533C0 0.08688 0 0.0889 0 0.09294L0 0.13599L0 0.17484L0 0.88391C0 0.88775 0 0.88967 0.00029 0.89146C0.00054 0.89304 0.00096 0.89454 0.00153 0.8959C0.00217 0.89743 0.00306 0.8987 0.00484 0.90124L0.00485 0.90124Z",
  tokenstudio: "M0.99579 0.10088L0.93164 0.00865L0.93164 0.00865C0.92942 0.00545 0.92831 0.00386 0.92703 0.00272C0.92589 0.0017 0.92465 0.00096 0.92335 0.00051C0.9219 0 0.92035 0 0.91726 0L0.0069 0C0.00448 0 0.00328 0 0.00235 0.0007C0.00154 0.00132 0.00088 0.0023 0.00047 0.00351C0 0.00488 0 0.00668 0 0.01027L0 0.81632L0 0.98882C0 0.99241 0 0.99421 0.00047 0.99558C0.00088 0.99679 0.00154 0.99777 0.00235 0.99839C0.00328 0.99909 0.00448 0.99909 0.0069 0.99909L0.1828 0.99909L0.40167 0.99909L0.50802 0.99909L0.61734 0.99909L0.77875 0.99995C0.78201 0.99997 0.78364 0.99998 0.78517 0.99942C0.78653 0.99893 0.78783 0.99812 0.78901 0.99701C0.79035 0.99575 0.79148 0.994 0.79374 0.99049L0.79374 0.99049L0.82057 0.94894L0.82057 0.94894C0.82808 0.93731 0.83184 0.9315 0.83626 0.92734C0.84018 0.92365 0.84448 0.92092 0.84898 0.91927C0.85406 0.91741 0.85948 0.91741 0.87031 0.91741L0.9931 0.91741C0.99552 0.91741 0.99672 0.91741 0.99764 0.91671C0.99845 0.91609 0.99911 0.91511 0.99953 0.9139C1 0.91253 1 0.91073 1 0.90713L1 0.86228L1 0.82305L1 0.11566C1 0.11244 1 0.11084 0.99975 0.10933C0.99953 0.10799 0.99917 0.10671 0.99867 0.10555C0.99812 0.10423 0.99734 0.10311 0.99579 0.10088L0.99579 0.10088Z",
  atlans: "M0.00421 0.89908L0.06836 0.99131L0.06836 0.99131C0.07058 0.9945 0.07169 0.9961 0.07298 0.99724C0.07412 0.99826 0.07535 0.99899 0.07665 0.99945C0.0781 0.99996 0.07965 0.99996 0.08274 0.99996L0.9931 0.99996C0.99552 0.99996 0.99672 0.99996 0.99764 0.99926C0.99845 0.99864 0.99911 0.99766 0.99953 0.99645C1 0.99508 1 0.99328 1 0.98969L1 0.18363L1 0.01114C1 0.00754 1 0.00575 0.99953 0.00437C0.99911 0.00317 0.99845 0.00218 0.99764 0.00157C0.99672 0.00087 0.99552 0.00087 0.9931 0.00087L0.8172 0.00087L0.59833 0.00087L0.49198 0.00087L0.38265 0.00087L0.22126 0.00001C0.21799 0 0.21636 0 0.21483 0.00054C0.21347 0.00103 0.21217 0.00185 0.21099 0.00296C0.20965 0.00421 0.20852 0.00596 0.20626 0.00947L0.17943 0.05101C0.17192 0.06264 0.16817 0.06846 0.16374 0.07262C0.15982 0.07631 0.15552 0.07903 0.15102 0.08068C0.14593 0.08255 0.14051 0.08255 0.12968 0.08255L0.0069 0.08255C0.00448 0.08255 0.00328 0.08255 0.00235 0.08325C0.00154 0.08386 0.00088 0.08485 0.00047 0.08605C0 0.08743 0 0.08922 0 0.09282L0 0.13768L0 0.17691L0 0.8843C0 0.88752 0 0.88913 0.00025 0.89064C0.00047 0.89197 0.00083 0.89325 0.00133 0.89441C0.00188 0.89573 0.00266 0.89684 0.00421 0.89908Z",
  relai: "M0.99588 0.10101L0.93167 0.00869C0.92944 0.00548 0.92832 0.00388 0.92703 0.00273C0.92588 0.00171 0.92463 0.00097 0.92332 0.00051C0.92184 0 0.92028 0 0.91715 0L0.0069 0C0.00448 0 0.00328 0 0.00235 0.00069C0.00154 0.00129 0.00088 0.00225 0.00047 0.00344C0 0.00479 0 0.00655 0 0.01008L0 0.81632L0 0.98901C0 0.99254 0 0.9943 0.00047 0.99565C0.00088 0.99683 0.00154 0.9978 0.00235 0.9984C0.00328 0.99909 0.00448 0.99909 0.0069 0.99909L0.1828 0.99909L0.40167 0.99909L0.50802 0.99909L0.61734 0.99909L0.77863 0.99995C0.78194 0.99997 0.78359 0.99998 0.78514 0.99942C0.78651 0.99893 0.78782 0.99811 0.78901 0.99699C0.79036 0.99573 0.79149 0.99398 0.79376 0.99047L0.82051 0.94904C0.82804 0.93738 0.8318 0.93155 0.83626 0.92737C0.84021 0.92368 0.84455 0.92094 0.8491 0.91928C0.85424 0.91741 0.85972 0.91741 0.87069 0.91741L0.9931 0.91741C0.99552 0.91741 0.99672 0.91741 0.99764 0.91672C0.99845 0.91612 0.99911 0.91516 0.99953 0.91397C1 0.91262 1 0.91086 1 0.90733L1 0.86227L1 0.82305L1 0.11539C1 0.11227 1 0.11071 0.99976 0.10925C0.99954 0.10795 0.99918 0.10671 0.9987 0.10557C0.99816 0.10429 0.9974 0.1032 0.99588 0.10101Z",
  nous: "M0.0002 0.02288V0.1536V0.1536L0.00006 0.55164L0 0.75829C0 0.7638 0 0.76655 0.00055 0.76895C0.00103 0.77106 0.00183 0.77296 0.00286 0.77449C0.00403 0.77623 0.00562 0.77729 0.0088 0.77942L0.03295 0.79554C0.04758 0.80529 0.05489 0.81018 0.06079 0.81773C0.06602 0.82443 0.07042 0.83262 0.07376 0.8419C0.07753 0.85237 0.07943 0.86467 0.08324 0.88926L0.09808 0.98519C0.0989 0.99048 0.09931 0.99313 0.10023 0.99511C0.10105 0.99685 0.10213 0.99821 0.10339 0.99905C0.1048 1 0.10651 1 0.10992 1H0.91616H0.98568C0.99069 1 0.9932 1 0.99511 0.99844C0.9968 0.99708 0.99817 0.99489 0.99902 0.9922C1 0.98914 1 0.98513 1 0.97712V0.9652V0.62191V0.54015V0.41201V0.09689C1 0.0905 1 0.08731 0.99958 0.08427C0.99921 0.08158 0.9986 0.07899 0.99776 0.07658C0.99682 0.07386 0.9955 0.07146 0.99286 0.06666L0.96472 0.01554C0.96158 0.00982 0.96 0.00696 0.9581 0.00491C0.95642 0.00309 0.95456 0.00174 0.95259 0.00092C0.95037 0 0.94799 0 0.94322 0H0.10038H0.01452C0.00951 0 0.007 0 0.00509 0.00156C0.0034 0.00293 0.00203 0.00512 0.00117 0.00781C0.0002 0.01087 0.0002 0.01487 0.0002 0.02288Z",
};

function CardClipDefs() {
  return (
    <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
      <defs>
        {Object.entries(CARD_CLIPS).map(([name, d]) => (
          <clipPath key={name} id={`clip-${name}`} clipPathUnits="objectBoundingBox">
            <path d={d} />
          </clipPath>
        ))}
      </defs>
    </svg>
  );
}

export default function WorkPage() {
  return (
    <div style={{ position: "relative", background: "#fff" }} className="min-h-screen">
      <CardClipDefs />
      <NavMenu />

      {/* ── Desktop / tablet (≥ md): pinned-hero reveal + work grid ── */}
      {/* Work grid + footer below inherit the shared --bleed (mouthwash gutter). */}
      <div className="hidden md:block">
        {/* Pinned hero — the work grid below slides up over it on first scroll */}
        <HeroReveal />

        {/* Work grid — opaque layer that reveals over the hero (z-1) */}
        <PageEnter style={{ position: "relative", zIndex: 1, background: "#fff" }}>
          <main className="w-full md:px-8 lg:px-[var(--bleed)] flex flex-col gap-[10px] pt-[10px]">
            {/* Featured: ZoomScale IS the entrance — no Reveal wrapper (would compete) */}
            <ProjectCard project={PROJECTS[0]} priority zoom />
            <Reveal delay={0.1}><ProjectCard project={PROJECTS[1]} /></Reveal>

            <CTASection
              text={"Built with craft. Driven by passion.\nShipped without excuses."}
              buttonLabel="Discover Studio"
              textGap={36}
              href="/studio"
            />

            <Reveal><ProjectCard project={PROJECTS[2]} /></Reveal>
            <Reveal delay={0.1}><ProjectCard project={PROJECTS[3]} /></Reveal>

            <CTASection
              text={"Looking designed is easy now.\nCaring enough to craft it isn't."}
              buttonLabel="Read Manifesto"
              textGap={45}
            />

            <Reveal><ProjectCard project={PROJECTS[4]} /></Reveal>
            <Reveal delay={0.1}><ProjectCard project={PROJECTS[5]} /></Reveal>
            <Reveal><ProjectCard project={PROJECTS[6]} /></Reveal>
          </main>

          <div className="max-w-[1240px] mx-auto md:px-8 mt-[10px] pb-[10px] lg:max-w-none lg:px-[var(--bleed)]">
            <FooterBanner />
          </div>
        </PageEnter>
      </div>

      {/* ── Mobile (< md): static stacked layout from the Figma mobile frame ── */}
      <MobileHome />
    </div>
  );
}
