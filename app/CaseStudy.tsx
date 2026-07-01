"use client";

import React from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { motion, useInView } from "framer-motion";
import NavMenu from "./NavMenu";
import FooterBanner from "./FooterBanner";
import CoverImage from "./CoverImage";
import PhoneVideo from "./world/chat/PhoneVideo";
import { caseStudyJsonLd } from "./seo";

// ─────────────────────────────────────────────────────────────────────────────
// Reusable, data-driven case-study template.
//
// This is the canonical case-study design (Figma "B Version — MCP" / Homepage,
// node 1863:11469). Every case study renders through here — the page only
// supplies a `CaseStudyData` object, so future studies are pure content.
//
// Images: pass `src` (static import → optimized via next/image, or a string
// path → raw <img>). Omit `src` to render a clean empty tile — used for assets
// that aren't on disk yet (drop the file at the documented path and add `src`).
// ─────────────────────────────────────────────────────────────────────────────

export type CSImage = {
  /** Static import (optimized) or string path. Omit while the asset is pending upload. */
  src?: StaticImageData | string;
  alt: string;
  /** Tile background — shown behind/around the image (and alone when src is omitted). */
  bg?: string;
  /** `src` is a looping video file, framed inside a phone shell. */
  video?: boolean;
  /** Render a centered glyph instead of an image (decorative tiles). */
  icon?: "lock";
  priority?: boolean;
};

export type CSMedia =
  | { kind: "full"; image: CSImage; aspect?: string }
  | { kind: "duo"; images: [CSImage, CSImage]; aspect?: string; aspects?: [string, string]; columns?: string }
  | { kind: "tallDuo"; tall: CSImage; stack: [CSImage, CSImage]; tallAspect?: string; stackAspect?: string; stackAspects?: [string, string]; stackFirst?: boolean; columns?: string };

export type CSSection = {
  /** Section heading (left column). Supports "\n". Omit for a media-/stats-only block. */
  title?: string;
  /** Body copy (right column). */
  body?: string;
  /** Stat row, e.g. [{ value: "45M+", label: "Total users" }]. Rendered as big numbers. */
  stats?: { value: string; label: string }[];
  /** Testimonial. `align` "center" (default) = big centered quote between rules; "left" = left-aligned quote with a single bottom rule. Both show the avatar + author/role. */
  quote?: { text: string; author?: string; role?: string; avatar?: StaticImageData | string; align?: "left" | "center" };
  /** Image/video blocks stacked below the header. */
  media?: CSMedia[];
};

export type CSProject = {
  name: string;
  href?: string;
  /** Preview image revealed on hover (All Projects section). */
  preview?: StaticImageData | string;
  /** Case mockup image for the Next project band (PNG with transparency). */
  nextImage?: string;
  /** Brand/product logo for the Next project band. */
  logo?: string;
};

export type CaseStudyData = {
  /** Last breadcrumb segment — the page name, e.g. "Relai". */
  breadcrumb: string;
  /** Optional middle breadcrumb crumb (e.g. World products → { label: "World", href: "/world" }). */
  section?: { label: string; href: string };
  title: string; // supports "\n"
  /** Hero sub-copy. Optional — omit for a title-only hero. */
  description?: string;
  /** Industry / Services / Year. Omit (or leave empty) to hide the meta block. */
  meta?: { label: string; value: string }[];
  hero: CSImage;
  sections: CSSection[];
  projects: CSProject[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Tokens (exact from Figma)
// ─────────────────────────────────────────────────────────────────────────────
const FONT = "var(--font-system), sans-serif";
const INK = "#282328";
const MUTED = "#989190";
const VALUE = "#282328";
const BEIGE = "#F0EBE5";
const HAIRLINE = "rgba(40,35,40,0.12)";
const RADIUS = "clamp(8px, 0.94vw, 13.5px)";
const CELL_GAP = "clamp(8px, 0.73vw, 11px)";

const T = {
  // Figma design system (Studio of the Ambitious — Case Study World, 1243px content):
  //   hero title 72 / 0.95 · section h2 56 / 0.96 · body 22 / 1.3 · all -0.0Xem.
  h1: { fontFamily: FONT, fontWeight: 500, fontSize: "clamp(44px, 5.8vw, 72px)", lineHeight: 0.95, letterSpacing: "-0.03em", color: INK, textWrap: "balance" as const },
  h2: { fontFamily: FONT, fontWeight: 500, fontSize: "clamp(32px, 3.6vw, 44px)", lineHeight: 0.96, letterSpacing: "-0.02em", color: INK, textWrap: "balance" as const },
  body: { fontFamily: FONT, fontWeight: 400, fontSize: "clamp(17px, 1.77vw, 22px)", lineHeight: 1.3, letterSpacing: "-0.02em", color: INK, textWrap: "pretty" as const },
  label: { fontFamily: FONT, fontWeight: 400, fontSize: "clamp(14px, 1.25vw, 16px)", lineHeight: 1.4, color: MUTED },
  value: { fontFamily: FONT, fontWeight: 400, fontSize: "clamp(17px, 1.77vw, 22px)", lineHeight: 1.4, color: VALUE },
};

// Vertical rhythm (Figma 1512 frame, content 1242px)
//   Between sections / before a divider:        140px
//   Hero block→image, image→stats, stats→rule:   80px
//   Section header→media:                         80px
const SECTION_GAP = "clamp(96px, 10.5vw, 140px)";
const HERO_GAP = "clamp(56px, 6.6vw, 80px)";
const HEADER_GAP = "clamp(56px, 6.6vw, 80px)";

// ─────────────────────────────────────────────────────────────────────────────
// TextReveal — simple fade in for headings / body copy on scroll entry.
// ─────────────────────────────────────────────────────────────────────────────
function TextReveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      style={style}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1], delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cell — fade + scale(1.05→1.0) reveal on scroll entry.
// ─────────────────────────────────────────────────────────────────────────────
function Cell({ image, aspect, sizes, phone }: { image: CSImage; aspect: string; sizes: string; phone?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  const tileVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: { opacity: 1, scale: 1 },
  };

  if (image.video && phone) {
    return (
      <motion.div ref={ref} variants={tileVariants} initial="hidden" animate={inView ? "visible" : "hidden"} transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}>
        <PhoneVideo src={typeof image.src === "string" ? image.src : ""} bg={image.bg ?? BEIGE} radius={RADIUS} active={inView} />
      </motion.div>
    );
  }

  return (
    <motion.div ref={ref} variants={tileVariants} initial="hidden" animate={inView ? "visible" : "hidden"} transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}>
      <div style={{ position: "relative", borderRadius: RADIUS, overflow: "hidden", background: image.bg ?? BEIGE, aspectRatio: aspect, width: "100%" }}>
        {image.video && image.src ? (
           
          <video src={inView ? (image.src as string) : undefined} autoPlay loop muted playsInline preload="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        ) : image.icon === "lock" ? (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "clamp(56px, 7vw, 96px)", aspectRatio: "1", borderRadius: "50%", background: INK, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="40%" height="40%" viewBox="0 0 24 24" fill="none">
                <path d="M17 11H7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2z" fill="white" />
                <path d="M8 11V7a4 4 0 118 0v4" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        ) : image.src == null ? null : (
          <CoverImage src={image.src} alt={image.alt} sizes={sizes} priority={image.priority} />
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Media block renderers (aspect ratios pulled straight from Figma)
// ─────────────────────────────────────────────────────────────────────────────
function MediaBlock({ media }: { media: CSMedia }) {
  if (media.kind === "full") {
    return <Cell image={media.image} aspect={media.aspect ?? "1241 / 760"} sizes="(min-width: 1024px) calc(100vw - 29rem), 100vw" />;
  }

  if (media.kind === "duo") {
    const cols = media.columns ?? "1fr 1fr";
    return (
      <div className="cs-media-grid" style={{ display: "grid", gridTemplateColumns: cols, gap: CELL_GAP, alignItems: "start" }}>
        {media.images.map((img, i) => (
          <Cell key={i} image={img} aspect={media.aspects?.[i] ?? media.aspect ?? "615 / 612"} sizes="(max-width: 768px) 100vw, (min-width: 1024px) calc((100vw - 29rem) / 2), 50vw" />
        ))}
      </div>
    );
  }

  // tallDuo — tall tile + two stacked tiles. stackFirst swaps column order.
  const cols = media.columns ?? "1fr 1fr";
  const tallCol = <Cell image={media.tall} aspect={media.tallAspect ?? "615 / 1038"} sizes="(max-width: 768px) 100vw, (min-width: 1024px) calc((100vw - 29rem) / 2), 50vw" phone={media.tall.video} />;
  const stackCol = (
    <div style={{ display: "flex", flexDirection: "column", gap: CELL_GAP }}>
      {media.stack.map((img, i) => (
        <Cell key={i} image={img} aspect={media.stackAspects?.[i] ?? media.stackAspect ?? "615 / 513"} sizes="(max-width: 768px) 100vw, (min-width: 1024px) calc((100vw - 29rem) / 2), 50vw" />
      ))}
    </div>
  );
  return (
    <div className="cs-media-grid" style={{ display: "grid", gridTemplateColumns: cols, gap: CELL_GAP, alignItems: "start" }}>
      {media.stackFirst ? stackCol : tallCol}
      {media.stackFirst ? tallCol : stackCol}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StatNumber — count-up + slide-up reveal on scroll entry
// Parses "45M+" → numeric 45, suffix "M+", counts 0→45 over ~1.2s with easeOut.
// ─────────────────────────────────────────────────────────────────────────────
function StatNumber({ value, delay = 0 }: { value: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  // Parse "45M+" → ["45", "M+"] once. Non-numeric values render verbatim (below)
  // and skip the count-up entirely, so they never need a setState.
  const parsed = useMemo(() => value.match(/^([\d.]+)(.*)$/), [value]);
  const [animated, setAnimated] = useState("0");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !parsed) return;
    const target = parseFloat(parsed[1]);
    const suffix = parsed[2];
    const duration = 1200;
    const start = performance.now() + delay;
    let raf: number;
    function tick(now: number) {
      const t = Math.max(0, Math.min(1, (now - start) / duration));
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const current = Math.round(eased * target);
      setAnimated(`${current}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, parsed, delay]);

  // Numeric stats animate (count up from 0); non-numeric values render as-is.
  const display = parsed ? animated : value;

  return (
    <span
      ref={ref}
      style={{
        display: "block",
        fontFamily: FONT, fontWeight: 500,
        fontSize: "clamp(52px, 7vw, 96px)",
        lineHeight: 0.95, letterSpacing: "-0.03em", color: INK,
        opacity: visible ? 1 : 0,
        transition: `opacity 0.7s cubic-bezier(0.22,0.61,0.36,1) ${delay}ms`,
      }}
    >
      {display}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section — optional 2-col header (title left, body right), optional stats row,
// optional pull quote, and a stack of media blocks
// ─────────────────────────────────────────────────────────────────────────────
// Testimonials (the case-study pull quotes + the divider beneath them) are
// currently hidden site-wide. Flip to `true` to bring them back — the quote
// data still lives in each page's `sections`, so nothing is lost.
const SHOW_TESTIMONIALS = false;

function Section({ section }: { section: CSSection }) {
  const hasHeader = section.title || section.body;
  const hasStats = section.stats && section.stats.length > 0;
  const hasMedia = section.media && section.media.length > 0;
  const showQuote = SHOW_TESTIMONIALS && section.quote;
  // With testimonials hidden, a quote-only section renders nothing — skip it
  // entirely so its top margin doesn't double the gap between real sections.
  if (!hasHeader && !hasStats && !showQuote && !hasMedia) return null;
  return (
    <section style={{ marginTop: SECTION_GAP, display: "flex", flexDirection: "column", gap: HEADER_GAP }}>
      {hasHeader && (
        <div className="cs-section-header" style={{ display: "flex", justifyContent: "space-between", gap: 24, alignItems: "start" }}>
          {section.title && (
            <TextReveal style={{ maxWidth: "40%" }}>
              <h2 style={{ ...T.h2, margin: 0, whiteSpace: "pre-line" }}>{section.title}</h2>
            </TextReveal>
          )}
          {section.body && (
            // Cap the measure on big screens — 50% of a wide viewport runs to
            // ~90ch, well past a comfortable read. ~46rem ≈ 60–66ch.
            <TextReveal delay={80} style={{ maxWidth: "min(50%, 46rem)" }}>
              <p style={{ ...T.body, margin: 0 }}>{section.body}</p>
            </TextReveal>
          )}
        </div>
      )}

      {section.stats && section.stats.length > 0 && (
        // Stats row spread across the full content width: first flush left, last
        // flush right, the rest evenly spaced between, with hairline dividers in
        // the gaps. Stacks to one-per-row on phones (see .cs-stats in globals.css).
        <div className="cs-stats" style={{ display: "flex", alignItems: "stretch", justifyContent: "space-between", width: "100%", margin: 0, gap: 32 }}>
          {section.stats.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div aria-hidden className="cs-stat-divider" style={{ width: 1, alignSelf: "stretch", background: HAIRLINE }} />}
              <div className="cs-stat" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16, textAlign: "left" }}>
                <StatNumber value={s.value} delay={i * 120} />
                <span style={{ ...T.label, margin: 0 }}>{s.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Figma: full-width hairline separating the stats row from the next section. */}
      {section.stats && section.stats.length > 0 && (
        <div style={{ height: 1, background: HAIRLINE, width: "100%" }} />
      )}

      {showQuote && (() => {
        const q = section.quote!;
        const left = q.align === "left";
        const attribution = (q.author || q.role) && (
          <footer style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {q.avatar && (
              <div style={{ position: "relative", width: "clamp(48px, 5vw, 64px)", aspectRatio: "1", borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: BEIGE }}>
                <CoverImage src={q.avatar} alt={q.author ?? ""} sizes="64px" />
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "left" }}>
              {q.author && <span style={{ ...T.value, fontWeight: 500, color: INK }}>{q.author}</span>}
              {q.role && <span style={{ ...T.label }}>{q.role}</span>}
            </div>
          </footer>
        );
        return left ? (
          <blockquote style={{ margin: 0, paddingBottom: "clamp(32px, 4vw, 56px)", borderBottom: `1px solid ${HAIRLINE}`, display: "flex", flexDirection: "column", gap: "clamp(28px, 3vw, 44px)" }}>
            <TextReveal>
              <p style={{ fontFamily: FONT, fontWeight: 400, fontSize: "clamp(24px, 2.7vw, 36px)", lineHeight: 1.15, letterSpacing: "-0.02em", color: INK, margin: 0, maxWidth: 628 }}>{q.text}</p>
            </TextReveal>
            <TextReveal delay={80}>{attribution}</TextReveal>
          </blockquote>
        ) : (
          // Figma: 140px above (section gap), author→divider 140px below.
          <blockquote style={{ margin: 0, padding: `0 0 ${SECTION_GAP}`, borderBottom: `1px solid ${HAIRLINE}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 56, textAlign: "center" }}>
            {/* Figma: 708px-wide centered quote, ~32px, sentence case (no capitalize). */}
            <TextReveal>
              <p style={{ fontFamily: FONT, fontWeight: 500, fontSize: "clamp(30px, 3.5vw, 44px)", lineHeight: 0.94, letterSpacing: "-0.02em", color: INK, margin: 0, maxWidth: 708 }}>{q.text}</p>
            </TextReveal>
            <TextReveal delay={80}>{attribution}</TextReveal>
          </blockquote>
        );
      })()}

      {section.media && section.media.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: CELL_GAP }}>
          {section.media.map((m, i) => (
            <MediaBlock key={i} media={m} />
          ))}
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Next project — white full-bleed band. Three-column layout:
//   left: "Next project" label  |  center: case mockup PNG  |  right: brand logo
// The last project wraps back to the first.
// ─────────────────────────────────────────────────────────────────────────────
function NextProject({ projects }: { projects: CSProject[] }) {
  const pathname = usePathname();

  const next = (() => {
    const idx = projects.findIndex((p) => p.href === pathname);
    if (idx === -1 || projects.length === 0) return projects[0] ?? null;
    return projects[(idx + 1) % projects.length];
  })();

  if (!next) return null;

  return (
    <section style={{ marginTop: SECTION_GAP }}>
      <Link href={next.href ?? "#"} style={{ textDecoration: "none", display: "block" }}>

        {/* ── Mobile / Tablet (<1024px): centered single-column, full viewport height ── */}
        <div
          className="flex lg:hidden"
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 24px",
            gap: "clamp(28px, 7.6vw, 40px)",
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: "clamp(32px, 10.2vw, 56px)",
              lineHeight: 0.9,
              letterSpacing: "-0.05em",
              color: INK,
              opacity: 0.95,
              textAlign: "center",
            }}
          >
            Next project
          </span>

          {next.nextImage && (
            <div style={{ width: "min(74%, 360px)", flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={next.nextImage}
                alt={next.name}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          )}

          {next.logo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={next.logo}
              alt={next.name}
              style={{
                maxHeight: "clamp(28px, 7.6vw, 42px)",
                maxWidth: "clamp(140px, 53.7vw, 260px)",
                width: "auto",
                height: "auto",
                display: "block",
              }}
            />
          ) : (
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 500,
                fontSize: "clamp(22px, 5.6vw, 32px)",
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                color: INK,
                opacity: 0.95,
                textAlign: "center",
              }}
            >
              {next.name}
            </span>
          )}
        </div>

        {/* ── Desktop (≥1024px): 3-column row — text | image | logo ── */}
        <div
          className="hidden lg:flex lg:px-[var(--bleed)]"
          data-cursor="View project"
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            gap: "clamp(20px, 2.8vw, 40px)",
            cursor: "none",
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: "clamp(32px, 4.44vw, 64px)",
              lineHeight: 0.9,
              letterSpacing: "-0.05em",
              color: INK,
              opacity: 0.95,
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            Next project
          </span>

          {next.nextImage && (
            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", minWidth: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={next.nextImage}
                alt={next.name}
                style={{
                  maxHeight: "clamp(280px, 48.4vw, 697px)",
                  maxWidth: "100%",
                  width: "auto",
                  height: "auto",
                  display: "block",
                }}
              />
            </div>
          )}

          {next.logo ? (
            <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={next.logo}
                alt={next.name}
                style={{
                  maxHeight: "clamp(28px, 3.75vw, 54px)",
                  maxWidth: "clamp(100px, 20vw, 280px)",
                  width: "auto",
                  height: "auto",
                  display: "block",
                }}
              />
            </div>
          ) : (
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 500,
                fontSize: "clamp(24px, 3vw, 44px)",
                lineHeight: 0.9,
                letterSpacing: "-0.05em",
                color: INK,
                opacity: 0.95,
                flexShrink: 0,
              }}
            >
              {next.name}
            </span>
          )}
        </div>
      </Link>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page template
// ─────────────────────────────────────────────────────────────────────────────
export default function CaseStudy({ data }: { data: CaseStudyData }) {
  const [entered, setEntered] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    // Case studies inherit the shared --bleed (mouthwash gutter) via the <main> below.
    <div className="bleed-root" style={{ backgroundColor: "#ffffff", minHeight: "100vh", display: "flex", flexDirection: "column" } as React.CSSProperties}>
      {/* Structured data: breadcrumb trail + the case study as a CreativeWork. */}
      {pathname && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudyJsonLd(data, pathname)) }}
        />
      )}
      {/* Nav is outside the entrance animation — stays fixed/visible immediately */}
      <NavMenu
        breadcrumb={[
          { label: "Work", href: "/" },
          ...(data.section ? [data.section] : []),
          { label: data.breadcrumb },
        ]}
      />
      {/* Animated content wrapper — nav stays above this */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          opacity: entered ? 1 : 0,
          filter: entered ? "blur(0px)" : "blur(10px)",
          transition: "opacity 0.9s cubic-bezier(0.22, 0.61, 0.36, 1), filter 0.9s cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      >
        <main className="w-full px-4 md:px-8 lg:px-[var(--bleed)]" style={{ flex: 1, display: "flex", flexDirection: "column" }}>

          {/* ── Hero: title, then intro copy + meta stacked beneath (Figma layout) ─ */}
          <div style={{ paddingTop: "clamp(48px, 6vw, 80px)", display: "flex", flexDirection: "column", gap: "clamp(20px, 2vw, 24px)" }}>
            <h1 style={{ ...T.h1, margin: 0, whiteSpace: "pre-line", maxWidth: 930 }}>{data.title}</h1>
            {(data.description || (data.meta && data.meta.length > 0)) && (
              <div className="cs-hero-aside" style={{ display: "flex", flexDirection: "column", gap: "clamp(28px, 3vw, 40px)", maxWidth: "min(50%, 46rem)" }}>
                {data.description && <p style={{ ...T.body, margin: 0 }}>{data.description}</p>}
                {data.meta && data.meta.length > 0 && (
                  <dl style={{ margin: 0, display: "flex", flexDirection: "column", gap: "clamp(12px, 1.3vw, 16px)" }}>
                    {data.meta.map((m) => (
                      <div key={m.label}>
                        <dt style={{ ...T.label, margin: 0 }}>{m.label}</dt>
                        <dd style={{ ...T.value, margin: 0 }}>{m.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            )}
          </div>

          {/* ── Hero image (full-width) ────────────────────────────────────────── */}
          <div style={{ marginTop: HERO_GAP }}>
            <Cell image={{ ...data.hero, priority: true }} aspect="1241 / 760" sizes="100vw" />
          </div>

          {/* ── Content sections ───────────────────────────────────────────────── */}
          {data.sections.map((s, i) => (
            <Section key={i} section={s} />
          ))}

        </main>

        {/* ── Next project — full-bleed, outside padded main ─────────────────── */}
        <NextProject projects={data.projects} />

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <div className="px-4 md:px-8 lg:px-[var(--bleed)]" style={{ marginTop: SECTION_GAP, paddingBottom: 20 }}>
          <FooterBanner />
        </div>

      </div>
    </div>
  );
}
