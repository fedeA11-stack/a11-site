import { type CSProject } from "./CaseStudy";

import worldMoneyCover from "../public/assets/world/case/world-money-cover.jpg";
import worldIdCover from "../public/assets/world/case/world-id-cover.jpg";

// Shared "All projects" list rendered at the bottom of every case study (the
// curated four from the Figma design). Hrefs fill in as each study ships.
export const ALL_PROJECTS: CSProject[] = [
  { name: "World Money", href: "/world/money", preview: worldMoneyCover },
  { name: "World ID", href: "/world/id", preview: worldIdCover },
  { name: "Atlans", href: "/atlans", preview: "/assets/Atlans-case.png" },
  { name: "Freehold", href: "/freehold", preview: "/assets/Freehold-Case.png" },
];
