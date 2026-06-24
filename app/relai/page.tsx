import CaseStudy, { type CaseStudyData } from "../CaseStudy";
import { buildCaseMetadata } from "../seo";
import { ALL_PROJECTS } from "../caseProjects";

import heroImg from "../../public/assets/relai/relai-hero.jpg";
import s1a from "../../public/assets/relai/relai-1-1.jpg";
import s1b from "../../public/assets/relai/relai-1-2.jpg";
import s1c from "../../public/assets/relai/relai-1-3.jpg";
import s2a from "../../public/assets/relai/relai-2-1.jpg";
import s3a from "../../public/assets/relai/relai-3-1.jpg";
import s3b from "../../public/assets/relai/relai-3-2.jpg";
import s3c from "../../public/assets/relai/relai-3-3.jpg";
import s3d from "../../public/assets/relai/relai-3-4.jpg";
import s3e from "../../public/assets/relai/relai-3-5.jpg";
import s4a from "../../public/assets/relai/relai-4-1.jpg";
import s4b from "../../public/assets/relai/relai-4-2.jpg";
import s4c from "../../public/assets/relai/relai-4-3.jpg";

// ─────────────────────────────────────────────────────────────────────────────
// Relai — case study rendered through the canonical case-study template
// (Figma 1871:43569). Tile grid + aspect ratios mirror the Figma `img` frames
// exactly, including side-by-side duos.
// ─────────────────────────────────────────────────────────────────────────────
export const data: CaseStudyData = {
  breadcrumb: "Relai",
  title: "Making Bitcoin\nsaving feel simple",
  description:
    "Relai is a Bitcoin-only wallet designed to help people buy, save, and self-custody Bitcoin through a simple mobile experience built around ownership and long-term confidence.",
  hero: { src: heroImg, alt: "Relai app, Bitcoin savings", bg: "#F0EBE5" },
  sections: [
    {
      title: "Bitcoin without\nthe noise",
      body: "Most crypto products overwhelm users with coins, charts, exchanges, and trading language. Relai took a different path, one asset, one clear purpose, and a wallet experience focused on helping people build Bitcoin savings over time.",
      media: [
        { kind: "full", aspect: "1076 / 900", image: { src: s1a, alt: "Relai wallet overview", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1076 / 900", image: { src: s1b, alt: "Relai Bitcoin balance", bg: "#F0EBE5" } },
        { kind: "full", aspect: "1076 / 900", image: { src: s1c, alt: "Relai portfolio detail", bg: "#F0EBE5" } },
      ],
    },
    {
      media: [
        { kind: "full", aspect: "1076 / 900", image: { src: s2a, alt: "Relai Lightning setup", bg: "#F0EBE5" } },
      ],
    },
    {
      title: "From first buy\nto long-term saving",
      body: "The experience needed to make buying Bitcoin feel understandable from the first interaction, while supporting repeat behavior through clear balances, simple purchase flows, and recurring savings plans.",
      media: [
        { kind: "duo", aspect: "533 / 900", images: [
          { src: s3a, alt: "Relai buy amount", bg: "#F0EBE5" },
          { src: s3b, alt: "Relai purchase confirmation", bg: "#F0EBE5" },
        ] },
        { kind: "full", aspect: "1076 / 720", image: { src: s3c, alt: "Relai payment methods", bg: "#F0EBE5" } },
        { kind: "duo", aspect: "533 / 900", images: [
          { src: s3d, alt: "Relai holdings overview", bg: "#F0EBE5" },
          { src: s3e, alt: "Relai monthly auto-invest", bg: "#F0EBE5" },
        ] },
      ],
    },
    {
      title: "Self-custody\nwithout the fear",
      body: "Self-custody is powerful, but it can also feel intimidating. The product had to help users understand ownership, recovery, and responsibility without making the wallet feel technical or risky.",
      media: [
        { kind: "full", aspect: "1078 / 720", image: { src: s4a, alt: "Relai hardware wallets", bg: "#F0EBE5" } },
        { kind: "duo", aspect: "533 / 900", images: [
          { src: s4b, alt: "Relai recovery phrase", bg: "#F0EBE5" },
          { src: s4c, alt: "Relai security setup", bg: "#F0EBE5" },
        ] },
      ],
    },
  ],
  projects: ALL_PROJECTS,
};

export const metadata = buildCaseMetadata(data, "/relai");

export default function RelaiPage() {
  return <CaseStudy data={data} />;
}
