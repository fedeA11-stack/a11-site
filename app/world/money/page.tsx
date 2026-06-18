import CaseStudy, { type CaseStudyData } from "../../CaseStudy";
import { ALL_PROJECTS } from "../../caseProjects";

import heroImg from "../../../public/assets/world-money/wm-hero.jpg";
import wmAvatar from "../../../public/assets/world-money/Patrick.jpg";
import s1b from "../../../public/assets/world-money/wm-1-2.jpg";
import s1c from "../../../public/assets/world-money/wm-1-3.jpg";
import s1e from "../../../public/assets/world-money/wm-1-5.jpg";
import s2b from "../../../public/assets/world-money/wm-2-2.jpg";
import s2d from "../../../public/assets/world-money/wm-2-4.jpg";
import s2e from "../../../public/assets/world-money/wm-2-5.jpg";
import s3a from "../../../public/assets/world-money/wm-3-1.jpg";
import s3b from "../../../public/assets/world-money/wm-3-2.jpg";
import s3c from "../../../public/assets/world-money/wm-3-3.jpg";
import s4b from "../../../public/assets/world-money/wm-4-2.jpg";
import s4c from "../../../public/assets/world-money/wm-4-3.jpg";
import s4d from "../../../public/assets/world-money/wm-4-4.jpg";
import s4e from "../../../public/assets/world-money/wm-4-5.jpg";
import s4f from "../../../public/assets/world-money/wm-4-6.jpg";

// ─────────────────────────────────────────────────────────────────────────────
// World Money — case study (Figma frame 1871:12124) rendered through the
// canonical case-study template. Tile grid + aspect ratios mirror the Figma
// `img` frames; the media grid uses Figma's actual full/duo layout, plus a
// stats row after the hero and a left-aligned testimonial mid-page.
// ─────────────────────────────────────────────────────────────────────────────
const BG = "#F0EBE5";

const data: CaseStudyData = {
  breadcrumb: "World Money",
  section: { label: "World", href: "/world" },
  title: "Designing no.1\nwallet in the world",
  description:
    "World Money was designed to help millions of people receive, manage, and use digital assets through a simple experience, even if they had never made a crypto transaction before.",
  hero: { src: heroImg, alt: "World Money wallet", bg: BG },
  sections: [
    // Stats row (Figma y1462)
    {
      stats: [
        { value: "45M+", label: "Total users" },
        { value: "36M+", label: "Monthly transactions" },
        { value: "2M+", label: "Daily users" },
      ],
    },
    // wallet designed for everyone (y1962)
    {
      title: "Wallet designed\nfor everyone",
      body: "For many people entering World Money was their first experience with digital assets. They were not thinking about networks, or blockchain infrastructure, they simply needed to understand what they owned, how to receive it, and how to use it safely.",
      media: [
        { kind: "duo", aspect: "553 / 900", images: [
          { src: "/assets/world-money/WorldMoney_Tabs.mp4", alt: "World Money wallet home", video: true, bg: BG },
          { src: s1b, alt: "World Money balance overview", bg: BG },
        ] },
        { kind: "full", aspect: "1116 / 750", image: { src: s1c, alt: "World Money cash balances", bg: BG } },
        { kind: "duo", aspect: "553 / 550", images: [
          { src: "/assets/world-money/REF3_V1.mp4", alt: "World Money asset detail", video: true, bg: BG },
          { src: s1e, alt: "World Money receive flow", bg: BG },
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
      title: "New financial rails\nfamiliar actions",
      body: "The experience was built around actions people already understand. The complexity of crypto infrastructure stayed in the background, while the interface focused on clarity, confidence, and control.",
      media: [
        { kind: "duo", aspect: "553 / 900", images: [
          { src: s2b, alt: "World Money transaction detail", bg: BG },
          { src: "/assets/world-money/WorldMoneyP2P_1.mp4", alt: "World Money P2P payment", video: true, bg: BG },
        ] },
        { kind: "full", aspect: "1116 / 750", image: { src: "/assets/world-money/REF4.mp4", alt: "World Money invest overview", video: true, bg: BG } },
        { kind: "duo", aspect: "553 / 600", images: [
          { src: s2d, alt: "World Money activity history", bg: BG },
          { src: s2e, alt: "World Money confirmation", bg: BG },
        ] },
      ],
    },
    // From wallet balance to real-world use (y7933)
    {
      title: "From wallet balance\nto real-world use",
      body: "World Card extended the wallet beyond holding and transferring assets, creating a familiar way for people to use their digital assets in everyday purchases, bringing wallet value into real-world payments.",
      media: [
        { kind: "full", aspect: "1116 / 750", image: { src: s3a, alt: "World Card", bg: BG } },
        { kind: "duo", aspect: "553 / 900", images: [
          { src: s3b, alt: "World Card in use", bg: BG },
          { src: s3c, alt: "World Card detail", bg: BG },
        ] },
      ],
    },
    // Helping users understand the value (y9977)
    {
      title: "Helping users\nunderstand the value",
      body: "Grants introduced a new concept for many users. We translated abstract ideas like airdrops, claims, and ownership into familiar visual metaphors, using everyday objects to help people understand the value.",
      media: [
        { kind: "full", aspect: "1116 / 750", image: { src: "/assets/world-money/REF5.mp4", alt: "World Money grants intro", video: true, bg: BG } },
        { kind: "full", aspect: "1116 / 750", image: { src: s4b, alt: "World Money claim flow", bg: BG } },
        { kind: "full", aspect: "1116 / 750", image: { src: s4c, alt: "World Money grant visual metaphor", bg: BG } },
        { kind: "duo", aspect: "553 / 600", images: [
          { src: s4d, alt: "World Money ownership detail", bg: BG },
          { src: s4e, alt: "World Money grant value", bg: BG },
        ] },
        { kind: "full", aspect: "1116 / 750", image: { src: s4f, alt: "World Money grant overview", bg: BG } },
      ],
    },
  ],
  projects: ALL_PROJECTS,
};

export default function WorldMoneyPage() {
  return <CaseStudy data={data} />;
}
