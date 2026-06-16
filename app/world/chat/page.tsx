"use client";

import Link from "next/link";
import NavMenu from "../../NavMenu";
import FooterBanner from "../../FooterBanner";
import PhoneVideo from "./PhoneVideo";

// ─────────────────────────────────────────────────────────────────────────────
// Typography tokens
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  h1: {
    fontFamily: "'System Unlicensed Trial', sans-serif",
    fontWeight: 400,
    fontSize: "clamp(42px, 6.11vw, 88px)",
    lineHeight: 0.96,
    letterSpacing: "-0.02em",
    color: "#282328",
  },
  h2: {
    fontFamily: "'System Unlicensed Trial', sans-serif",
    fontWeight: 400,
    fontSize: "clamp(32px, 3.89vw, 56px)",
    lineHeight: 0.96,
    letterSpacing: "-0.02em",
    color: "#282328",
  },
  body: {
    fontFamily: "'System Unlicensed Trial', sans-serif",
    fontWeight: 400,
    fontSize: "clamp(16px, 1.39vw, 20px)",
    lineHeight: 1.3,
    letterSpacing: "-0.01em",
    color: "#282328",
  },
  label: {
    fontFamily: "'System Unlicensed Trial', sans-serif",
    fontWeight: 400,
    fontSize: "clamp(13px, 1vw, 15px)",
    lineHeight: 1.3,
    color: "rgba(40,35,40,0.4)",
  },
};

const PAD = "0 32px";
const RADIUS = "clamp(8px, 0.94vw, 13.5px)";
const BEIGE = "#F0EBE5";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function Divider() {
  return <div style={{ height: 1, background: "rgba(40,35,40,0.12)", margin: PAD }} />;
}

function SectionHeader({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px, 3.33vw, 48px)", padding: PAD, alignItems: "start" }}>
      <h2 style={{ ...T.h2, margin: 0 }}>{title}</h2>
      <p style={{ ...T.body, margin: 0, maxWidth: 620 }}>{body}</p>
    </div>
  );
}

function FullImage({ src, alt, bg = BEIGE }: { src: string; alt: string; bg?: string }) {
  return (
    <div style={{ padding: PAD }}>
      <div style={{ borderRadius: RADIUS, overflow: "hidden", background: bg, width: "100%", aspectRatio: "1447 / 1009" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    </div>
  );
}

function TwoCol({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(12px, 1.67vw, 24px)", padding: PAD }}>
      {left}
      {right}
    </div>
  );
}

function ImageCell({ src, alt, bg = BEIGE, aspect = "693 / 690" }: { src: string; alt: string; bg?: string; aspect?: string }) {
  return (
    <div style={{ borderRadius: RADIUS, overflow: "hidden", background: bg, aspectRatio: aspect }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function WorldChatPage() {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavMenu />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", gap: "clamp(48px, 5.56vw, 80px)" }}>

        {/* ── Back link ──────────────────────────────────────────────────────── */}
        <div style={{ padding: PAD, paddingTop: "clamp(24px, 2.78vw, 40px)" }}>
          <Link href="/world" style={{ display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none", ...T.label }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M10 3L5 8l5 5" stroke="rgba(40,35,40,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 10 10)" />
            </svg>
            World
          </Link>
        </div>

        {/* ── Hero title ─────────────────────────────────────────────────────── */}
        <div style={{ padding: PAD, display: "flex", flexDirection: "column", gap: "clamp(20px, 2.78vw, 40px)" }}>
          <h1 style={{ ...T.h1, margin: 0, maxWidth: "clamp(480px, 61.3vw, 929px)" }}>
            Built For Humans<br />To Talk To Humans
          </h1>
          <p style={{ ...T.body, margin: 0, maxWidth: "clamp(300px, 43.6vw, 627px)" }}>
            A communication layer designed for a world where being human can no longer be assumed, simple to use, yet grounded in identity, trust, and interaction.
          </p>
        </div>

        {/* ── Hero image ─────────────────────────────────────────────────────── */}
        <FullImage src="/assets/world-chat/chat-main.png" alt="World Chat app — hand holding phone showing chat list" bg="#2A1F17" />

        {/* ── Designing Trust At Scale ────────────────────────────────────────── */}
        <div style={{ padding: PAD, display: "flex", flexDirection: "column", gap: "clamp(16px, 1.67vw, 24px)" }}>
          <h2 style={{
            fontFamily: "'System Unlicensed Trial', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(40px, 4.44vw, 64px)",
            lineHeight: 0.96,
            letterSpacing: "-0.02em",
            color: "#282328",
            margin: 0,
          }}>
            Designing<br />Trust At Scale
          </h2>
          <p style={{
            fontFamily: "'System Unlicensed Trial', sans-serif",
            fontWeight: 450,
            fontSize: "clamp(16px, 1.39vw, 20px)",
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
            color: "#282328",
            margin: 0,
            maxWidth: "50%",
          }}>
            As digital interactions scale globally, communication needs to remain reliable, even when identity isn&apos;t visible. New signals within the conversation make it possible to understand who&apos;s on the other side, without exposing personal information.
          </p>
        </div>

        {/* ── Trust 3-image grid: left tall | right stacked ───────────────────── */}
        <div style={{ padding: PAD, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(12px, 1.67vw, 24px)", alignItems: "stretch" }}>
          {/* Left — full height: phone frame with video */}
          <PhoneVideo
            src="/assets/world-chat/chat-unverified-verified.webm"
            bg={BEIGE}
            radius={RADIUS}
          />
          {/* Right — two stacked images filling the same height as left */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(12px, 1.67vw, 24px)" }}>
            {/* Top: group chat with notification */}
            <div style={{ borderRadius: RADIUS, overflow: "hidden", background: BEIGE, flex: 1 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/world-chat/chat-group.png" alt="Friends group with chat notification"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            {/* Bottom: Joseph Wilson verified human */}
            <div style={{ borderRadius: RADIUS, overflow: "hidden", background: BEIGE, flex: 1 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/world-chat/chat-verified-user.png" alt="Joseph Wilson verified human"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          </div>
        </div>

        <Divider />

        {/* ── Private by Design ───────────────────────────────────────────────── */}
        <SectionHeader
          title="Private by Design"
          body="Conversations are end-to-end encrypted by default, ensuring that only participants can access what's shared. Features like disappearing messages give users control over how long interactions persist, making privacy part of the experience."
        />

        {/* ── Privacy two-col ─────────────────────────────────────────────────── */}
        <TwoCol
          left={
            <div style={{ borderRadius: RADIUS, overflow: "hidden", background: BEIGE, aspectRatio: "693 / 690", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#282328", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M17 11H7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2z" fill="white"/><path d="M8 11V7a4 4 0 118 0v4" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
            </div>
          }
          right={<ImageCell src="/assets/world-chat/chat-verified-user.png" alt="Joseph Wilson verified human profile" aspect="693 / 690" />}
        />

        {/* ── Disappearing messages full ───────────────────────────────────────── */}
        <FullImage src="/assets/world-chat/chat-private.png" alt="Disappearing messages — Elowen chat" bg="#1A1A1A" />

        <Divider />

        {/* ── Value in Conversation ───────────────────────────────────────────── */}
        <SectionHeader
          title="Value in Conversation"
          body="Transactions happen directly within chat, making value feel as simple as sending a message. From everyday use to moments of celebration, value becomes part of the conversation."
        />

        {/* ── Value two-col ───────────────────────────────────────────────────── */}
        <TwoCol
          left={
            <div style={{ borderRadius: RADIUS, overflow: "hidden", background: BEIGE, aspectRatio: "693 / 690", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden" }}>
                <img src="https://flagcdn.com/w160/us.png" alt="US flag" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
          }
          right={<ImageCell src="/assets/world-chat/chat-split.png" alt="Split payment — pizza $80 of $160" aspect="693 / 690" />}
        />

        {/* ── Chat value full ─────────────────────────────────────────────────── */}
        <FullImage src="/assets/world-chat/chat-gift.png" alt="Gift from Tiago — chat gift message" bg={BEIGE} />

        {/* ── Quote ───────────────────────────────────────────────────────────── */}
        <div style={{ padding: PAD }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40, textAlign: "center", padding: "clamp(48px, 5.56vw, 80px) 0", borderTop: "1px solid rgba(40,35,40,0.12)", borderBottom: "1px solid rgba(40,35,40,0.12)" }}>
            <p style={{ ...T.h2, margin: 0, maxWidth: "min(708px, 100%)", fontStyle: "normal" }}>
              &ldquo;This Is Exactly What We Needed, A Wallet Experience That Made Crypto Feel Simple, Familiar, And Safe.&rdquo;
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/world-chat/quote-andy.png" alt="Andy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ textAlign: "left" }}>
                <p style={{ ...T.body, margin: 0, fontWeight: 500 }}>Andy</p>
                <p style={{ ...T.label, margin: 0 }}>Tools for Humanity</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Discover More ───────────────────────────────────────────────────── */}
        <div style={{ padding: PAD, display: "flex", flexDirection: "column", gap: "clamp(24px, 2.78vw, 40px)" }}>
          <h2 style={{ ...T.h2, margin: 0 }}>Discover More</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "clamp(12px, 1.67vw, 24px)" }}>
            {[
              { src: "/assets/world-chat/discover-freehold.png", title: "Freehold", sub: "A non-custodial, multi-chain DeFi wallet app", href: "#" },
              { src: "/assets/world-chat/discover-atlans.png",   title: "Atlans",   sub: "Athletic platform of Discovery and connection", href: "#" },
              { src: "/assets/world-chat/discover-money.png",    title: "World Money", sub: "Helping users understand the value", href: "/world/money" },
            ].map((item) => (
              <Link key={item.title} href={item.href} style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ borderRadius: RADIUS, overflow: "hidden", aspectRatio: "458 / 456", background: BEIGE }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div>
                  <p style={{ ...T.body, margin: "0 0 4px", fontWeight: 500, color: "#282328" }}>{item.title}</p>
                  <p style={{ ...T.label, margin: 0 }}>{item.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────────── */}
        <div style={{ padding: PAD, paddingBottom: "32px" }}>
          <FooterBanner />
        </div>

      </main>
    </div>
  );
}
