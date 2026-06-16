import CaseStudy, { type CaseStudyData } from "../CaseStudy";
import { ALL_PROJECTS } from "../caseProjects";

import heroImg from "../../public/assets/districts/dis-hero.jpg";
import s1a from "../../public/assets/districts/dis-1-1.jpg";
import s1b from "../../public/assets/districts/dis-1-2.jpg";
import s2a from "../../public/assets/districts/dis-2-1.jpg";
import s2b from "../../public/assets/districts/dis-2-2.jpg";
import s3a from "../../public/assets/districts/dis-3-1.jpg";
import s3b from "../../public/assets/districts/dis-3-2.jpg";
import s4a from "../../public/assets/districts/dis-4-1.jpg";
import s5a from "../../public/assets/districts/dis-5-1.jpg";
import s5b from "../../public/assets/districts/dis-5-2.jpg";

// ─────────────────────────────────────────────────────────────────────────────
// Districts — content from Figma frame 1871:30025. Composed scenes (hero,
// section 1 map) were exported as their bounding parent frames, not as
// individual overlapping layers.
// ─────────────────────────────────────────────────────────────────────────────
const data: CaseStudyData = {
  breadcrumb: "Districts",
  title: "Designing a world\nyou can own",
  description:
    "Districts turns real cities into a grid of claimable land. We designed the experience that lets anyone own a piece of the map, trade it, and help decide what opens next.",
  hero: { src: heroImg, alt: "Districts — own a piece of the map", bg: "#F0EBE5" },
  sections: [
    {
      title: "A map you\nalready know",
      body: "Owning digital land only makes sense if you can see it, so we made the map the product. Real cities, rendered as a grid of ownable parcels, every district legible the moment it loads. Buying, bidding, and activity all happen in place, on the map, instead of buried in menus.",
      media: [
        { kind: "full", aspect: "2981 / 1936", image: { src: s1a, alt: "Districts map with owned parcels", bg: "#F0EBE5" } },
        { kind: "full", aspect: "2152 / 1060", image: { src: s1b, alt: "District detail on the map", bg: "#F0EBE5" } },
      ],
    },
    {
      quote: {
        text: "A11 made a complicated idea feel obvious. They didn't just design screens. They designed the way people understand owning a piece of the world.",
      },
    },
    {
      title: "A marketplace\nanyone can use",
      body: "We built the marketplace around actions everyone already knows: browse, buy now, place a bid. The genuinely crypto steps, funding your wallet and confirming a purchase, stay clear and guided rather than hidden.",
      media: [
        { kind: "full", aspect: "1877 / 3115", image: { src: s2a, alt: "Districts marketplace flow", bg: "#F0EBE5" } },
        { kind: "full", aspect: "2152 / 1060", image: { src: s2b, alt: "Buy now and place a bid", bg: "#F0EBE5" } },
      ],
    },
    {
      title: "Land that works\nwhile you hold it",
      body: "Owning a district isn't passive. Staking lives right on the asset. Stake your land and your $DSTRX, watch rewards build, claim in a tap. Earning feels like managing property, not running a protocol.",
      media: [
        { kind: "full", aspect: "1877 / 1832", image: { src: s3a, alt: "Staking on a district asset", bg: "#F0EBE5" } },
        { kind: "full", aspect: "2152 / 1800", image: { src: s3b, alt: "Rewards building and claiming", bg: "#F0EBE5" } },
      ],
    },
    {
      title: "Run by\nits community",
      body: "What opens next is decided by the people who own Districts, not a company. Every $DSTRX vote pushes a city closer to opening, and the economy stays open to anyone — nothing you have to take on trust.",
      media: [
        { kind: "full", aspect: "2152 / 1060", image: { src: s4a, alt: "Community voting to open cities", bg: "#F0EBE5" } },
      ],
    },
    {
      title: "A world worth entering",
      body: "The work didn't stop at the product. We shaped the front door too — the landing page, the brand, and the voice it carries online. So the very first thing people meet already feels like a place with a future worth owning.",
      media: [
        { kind: "full", aspect: "2152 / 1044", image: { src: s5a, alt: "Districts landing page", bg: "#F0EBE5" } },
        { kind: "full", aspect: "2653 / 1998", image: { src: s5b, alt: "Districts brand and voice", bg: "#F0EBE5" } },
      ],
    },
  ],
  projects: ALL_PROJECTS,
};

export default function DistrictsPage() {
  return <CaseStudy data={data} />;
}
