"use client";

import Link from "next/link";
import NavMenu from "./NavMenu";
import FooterBanner from "./FooterBanner";

// ─── Project data ─────────────────────────────────────────────────────────────
type Project = {
  num: string;
  image: string;
  name: string;
  description: string;
  textColor: string;
  href?: string;
  labelPx: number;
  labelTracking: string;
  // Exact top offsets from Figma (mask-position y values per card)
  labelTop: number;
  descTop: number;
  // Project logo — exact Figma positions per card
  logo?: string;
  logoHeight: number; // px, from Figma (31.105px)
  logoLeft: number;   // px, from Figma absolute positions
};

const PROJECTS: Project[] = [
  {
    num: "01",
    image: "/assets/World-Case.png",
    name: "World",
    description: "Five years,\nnine people.\nFour Apps for\nreal humans",
    textColor: "#282828",
    href: "/world",
    labelPx: 16,
    labelTracking: "-0.32px",
    labelTop: 56,   // Figma confirmed
    descTop: 112,   // Figma confirmed
    logo: "/assets/world logo.png",
    logoHeight: 31,
    logoLeft: 72,
  },
  {
    num: "02",
    image: "/assets/Freehold-Case.png",
    name: "Freehold",
    description: "A non-custodial,\nmulti-chain DeFi\nwallet app",
    textColor: "#303030",
    labelPx: 18,
    labelTracking: "-0.36px",
    labelTop: 62,
    descTop: 124,
    logo: "/assets/freehold logo grey.png",
    logoHeight: 31,
    logoLeft: 174,
  },
  {
    num: "03",
    image: "/assets/District-case.png",
    name: "Districts",
    description: "RWA tokenization,\nstart to finish",
    textColor: "#45474a",
    labelPx: 18,
    labelTracking: "-0.36px",
    labelTop: 147,
    descTop: 209,
    logo: "/assets/district logo.png",
    logoHeight: 31,
    logoLeft: 72,
  },
  {
    num: "04",
    image: "/assets/Token studio-case.png",
    name: "Token Studio",
    description: "Tokenize, launch,\nmanage. On-chain\nRWAs",
    textColor: "#4d2820",
    labelPx: 18,
    labelTracking: "-0.36px",
    labelTop: 80,
    descTop: 142,
    logo: "/assets/freehold logo.png",
    logoHeight: 31,
    logoLeft: 80,
  },
  {
    num: "05",
    image: "/assets/Atlans-case.png",
    name: "Atlans",
    description: "Athletic platform\nof Discovery and\nconnection",
    textColor: "#ffffff",
    labelPx: 18,
    labelTracking: "-0.36px",
    labelTop: 123,
    descTop: 186,
    logo: "/assets/atlans logo.png",
    logoHeight: 31,
    logoLeft: 80,
  },
  {
    num: "06",
    image: "/assets/Relai-case.png",
    name: "Relai",
    description: "Bitcoin-only savings\napp focused on\nsimple self-custody.",
    textColor: "#282828",
    labelPx: 18,
    labelTracking: "-0.36px",
    labelTop: 80,
    descTop: 142,
    logoHeight: 31,
    logoLeft: 80,
  },
];

// ─── Slash ────────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Chevron({ color }: { color: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/assets/slash.svg" alt="" aria-hidden style={{ height: 18, width: "auto", flexShrink: 0 }} />
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────
// Figma: 1240 × 769px card (node 3488:10724)
// Label:       top = 56px   left = 72px
// Description: top = 112px  left = 72px  maxWidth = 521px (42% × 1240px)
function ProjectCard({ project }: { project: Project }) {
  const c = project.textColor;

  const card = (
    <div
      data-cursor={project.href ? "View project" : undefined}
      className="relative w-full overflow-hidden rounded-[4.444px]"
      style={{
        aspectRatio: "1240 / 769",
        cursor: project.href ? "none" : "default",
      }}
    >
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.image}
        alt={project.name}
        className="absolute inset-0 w-full h-full object-cover block"
      />

      {/* Label — top/left per card from Figma */}
      <div
        className="absolute flex items-center gap-[9px] whitespace-nowrap capitalize"
        style={{
          top: project.labelTop,
          left: 72,
          fontFamily: "'System Unlicensed Trial', sans-serif",
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

      {/* Description — top/left per card from Figma, maxWidth: 521px */}
      <p
        className="absolute m-0 whitespace-pre-wrap capitalize"
        style={{
          top: project.descTop,
          left: 72,
          fontFamily: "'System Unlicensed Trial', sans-serif",
          fontWeight: 500,
          fontSize: "42px",
          lineHeight: 0.95,
          letterSpacing: "-1.26px",
          color: c,
          maxWidth: "521px",
        }}
      >
        {project.description}
      </p>

      {project.logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.logo}
          alt=""
          aria-hidden
          style={{
            position: "absolute",
            bottom: 64,
            left: project.logoLeft,
            height: project.logoHeight,
            width: "auto",
            display: "block",
          }}
        />
      )}
    </div>
  );

  if (project.href) {
    return (
      <Link href={project.href} className="block">
        {card}
      </Link>
    );
  }
  return card;
}

// ─── CTA interstitial ─────────────────────────────────────────────────────────
// Figma: ~147px top/bottom padding, gap between text and button varies:
//   CTA1: text-to-button gap = 36px   CTA2: text-to-button gap = 45px
function CTASection({
  text,
  buttonLabel,
  textGap = 36,
}: {
  text: string;
  buttonLabel: string;
  textGap?: number;
}) {
  return (
    <div
      className="flex flex-col items-center pt-[147px] pb-[147px]"
      style={{ gap: textGap }}
    >
      {/* CTA text: 44.436px, leading 0.94, tracking -0.8887px, w: 714.315px */}
      <p
        className="m-0 text-center whitespace-pre-wrap"
        style={{
          fontFamily: "'System Unlicensed Trial', sans-serif",
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
      </p>

      {/* Button: h 44.436px, px 15.553px, py 6.665px, rounded 111.091px */}
      <button
        className="inline-flex items-center justify-center whitespace-nowrap capitalize"
        style={{
          height: "44.436px",
          padding: "6.665px 15.553px",
          borderRadius: "111.091px",
          background: "#282328",
          border: "none",
          fontFamily: "'System Unlicensed Trial', sans-serif",
          fontWeight: 500,
          fontSize: "15.553px",
          lineHeight: 1.09,
          color: "#ffffff",
          cursor: "pointer",
        }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WorkPage() {
  return (
    <div className="bg-white min-h-screen">
      <NavMenu />

      {/*
       * All content uses max-w-[1240px] mx-auto — equivalent to 135px horizontal
       * padding on Figma's 1512px canvas (135px left, ~137px right).
       */}

      {/* ── Hero tagline ──────────────────────────────────────────────────────
       * Figma: tagline at y=248, nav bottom ~y=90 → pt = 248-90 = 158px
       * Tagline bottom at y=338, first card at y=516 → pb = 516-338 = 178px
       */}
      {/* pt: Figma tagline y=248 − nav height 80px = 168px. pb: first card y=516 − tagline bottom 338px = 178px */}
      <div className="max-w-[1240px] mx-auto pt-[168px] pb-[178px] flex justify-center">
        <p
          className="m-0 text-center whitespace-pre-wrap"
          style={{
            fontFamily: "'System Unlicensed Trial', sans-serif",
            fontWeight: 500,
            fontSize: "32px",
            lineHeight: 0.95,
            letterSpacing: "-0.64px",
            color: "#282328",
            width: "366px",
            maxWidth: "100%",
          }}
        >
          {"We are A11.\nProduct Studio Built on\nPassion and Craft."}
        </p>
      </div>

      {/* ── Cards + CTAs ──────────────────────────────────────────────────────
       * Cards gap: 10px (Figma exact)
       * CTA sections sit inline in the same flex column
       */}
      <main className="max-w-[1240px] mx-auto flex flex-col gap-[10px]">
        {/* Group 1: World + Freehold */}
        <ProjectCard project={PROJECTS[0]} />
        <ProjectCard project={PROJECTS[1]} />

        {/* CTA 1 — text-to-button gap: 36px (Figma: 2339.31 - 2303.33 = 35.98px) */}
        <CTASection
          text={"Built with craft. Driven by passion.\nShipped without excuses."}
          buttonLabel="Discover Studio"
          textGap={36}
        />

        {/* Group 2: Districts + Token Studio */}
        <ProjectCard project={PROJECTS[2]} />
        <ProjectCard project={PROJECTS[3]} />

        {/* CTA 2 — text-to-button gap: 45px (Figma: 4361.58 - 4316.72 = 44.86px) */}
        <CTASection
          text={"Looking designed is easy now.\nCaring enough to craft it isn't."}
          buttonLabel="Read Manifest"
          textGap={45}
        />

        {/* Group 3: Atlans + Relai */}
        <ProjectCard project={PROJECTS[4]} />
        <ProjectCard project={PROJECTS[5]} />
      </main>

      {/* Footer — same 1240px container, 10px gap from last card. Includes banner + bottom bar. */}
      <div className="max-w-[1240px] mx-auto mt-[10px] pb-[10px]">
        <FooterBanner />
      </div>
    </div>
  );
}
