import CaseStudy, { type CaseStudyData } from "../CaseStudy";
import { buildCaseMetadata } from "../seo";
import { ALL_PROJECTS } from "../caseProjects";

import heroImg from "../../public/assets/districts/dis-hero.jpg";
import disAvatar from "../../public/assets/districts/Derek.jpg";
import s1a from "../../public/assets/districts/dis-1-1.jpg";
import s1b from "../../public/assets/districts/dis-1-2.jpg";
import s1c from "../../public/assets/districts/dis-1-3.jpg";
import s2a from "../../public/assets/districts/dis-2-1.jpg";
import s2b from "../../public/assets/districts/dis-2-2.jpg";
import s2c from "../../public/assets/districts/dis-2-3.jpg";
import s3a from "../../public/assets/districts/dis-3-1.jpg";
import s3b from "../../public/assets/districts/dis-3-2.jpg";
import s3c from "../../public/assets/districts/dis-3-3.jpg";
import s3d from "../../public/assets/districts/dis-3-4.jpg";
import s4a from "../../public/assets/districts/dis-4-1.jpg";
import s4b from "../../public/assets/districts/dis-4-2.jpg";
import s4c from "../../public/assets/districts/dis-4-3.jpg";
import s5a from "../../public/assets/districts/dis-5-1.png";
import s5b from "../../public/assets/districts/dis-5-2.png";
import s5c from "../../public/assets/districts/dis-5-3.png";
import s5d from "../../public/assets/districts/dis-5-4.png";
import s5e from "../../public/assets/districts/dis-5-5.png";

// ─────────────────────────────────────────────────────────────────────────────
// Districts — case study rendered through the canonical case-study template.
// Tile grid + aspect ratios mirror the Figma `img` frames (root 1871:30025).
// Stats row, pull quote, duos and a tallDuo all map to Figma's actual layout.
// ─────────────────────────────────────────────────────────────────────────────
export const data: CaseStudyData = {
  breadcrumb: "Districts",
  title: "Designing a world\nyou can own",
  description:
    "Districts turns real cities into a grid of claimable land. We designed the experience that lets anyone own a piece of the map, trade it, and help decide what opens next.",
  hero: { src: heroImg, alt: "Districts, own a piece of the map", bg: "#F0EBE5" },
  sections: [
    // Stats row (Figma y1469)
    {
      stats: [
        { value: "5.6K+", label: "Districts Minted" },
        { value: "12.3K+", label: "Token holders" },
        { value: "36M+", label: "Tokens staked" },
      ],
    },
    // A map you already know (y1870)
    {
      title: "A map you\nalready know",
      body: "Owning digital land only makes sense if you can see it, so we made the map the product. Real cities, rendered as a grid of ownable parcels, every district legible the moment it loads. Buying, bidding, and activity all happen in place, on the map, instead of buried in menus.",
      media: [
        { kind: "full", aspect: "1076 / 723", image: { src: s1a, alt: "Districts map with owned parcels", bg: "#F0EBE5" } },
        { kind: "duo", aspect: "533 / 530", images: [
          { src: s1b, alt: "District detail on the map", bg: "#F0EBE5" },
          { src: s1c, alt: "Parcel ownership view", bg: "#F0EBE5" },
        ] },
      ],
    },
    // Pull quote (y3563)
    {
      quote: {
        text: "“A11 made a complicated idea feel obvious. They didn't just design screens. They designed the way people understand owning a piece of the world.”",
        author: "Derek Boirun",
        role: "CEO of Realio",
        avatar: disAvatar,
        align: "center",
      },
    },
    // A marketplace anyone can use (y4065)
    {
      title: "A marketplace\nanyone can use",
      body: "We built the marketplace around actions everyone already knows: browse, buy now, place a bid. The genuinely crypto steps, funding your wallet and confirming a purchase, stay clear and guided rather than hidden.",
      media: [
        { kind: "full", aspect: "1076 / 642", image: { src: s2a, alt: "Districts marketplace overview", bg: "#F0EBE5" } },
        { kind: "duo", aspect: "533 / 530", images: [
          { src: s2b, alt: "Buy now flow", bg: "#F0EBE5" },
          { src: s2c, alt: "Place a bid flow", bg: "#F0EBE5" },
        ] },
      ],
    },
    // Land that works while you hold it (y5614)
    {
      title: "Land that works\nwhile you hold it",
      body: "Owning a district isn't passive. Staking lives right on the asset. Stake your land and your $DSTRX, watch rewards build, claim in a tap. Earning feels like managing property, not running a protocol.",
      media: [
        { kind: "full", aspect: "1076 / 740", image: { src: s3a, alt: "Staking on a district asset", bg: "#F0EBE5" } },
        { kind: "tallDuo",
          tall: { src: s3b, alt: "Wallet staking detail", bg: "#F0EBE5" },
          stack: [
            { src: s3c, alt: "Rewards building", bg: "#F0EBE5" },
            { src: s3d, alt: "Claiming rewards", bg: "#F0EBE5" },
          ],
        },
      ],
    },
    // Run by its community (y7631)
    {
      title: "Run by\nits community",
      body: "What opens next is decided by the people who own Districts, not a company. Every $DSTRX vote pushes a city closer to opening, and the economy stays open to anyone, nothing you have to take on trust.",
      media: [
        { kind: "full", aspect: "1076 / 690", image: { src: s4a, alt: "Community voting to open cities", bg: "#F0EBE5" } },
        { kind: "duo", aspect: "533 / 530", images: [
          { src: s4b, alt: "Governance proposal", bg: "#F0EBE5" },
          { src: s4c, alt: "Vote tally toward opening", bg: "#F0EBE5" },
        ] },
      ],
    },
    // A world worth entering (y9228)
    {
      title: "A world\nworth entering",
      body: "The work didn't stop at the product. We shaped the front door too. The landing page, the brand, and the voice it carries online. So the very first thing people meet already feels like a place with a future worth owning.",
      media: [
        // Row 1: left stack 344px (icon 344×225 + brand 344×366), right landing page 889×603
        { kind: "tallDuo",
          stackFirst: true,
          columns: "344fr 889fr",
          tall: { src: s5b, alt: "Districts landing page", bg: "#F0EBE5" },
          tallAspect: "889 / 603",
          stack: [
            { src: s5a, alt: "Districts app icon", bg: "#F0EBE5" },
            { src: s5c, alt: "Districts brand identity", bg: "#F0EBE5" },
          ],
          stackAspects: ["344 / 225", "344 / 366"],
        },
        // Row 2: wide gradient 754×563, narrow social card 479×563
        { kind: "duo",
          columns: "754fr 479fr",
          aspects: ["754 / 563", "479 / 563"],
          images: [
            { src: s5d, alt: "Districts brand application", bg: "#F0EBE5" },
            { src: s5e, alt: "Districts social profile", bg: "#F0EBE5" },
          ],
        },
      ],
    },
  ],
  projects: ALL_PROJECTS,
};

export const metadata = buildCaseMetadata(data, "/districts");

export default function DistrictsPage() {
  return <CaseStudy data={data} />;
}
