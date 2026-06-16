import CaseStudy, { type CaseStudyData } from "../CaseStudy";
import { ALL_PROJECTS } from "../caseProjects";

import heroImg from "../../public/assets/tokenstudio/ts-hero.jpg";
import s1a from "../../public/assets/tokenstudio/ts-1-1.jpg";
import s1b from "../../public/assets/tokenstudio/ts-1-2.jpg";
import s1c from "../../public/assets/tokenstudio/ts-1-3.jpg";
import s1d from "../../public/assets/tokenstudio/ts-1-4.png";
import s2a from "../../public/assets/tokenstudio/ts-2-1.jpg";
import s2b from "../../public/assets/tokenstudio/ts-2-2.jpg";
import s3a from "../../public/assets/tokenstudio/ts-3-1.jpg";
import s3b from "../../public/assets/tokenstudio/ts-3-2.jpg";
import s4a from "../../public/assets/tokenstudio/ts-4-1.jpg";
import s4b from "../../public/assets/tokenstudio/ts-4-2.jpg";

// ─────────────────────────────────────────────────────────────────────────────
// TokenStudio — Figma frame 1871:36829. Several bands are composed/layered
// scenes, exported as their common parent frame (see report below). Aspect
// ratios are the real exported pixel dimensions.
// ─────────────────────────────────────────────────────────────────────────────
const data: CaseStudyData = {
  breadcrumb: "TokenStudio",
  title: "Invest across\nreal-world assets",
  description:
    "Tokenization turns illiquid real-world assets into tradeable digital ownership. We designed the experience that lets anyone invest in property, art, or infrastructure and move value the way the internet moves data.",
  hero: { src: heroImg, alt: "TokenStudio — invest across real-world assets", bg: "#F0EBE5" },
  sections: [
    {
      title: "Real-world assets\nreimagined",
      body: "As investing continues to evolve, the platform bridges traditional opportunities with digital ownership, creating a more accessible and connected investment experience.",
      media: [
        { kind: "full", aspect: "1997 / 1124", image: { src: s1a, alt: "TokenStudio main hero card", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1877 / 1832", image: { src: s1b, alt: "TokenStudio asset detail and real-estate listings", bg: "#F0EBE5" } },
        { kind: "full", aspect: "2152 / 1060", image: { src: s1c, alt: "TokenStudio asset overview", bg: "#F0EBE5" } },
        { kind: "full", aspect: "2152 / 684", image: { src: s1d, alt: "TokenStudio asset categories", bg: "#F0EBE5" } },
      ],
    },
    {
      title: "Owning a piece\nin minutes",
      body: "Behind every real investment sits real regulation — disclosures, agreements, eligibility checks. We turned them into one guided path that speaks plain English.",
      media: [
        { kind: "full", aspect: "2154 / 1440", image: { src: s2a, alt: "TokenStudio guided investment flow", bg: "#F0EBE5" } },
        { kind: "full", aspect: "2154 / 1060", image: { src: s2b, alt: "TokenStudio eligibility and disclosures", bg: "#F0EBE5" } },
      ],
    },
    {
      title: "Ownership you\ncan trade",
      body: "A tokenized building shouldn't be harder to sell than it was to buy. Every project carries its own market — individual units listed with real prices, available or sold at a glance.",
      media: [
        { kind: "full", aspect: "1617 / 1080", image: { src: s3a, alt: "TokenStudio project marketplace and order book", bg: "#F0EBE5" } },
        { kind: "full", aspect: "2156 / 1060", image: { src: s3b, alt: "TokenStudio unit listings", bg: "#F0EBE5" } },
      ],
    },
    {
      title: "Ownership beyond\nthe transaction",
      body: "Investing is only one part of the journey. The platform was designed to support the complete lifecycle of digital ownership, from investor management and liquidity to reporting and ongoing asset operations.",
      media: [
        { kind: "full", aspect: "2156 / 1440", image: { src: s4a, alt: "TokenStudio investor management and reporting", bg: "#F0EBE5" } },
        { kind: "full", aspect: "2156 / 1246", image: { src: s4b, alt: "TokenStudio asset operations lifecycle", bg: "#F0EBE5" } },
      ],
    },
  ],
  projects: ALL_PROJECTS,
};

export default function TokenStudioPage() {
  return <CaseStudy data={data} />;
}
