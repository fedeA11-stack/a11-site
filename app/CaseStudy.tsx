"use client";

import React from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, useInView } from "framer-motion";
import NavMenu from "./NavMenu";
import FooterBanner from "./FooterBanner";
import CoverImage from "./CoverImage";
import PhoneVideo from "./world/chat/PhoneVideo";
import WordReveal from "./WordReveal";
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
  /** Preview image revealed on hover. */
  preview?: StaticImageData | string;
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
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video src={inView ? (image.src as string) : undefined} autoPlay loop muted playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
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
    return <Cell image={media.image} aspect={media.aspect ?? "1241 / 760"} sizes="100vw" />;
  }

  if (media.kind === "duo") {
    const cols = media.columns ?? "1fr 1fr";
    return (
      <div className="cs-media-grid" style={{ display: "grid", gridTemplateColumns: cols, gap: CELL_GAP, alignItems: "start" }}>
        {media.images.map((img, i) => (
          <Cell key={i} image={img} aspect={media.aspects?.[i] ?? media.aspect ?? "615 / 612"} sizes="(max-width: 768px) 100vw, 50vw" />
        ))}
      </div>
    );
  }

  // tallDuo — tall tile + two stacked tiles. stackFirst swaps column order.
  const cols = media.columns ?? "1fr 1fr";
  const tallCol = <Cell image={media.tall} aspect={media.tallAspect ?? "615 / 1038"} sizes="(max-width: 768px) 100vw, 50vw" phone={media.tall.video} />;
  const stackCol = (
    <div style={{ display: "flex", flexDirection: "column", gap: CELL_GAP }}>
      {media.stack.map((img, i) => (
        <Cell key={i} image={img} aspect={media.stackAspects?.[i] ?? media.stackAspect ?? "615 / 513"} sizes="(max-width: 768px) 100vw, 50vw" />
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
  const [display, setDisplay] = useState("0");
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
    if (!visible) return;
    // Parse number + suffix: "45M+" → [45, "M+"], "2M+" → [2, "M+"]
    const match = value.match(/^([\d.]+)(.*)$/);
    if (!match) { setDisplay(value); return; }
    const target = parseFloat(match[1]);
    const suffix = match[2];
    const duration = 1200;
    const start = performance.now() + delay;
    let raf: number;
    function tick(now: number) {
      const t = Math.max(0, Math.min(1, (now - start) / duration));
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const current = Math.round(eased * target);
      setDisplay(`${current}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, value, delay]);

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
function Section({ section }: { section: CSSection }) {
  const hasHeader = section.title || section.body;
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
        // Left-aligned stats row, capped at ~1025px; number→label gap 16px.
        <div className="cs-stats" style={{ display: "grid", gridTemplateColumns: `repeat(${section.stats.length}, 1fr)`, width: "100%", maxWidth: 1025, margin: 0 }}>
          {section.stats.map((s, i) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16, textAlign: "left", borderLeft: i > 0 ? `1px solid ${HAIRLINE}` : "none", paddingLeft: i > 0 ? 32 : 0 }}>
              <StatNumber value={s.value} delay={i * 120} />
              <span style={{ ...T.label, margin: 0 }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Figma: full-width hairline separating the stats row from the next section. */}
      {section.stats && section.stats.length > 0 && (
        <div style={{ height: 1, background: HAIRLINE, width: "100%" }} />
      )}

      {section.quote && (() => {
        const q = section.quote;
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
// All projects — editorial list with a hover preview that follows the cursor
// (flabbergast.agency style): the image eases toward the pointer and scales in.
// ─────────────────────────────────────────────────────────────────────────────
function AllProjects({ projects }: { projects: CSProject[] }) {
  const pathname = usePathname();

  // Exclude the current page, then show the 4 that follow it (wrapping around).
  // Deterministic rotation → each page shows a different set, no hydration drift.
  const shown = (() => {
    const idx = projects.findIndex((p) => p.href === pathname);
    const ordered = idx === -1 ? projects : [...projects.slice(idx + 1), ...projects.slice(0, idx)];
    return ordered.slice(0, 3);
  })();

  const [hovered, setHovered] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef   = useRef<HTMLDivElement>(null);
  // Y: lerps to hovered row centre. X: subtle parallax offset from mouse.
  const posY         = useRef(0);
  const posX         = useRef(0);
  const targetY      = useRef(0);
  const targetX      = useRef(0);
  const rafRef       = useRef<number | null>(null);
  const lastIndex    = useRef(0);
  const rowRefs      = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const LERP = 0.1;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    function tick() {
      posY.current = lerp(posY.current, targetY.current, LERP);
      posX.current = lerp(posX.current, targetX.current, LERP);
      el!.style.transform = `translate(${posX.current}px, ${posY.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, []);

  function onRowEnter(i: number) {
    lastIndex.current = i;
    setHovered(i);
    const container = containerRef.current;
    const row = rowRefs.current[i];
    if (container && row) {
      const cRect = container.getBoundingClientRect();
      const rRect = row.getBoundingClientRect();
      const el = previewRef.current;
      const halfH = el ? el.offsetHeight / 2 : 0;
      targetY.current = rRect.top - cRect.top + rRect.height / 2 - halfH;
    }
  }

  function onMove(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Normalise mouse to [-1, 1] within the container, apply ±20px nudge
    const nx = (e.clientX - rect.left) / rect.width * 2 - 1;
    const ny = (e.clientY - rect.top)  / rect.height * 2 - 1;
    targetX.current = nx * 40;
    // Y nudge is additive on top of the row-snap target — update targetY directly
    const container = containerRef.current;
    const row = rowRefs.current[lastIndex.current];
    if (container && row) {
      const cRect = container.getBoundingClientRect();
      const rRect = row.getBoundingClientRect();
      const el = previewRef.current;
      const halfH = el ? el.offsetHeight / 2 : 0;
      const baseY = rRect.top - cRect.top + rRect.height / 2 - halfH;
      targetY.current = baseY + ny * 40;
    }
  }

  const active = hovered !== null && !!shown[hovered]?.preview;
  const displayIndex = hovered ?? lastIndex.current;
  const preview = shown[displayIndex]?.preview;

  return (
    <section style={{ marginTop: SECTION_GAP, position: "relative" }}>
      {/* Figma: All projects title 64px / lh 1.1 */}
      <h2 style={{ ...T.h1, fontSize: "clamp(40px, 5.15vw, 64px)", lineHeight: 1.1, margin: 0 }}>All projects</h2>

      <div ref={containerRef} onMouseMove={onMove} style={{ marginTop: "clamp(56px, 6.5vw, 100px)", position: "relative" }}>
        {/* Fixed right-zone preview — sits at ~55% from left, Y lerps to hovered row centre */}
        <div
          ref={previewRef}
          aria-hidden
          className="cs-allprojects-preview"
          style={{
            position: "absolute",
            left: "55%",
            top: 0,
            width: "clamp(280px, 28vw, 420px)",
            pointerEvents: "none",
            opacity: active ? 1 : 0,
            scale: active ? "1" : "0.9",
            transition: "opacity 0.35s cubic-bezier(0.22, 0.61, 0.36, 1), scale 0.35s cubic-bezier(0.22, 0.61, 0.36, 1)",
            zIndex: 3,
            willChange: "transform",
          }}
        >
          {/* Photos already include the correct shape — show them whole, no crop/clip. */}
          {preview && (
            typeof preview === "string" ? (
              <Image src={preview} alt="" width={0} height={0} sizes="460px" unoptimized style={{ width: "100%", height: "auto", display: "block" }} />
            ) : (
              <Image src={preview as StaticImageData} alt="" sizes="460px" style={{ width: "100%", height: "auto", display: "block" }} />
            )
          )}
        </div>

        {shown.map((p, i) => {
          // Figma: idle all dark; on hover the hovered row stays dark and its
          // bottom line becomes 2px solid black, the rest fade to muted (#989190)
          // with faint 1px rgba(0,0,0,0.1) lines. Dividers sit between rows only.
          const dimmed = hovered !== null && hovered !== i;
          const isLast = i === shown.length - 1;
          // Bottom line of row i turns dark when row i OR row i+1 is hovered
          const lineActive = hovered === i || hovered === i + 1;
          const border = `1px solid ${lineActive ? "rgba(0,0,0,1)" : "rgba(0,0,0,0.1)"}`;
          const row = (
            <div
              ref={el => { rowRefs.current[i] = el; }}
              onMouseEnter={() => onRowEnter(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                gap: "clamp(16px, 1.8vw, 24px)",
                padding: "clamp(20px, 2.5vw, 40px) 0",
                borderBottom: border,
                fontFamily: FONT,
                fontWeight: 500,
                fontSize: "clamp(28px, 3.5vw, 44px)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: dimmed ? MUTED : INK,
                transition: "color 0.3s cubic-bezier(0.22, 0.61, 0.36, 1), border-color 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)",
              }}
            >
              <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontWeight: 600, letterSpacing: 0, minWidth: "2.2ch", color: dimmed ? MUTED : INK, flexShrink: 0 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{p.name}</span>
            </div>
          );
          return p.href ? (
            <Link key={p.name} href={p.href} style={{ textDecoration: "none", display: "block" }}>
              {row}
            </Link>
          ) : (
            <div key={p.name}>{row}</div>
          );
        })}
      </div>
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

          {/* ── All projects ───────────────────────────────────────────────────── */}
          <AllProjects projects={data.projects} />

          {/* ── Footer ─────────────────────────────────────────────────────────── */}
          <div style={{ marginTop: SECTION_GAP }}>
            <FooterBanner />
          </div>

        </main>
      </div>
    </div>
  );
}
