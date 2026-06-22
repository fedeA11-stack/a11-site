import CaseStudy, { type CaseStudyData } from "../CaseStudy";
import { buildCaseMetadata } from "../seo";
import { ALL_PROJECTS } from "../caseProjects";

import heroImg from "../../public/assets/nous/nous-hero.png";
import s1a from "../../public/assets/nous/nous-1-1.png";
import s1b from "../../public/assets/nous/nous-1-2.png";
import s1c from "../../public/assets/nous/nous-1-3.png";
import s2a from "../../public/assets/nous/nous-2-1.png";
import s2b from "../../public/assets/nous/nous-2-2.png";
import s2c from "../../public/assets/nous/nous-2-3.png";
import s2d from "../../public/assets/nous/nous-2-4.png";
import s3a from "../../public/assets/nous/nous-3-1.png";
import s3b from "../../public/assets/nous/nous-3-2.png";
import s4a from "../../public/assets/nous/nous-4-1.png";
import s4b from "../../public/assets/nous/nous-4-2.png";
import s4c from "../../public/assets/nous/nous-4-3.png";
import s4d from "../../public/assets/nous/nous-4-4.png";
import avatar from "../../public/assets/nous/nous-avatar.png";

// ─────────────────────────────────────────────────────────────────────────────
// Nous — case study rendered through the canonical case-study template
// (Figma 283:56308). Tiles are exported as opaque rectangles; each tile's `bg`
// matches its own edge colour so the Cell's rounded-corner anti-aliasing blends
// seamlessly (no dark fringe). The chat tiles carry a vertical grey→light frame
// gradient, so their bg is the matching gradient.
// ─────────────────────────────────────────────────────────────────────────────
const HERO = "#0D0D0D";          // dark monitor hero
const LIGHT = "#F3F2F2";         // light tile frame
const CHAT = "linear-gradient(180deg, #6B6B6B 0%, #F3F2F2 100%)"; // chat tile frame

const data: CaseStudyData = {
  breadcrumb: "Nous",
  title: "Designing a shared\nintelligence layer",
  description:
    "Nous was designed as an AI workspace where people, memory, and specialized agents work together, helping individuals and teams turn context into action without losing control over knowledge access.",
  hero: { src: heroImg, alt: "Nous — a shared intelligence workspace", bg: HERO },
  sections: [
    {
      title: "Keeping context\nwithout losing control",
      body: "Nous had to hold context across an entire experience, not just a single conversation. The challenge was allowing the system to understand the bigger picture while giving each agent and collaborator access only to the information they actually needed.",
      media: [
        { kind: "full", aspect: "1076 / 723", image: { src: s1a, alt: "Nous workspace holding context across a conversation", bg: CHAT } },
        { kind: "duo", aspect: "533 / 530", images: [
          { src: s1b, alt: "Nous shared memory", bg: LIGHT },
          { src: s1c, alt: "Nous assistant prompt", bg: LIGHT },
        ] },
      ],
    },
    {
      quote: {
        text: "This is what good operator tooling looks like. Less friction, fewer errors, more verifications done.",
        author: "Subho Deep",
        role: "Tools for Humanity",
        avatar,
        align: "center",
      },
    },
    {
      title: "From one brain\nto many specialists",
      body: "Instead of asking one AI to do everything, Nous can create specialized agents for specific tasks. Each agent receives the context relevant to its role.",
      media: [
        { kind: "full", aspect: "1077 / 723", image: { src: s2a, alt: "Nous spinning up a specialized agent", bg: CHAT } },
        { kind: "duo", aspect: "533 / 530", images: [
          { src: s2b, alt: "Nous new assistant added", bg: LIGHT },
          { src: s2c, alt: "Nous agent roster", bg: LIGHT },
        ] },
        { kind: "full", aspect: "1077 / 723", image: { src: s2d, alt: "Nous task queue with time estimates", bg: LIGHT } },
      ],
    },
    {
      title: "People and agents\nworking together",
      body: "Nous was designed as a collaborative workspace where people can work with each other and bring AI agents into the conversation when needed.",
      media: [
        { kind: "full", aspect: "1077 / 723", image: { src: s3a, alt: "Nous collaborative workspace", bg: CHAT } },
        { kind: "full", aspect: "1076 / 723", image: { src: s3b, alt: "People and agents collaborating in Nous", bg: LIGHT } },
      ],
    },
    {
      title: "Connecting\nthe knowledge",
      body: "Nous brings files, connected tools, and shared resources into one context layer — making knowledge easy to organize, reuse, and selectively share with the agents and people who need it.",
      media: [
        { kind: "full", aspect: "1077 / 723", image: { src: s4a, alt: "Nous file storage", bg: CHAT } },
        { kind: "duo", aspect: "533 / 530", images: [
          { src: s4b, alt: "Nous pinned resources", bg: LIGHT },
          { src: s4c, alt: "Nous shared file", bg: LIGHT },
        ] },
        { kind: "full", aspect: "1077 / 723", image: { src: s4d, alt: "Nous connectors", bg: LIGHT } },
      ],
    },
  ],
  projects: ALL_PROJECTS,
};

export const metadata = buildCaseMetadata(data, "/nous");

export default function NousPage() {
  return <CaseStudy data={data} />;
}
