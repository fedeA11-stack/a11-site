"use client";

import { useRef, type CSSProperties } from "react";
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
import worldLogo from "../public/assets/world logo.png";
import freeholdLogoGrey from "../public/assets/freehold logo grey.png";
import districtLogo from "../public/assets/district logo.png";
import freeholdLogo from "../public/assets/freehold logo.png";
import atlansLogo from "../public/assets/atlans logo.png";
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
    textColor: "#282828",
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
    textColor: "#303030",
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
    textColor: "#45474a",
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
    textColor: "#4d2820",
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
    textColor: "#282828",
    href: "/relai",
    labelPx: 18,
    labelTracking: "-0.36px",
    labelTop: 80,
    descTop: 142,
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
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/assets/slash.svg" alt="" aria-hidden style={{ height: cqMid(18), width: "auto", flexShrink: 0 }} />
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
        aspectRatio: "1240 / 769",
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
        />
      ) : (
        <ImageReveal>
          <CoverImage
            src={project.image}
            alt={project.name}
            sizes="100vw"
            priority={priority}
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
  { tile: worldTile,       name: "World",        description: "Five years,\nnine people.\nFour Apps for\nreal humans", color: "#282828", href: "/world",       logo: worldLogo,        logoHeight: 20 },
  { tile: freeholdTile,    name: "Freehold",     description: "A non-custodial,\nmulti-chain DeFi\nwallet app",        color: "#282828", href: "/freehold",    logo: freeholdLogoGrey, logoHeight: 18 },
  { tile: districtsTile,   name: "Districts",    description: "RWA tokenization,\nstart to finish",                   color: "#45474a", href: "/districts",   logo: districtLogo,     logoHeight: 20 },
  { tile: tokenStudioTile, name: "Token Studio", description: "Tokenize, launch,\nmanage. On-chain\nRWAs",            color: "#4d2820", href: "/tokenstudio", logo: freeholdLogo,     logoHeight: 18 },
  { tile: atlansTile,      name: "Atlans",       description: "Athletic platform\nof Discovery and\nconnection",       color: "#ffffff", href: "/atlans",      logo: atlansLogo,       logoHeight: 16 },
  { tile: relaiTile,       name: "Relai",        description: "Bitcoin-only savings\napp focused on\nsimple self-custody.", color: "#282828", href: "/relai",   logoHeight: 19 },
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
export default function WorkPage() {
  return (
    <div style={{ position: "relative", background: "#fff" }} className="min-h-screen">
      <NavMenu />

      {/* ── Desktop / tablet (≥ md): pinned-hero reveal + work grid ── */}
      {/* Homepage runs a slightly wider bleed (5vw) than the shared --bleed; the
          work grid + footer below both inherit this override via var(--bleed). */}
      <div className="hidden md:block" style={{ "--bleed": "6vw" } as CSSProperties}>
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
