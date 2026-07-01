import CaseStudy, { type CaseStudyData } from "../../CaseStudy";
import { buildCaseMetadata } from "../../seo";
import { ALL_PROJECTS } from "../../caseProjects";

import heroImg from "../../../public/assets/orb/orb-hero.jpg";
import subhoAvatar from "../../../public/assets/orb/Subho.png";
import s1a from "../../../public/assets/orb/orb-1-1.jpg";
import s1b from "../../../public/assets/orb/orb-1-2.jpg";
import s1c from "../../../public/assets/orb/orb-1-3.jpg";
import s2a from "../../../public/assets/orb/orb-2-1.jpg";
import s2b from "../../../public/assets/orb/orb-2-2.jpg";
import s2c from "../../../public/assets/orb/orb-2-3.jpg";
import s2d from "../../../public/assets/orb/orb-2-4.jpg";
import s2e from "../../../public/assets/orb/orb-2-5.jpg";
import s2f from "../../../public/assets/orb/orb-2-6.jpg";
import s3a from "../../../public/assets/orb/orb-3-1.jpg";
import s3b from "../../../public/assets/orb/orb-3-2.jpg";
import s3c from "../../../public/assets/orb/orb-3-3.jpg";
import s3d from "../../../public/assets/orb/orb-3-4.jpg";
import s4a from "../../../public/assets/orb/orb-4-1.jpg";
import s4b from "../../../public/assets/orb/orb-4-2.jpg";
import s4c from "../../../public/assets/orb/orb-4-3.jpg";
import s4d from "../../../public/assets/orb/orb-4-4.jpg";

// ─────────────────────────────────────────────────────────────────────────────
// Orb App — World products case study (Figma frame "Orb App" 1871:12815)
// rendered through the canonical case-study template. Tile grid + aspect ratios
// mirror the Figma `img` frames: full tiles 1116×750, duos 553×550 side-by-side.
// Includes the stats row (after hero) and the left-aligned testimonial.
// ─────────────────────────────────────────────────────────────────────────────
export const data: CaseStudyData = {
  breadcrumb: "Orb App",
  section: { label: "World", href: "/world" },
  title: "Designing for scale",
  description:
    "Orb App evolved alongside the World network, supporting operators, devices, and verification workflows across rapidly expanding global operations.",
  hero: { src: heroImg, alt: "Orb App, designing clarity at global scale", bg: "#F0EBE5" },
  sections: [
    // Left-aligned testimonial (y3826)
    {
      quote: {
        text: "“This is what good operator tooling looks like. Less friction, fewer errors, more verifications done.”",
        author: "Subho Deep",
        role: "Staff Product Manager",
        avatar: subhoAvatar,
        align: "center",
      },
    },
    // Intuitive Interfaces For Complex Hardware (y4391)
    {
      title: "Intuitive interfaces\nfor complex hardware",
      body: "Orb App was designed to make complex hardware easy to operate, simplifying setup, connectivity, and device management through clear and intuitive interactions.",
      media: [
        // Images from the former "Simplicity across every workflow" section —
        // copy removed per the deck; media merged here so it keeps the tile gap.
        { kind: "full", aspect: "1116 / 750", image: { src: s1a, alt: "Orb App workflow overview", bg: "#F0EBE5" } },
        { kind: "duo", aspect: "553 / 550", images: [
          { src: s1b, alt: "Orb App workflow detail", bg: "#F0EBE5" },
          { src: s1c, alt: "Orb App verification dashboard", bg: "#F0EBE5" },
        ] },
        { kind: "full", aspect: "1116 / 750", image: { src: s2a, alt: "Orb App device setup", bg: "#F0EBE5" } },
        { kind: "duo", aspect: "553 / 550", images: [
          { src: s2b, alt: "Orb App connectivity", bg: "#F0EBE5" },
          { src: s2c, alt: "Orb App device management", bg: "#F0EBE5" },
        ] },
        { kind: "duo", aspect: "553 / 550", images: [
          { src: s2d, alt: "Orb App device status", bg: "#F0EBE5" },
          { src: s2e, alt: "Orb App setup confirmation", bg: "#F0EBE5" },
        ] },
        { kind: "full", aspect: "1116 / 750", image: { src: s2f, alt: "Orb App hardware overview", bg: "#F0EBE5" } },
        // Images from the former "Visibility across global deployments" section —
        // copy removed per the deck; media merged here so it keeps the tile gap
        // instead of opening a new section (which would add the larger gap).
        { kind: "full", aspect: "1116 / 750", image: { src: s3a, alt: "Orb App deployment overview", bg: "#F0EBE5" } },
        { kind: "duo", aspect: "553 / 550", images: [
          { src: s3b, alt: "Orb App field activity", bg: "#F0EBE5" },
          { src: s3c, alt: "Orb App scheduling calendar", bg: "#F0EBE5" },
        ] },
        { kind: "full", aspect: "1116 / 750", image: { src: s3d, alt: "Orb App operational clarity", bg: "#F0EBE5" } },
        // Images from the former "Built for large scale operations" section.
        { kind: "full", aspect: "1116 / 750", image: { src: s4a, alt: "Orb App large-scale operations", bg: "#F0EBE5" } },
        { kind: "duo", aspect: "553 / 550", images: [
          { src: s4b, alt: "Orb App operational models", bg: "#F0EBE5" },
          { src: s4c, alt: "Orb App community operations", bg: "#F0EBE5" },
        ] },
        { kind: "full", aspect: "1116 / 750", image: { src: s4d, alt: "Orb App global deployment view", bg: "#F0EBE5" } },
      ],
    },
  ],
  projects: ALL_PROJECTS,
};

export const metadata = buildCaseMetadata(data, "/world/orb");

export default function OrbPage() {
  return <CaseStudy data={data} />;
}
