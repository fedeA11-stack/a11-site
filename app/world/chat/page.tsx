import CaseStudy, { type CaseStudyData } from "../../CaseStudy";
import { ALL_PROJECTS } from "../../caseProjects";

// Assets (optimized via next/image).
import chatMain from "../../../public/assets/world-chat/chat-main.png";
import chatGroup from "../../../public/assets/world-chat/chat-group.png";
import chatVerifiedUser from "../../../public/assets/world-chat/chat-verified-user.png";
import chatPrivate from "../../../public/assets/world-chat/chat-private.jpg";
import chatSophia from "../../../public/assets/world-chat/chat-sophia.png";

// ─────────────────────────────────────────────────────────────────────────────
// World Chat — content for the canonical case-study design (Figma 1863:11469).
// ─────────────────────────────────────────────────────────────────────────────
const data: CaseStudyData = {
  breadcrumb: "World Chat",
  section: { label: "World", href: "/world" },
  title: "Built for humans\nto talk to humans",
  description:
    "A communication layer designed for a world where being human can no longer be assumed, simple to use, yet grounded in identity, trust, and interaction.",
  meta: [
    { label: "Industry", value: "Technology, Financial" },
    { label: "Services", value: "UX/UI, Strategy, Visual Design" },
    { label: "Year", value: "2021 - Ongoing" },
  ],
  hero: {
    src: chatMain,
    alt: "World Chat app — hand holding phone showing chat list",
    bg: "#2A1F17",
  },
  sections: [
    {
      title: "Designing\nTrust At Scale",
      body: "As digital interactions scale globally, communication needs to remain reliable, even when identity isn’t visible. New signals within the conversation make it possible to understand who’s on the other side, without exposing personal information.",
      media: [
        {
          kind: "tallDuo",
          tall: { src: "/assets/world-chat/chat-unverified-verified.webm", alt: "Verifying a chat participant", video: true, bg: "#F0EBE5" },
          stack: [
            { src: chatGroup, alt: "Friends group with chat notification" },
            { src: chatVerifiedUser, alt: "Joseph Wilson — verified human" },
          ],
        },
      ],
    },
    {
      title: "Private\nby design",
      body: "Conversations are end-to-end encrypted by default, ensuring that only participants can access what’s shared. Features like disappearing messages give users control over how long interactions persist, making privacy part of the experience.",
      media: [
        {
          kind: "full",
          aspect: "1242 / 835",
          image: { src: chatPrivate, alt: "Disappearing messages chat", bg: "#1A1A1A" },
        },
        {
          kind: "duo",
          images: [
            { alt: "End-to-end encrypted", icon: "lock", bg: "#F0EBE5" },
            { src: chatSophia, alt: "Sophia Davis — verified human", bg: "#F0EBE5" },
          ],
        },
      ],
    },
  ],
  projects: ALL_PROJECTS,
};

export default function WorldChatV2Page() {
  return <CaseStudy data={data} />;
}
