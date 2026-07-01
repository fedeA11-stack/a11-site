import CaseStudy, { type CaseStudyData } from "../../CaseStudy";
import { buildCaseMetadata } from "../../seo";
import { ALL_PROJECTS } from "../../caseProjects";

import heroImg from "../../../public/assets/world-money/wm-hero.jpg";
import wmAvatar from "../../../public/assets/world-money/Patrick.jpg";
import s1a from "../../../public/assets/world-money/wm-1-1.jpg";
import s1b from "../../../public/assets/world-money/wm-1-2.jpg";
import s1c from "../../../public/assets/world-money/wm-1-3.jpg";
import s1e from "../../../public/assets/world-money/wm-1-5.jpg";
import s2b from "../../../public/assets/world-money/wm-2-2.jpg";
import s2d from "../../../public/assets/world-money/wm-2-4.jpg";
import s2e from "../../../public/assets/world-money/wm-2-5.jpg";
import s4b from "../../../public/assets/world-money/wm-4-2.jpg";
import s4c from "../../../public/assets/world-money/wm-4-3.jpg";
import s4d from "../../../public/assets/world-money/wm-4-4.jpg";
import s4e from "../../../public/assets/world-money/wm-4-5.jpg";
import s4f from "../../../public/assets/world-money/wm-4-6.jpg";

// ─────────────────────────────────────────────────────────────────────────────
// World App — case study (Figma frame 1871:12124) rendered through the
// canonical case-study template. Tile grid + aspect ratios mirror the Figma
// `img` frames; the media grid uses Figma's actual full/duo layout, plus a
// stats row after the hero and a left-aligned testimonial mid-page.
// ─────────────────────────────────────────────────────────────────────────────
const BG = "#F0EBE5";

export const data: CaseStudyData = {
  breadcrumb: "World App",
  section: { label: "World", href: "/world" },
  title: "Designing no.1\nwallet in the world",
  description:
    "World App was designed to help millions of people receive, manage, and use digital assets through a simple experience, even if they had never made a crypto transaction before.",
  hero: { src: heroImg, alt: "World App wallet", bg: BG },
  sections: [
    // Stats row (Figma y1462)
    {
      stats: [
        { value: "39M+", label: "World App users" },
        { value: "18M+", label: "Verified humans" },
        { value: "191", label: "Countries" },
      ],
    },
    // wallet designed for everyone (y1962)
    {
      title: "Wallet designed\nfor everyone",
      body: "For many people entering World App was their first experience with digital assets. They were not thinking about networks or blockchain infrastructure; they simply needed to understand what they owned, how to receive it, and how to use it safely.",
      media: [
        { kind: "duo", aspect: "553 / 900", images: [
          { src: s1a, alt: "World App wallet home", bg: BG },
          { src: s1b, alt: "World App balance overview", bg: BG },
        ] },
        { kind: "full", aspect: "1116 / 750", image: { src: s1c, alt: "World App cash balances", bg: BG } },
        { kind: "duo", aspect: "553 / 550", images: [
          { src: "/assets/world-money/REF3_V1.mp4", alt: "World App asset detail", video: true, bg: BG },
          { src: s1e, alt: "World App receive flow", bg: BG },
        ] },
      ],
    },
    // Centered testimonial (Figma y4571 — centered quote)
    {
      quote: {
        text: "“This is exactly what we needed, a wallet experience that made crypto feel simple, familiar, and safe.”",
        author: "Patrick Traughber",
        role: "Head of Finance Products",
        avatar: wmAvatar,
        align: "center",
      },
    },
    // New financial rails / Familiar actions (y5279)
    {
      title: "New financial rails,\nfamiliar actions",
      body: "The experience was built around actions people already understand. The complexity of crypto infrastructure stayed in the background, while the interface focused on clarity and control.",
      media: [
        { kind: "duo", aspect: "553 / 900", images: [
          { src: s2b, alt: "World App transaction detail", bg: BG },
          { src: "/assets/world-money/WorldMoneyP2P_1.mp4", alt: "World App P2P payment", video: true, bg: BG },
        ] },
        { kind: "full", aspect: "1116 / 750", image: { src: "/assets/world-money/REF4_updated.mp4", alt: "World App invest overview", video: true, bg: BG } },
        { kind: "duo", aspect: "553 / 600", images: [
          { src: s2d, alt: "World App activity history", bg: BG },
          { src: s2e, alt: "World App confirmation", bg: BG },
        ] },
      ],
    },
    // Helping users understand the value (y9977)
    {
      title: "Helping users\nunderstand the value",
      body: "Grants introduced a new concept for many users. We translated abstract ideas like airdrops, claims, and ownership into familiar visual metaphors, using everyday objects to help people understand the value.",
      media: [
        { kind: "full", aspect: "1116 / 750", image: { src: "/assets/world-money/REF5.0fe9dda2.mp4", alt: "World App grants intro", video: true, bg: BG } },
        { kind: "full", aspect: "1116 / 750", image: { src: s4b, alt: "World App claim flow", bg: BG } },
        { kind: "full", aspect: "1116 / 750", image: { src: s4c, alt: "World App grant visual metaphor", bg: BG } },
        { kind: "duo", aspect: "553 / 600", images: [
          { src: s4d, alt: "World App ownership detail", bg: BG },
          { src: s4e, alt: "World App grant value", bg: BG },
        ] },
        { kind: "full", aspect: "1116 / 750", image: { src: s4f, alt: "World App grant overview", bg: BG } },
      ],
    },
  ],
  projects: ALL_PROJECTS,
};

export const metadata = buildCaseMetadata(data, "/world/app");

export default function WorldMoneyPage() {
  return <CaseStudy data={data} />;
}
