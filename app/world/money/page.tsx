"use client";

import Link from "next/link";
import NavMenu from "../../NavMenu";

// ─────────────────────────────────────────────────────────────────────────────
// Shared style helpers
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  /** Section headline — 64px TWK Book */
  h2: {
    fontFamily: "'System Unlicensed Trial', sans-serif",
    fontWeight: 400,
    fontSize: "clamp(36px, 4.44vw, 64px)",
    lineHeight: 0.96,
    letterSpacing: "-0.02em",
    color: "#282328",
    textTransform: "capitalize" as const,
  },
  /** Large display — 88px TWK Book */
  h1: {
    fontFamily: "'System Unlicensed Trial', sans-serif",
    fontWeight: 400,
    fontSize: "clamp(42px, 6.11vw, 88px)",
    lineHeight: 0.96,
    letterSpacing: "-0.02em",
    color: "#282328",
    textTransform: "capitalize" as const,
  },
  /** Body — 20px TWK Regular */
  body: {
    fontFamily: "'System Unlicensed Trial', sans-serif",
    fontWeight: 400,
    fontSize: "clamp(16px, 1.39vw, 20px)",
    lineHeight: 1.3,
    letterSpacing: "-0.02em",
    color: "#282328",
  },
  /** Small label */
  label: {
    fontFamily: "'System Unlicensed Trial', sans-serif",
    fontWeight: 400,
    fontSize: "clamp(14px, 1.11vw, 16px)",
    lineHeight: 1.3,
    letterSpacing: "-0.01em",
    color: "rgba(40,35,40,0.4)",
  },
};

/** Horizontal rule */
function Divider() {
  return <div style={{ height: 1, background: "rgba(40,35,40,0.12)", width: "100%" }} />;
}

/** Two-column section header: big title left, body text right */
function SectionHeader({ title, body }: { title: string; body: string }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "clamp(24px, 3.33vw, 48px)",
        alignItems: "start",
        padding: "0 32px",
      }}
    >
      <h2 style={T.h2}>{title}</h2>
      <p style={{ ...T.body, color: "#282328", maxWidth: 695 }}>{body}</p>
    </div>
  );
}

/** Full-width image block with rounded corners */
function FullImage({
  src, alt, bg = "#F6F3EE", caption,
}: { src: string; alt: string; bg?: string; caption?: string }) {
  return (
    <div style={{ padding: "0 32px" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1448 / 969",
          borderRadius: "clamp(8px, 0.94vw, 13.5px)",
          overflow: "hidden",
          background: bg,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        {caption && (
          <p
            style={{
              ...T.label,
              position: "absolute",
              bottom: 24,
              left: 24,
            }}
          >
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}

/** Two equal-column image blocks */
function TwoColImages({
  left, right,
}: {
  left: { src: string; alt: string; bg?: string };
  right: { src: string; alt: string; bg?: string };
}) {
  const cell = {
    position: "relative" as const,
    width: "100%",
    aspectRatio: "719 / 1211",
    borderRadius: "clamp(8px, 0.94vw, 13.5px)",
    overflow: "hidden" as const,
  };
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "clamp(8px, 0.69vw, 10px)",
        padding: "0 32px",
      }}
    >
      {[left, right].map((img, i) => (
        <div key={i} style={{ ...cell, background: img.bg ?? "#F6F3EE" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.src}
            alt={img.alt}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function WorldMoneyPage() {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <NavMenu />

      {/* ── Back link ──────────────────────────────────────────────────────── */}
      <div style={{ padding: "32px 32px 0" }}>
        <Link
          href="/world"
          style={{
            ...T.label,
            color: "#282328",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="#282328" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          World
        </Link>
      </div>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(40px, 5.56vw, 80px) 32px clamp(32px, 3.33vw, 48px)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(16px, 1.39vw, 20px)",
        }}
      >
        <h1 style={T.h1}>
          Designing no.1<br />
          wallet in the world
        </h1>
        <p style={{ ...T.body, maxWidth: "min(627px, 100%)" }}>
          World Money was designed to help millions of people receive, manage, and use digital
          assets through a simple experience, even if they had never made a crypto transaction before.
        </p>
      </section>

      {/* ── Hero image ─────────────────────────────────────────────────────── */}
      <FullImage src="/assets/world/wm-hero.png" alt="World Money app in use" bg="#282328" />

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(40px, 5.56vw, 80px) 32px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
        }}
      >
        {[
          { value: "45M+", label: "Total Users" },
          { value: "36M+", label: "Monthly Transactions" },
          { value: "2M+", label: "Daily Users" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              textAlign: "center",
              borderLeft: i > 0 ? "1px solid rgba(40,35,40,0.12)" : "none",
            }}
          >
            <span
              style={{
                fontFamily: "'System Unlicensed Trial', sans-serif",
                fontWeight: 400,
                fontSize: "clamp(48px, 6.67vw, 96px)",
                lineHeight: 0.96,
                letterSpacing: "-0.02em",
                color: "#282328",
              }}
            >
              {stat.value}
            </span>
            <span style={T.label}>{stat.label}</span>
          </div>
        ))}
      </section>

      <Divider />

      {/* ── "Wallet designed for everyone" ─────────────────────────────────── */}
      <section style={{ padding: "clamp(40px, 5.56vw, 80px) 32px", display: "flex", flexDirection: "column", gap: "clamp(16px, 1.39vw, 20px)" }}>
        <h2 style={{ ...T.h2, fontSize: "clamp(32px, 4.44vw, 64px)" }}>
          Wallet designed<br />for everyone
        </h2>
        <p style={{ ...T.body, maxWidth: "min(627px, 100%)" }}>
          For many people entering World Money was their first experience with digital assets.
          They were not thinking about networks, or blockchain infrastructure, they simply needed
          to understand what they owned, how to receive it, and how to use it safely.
        </p>
      </section>

      {/* ── Two-col: Home + Earn screens ───────────────────────────────────── */}
      <TwoColImages
        left={{ src: "/assets/world/wm-home-screen.png", alt: "World Money home screen", bg: "#F6F3EE" }}
        right={{ src: "/assets/world/wm-earn-bg.png", alt: "World Money earn screen", bg: "#F3F2F2" }}
      />

      {/* ── Large phone in hand ────────────────────────────────────────────── */}
      <div style={{ paddingTop: "clamp(8px, 0.69vw, 10px)" }}>
        <FullImage src="/assets/world/wm-phone-bg.png" alt="World Money wallet balance detail" bg="#F6F3EE" />
      </div>

      {/* ── Section header: New Financial Rails ───────────────────────────── */}
      <section style={{ padding: "clamp(40px, 5.56vw, 80px) 32px" }}>
        <SectionHeader
          title="New Financial Rails Familiar Actions"
          body="The experience was built around actions people already understand. The complexity of crypto infrastructure stayed in the background, while the interface focused on clarity, confidence, and control."
        />
      </section>

      {/* ── Two-col: Send + Transfer ────────────────────────────────────────── */}
      <TwoColImages
        left={{ src: "/assets/world/wm-starbucks-photo.png", alt: "World Money send screen", bg: "#F6F3EE" }}
        right={{ src: "/assets/world/wm-starbucks-hand.png", alt: "World Money transaction history", bg: "#F3F2F2" }}
      />

      {/* ── Quote ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(48px, 6.67vw, 96px) 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        <blockquote
          style={{
            ...T.h2,
            fontSize: "clamp(20px, 2.22vw, 32px)",
            textAlign: "center",
            maxWidth: "min(741px, 100%)",
            margin: 0,
            fontStyle: "normal",
            textTransform: "none",
          }}
        >
          &ldquo;This is exactly what we needed, a wallet experience that made crypto feel
          simple, familiar, and safe.&rdquo;
        </blockquote>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/world/wm-quote-avatar.png"
            alt="Patrick Traughber"
            style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
          />
          <div>
            <p style={{ ...T.body, fontWeight: 500, margin: 0 }}>Patrick Traughber</p>
            <p style={{ ...T.label, margin: 0 }}>Head of Finance Products</p>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Section header: From Wallet Balance ────────────────────────────── */}
      <section style={{ padding: "clamp(40px, 5.56vw, 80px) 32px" }}>
        <SectionHeader
          title="From Wallet Balance To Real-World Use"
          body="World Card extended the wallet beyond holding and transferring assets, creating a familiar way for people to use their digital assets in everyday purchases. By bringing wallet value into real-world payments."
        />
      </section>

      {/* ── Full-width World Card ───────────────────────────────────────────── */}
      <FullImage
        src="/assets/world/wm-card.png"
        alt="World Card designed by TFH Design Lab"
        bg="#F6F3EE"
        caption="Card designed by TFH Design Lab"
      />

      {/* ── Two-col: Starbucks real-world payment ──────────────────────────── */}
      <div style={{ paddingTop: "clamp(8px, 0.69vw, 10px)" }}>
        <TwoColImages
          left={{ src: "/assets/world/wm-full-1.png", alt: "World Money card real-world use", bg: "#F6F3EE" }}
          right={{ src: "/assets/world/wm-full-2.png", alt: "World Money payment detail", bg: "#F6F3EE" }}
        />
      </div>

      {/* ── Section header: Helping users understand the value ─────────────── */}
      <section style={{ padding: "clamp(40px, 5.56vw, 80px) 32px" }}>
        <SectionHeader
          title="Helping Users Understand The Value"
          body="Grants introduced a new concept for many users. We translated abstract ideas like airdrops, claims, and ownership into familiar visual metaphors, using everyday objects to help people understand the value."
        />
      </section>

      {/* ── Coin section ────────────────────────────────────────────────────── */}
      <FullImage src="/assets/world/wm-coin.png" alt="World coin — Belongs to every human" bg="#F6F3EE" />

      {/* ── Grants screen phone ─────────────────────────────────────────────── */}
      <div style={{ paddingTop: "clamp(8px, 0.69vw, 10px)" }}>
        <FullImage src="/assets/world/wm-grants-screen.png" alt="World Grants phone screen" bg="#F6F3EE" />
      </div>

      {/* ── Discover More ───────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(48px, 6.67vw, 96px) 32px",
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        <h2 style={T.h2}>Discover more</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(8px, 0.69vw, 10px)",
          }}
        >
          {[
            {
              img: "/assets/world/wm-discover-freehold.png",
              bg: "#1a2e1a",
              name: "Freehold",
              desc: "A non-custodial, multi-chain DeFi wallet app",
              href: "#",
            },
            {
              img: "/assets/world/wm-discover-atlans.png",
              bg: "#c8a96e",
              name: "Atlans",
              desc: "Athletic platform of Discovery and connection",
              href: "#",
            },
            {
              img: null,
              bg: "linear-gradient(180deg, #000 0%, #007bff 100%)",
              name: "World Money",
              desc: "Helping users understand the value",
              href: "/world/money",
            },
          ].map((card) => (
            <div key={card.name} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "476 / 474",
                  borderRadius: "clamp(6px, 0.69vw, 10px)",
                  overflow: "hidden",
                  background: card.bg,
                }}
              >
                {card.img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={card.img}
                    alt={card.name}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
              </div>
              <p
                style={{
                  ...T.body,
                  fontSize: "clamp(16px, 1.67vw, 24px)",
                  margin: 0,
                  textTransform: "capitalize",
                }}
              >
                <strong style={{ fontWeight: 500 }}>{card.name}</strong>
                {" "}
                <span style={{ color: "rgba(40,35,40,0.45)" }}>{card.desc}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dark CTA footer ─────────────────────────────────────────────────── */}
      <section
        data-footer=""
        style={{
          margin: "0 32px 32px",
          background: "#282328",
          borderRadius: "clamp(8px, 0.94vw, 13.5px)",
          padding: "clamp(64px, 8.89vw, 128px) 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'System Unlicensed Trial', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(28px, 4.17vw, 60px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            margin: 0,
            maxWidth: "min(700px, 100%)",
          }}
        >
          If you&apos;re ambitious enough to work with us, we should talk.
        </p>
        <a
          href="mailto:hello@a11studio.com"
          style={{
            display: "inline-block",
            border: "1px solid rgba(255,255,255,0.4)",
            borderRadius: 6,
            padding: "11px 24px",
            fontFamily: "'System Unlicensed Trial', sans-serif",
            fontWeight: 400,
            fontSize: 16,
            lineHeight: 1.3,
            color: "#ffffff",
            textDecoration: "none",
            letterSpacing: "-0.01em",
          }}
        >
          Let&apos;s talk
        </a>
      </section>
    </div>
  );
}
