import CaseStudy, { type CaseStudyData } from "../../CaseStudy";
import { ALL_PROJECTS } from "../../caseProjects";

import heroImg from "../../../public/assets/world-money/wm-hero.jpg";
import wm11 from "../../../public/assets/world-money/wm-1-1.jpg";
import wm12 from "../../../public/assets/world-money/wm-1-2.jpg";
import wm13 from "../../../public/assets/world-money/wm-1-3.png";
import wm14 from "../../../public/assets/world-money/wm-1-4.png";
import wm21 from "../../../public/assets/world-money/wm-2-1.jpg";
import wm22 from "../../../public/assets/world-money/wm-2-2.png";
import wm23 from "../../../public/assets/world-money/wm-2-3.png";
import wm31 from "../../../public/assets/world-money/wm-3-1.jpg";
import wm32 from "../../../public/assets/world-money/wm-3-2.jpg";
import wm41 from "../../../public/assets/world-money/wm-4-1.png";
import wm42 from "../../../public/assets/world-money/wm-4-2.jpg";
import wm43 from "../../../public/assets/world-money/wm-4-3.jpg";
import wm44 from "../../../public/assets/world-money/wm-4-4.jpg";
import wm45 from "../../../public/assets/world-money/wm-4-5.png";

// ─────────────────────────────────────────────────────────────────────────────
// World Money — content from Figma frame 1871:12124, rendered through the
// canonical case-study template.
// ─────────────────────────────────────────────────────────────────────────────
const BG = "#F0EBE5";

const data: CaseStudyData = {
  breadcrumb: "World Money",
  section: { label: "World", href: "/world" },
  title: "Designing the no.1\nwallet in the world",
  description:
    "World Money was designed to help millions of people receive, manage, and use digital assets through a simple experience, even if they had never made a crypto transaction before.",
  hero: { src: heroImg, alt: "World Money wallet", bg: BG },
  sections: [
    {
      stats: [
        { value: "45M+", label: "Total users" },
        { value: "36M+", label: "Monthly transactions" },
        { value: "2M+", label: "Daily users" },
      ],
    },
    {
      title: "Wallet designed for everyone",
      body: "For many people entering World Money was their first experience with digital assets. They were not thinking about networks, or blockchain infrastructure, they simply needed to understand what they owned, how to receive it, and how to use it safely.",
      media: [
        { kind: "full", aspect: "1116 / 900", image: { src: wm11, alt: "World Money wallet home", bg: BG } },
        { kind: "full", aspect: "1116 / 750", image: { src: wm12, alt: "World Money balance overview", bg: BG } },
        { kind: "full", aspect: "1116 / 550", image: { src: wm13, alt: "World Money asset detail", bg: BG } },
        { kind: "full", aspect: "1116 / 405", image: { src: wm14, alt: "World Money receive flow", bg: BG } },
      ],
    },
    {
      title: "New financial rails, familiar actions",
      body: "The experience was built around actions people already understand. The complexity of crypto infrastructure stayed in the background, while the interface focused on clarity, confidence, and control.",
      media: [
        { kind: "full", aspect: "1116 / 900", image: { src: wm21, alt: "World Money send flow", bg: BG } },
        { kind: "full", aspect: "1116 / 750", image: { src: wm22, alt: "World Money transaction confirmation", bg: BG } },
        { kind: "full", aspect: "1116 / 600", image: { src: wm23, alt: "World Money activity history", bg: BG } },
      ],
    },
    {
      title: "From wallet balance to real-world use",
      body: "World Card extended the wallet beyond holding and transferring assets, creating a familiar way for people to use their digital assets in everyday purchases, bringing wallet value into real-world payments.",
      media: [
        { kind: "full", aspect: "1116 / 750", image: { src: wm31, alt: "World Card", bg: BG } },
        { kind: "full", aspect: "1116 / 900", image: { src: wm32, alt: "World Card in use", bg: BG } },
      ],
    },
    {
      title: "Helping users understand the value",
      body: "Grants introduced a new concept for many users. We translated abstract ideas like airdrops, claims, and ownership into familiar visual metaphors, using everyday objects to help people understand the value.",
      media: [
        { kind: "full", aspect: "1116 / 750", image: { src: wm41, alt: "World Money grants intro", bg: BG } },
        { kind: "full", aspect: "1116 / 750", image: { src: wm42, alt: "World Money claim flow", bg: BG } },
        { kind: "full", aspect: "1842 / 1036", image: { src: wm43, alt: "World Money grant visual metaphor", bg: BG } },
        { kind: "full", aspect: "1116 / 600", image: { src: wm44, alt: "World Money ownership detail", bg: BG } },
        { kind: "full", aspect: "1116 / 750", image: { src: wm45, alt: "World Money grant value", bg: BG } },
      ],
    },
  ],
  projects: ALL_PROJECTS,
};

export default function WorldMoneyV2Page() {
  return <CaseStudy data={data} />;
}
