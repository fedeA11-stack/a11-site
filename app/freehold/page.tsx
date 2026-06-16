import CaseStudy, { type CaseStudyData } from "../CaseStudy";
import { ALL_PROJECTS } from "../caseProjects";

import heroImg from "../../public/assets/freehold/fh-hero.jpg";
import s1a from "../../public/assets/freehold/fh-1-1.jpg";
import s1b from "../../public/assets/freehold/fh-1-2.jpg";
import s1c from "../../public/assets/freehold/fh-1-3.jpg";
import s2a from "../../public/assets/freehold/fh-2-1.jpg";
import s2b from "../../public/assets/freehold/fh-2-2.jpg";
import s3a from "../../public/assets/freehold/fh-3-1.jpg";
import s3b from "../../public/assets/freehold/fh-3-2.jpg";
import s3c from "../../public/assets/freehold/fh-3-3.jpg";
import s4a from "../../public/assets/freehold/fh-4-1.jpg";
import s4b from "../../public/assets/freehold/fh-4-2.jpg";
import s4c from "../../public/assets/freehold/fh-4-3.jpg";

// ─────────────────────────────────────────────────────────────────────────────
// Freehold — case study rendered through the canonical case-study template.
// No `section` field (not a World product) → breadcrumb reads "Work / Freehold".
// ─────────────────────────────────────────────────────────────────────────────
const data: CaseStudyData = {
  breadcrumb: "Freehold",
  title: "Invest and manage\non the move",
  description:
    "Freehold brings portfolio tracking, staking rewards, and tokenized real-world assets into a single mobile experience. Built for modern investors, it simplifies onchain wealth management without sacrificing transparency or control.",
  hero: { src: heroImg, alt: "Freehold app — invest and manage on the move", bg: "#F0EBE5" },
  sections: [
    {
      title: "Designed for\neveryday investors",
      body: "Managing digital assets often means navigating fragmented tools, technical concepts, and disconnected experiences. The goal was to create an investment platform that feels intuitive from the very first interaction.",
      media: [
        { kind: "full", aspect: "1076 / 900", image: { src: s1a, alt: "Freehold portfolio overview", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1271 / 848", image: { src: s1b, alt: "Freehold asset dashboard", bg: "#F0EBE5" } },
        { kind: "full", aspect: "938 / 662", image: { src: s1c, alt: "Freehold investment detail", bg: "#F0EBE5" } },
      ],
    },
    {
      title: "Control without complexity",
      body: "Taking control of digital assets begins with understanding how to protect them. Recovery and backup flows were designed to guide users through every step with clarity and confidence.",
      media: [
        { kind: "full", aspect: "1076 / 723", image: { src: s2a, alt: "Freehold recovery flow", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1076 / 530", image: { src: s2b, alt: "Freehold backup setup", bg: "#F0EBE5" } },
      ],
    },
    {
      title: "Turn your tokens\ninto earnings",
      body: "Long-term investing isn't only about asset appreciation. Certain digital assets can generate rewards over time, creating additional opportunities for portfolio growth.",
      media: [
        { kind: "full", aspect: "1076 / 900", image: { src: s3a, alt: "Freehold staking rewards", bg: "#F0EBE5" } },
        { kind: "full", aspect: "938 / 780", image: { src: s3b, alt: "Freehold earnings overview", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1076 / 530", image: { src: s3c, alt: "Freehold rewards detail", bg: "#F0EBE5" } },
      ],
    },
    {
      title: "Building more\nthan a product",
      body: "The work extended beyond product design to include the website, visual identity, and supporting digital experiences. Every touchpoint was crafted to feel consistent, familiar, and aligned with the broader vision of the platform.",
      media: [
        { kind: "full", aspect: "1326 / 994", image: { src: s4a, alt: "Freehold website and brand", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1078 / 530", image: { src: s4b, alt: "Freehold visual identity", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1262 / 841", image: { src: s4c, alt: "Freehold supporting experiences", bg: "#F0EBE5" } },
      ],
    },
  ],
  projects: ALL_PROJECTS,
};

export default function FreeholdPage() {
  return <CaseStudy data={data} />;
}
