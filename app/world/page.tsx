"use client";

import { type StaticImageData } from "next/image";
import Link from "next/link";
import NavMenu from "../NavMenu";
import CoverImage from "../CoverImage";

// Default (context) photos — visible at rest.
import worldMoneyCover from "../../public/assets/world/case/world-money-cover.jpg";
import worldIdCover from "../../public/assets/world/case/world-id-cover.jpg";
import worldChatCover from "../../public/assets/world/case/world-chat-cover.jpg";
import worldOrbCover from "../../public/assets/world/case/world-orb-cover.jpg";
// Hover (product) screenshots — cross-faded in on hover.
import worldMoneyApp from "../../public/assets/world/case/world-money.jpg";
import worldIdApp from "../../public/assets/world/case/world-id.jpg";
import worldChatApp from "../../public/assets/world/case/world-chat.jpg";
import worldOrbApp from "../../public/assets/world/case/world-orb.jpg";

// ── Cards — Figma 004_World Story (component sets World *B, Default↔Hover) ────
// Each tile is a two-state component: a context photo + centered glass icon at
// rest, cross-fading to the in-app product screenshot on hover while the icon
// fades and the photo frame eases back (307→287 in Figma). iconScale = icon px
// ÷ 72px badge.
type CaseCard = {
  img: StaticImageData;
  hoverImg: StaticImageData;
  icon: string;
  iconScale: number;
  title: string;
  sub: string;
  href?: string;
};

const CARDS: CaseCard[] = [
  { img: worldMoneyCover, hoverImg: worldMoneyApp, icon: "/assets/world/case/world-money-icon.svg", iconScale: 0.5625, title: "World App",  sub: "Manage your investments",   href: "/world/money" },
  { img: worldIdCover,    hoverImg: worldIdApp,    icon: "/assets/world/case/world-id-icon.svg",    iconScale: 0.5625, title: "World ID",   sub: "Prove you’re a real human", href: undefined      },
  { img: worldChatCover,  hoverImg: worldChatApp,  icon: "/assets/world/case/world-chat-icon.svg",  iconScale: 0.5625, title: "World Chat", sub: "Chat with real humans",      href: "/world/chat"  },
  { img: worldOrbCover,   hoverImg: worldOrbApp,   icon: "/assets/world/case/world-orb-icon.svg",   iconScale: 0.6667, title: "Orb App",    sub: "Manage your Orb operations", href: undefined      },
];

const INK = "#282328";
const SIZES = "(max-width: 520px) 100vw, (max-width: 880px) 50vw, 320px";

// ── Card ───────────────────────────────────────────────────────────────────
function Card({ card, priority }: { card: CaseCard; priority?: boolean }) {
  const media = (
    <div className="wcs-tile" style={{ position: "relative", width: "100%", aspectRatio: "1 / 1" }}>
      {/* Photo frame — eases back on hover, revealing a hairline of page behind */}
      <div className="wcs-frame">
        <CoverImage src={card.img} alt={card.title} sizes={SIZES} priority={priority} className="wcs-base" />
        <CoverImage src={card.hoverImg} alt="" sizes={SIZES} className="wcs-hover" />
      </div>

      {/* Centered glass icon badge — fades out on hover */}
      <div className="wcs-icon">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={card.icon} alt="" aria-hidden style={{ width: `${card.iconScale * 100}%`, height: `${card.iconScale * 100}%`, display: "block" }} />
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {card.href ? (
        <Link href={card.href} style={{ display: "block" }} aria-label={card.title}>
          {media}
        </Link>
      ) : (
        media
      )}

      {/* Label — title (Medium 16) + subtitle (Regular 14), 2px gap, both INK */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 14 }}>
        <span style={{ fontFamily: "var(--font-system), sans-serif", fontWeight: 500, fontSize: 16, lineHeight: 1.2, letterSpacing: "-0.02em", color: INK }}>
          {card.title}
        </span>
        <span style={{ fontFamily: "var(--font-system), sans-serif", fontWeight: 400, fontSize: 14, lineHeight: 1.2, color: INK }}>
          {card.sub}
        </span>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function WorldPage() {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <style>{`
        .wcs-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 880px) { .wcs-grid { grid-template-columns: repeat(2, 1fr); row-gap: 28px; } }
        @media (max-width: 520px) { .wcs-grid { grid-template-columns: 1fr; row-gap: 28px; } }

        /* Tile hover: cross-fade context↔product, ease the frame back, drop icon */
        .wcs-frame {
          position: absolute; inset: 0;
          border-radius: 16px; overflow: hidden;
          transform: scale(1); transform-origin: center;
          transition: transform 0.55s cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .wcs-base, .wcs-hover { transition: opacity 0.55s cubic-bezier(0.22, 0.61, 0.36, 1); }
        .wcs-hover { opacity: 0; }
        .wcs-icon {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 23.45%; aspect-ratio: 1 / 1; border-radius: 33.3%;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 13px 47px rgba(0, 0, 0, 0.06);
          display: flex; align-items: center; justify-content: center;
          transition: opacity 0.55s cubic-bezier(0.22, 0.61, 0.36, 1), transform 0.55s cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        /* Hover only on real pointer devices — avoids sticky :hover on tap */
        @media (hover: hover) and (pointer: fine) {
          .wcs-frame { will-change: transform; }
          .wcs-tile:hover .wcs-frame { transform: scale(0.935); }
          .wcs-tile:hover .wcs-base { opacity: 0; }
          .wcs-tile:hover .wcs-hover { opacity: 1; }
          .wcs-tile:hover .wcs-icon { opacity: 0; transform: translate(-50%, calc(-50% + 16px)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .wcs-frame, .wcs-base, .wcs-hover, .wcs-icon { transition: none; }
        }
      `}</style>

      <NavMenu />

      <div className="max-w-[1240px] mx-auto px-4 md:px-8 lg:px-0">
        {/* Headline */}
        <h1
          style={{
            margin: "104px 0 0",
            maxWidth: 616,
            fontFamily: "var(--font-system), sans-serif",
            fontWeight: 500,
            fontSize: "clamp(34px, 3.8vw, 56px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: INK,
          }}
        >
          Five years, nine people,
          <br />
          four apps, number one
          <br />
          crypto wallet.
        </h1>

        {/* Card grid — contained, aligned to the headline (Figma ~5px gaps) */}
        <div className="wcs-grid" style={{ display: "grid", columnGap: 6, margin: "84px 0 0" }}>
          {CARDS.map((c, i) => (
            <Card key={c.title} card={c} priority={i === 0} />
          ))}
        </div>
      </div>

      <div style={{ height: 120 }} aria-hidden />
    </div>
  );
}
