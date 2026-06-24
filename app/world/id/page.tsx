import CaseStudy, { type CaseStudyData } from "../../CaseStudy";
import { buildCaseMetadata } from "../../seo";
import { ALL_PROJECTS } from "../../caseProjects";

import ajayAvatar from "../../../public/assets/world-id/Ajay.jpg";
import s2b from "../../../public/assets/world-id/wid-2-2.jpg";
import s3a from "../../../public/assets/world-id/wid-3-1.jpg";
import s4a from "../../../public/assets/world-id/wid-4-1.jpg";
import s4tall from "../../../public/assets/world-id/wid-4-2.jpg";
import s4s1 from "../../../public/assets/world-id/wid-4-3.jpg";
import s4s2 from "../../../public/assets/world-id/wid-4-4.jpg";
import s5a from "../../../public/assets/world-id/wid-5-1.jpg";
import s5b from "../../../public/assets/world-id/wid-5-2.jpg";
import s5c from "../../../public/assets/world-id/wid-5-3.jpg";

// ─────────────────────────────────────────────────────────────────────────────
// World ID — case study (Figma 1871:12610) rendered through the canonical
// case-study template. Tile grid + aspect ratios mirror the Figma `img` frames.
// ─────────────────────────────────────────────────────────────────────────────
export const data: CaseStudyData = {
  breadcrumb: "World ID",
  section: { label: "World", href: "/world" },
  title: "Are you a real human?",
  description:
    "World ID is the identity layer for humans in the age of AI. The app needed to make a complex, unfamiliar concept feel simple and immediately useful.",
  hero: { src: "/assets/world-id/Intro-reveal.2f62bf12.mp4", alt: "World ID", video: true, bg: "#F0EBE5" },
  sections: [
    {
      title: "You know you're human.\nDoes the internet?",
      body: "You already know you're a real, breathing human. The internet doesn't. And in the age of AI, more than 70% of it is bots.",
      media: [
        { kind: "full", aspect: "1243 / 832", image: { src: "/assets/world-id/Main%20Comp_1.mp4", alt: "World ID main composition", video: true, bg: "#F0EBE5" } },
      ],
    },
    {
      quote: {
        text: "“This is exactly what we needed, a wallet experience that made crypto feel simple, familiar, and safe.”",
        author: "Ajay Patel",
        role: "Chief Revenue Officer and Head of World ID",
        avatar: ajayAvatar,
        align: "center",
      },
    },
    {
      title: "Meet the Orb.\nAnd its experience.",
      body: "You know captchas. Pick the cars. Slide the puzzle piece. Find the crosswalk. Bots can do all of that now. So Tools for Humanity Design Lab built something they can't fake: a camera that just looks at you. No voice. No instructions. No display. That's where the fun started.",
      media: [
        { kind: "full", aspect: "1243 / 832", image: { src: "/assets/world-id/preflights.e0b82ac7.mp4", alt: "The Orb preflights", video: true, bg: "#F0EBE5" } },
        { kind: "duo", aspect: "615 / 612", images: [
          { src: "/assets/world-id/Post_verification.0dd44eb6.mp4", alt: "Post verification flow", video: true, bg: "#F0EBE5" },
          { src: s2b, alt: "The Orb experience", bg: "#F0EBE5" },
        ] },
      ],
    },
    {
      title: "If you're a real human,\nknow it, show it",
      body: "Once you're verified, you receive your World ID. Your human credential. Over the years it's taken many forms, but the message has stayed the same. Here's how it evolved. We had a lot of fun with that.",
      media: [
        { kind: "full", aspect: "1243 / 832", image: { src: s3a, alt: "World ID credential", bg: "#F0EBE5" } },
        { kind: "duo", aspect: "615 / 612", images: [
          { src: "/assets/world-id/Passport.c97f4c7b.mp4", alt: "World ID passport", video: true, bg: "#F0EBE5" },
          { src: "/assets/world-id/WorldID_Card_Rotiation.mp4", alt: "World ID card rotation", video: true, bg: "#F0EBE5" },
        ] },
      ],
    },
    {
      title: "3 continents.\n160+ locations.",
      body: "Proving you're human isn't just another US-only thing. We're on three continents, with locations all around the globe. We designed an experience that makes it easy to find one and book your own appointment. Anywhere.",
      media: [
        { kind: "full", aspect: "1116 / 750", image: { src: s4a, alt: "World ID locations", bg: "#F0EBE5" } },
        { kind: "tallDuo", tallAspect: "615 / 721", stackAspect: "617 / 355",
          tall: { src: s4tall, alt: "World ID location map", bg: "#F0EBE5" },
          stack: [
            { src: s4s1, alt: "World ID appointment booking", bg: "#F0EBE5" },
            { src: s4s2, alt: "World ID appointment detail", bg: "#F0EBE5" },
          ] },
      ],
    },
    {
      title: "Wait, do I have to\ngo somewhere?",
      body: "Not exactly. We also designed a way to order verification straight to your door. Place the order whenever you're ready. A driver brings the Orb to you and verifies you on the spot.",
      media: [
        { kind: "full", aspect: "1116 / 750", image: { src: s5a, alt: "Orb delivery", bg: "#F0EBE5" } },
        { kind: "duo", aspect: "553 / 547", images: [
          { src: s5b, alt: "Orb delivery order", bg: "#F0EBE5" },
          { src: s5c, alt: "Orb delivery tracking", bg: "#F0EBE5" },
        ] },
      ],
    },
  ],
  projects: ALL_PROJECTS,
};

export const metadata = buildCaseMetadata(data, "/world/id");

export default function WorldIdPage() {
  return <CaseStudy data={data} />;
}
