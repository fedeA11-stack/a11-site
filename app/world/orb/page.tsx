import CaseStudy, { type CaseStudyData } from "../../CaseStudy";
import { ALL_PROJECTS } from "../../caseProjects";

import heroImg from "../../../public/assets/orb/orb-hero.jpg";
import s1a from "../../../public/assets/orb/orb-1-1.jpg";
import s1b from "../../../public/assets/orb/orb-1-2.jpg";
import s2a from "../../../public/assets/orb/orb-2-1.jpg";
import s2b from "../../../public/assets/orb/orb-2-2.jpg";
import s2c from "../../../public/assets/orb/orb-2-3.jpg";
import s2d from "../../../public/assets/orb/orb-2-4.png";
import s3a from "../../../public/assets/orb/orb-3-1.jpg";
import s3b from "../../../public/assets/orb/orb-3-2.jpg";
import s4a from "../../../public/assets/orb/orb-4-1.jpg";
import s4b from "../../../public/assets/orb/orb-4-2.jpg";
import s4c from "../../../public/assets/orb/orb-4-3.jpg";

// ─────────────────────────────────────────────────────────────────────────────
// Orb App — World products case study (Figma frame 1871:12815).
// Aspect ratios match each tile's true Figma bounding box.
// ─────────────────────────────────────────────────────────────────────────────
const data: CaseStudyData = {
  breadcrumb: "Orb App",
  section: { label: "World", href: "/world" },
  title: "Designing clarity\nat global scale",
  description:
    "Orb App evolved alongside the World network, supporting thousands of operators, devices, and verification workflows across rapidly expanding global operations.",
  hero: { src: heroImg, alt: "Orb App — designing clarity at global scale", bg: "#F0EBE5" },
  sections: [
    {
      stats: [
        { value: "18M+", label: "Verified users" },
        { value: "160+", label: "Countries covered" },
        { value: "3700", label: "Active operators" },
      ],
    },
    {
      title: "Simplicity across\nevery workflow",
      body: "The core challenge was not designing more features. It was reducing the cognitive load behind every critical workflow, helping operators understand what to do, what state the system was in, and what needed to happen next, regardless of technical background.",
      media: [
        { kind: "full", aspect: "1596 / 1449", image: { src: s1a, alt: "Orb App workflow overview", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1116 / 550", image: { src: s1b, alt: "Orb App workflow detail", bg: "#F0EBE5" } },
      ],
    },
    {
      title: "Intuitive interfaces\nfor complex hardware",
      body: "Orb App was designed to make complex hardware easy to operate, simplifying setup, connectivity, and device management through clear and intuitive interactions.",
      media: [
        { kind: "full", aspect: "1280 / 853", image: { src: s2a, alt: "Orb App device setup", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1116 / 550", image: { src: s2b, alt: "Orb App connectivity", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1116 / 550", image: { src: s2c, alt: "Orb App device management", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1116 / 750", image: { src: s2d, alt: "Orb App hardware status", bg: "#F0EBE5" } },
      ],
    },
    {
      title: "Visibility across\nglobal deployments",
      body: "Orb App was designed to support the coordination of teams, devices, and field activity across rapidly expanding operations, while maintaining operational clarity at every level.",
      media: [
        { kind: "full", aspect: "1280 / 853", image: { src: s3a, alt: "Orb App deployment overview", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1596 / 1449", image: { src: s3b, alt: "Orb App field activity", bg: "#F0EBE5" } },
      ],
    },
    {
      title: "Built for large-scale operations",
      body: "From structured field deployments to lightweight community-led operations, Orb App was designed to support a wide range of workflows and operational models at global scale.",
      media: [
        { kind: "full", aspect: "1137 / 764", image: { src: s4a, alt: "Orb App large-scale operations", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1116 / 550", image: { src: s4b, alt: "Orb App operational models", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1116 / 750", image: { src: s4c, alt: "Orb App community operations", bg: "#F0EBE5" } },
      ],
    },
  ],
  projects: ALL_PROJECTS,
};

export default function OrbPage() {
  return <CaseStudy data={data} />;
}
