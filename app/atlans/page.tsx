import CaseStudy, { type CaseStudyData } from "../CaseStudy";
import { buildCaseMetadata } from "../seo";
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
import s1c from "../../public/assets/atlans/atlans-1-3.jpg";

export const data: CaseStudyData = {
  breadcrumb: "Atlans",
  title: "Connecting athletes,\nplaces & communities",
  description:
    "For those who don't only care about wattage and stats, but about the espresso and how they spend their time.",
  hero: { src: heroImg, alt: "Atlans hero", bg: "#F0EBE5" },
  sections: [
    {
      title: "The best spots,\ncurated for athletes",
      body: "We're curating the best athletic lifestyle spots around the world, cafés, brands, clubhouses, rentals, bike shops. Carefully and genuinely, with each place welcoming to people like us.",
      media: [
        { kind: "full", aspect: "1243 / 832", image: { src: s1a, alt: "Atlans, curated spots map", bg: "#F0EBE5" } },
        { kind: "duo", aspect: "615 / 612", images: [
          { src: s1c, alt: "Atlans, spot amenities", bg: "#F2F2F0" },
          { src: s1b, alt: "Atlans, community card", bg: "#F6F3EE" },
        ] },
      ],
    },
    {
      title: "Find your community,\nwherever you are",
      body: "Map and list views show the closest community or rental to your hotel, and which friends are up for an activity.",
      media: [
        { kind: "full", aspect: "1243 / 832", image: { src: s2a, alt: "Atlans, community home", bg: "#F0EBE5" } },
        { kind: "duo", aspect: "615 / 612", images: [
          { src: s2b, alt: "Atlans, community chat", bg: "#F0EBE5" },
          { src: s2c, alt: "Atlans, community members", bg: "#F0EBE5" },
        ] },
        { kind: "full", aspect: "1243 / 832", image: { src: s2d, alt: "Atlans, discover people nearby", bg: "#F0EBE5" } },
      ],
    },
    {
      title: "Turn every workout into\na shared experience",
      body: "A new way to plan. Pin an activity on the map yourself ('let's run this week'), or find a community on the map with fully planned events.",
      media: [
        { kind: "full", aspect: "1243 / 832", image: { src: s3a, alt: "Atlans, shared workout", bg: "#F0EBE5" } },
        { kind: "duo", aspect: "615 / 612", images: [
          { src: s3b, alt: "Atlans, workout detail", bg: "#F0EBE5" },
          { src: s3c, alt: "Atlans, workout stats", bg: "#F0EBE5" },
        ] },
        { kind: "full", aspect: "1243 / 832", image: { src: s3d, alt: "Atlans, activity overview", bg: "#F0EBE5" } },
      ],
    },
  ],
  projects: ALL_PROJECTS,
};

export const metadata = buildCaseMetadata(data, "/atlans");

export default function AtlansPage() {
  return <CaseStudy data={data} />;
}
