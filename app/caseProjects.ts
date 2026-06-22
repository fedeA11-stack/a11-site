import { type CSProject } from "./CaseStudy";

// Full project dataset. The "All projects" section at the bottom of each case
// study excludes the current page and shows 4 of the rest (see relatedProjects
// in CaseStudy). Previews come from /public/assets/All Projects, matched by title.
// Add new studies here — the section scales automatically.
export const ALL_PROJECTS: CSProject[] = [
  { name: "World Money", href: "/world/money", preview: "/assets/All%20Projects/Money.png" },
  { name: "World ID",    href: "/world/id",    preview: "/assets/All%20Projects/ID.png" },
  { name: "World Chat",  href: "/world/chat",  preview: "/assets/All%20Projects/Chat.png" },
  { name: "Orb App",     href: "/world/orb",   preview: "/assets/All%20Projects/Orb.png" },
  { name: "Atlans",      href: "/atlans",      preview: "/assets/All%20Projects/Atlans.png" },
  { name: "Freehold",    href: "/freehold",    preview: "/assets/All%20Projects/Freehold%20Mobile.png" },
  { name: "Relai",       href: "/relai",       preview: "/assets/All%20Projects/Relai.png" },
  { name: "TokenStudio", href: "/tokenstudio", preview: "/assets/All%20Projects/Tokenization.png" },
  { name: "Districts",   href: "/districts",   preview: "/assets/All%20Projects/District.png" },
  { name: "Nous",        href: "/nous",        preview: "/assets/All%20Projects/Nous.png" },
];
