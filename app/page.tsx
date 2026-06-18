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
import worldLogo from "../public/assets/world logo.png";
import freeholdLogoGrey from "../public/assets/freehold logo grey.png";
import districtLogo from "../public/assets/district logo.png";
import freeholdLogo from "../public/assets/freehold logo.png";
import atlansLogo from "../public/assets/atlans logo.png";
import PageEnter from "./PageEnter";
import WordReveal from "./WordReveal";

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Chevron({ color }: { color: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/assets/slash.svg" alt="" aria-hidden style={{ height: 18, width: "auto", flexShrink: 0 }} />
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
          sizes="(max-width: 1280px) 100vw, 1240px"
          priority={priority}
        />
      ) : (
        <ImageReveal>
          <CoverImage
            src={project.image}
            alt={project.name}
            sizes="(max-width: 1280px) 100vw, 1240px"
            priority={priority}
          />
        </ImageReveal>
      )}

      <div
        className="absolute flex items-center gap-[9px] whitespace-nowrap capitalize"
        style={{
          top: project.labelTop,
          left: 72,
          fontFamily: "var(--font-system), sans-serif",
          fontWeight: 500,
          fontSize: project.labelPx,
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
          top: project.descTop,
          left: 72,
          fontFamily: "var(--font-system), sans-serif",
          fontWeight: 500,
          fontSize: "42px",
          lineHeight: 0.95,
          letterSpacing: "-1.26px",
          color: c,
          maxWidth: "521px",
          textWrap: "pretty",
        }}
      >
        {project.description}
      </p>

      {project.logo && (
        <div
          style={{
            position: "absolute",
            bottom: 64,
            left: project.logoLeft,
            height: project.logoHeight,
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
      <div className="flex flex-col items-center pt-[147px] pb-[147px]" style={{ gap: textGap }}>
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
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
          }}
        >
          {"We are A11.\nProduct Studio Built on\nPassion and Craft."}
        </motion.p>
      </motion.section>

      {/*
       * Reserves scroll distance for the reveal — but stops short of a full
       * viewport so the first case study already peeks ~15% of its height at
       * rest. The card is 1240/769 and full-width up to 1240px, so 15% of its
       * height ≈ min(9.3vw, 115px). We add back the 80px nav spacer + 10px grid
       * top (90px) that sit above the grid, so the visible card peek lands on 15%.
       */}
      <div
        ref={sentinel}
        style={{ height: "calc(100vh - 90px - min(9.3vw, 115px))" }}
        aria-hidden
      />
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WorkPage() {
  return (
    <div style={{ position: "relative", background: "#fff" }} className="min-h-screen">
      <NavMenu />

      {/* Pinned hero — the work grid below slides up over it on first scroll */}
      <HeroReveal />

      {/* Work grid — opaque layer that reveals over the hero (z-1) */}
      <PageEnter style={{ position: "relative", zIndex: 1, background: "#fff" }}>
        <main className="max-w-[1240px] mx-auto flex flex-col gap-[10px] pt-[10px]">
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

        <div className="max-w-[1240px] mx-auto mt-[10px] pb-[10px]">
          <FooterBanner />
        </div>
      </PageEnter>
    </div>
  );
}
