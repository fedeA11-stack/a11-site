import CaseStudy, { type CaseStudyData } from "../CaseStudy";
import { ALL_PROJECTS } from "../caseProjects";

import heroImg from "../../public/assets/relai/relai-hero.jpg";
import s1a from "../../public/assets/relai/relai-s1-1.png";
import s1b from "../../public/assets/relai/relai-s1-2.jpg";
import s1c from "../../public/assets/relai/relai-s1-3.png";
import s2a from "../../public/assets/relai/relai-s2-1.png";
import s2b from "../../public/assets/relai/relai-s2-2.png";
import s2c from "../../public/assets/relai/relai-s2-3.jpg";
import s2d from "../../public/assets/relai/relai-s2-4.png";
import s3a from "../../public/assets/relai/relai-s3-1.jpg";
import s3b from "../../public/assets/relai/relai-s3-2.png";

// ─────────────────────────────────────────────────────────────────────────────
// Relai — content ported from the older case-study template (Figma 1871:43569)
// into the canonical case-study design.
// ─────────────────────────────────────────────────────────────────────────────
const data: CaseStudyData = {
  breadcrumb: "Relai",
  title: "Making Bitcoin\nsaving feel simple",
  description:
    "Relai is a Bitcoin-only wallet designed to help people buy, save, and self-custody Bitcoin through a simple mobile experience built around trust, ownership, and long-term confidence.",
  hero: { src: heroImg, alt: "Relai app — Bitcoin savings", bg: "#F0EBE5" },
  sections: [
    {
      title: "Bitcoin without the noise",
      body: "Most crypto products overwhelm users with coins, charts, exchanges, and trading language. Relai took a different path, one asset, one clear purpose, and a wallet experience focused on helping people build Bitcoin savings over time.",
      media: [
        { kind: "full", aspect: "1076 / 900", image: { src: s1a, alt: "Relai onboarding", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1076 / 900", image: { src: s1b, alt: "Relai wallet overview", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1076 / 900", image: { src: s1c, alt: "Relai balance detail", bg: "#F0EBE5" } },
      ],
    },
    {
      title: "From first buy to long-term saving",
      body: "The experience needed to make buying Bitcoin feel understandable from the first interaction, while supporting repeat behavior through clear balances, simple purchase flows, and recurring savings plans.",
      media: [
        { kind: "full", aspect: "1076 / 900", image: { src: s2a, alt: "Relai buy flow", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1076 / 900", image: { src: s2b, alt: "Relai recurring savings", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1076 / 720", image: { src: s2c, alt: "Relai monthly auto-invest", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1076 / 900", image: { src: s2d, alt: "Relai purchase confirmation", bg: "#F0EBE5" } },
      ],
    },
    {
      title: "Self-custody without the fear",
      body: "Self-custody is powerful, but it can also feel intimidating. The product had to help users understand ownership, recovery, and responsibility without making the wallet feel technical or risky.",
      media: [
        { kind: "full", aspect: "1078 / 720", image: { src: s3a, alt: "Relai recovery phrase", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1076 / 900", image: { src: s3b, alt: "Relai security setup", bg: "#F0EBE5" } },
      ],
    },
  ],
  projects: ALL_PROJECTS,
};

export default function RelaiPage() {
  return <CaseStudy data={data} />;
}
