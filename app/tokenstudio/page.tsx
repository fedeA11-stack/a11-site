import CaseStudy, { type CaseStudyData } from "../CaseStudy";
import { ALL_PROJECTS } from "../caseProjects";

import heroImg from "../../public/assets/tokenstudio/ts-hero.jpg";
import tsAvatar from "../../public/assets/tokenstudio/ts-avatar.png";
import s1a from "../../public/assets/tokenstudio/ts-1-1.jpg";
import s1b from "../../public/assets/tokenstudio/ts-1-2.jpg";
import s1c from "../../public/assets/tokenstudio/ts-1-3.jpg";
import s2a from "../../public/assets/tokenstudio/ts-2-1.jpg";
import s2b from "../../public/assets/tokenstudio/ts-2-2.jpg";
import s2c from "../../public/assets/tokenstudio/ts-2-3.jpg";
import s3a from "../../public/assets/tokenstudio/ts-3-1.jpg";
import s3b from "../../public/assets/tokenstudio/ts-3-2.jpg";
import s3c from "../../public/assets/tokenstudio/ts-3-3.jpg";
import s4a from "../../public/assets/tokenstudio/ts-4-1.jpg";
import s4b from "../../public/assets/tokenstudio/ts-4-2.jpg";
import s4c from "../../public/assets/tokenstudio/ts-4-3.jpg";

// ─────────────────────────────────────────────────────────────────────────────
// TokenStudio — case study rendered through the canonical case-study template.
// Figma root frame 1871:36829. Every image tile is re-exported from its Figma
// "img" frame; the grid mirrors Figma's real tile layout (full + side-by-side
// duos). Aspect ratios are the exact Figma frame dimensions.
// ─────────────────────────────────────────────────────────────────────────────
const data: CaseStudyData = {
  breadcrumb: "TokenStudio",
  title: "Invest Across\nReal-World Assets",
  description:
    "Tokenization turns illiquid real-world assets into tradeable digital ownership. We designed the experience that lets anyone invest in property, art, or infrastructure and move value the way the internet moves data.",
  hero: { src: heroImg, alt: "TokenStudio — invest across real-world assets", bg: "#F0EBE5" },
  sections: [
    {
      stats: [
        { value: "18M+", label: "Verified users" },
        { value: "3700", label: "Active operators" },
        { value: "160+", label: "Countries covered" },
      ],
    },
    {
      title: "real-world assets\nReimagined",
      body: "As investing continues to evolve, the platform bridges traditional opportunities with digital ownership, creating a more accessible and connected investment experience.",
      media: [
        { kind: "full", aspect: "1076 / 723", image: { src: s1a, alt: "TokenStudio investment dashboard", bg: "#F0EBE5" } },
        { kind: "duo", aspect: "533 / 530", images: [
          { src: s1b, alt: "TokenStudio asset card — Ferrari 488 Spider", bg: "#F0EBE5" },
          { src: s1c, alt: "TokenStudio asset card", bg: "#F0EBE5" },
        ] },
      ],
    },
    {
      quote: {
        text: "“Tokenization platforms usually feel like back-office software. This one feels like something people actually want to use.”",
        author: "Derek Boirun",
        role: "CEO of Realio",
        avatar: tsAvatar,
      },
    },
    {
      title: "Owning a piece\nin minutes",
      body: "Behind every real investment sits real regulation — disclosures, agreements, eligibility checks. We turned them into one guided path that speaks plain English.",
      media: [
        { kind: "full", aspect: "1078 / 720", image: { src: s2a, alt: "TokenStudio guided investment flow", bg: "#F0EBE5" } },
        { kind: "duo", aspect: "533 / 530", images: [
          { src: s2b, alt: "TokenStudio eligibility check", bg: "#F0EBE5" },
          { src: s2c, alt: "TokenStudio disclosures and agreements", bg: "#F0EBE5" },
        ] },
      ],
    },
    {
      title: "Ownership you\ncan trade",
      body: "A tokenized building shouldn't be harder to sell than it was to buy. Every project carries its own market — individual units listed with real prices, available or sold at a glance.",
      media: [
        { kind: "full", aspect: "1078 / 720", image: { src: s3a, alt: "TokenStudio project marketplace and listings", bg: "#F0EBE5" } },
        { kind: "duo", aspect: "533 / 530", images: [
          { src: s3b, alt: "TokenStudio unit listing", bg: "#F0EBE5" },
          { src: s3c, alt: "TokenStudio order book", bg: "#F0EBE5" },
        ] },
      ],
    },
    {
      title: "Ownership Beyond\nThe Transaction",
      body: "Investing is only one part of the journey. The platform was designed to support the complete lifecycle of digital ownership, from investor management and liquidity to reporting and ongoing asset operations.",
      media: [
        { kind: "full", aspect: "1078 / 720", image: { src: s4a, alt: "TokenStudio investor management and reporting", bg: "#F0EBE5" } },
        { kind: "duo", aspect: "533 / 623", images: [
          { src: s4b, alt: "TokenStudio asset operations", bg: "#F0EBE5" },
          { src: s4c, alt: "TokenStudio reporting and liquidity", bg: "#F0EBE5" },
        ] },
      ],
    },
  ],
  projects: ALL_PROJECTS,
};

export default function TokenStudioPage() {
  return <CaseStudy data={data} />;
}
