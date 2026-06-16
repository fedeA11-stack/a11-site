import CaseStudy, { type CaseStudyData } from "../CaseStudy";
import { ALL_PROJECTS } from "../caseProjects";

import heroImg from "../../public/assets/atlans/atlans-hero.jpg";
import s1a from "../../public/assets/atlans/atlans-1-1.jpg";
import s2a from "../../public/assets/atlans/atlans-2-1.jpg";
import s2b from "../../public/assets/atlans/atlans-2-2.jpg";
import s2c from "../../public/assets/atlans/atlans-2-3.jpg";
import s3a from "../../public/assets/atlans/atlans-3-1.jpg";
import s3b from "../../public/assets/atlans/atlans-3-2.jpg";
import s3c from "../../public/assets/atlans/atlans-3-3.jpg";
import s4a from "../../public/assets/atlans/atlans-4-1.jpg";

// ─────────────────────────────────────────────────────────────────────────────
// Atlans — title-only hero (no description). Rendered through the canonical
// case-study template (Figma 1871:46193). Aspect ratios are the real exported
// pixel dimensions of each asset.
// ─────────────────────────────────────────────────────────────────────────────
const data: CaseStudyData = {
  breadcrumb: "Atlans",
  title: "Bringing athletes, places\nand communities together",
  hero: { src: heroImg, alt: "Atlans hero", bg: "#F0EBE5" },
  sections: [
    {
      title: "The best spots,\ncurated for athletes",
      media: [
        { kind: "full", aspect: "2232 / 1500", image: { src: s1a, alt: "Atlans — curated spots", bg: "#F0EBE5" } },
      ],
    },
    {
      title: "Find your community,\nwherever you are",
      media: [
        { kind: "full", aspect: "2232 / 1500", image: { src: s2a, alt: "Atlans — community feed", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1106 / 1100", image: { src: s2b, alt: "Atlans — community profiles", bg: "#F0EBE5" } },
        { kind: "full", aspect: "2232 / 1500", image: { src: s2c, alt: "Atlans — discover people nearby", bg: "#F0EBE5" } },
      ],
    },
    {
      title: "Turn every workout into\na shared experience",
      media: [
        { kind: "full", aspect: "3428 / 1524", image: { src: s3a, alt: "Atlans — shared workout", bg: "#F0EBE5" } },
        { kind: "full", aspect: "2126 / 2674", image: { src: s3b, alt: "Atlans — workout detail", bg: "#F0EBE5" } },
        { kind: "full", aspect: "2232 / 1500", image: { src: s3c, alt: "Atlans — activity overview", bg: "#F0EBE5" } },
      ],
    },
    {
      title: "We've built emotion,\nnot just another brand",
      media: [
        { kind: "full", aspect: "3428 / 1524", image: { src: s4a, alt: "Atlans — brand", bg: "#F0EBE5" } },
      ],
    },
  ],
  projects: ALL_PROJECTS,
};

export default function AtlansPage() {
  return <CaseStudy data={data} />;
}
