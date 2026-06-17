"use client";

import { type StaticImageData } from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import NavMenu from "./NavMenu";
import FooterBanner from "./FooterBanner";
import CoverImage from "./CoverImage";
import PhoneVideo from "./world/chat/PhoneVideo";

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
  | { kind: "duo"; images: [CSImage, CSImage]; aspect?: string }
  | { kind: "tallDuo"; tall: CSImage; stack: [CSImage, CSImage]; tallAspect?: string; stackAspect?: string };

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
const MUTED = "#989291";
const VALUE = "#2C2C2C";
const BEIGE = "#F0EBE5";
const HAIRLINE = "rgba(40,35,40,0.12)";
const PROJECT_LINE = "#EFEAE5"; // All-projects row divider (Figma beige hairline)
const RADIUS = "clamp(8px, 0.94vw, 13.5px)";
const CELL_GAP = "clamp(8px, 0.73vw, 11px)";

const T = {
  // Figma: hero title 2 lines in 136px box → ~64px. Section h2 84px box → ~44px.
  h1: { fontFamily: FONT, fontWeight: 500, fontSize: "clamp(40px, 4.8vw, 64px)", lineHeight: 0.98, letterSpacing: "-0.03em", color: INK },
  h2: { fontFamily: FONT, fontWeight: 500, fontSize: "clamp(32px, 3.6vw, 44px)", lineHeight: 0.96, letterSpacing: "-0.02em", color: INK },
  // Figma: body 26px line-box ÷ 1.3 = 20px.
  body: { fontFamily: FONT, fontWeight: 400, fontSize: "clamp(16px, 1.55vw, 20px)", lineHeight: 1.3, letterSpacing: "-0.02em", color: INK },
  label: { fontFamily: FONT, fontWeight: 400, fontSize: "clamp(14px, 1.25vw, 16px)", lineHeight: 1.4, color: MUTED },
  value: { fontFamily: FONT, fontWeight: 400, fontSize: "clamp(16px, 1.55vw, 20px)", lineHeight: 1.4, color: VALUE },
};

// Vertical rhythm (Figma 1512 frame, content 1242px)
//   Between sections / before a divider:        140px
//   Hero block→image, image→stats, stats→rule:   80px
//   Section header→media:                         80px
const SECTION_GAP = "clamp(96px, 10.5vw, 140px)";
const HERO_GAP = "clamp(56px, 6.6vw, 80px)";
const HEADER_GAP = "clamp(56px, 6.6vw, 80px)";

// ─────────────────────────────────────────────────────────────────────────────
// Cell — renders a single image / video / placeholder inside a rounded tile
// ─────────────────────────────────────────────────────────────────────────────
function Cell({ image, aspect, sizes, phone }: { image: CSImage; aspect: string; sizes: string; phone?: boolean }) {
  // Phone-framed looping video (tall hero-style tile).
  if (image.video && phone) {
    return <PhoneVideo src={typeof image.src === "string" ? image.src : ""} bg={image.bg ?? BEIGE} radius={RADIUS} />;
  }

  return (
    <div style={{ position: "relative", borderRadius: RADIUS, overflow: "hidden", background: image.bg ?? BEIGE, aspectRatio: aspect, width: "100%" }}>
      {image.video && image.src ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video src={image.src as string} autoPlay loop muted playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      ) : image.icon === "lock" ? (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "clamp(56px, 7vw, 96px)", aspectRatio: "1", borderRadius: "50%", background: INK, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="40%" height="40%" viewBox="0 0 24 24" fill="none">
              <path d="M17 11H7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2z" fill="white" />
              <path d="M8 11V7a4 4 0 118 0v4" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      ) : image.src == null ? null : typeof image.src === "string" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.src} alt={image.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : (
        <CoverImage src={image.src} alt={image.alt} sizes={sizes} priority={image.priority} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Media block renderers (aspect ratios pulled straight from Figma)
// ─────────────────────────────────────────────────────────────────────────────
function MediaBlock({ media }: { media: CSMedia }) {
  if (media.kind === "full") {
    return <Cell image={media.image} aspect={media.aspect ?? "1241 / 760"} sizes="(max-width: 1280px) 100vw, 1240px" />;
  }

  if (media.kind === "duo") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: CELL_GAP, alignItems: "start" }}>
        {media.images.map((img, i) => (
          <Cell key={i} image={img} aspect={media.aspect ?? "615 / 612"} sizes="(max-width: 768px) 100vw, 50vw" />
        ))}
      </div>
    );
  }

  // tallDuo — left tall tile, right two stacked tiles. Equal column widths make
  // the two right tiles + gap sum to the left tile's height automatically.
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: CELL_GAP, alignItems: "start" }}>
      <Cell image={media.tall} aspect={media.tallAspect ?? "615 / 1038"} sizes="(max-width: 768px) 100vw, 50vw" phone={media.tall.video} />
      <div style={{ display: "flex", flexDirection: "column", gap: CELL_GAP }}>
        {media.stack.map((img, i) => (
          <Cell key={i} image={img} aspect={media.stackAspect ?? "615 / 513"} sizes="(max-width: 768px) 100vw, 50vw" />
        ))}
      </div>
    </div>
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
        // Two-column header — title left (max 30%), body right (max 50%), space between.
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, alignItems: "start" }}>
          {section.title && <h2 style={{ ...T.h2, margin: 0, whiteSpace: "pre-line", maxWidth: "30%" }}>{section.title}</h2>}
          {section.body && <p style={{ ...T.body, margin: 0, maxWidth: "50%" }}>{section.body}</p>}
        </div>
      )}

      {section.stats && section.stats.length > 0 && (
        // Figma: stats row centered at ~1025px (not full-bleed); number→label gap 16px.
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${section.stats.length}, 1fr)`, width: "100%", maxWidth: 1025, margin: "0 auto" }}>
          {section.stats.map((s, i) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center", borderLeft: i > 0 ? `1px solid ${HAIRLINE}` : "none" }}>
              <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: "clamp(52px, 7vw, 96px)", lineHeight: 0.95, letterSpacing: "-0.03em", color: INK }}>{s.value}</span>
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
                {typeof q.avatar === "string" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={q.avatar} alt={q.author ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <CoverImage src={q.avatar} alt={q.author ?? ""} sizes="64px" />
                )}
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
            <p style={{ fontFamily: FONT, fontWeight: 400, fontSize: "clamp(24px, 2.7vw, 36px)", lineHeight: 1.15, letterSpacing: "-0.02em", color: INK, margin: 0, maxWidth: 628 }}>{q.text}</p>
            {attribution}
          </blockquote>
        ) : (
          // Figma: 140px above (section gap), author→divider 140px below.
          <blockquote style={{ margin: 0, padding: `0 0 ${SECTION_GAP}`, borderBottom: `1px solid ${HAIRLINE}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 32, textAlign: "center" }}>
            {/* Figma: 708px-wide centered quote, ~32px, sentence case (no capitalize). */}
            <p style={{ fontFamily: FONT, fontWeight: 500, fontSize: "clamp(24px, 2.6vw, 34px)", lineHeight: 1.2, letterSpacing: "-0.02em", color: INK, margin: 0, maxWidth: 708 }}>{q.text}</p>
            {attribution}
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
    return ordered.slice(0, 4);
  })();

  const [hovered, setHovered] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef   = useRef<HTMLDivElement>(null);
  const posRef       = useRef({ x: 0, y: 0 });   // smoothed (current) position
  const targetRef    = useRef({ x: 0, y: 0 });   // raw pointer (relative to list)
  const rafRef       = useRef<number | null>(null);
  const lastIndex    = useRef(0);                // keep last image during fade-out

  // Lerp the preview toward the pointer every frame → it trails the cursor.
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const LERP = 0.1;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    function tick() {
      posRef.current.x = lerp(posRef.current.x, targetRef.current.x, LERP);
      posRef.current.y = lerp(posRef.current.y, targetRef.current.y, LERP);
      el!.style.transform = `translate3d(${posRef.current.x - el!.offsetWidth / 2}px, ${posRef.current.y - el!.offsetHeight / 2}px, 0)`;
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, []);

  function onMove(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    targetRef.current.x = e.clientX - rect.left;
    targetRef.current.y = e.clientY - rect.top;
  }

  const active = hovered !== null && !!shown[hovered]?.preview;
  const displayIndex = hovered ?? lastIndex.current;
  const preview = shown[displayIndex]?.preview;

  return (
    <section style={{ marginTop: SECTION_GAP, position: "relative" }}>
      <h2 style={{ ...T.h1, margin: 0 }}>All projects</h2>

      {/* Figma: ~80px from title to first row; rows divided by a hairline below each (no top line). */}
      <div ref={containerRef} onMouseMove={onMove} style={{ marginTop: "clamp(32px, 4vw, 48px)", position: "relative" }}>
        {/* Cursor-following preview — eases toward the pointer, scales in on hover */}
        <div
          ref={previewRef}
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "clamp(280px, 30vw, 460px)",
            pointerEvents: "none",
            opacity: active ? 1 : 0,
            scale: active ? "1" : "0.85",
            transition: "opacity 0.4s cubic-bezier(0.22, 0.61, 0.36, 1), scale 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)",
            zIndex: 3,
            willChange: "transform",
          }}
        >
          {/* Photos already include the correct shape — show them whole, no crop/clip. */}
          {preview && (
            typeof preview === "string" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" style={{ width: "100%", height: "auto", display: "block" }} />
            ) : (
              <CoverImage src={preview as StaticImageData} alt="" sizes="460px" />
            )
          )}
        </div>

        {shown.map((p, i) => {
          // Figma: all dark by default; on hover the hovered row stays dark, the
          // rest fade to muted (#989190). Lines: base #EFEAE5; the hovered row is
          // bracketed by INK lines (its own bottom + the one above it).
          const dimmed = hovered !== null && hovered !== i;
          const lineActive = hovered === i || hovered === i + 1;
          const lineColor = hovered === null ? PROJECT_LINE : (lineActive ? INK : PROJECT_LINE);
          const row = (
            <div
              onMouseEnter={() => { lastIndex.current = i; setHovered(i); }}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                padding: "clamp(24px, 2.2vw, 32px) 0",
                borderBottom: `1px solid ${lineColor}`,
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: "clamp(16px, 1.5vw, 20px)",
                lineHeight: 1.4,
                letterSpacing: "-0.02em",
                color: dimmed ? MUTED : INK,
                transition: "color 0.3s cubic-bezier(0.22, 0.61, 0.36, 1), border-color 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)",
              }}
            >
              {/* Figma: number prefix (01–04) at left, name offset to ~56px */}
              <span style={{ width: 56, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
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
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavMenu
        breadcrumb={[
          { label: "Work", href: "/" },
          ...(data.section ? [data.section] : []),
          { label: data.breadcrumb },
        ]}
      />

      <main className="max-w-[1240px] mx-auto px-4 md:px-8 lg:px-0 w-full" style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* ── Hero: title, then intro copy + meta stacked beneath (Figma layout) ─ */}
        {/* Figma: ~80px below the nav; title→description gap = 24px. */}
        <div style={{ paddingTop: "clamp(48px, 6vw, 80px)", display: "flex", flexDirection: "column", gap: "clamp(20px, 2vw, 24px)" }}>
          <h1 style={{ ...T.h1, margin: 0, whiteSpace: "pre-line", maxWidth: 930 }}>{data.title}</h1>
          {(data.description || (data.meta && data.meta.length > 0)) && (
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(28px, 3vw, 40px)", maxWidth: "50%" }}>
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

        {/* ── Hero image ─────────────────────────────────────────────────────── */}
        <div style={{ marginTop: HERO_GAP }}>
          <Cell image={{ ...data.hero, priority: true }} aspect="1241 / 760" sizes="(max-width: 1280px) 100vw, 1240px" />
        </div>

        {/* ── Content sections ───────────────────────────────────────────────── */}
        {data.sections.map((s, i) => (
          <Section key={i} section={s} />
        ))}

        {/* ── All projects ───────────────────────────────────────────────────── */}
        <AllProjects projects={data.projects} />

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <div style={{ marginTop: SECTION_GAP, paddingBottom: 32 }}>
          <FooterBanner />
        </div>

      </main>
    </div>
  );
}
