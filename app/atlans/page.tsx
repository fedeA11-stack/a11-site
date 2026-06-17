import CaseStudy, { type CaseStudyData } from "../CaseStudy";
import { ALL_PROJECTS } from "../caseProjects";

import heroImg from "../../public/assets/atlans/atlans-hero.jpg";
import s1a from "../../public/assets/atlans/atlans-1-1.jpg";
import s1b from "../../public/assets/atlans/atlans-1-2.jpg";
import s2a from "../../public/assets/atlans/atlans-2-1.jpg";
import s2b from "../../public/assets/atlans/atlans-2-2.jpg";
import s2c from "../../public/assets/atlans/atlans-2-3.jpg";
import s2d from "../../public/assets/atlans/atlans-2-4.jpg";
import s3a from "../../public/assets/atlans/atlans-3-1.jpg";
import s3b from "../../public/assets/atlans/atlans-3-2.jpg";
import s3c from "../../public/assets/atlans/atlans-3-3.jpg";
import s3d from "../../public/assets/atlans/atlans-3-4.jpg";

// ─────────────────────────────────────────────────────────────────────────────
// Atlans — title-only hero (no description). Rendered through the canonical
// case-study template (Figma 1871:46193). Each tile mirrors a real Figma "img"
// frame: 1116×750 → "full" rows, 553×550 → side-by-side "duo" rows.
// ─────────────────────────────────────────────────────────────────────────────
const data: CaseStudyData = {
  breadcrumb: "Atlans",
  title: "Bringing athletes, places\nand communities together",
  hero: { src: heroImg, alt: "Atlans hero", bg: "#F0EBE5" },
  sections: [
    {
      title: "The best spots,\ncurated for athletes",
      media: [
        { kind: "full", aspect: "1116 / 750", image: { src: s1a, alt: "Atlans — curated spots map", bg: "#F0EBE5" } },
        // Irregular: a lone 553×550 tile (Figma 1871:46539) sits on the right with
        // no left partner, so it renders as a half-width-aspect "full" tile.
        { kind: "full", aspect: "553 / 550", image: { src: s1b, alt: "Atlans — spot amenities", bg: "#F0EBE5" } },
      ],
    },
    {
      title: "Find your community,\nwherever you are",
      media: [
        { kind: "full", aspect: "1116 / 750", image: { src: s2a, alt: "Atlans — community home", bg: "#F0EBE5" } },
        { kind: "duo", aspect: "553 / 550", images: [
          { src: s2b, alt: "Atlans — community chat", bg: "#F0EBE5" },
          { src: s2c, alt: "Atlans — community members", bg: "#F0EBE5" },
        ] },
        { kind: "full", aspect: "1116 / 750", image: { src: s2d, alt: "Atlans — discover people nearby", bg: "#F0EBE5" } },
      ],
    },
    {
      title: "Turn every workout into\na shared experience",
      media: [
        { kind: "full", aspect: "1116 / 750", image: { src: s3a, alt: "Atlans — shared workout", bg: "#F0EBE5" } },
        { kind: "duo", aspect: "553 / 550", images: [
          { src: s3b, alt: "Atlans — workout detail", bg: "#F0EBE5" },
          { src: s3c, alt: "Atlans — workout stats", bg: "#F0EBE5" },
        ] },
        { kind: "full", aspect: "1116 / 750", image: { src: s3d, alt: "Atlans — activity overview", bg: "#F0EBE5" } },
      ],
    },
  ],
  projects: ALL_PROJECTS,
};

export default function AtlansPage() {
  return <CaseStudy data={data} />;
}
