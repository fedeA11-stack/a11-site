"use client";

import { type StaticImageData } from "next/image";
import Link from "next/link";
import { useState } from "react";
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
const RADIUS = "clamp(8px, 0.94vw, 13.5px)";
const CELL_GAP = "clamp(8px, 0.73vw, 11px)";

const T = {
  h1: { fontFamily: FONT, fontWeight: 500, fontSize: "clamp(34px, 3.9vw, 56px)", lineHeight: 0.95, letterSpacing: "-0.03em", color: INK },
  h2: { fontFamily: FONT, fontWeight: 500, fontSize: "clamp(30px, 3.4vw, 44px)", lineHeight: 0.96, letterSpacing: "-0.02em", color: INK },
  body: { fontFamily: FONT, fontWeight: 400, fontSize: "clamp(15px, 1.4vw, 18px)", lineHeight: 1.3, letterSpacing: "-0.02em", color: INK },
  label: { fontFamily: FONT, fontWeight: 400, fontSize: "clamp(14px, 1.1vw, 16px)", lineHeight: 1.4, color: MUTED },
  value: { fontFamily: FONT, fontWeight: 400, fontSize: "clamp(15px, 1.4vw, 18px)", lineHeight: 1.4, color: VALUE },
};

// Vertical rhythm
const SECTION_GAP = "clamp(80px, 9vw, 140px)";
const HERO_GAP = "clamp(48px, 5.3vw, 80px)";
const HEADER_GAP = "clamp(40px, 5.3vw, 80px)";

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
        // Figma stacks the heading over its copy in one left column (gap 24).
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(16px, 1.6vw, 24px)" }}>
          {section.title && <h2 style={{ ...T.h2, margin: 0, whiteSpace: "pre-line", maxWidth: 930 }}>{section.title}</h2>}
          {section.body && <p style={{ ...T.body, margin: 0, maxWidth: 627 }}>{section.body}</p>}
        </div>
      )}

      {section.stats && section.stats.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${section.stats.length}, 1fr)` }}>
          {section.stats.map((s, i) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center", borderLeft: i > 0 ? `1px solid ${HAIRLINE}` : "none" }}>
              <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: "clamp(48px, 6.5vw, 88px)", lineHeight: 0.95, letterSpacing: "-0.03em", color: INK }}>{s.value}</span>
              <span style={{ ...T.label, margin: 0 }}>{s.label}</span>
            </div>
          ))}
        </div>
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
          <blockquote style={{ margin: 0, padding: "clamp(40px, 5vw, 72px) 0", borderTop: `1px solid ${HAIRLINE}`, borderBottom: `1px solid ${HAIRLINE}`, display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(28px, 3vw, 40px)", textAlign: "center" }}>
            <p style={{ ...T.h2, margin: 0, maxWidth: 900, fontWeight: 400, textTransform: "capitalize" }}>{q.text}</p>
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
// All projects — editorial list with a hover preview that fades in on the right
// ─────────────────────────────────────────────────────────────────────────────
function AllProjects({ projects }: { projects: CSProject[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section style={{ marginTop: SECTION_GAP, position: "relative" }}>
      <h2 style={{ ...T.h1, margin: 0 }}>All projects</h2>

      <div style={{ marginTop: "clamp(40px, 5.3vw, 80px)", borderTop: `1px solid ${HAIRLINE}`, position: "relative" }}>
        {/* Hover preview — anchored to the right of the list */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: "clamp(220px, 28vw, 360px)",
            aspectRatio: "4 / 3",
            borderRadius: RADIUS,
            overflow: "hidden",
            pointerEvents: "none",
            opacity: hovered !== null && projects[hovered]?.preview ? 1 : 0,
            transition: "opacity 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)",
            zIndex: 1,
          }}
        >
          {hovered !== null && projects[hovered]?.preview && (
            typeof projects[hovered].preview === "string" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={projects[hovered].preview as string} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <CoverImage src={projects[hovered].preview as StaticImageData} alt="" sizes="360px" />
            )
          )}
        </div>

        {projects.map((p, i) => {
          const active = hovered === i;
          const row = (
            <div
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                padding: "clamp(16px, 1.6vw, 24px) 0",
                borderBottom: `1px solid ${HAIRLINE}`,
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: "clamp(18px, 1.9vw, 24px)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: active ? INK : MUTED,
                transition: "color 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)",
              }}
            >
              {p.name}
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
        <div style={{ paddingTop: "clamp(40px, 6vw, 100px)", display: "flex", flexDirection: "column", gap: "clamp(24px, 2.2vw, 32px)" }}>
          <h1 style={{ ...T.h1, margin: 0, whiteSpace: "pre-line", maxWidth: 930 }}>{data.title}</h1>
          {(data.description || (data.meta && data.meta.length > 0)) && (
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(28px, 3vw, 40px)", maxWidth: 627 }}>
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
