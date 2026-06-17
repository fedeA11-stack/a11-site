import CaseStudy, { type CaseStudyData } from "../../CaseStudy";
import { ALL_PROJECTS } from "../../caseProjects";

import hero from "../../../public/assets/world-id/wid-hero.jpg";
import ajayAvatar from "../../../public/assets/world-id/wid-avatar.png";
import s2a from "../../../public/assets/world-id/wid-2-1.jpg";
import s2b from "../../../public/assets/world-id/wid-2-2.jpg";
import s3a from "../../../public/assets/world-id/wid-3-1.jpg";
import s3b from "../../../public/assets/world-id/wid-3-2.jpg";
import s3c from "../../../public/assets/world-id/wid-3-3.jpg";
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
const data: CaseStudyData = {
  breadcrumb: "World ID",
  section: { label: "World", href: "/world" },
  title: "Are you a real human?",
  description:
    "World ID is the identity layer for humans in the age of AI. The app needed to make a complex, unfamiliar concept feel simple, trustworthy, and immediately useful.",
  hero: { src: hero, alt: "World ID", bg: "#F0EBE5" },
  sections: [
    {
      title: "You know you're human. Does the internet?",
      body: "You already know you're a real, breathing human. The internet doesn't. And in the age of AI, more than 70% of it is bots.",
    },
    {
      quote: {
        text: "By the time I joined, A11 designers had already become part of the product's DNA.",
        author: "Ajay Patel",
        role: "Head of World ID",
        avatar: ajayAvatar,
        align: "left",
      },
    },
    {
      title: "Meet the Orb.\nAnd its experience.",
      body: "You know captchas. Pick the cars. Slide the puzzle piece. Find the crosswalk. Bots can do all of that now. So Tools For Humanity Design Lab built something they can't fake — a camera that just looks at you. No voice. No instructions. No display. That's where the fun started.",
      media: [
        { kind: "full", aspect: "1116 / 750", image: { src: s2a, alt: "The Orb", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1116 / 550", image: { src: s2b, alt: "The Orb experience", bg: "#F0EBE5" } },
      ],
    },
    {
      title: "If you're a real human,\nknow it, show it",
      body: "Once you're verified, you receive your World ID — your human credential. Over the years it's taken many forms, but the message has stayed the same. Here's how it evolved. We had a lot of fun with that.",
      media: [
        { kind: "full", aspect: "1116 / 750", image: { src: s3a, alt: "World ID credential", bg: "#F0EBE5" } },
        { kind: "duo", aspect: "553 / 550", images: [
          { src: s3b, alt: "World ID credential evolution", bg: "#F0EBE5" },
          { src: s3c, alt: "World ID credential variants", bg: "#F0EBE5" },
        ] },
      ],
    },
    {
      title: "3 continents.\n160+ locations.",
      body: "Proving you're human isn't just another US-only thing. We're on three continents, with locations all around the globe. We designed an experience that makes it easy to find one and book your own appointment. Anywhere.",
      media: [
        { kind: "full", aspect: "1116 / 750", image: { src: s4a, alt: "World ID locations", bg: "#F0EBE5" } },
        { kind: "tallDuo", tallAspect: "554 / 648", stackAspect: "553 / 320",
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

export default function WorldIdPage() {
  return <CaseStudy data={data} />;
}
