import CaseStudy, { type CaseStudyData } from "../../CaseStudy";
import { buildCaseMetadata } from "../../seo";
import { ALL_PROJECTS } from "../../caseProjects";

// Assets (optimized via next/image).
import chatMain from "../../../public/assets/world-chat/chat-main.png";
import chatGroup from "../../../public/assets/world-chat/chat-group.png";
import chatVerifiedUser from "../../../public/assets/world-chat/chat-verified-user.png";
import chatPrivate from "../../../public/assets/world-chat/chat-private.jpg";
import chatSophia from "../../../public/assets/world-chat/chat-sophia.png";
import chat004 from "../../../public/assets/world-chat/chat-004.png";
import chat005 from "../../../public/assets/world-chat/chat-005.png";
import chat006 from "../../../public/assets/world-chat/chat-006.png";

// ─────────────────────────────────────────────────────────────────────────────
// World Chat — content for the canonical case-study design (Figma 1863:11469).
// ─────────────────────────────────────────────────────────────────────────────
export const data: CaseStudyData = {
  breadcrumb: "World Chat",
  section: { label: "World", href: "/world" },
  title: "Built for humans\nto talk to humans",
  description:
    "A communication layer for a world where being human can no longer be assumed. Simple to use, but grounded in real identity.",
  hero: {
    src: chatMain,
    alt: "World Chat app, hand holding phone showing chat list",
    bg: "#282328",
  },
  sections: [
    {
      title: "Designing\ntrust at scale",
      body: "As digital interactions scale globally, communication needs to remain reliable, even when identity isn’t visible. New signals within the conversation make it possible to understand who’s on the other side, without exposing personal information.",
      media: [
        {
          kind: "tallDuo",
          tall: { src: "/assets/world-chat/chat-unverified-verified.webm", alt: "Verifying a chat participant", video: true, bg: "#F0EBE5" },
          stack: [
            { src: chatGroup, alt: "Friends group with chat notification" },
            { src: chatVerifiedUser, alt: "Joseph Wilson, verified human" },
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
          image: { src: chatPrivate, alt: "Disappearing messages chat", bg: "#282328" },
        },
        {
          kind: "duo",
          images: [
            { src: "/assets/world-chat/End_to_End.mp4", alt: "End-to-end encrypted", video: true, bg: "#F0EBE5" },
            { src: chatSophia, alt: "Sophia Davis, verified human", bg: "#F0EBE5" },
          ],
        },
      ],
    },
    {
      title: "Value in\nconversation",
      body: "Transactions happen directly within chat, making value feel as simple as sending a message. From everyday use to moments of celebration, value becomes part of the conversation.",
      media: [
        {
          kind: "full",
          aspect: "1242 / 835",
          image: { src: "/assets/world-chat/Send%20Money_composition.mp4", alt: "Sending money inside a chat", video: true, bg: "#F6F3EE" },
        },
        {
          kind: "duo",
          aspect: "615 / 612",
          images: [
            { src: chat005, alt: "Choosing a token to send", bg: "#F6F3EE" },
            { src: chat004, alt: "Value shared in conversation", bg: "#F6F3EE" },
          ],
        },
        {
          kind: "full",
          aspect: "1242 / 835",
          image: { src: chat006, alt: "Sending money, phone detail", bg: "#F6F3EE" },
        },
      ],
    },
  ],
  projects: ALL_PROJECTS,
};

export const metadata = buildCaseMetadata(data, "/world/chat");

export default function WorldChatV2Page() {
  return <CaseStudy data={data} />;
}
