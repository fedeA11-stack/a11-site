import type { CaseStudyData } from "./CaseStudy";
import { ALL_PROJECTS } from "./caseProjects";

// Each case study's full content object, imported from its page module (every
// case page exports `data`). Keyed by route so we can join it to ALL_PROJECTS.
import { data as worldMoney } from "./world/money/page";
import { data as worldId } from "./world/id/page";
import { data as worldChat } from "./world/chat/page";
import { data as orb } from "./world/orb/page";
import { data as atlans } from "./atlans/page";
import { data as freehold } from "./freehold/page";
import { data as relai } from "./relai/page";
import { data as freeholdInvest } from "./freehold-invest/page";
import { data as districts } from "./districts/page";
import { data as nous } from "./nous/page";

const DATA_BY_HREF: Record<string, CaseStudyData> = {
  "/world/money": worldMoney,
  "/world/id": worldId,
  "/world/chat": worldChat,
  "/world/orb": orb,
  "/atlans": atlans,
  "/freehold": freehold,
  "/relai": relai,
  "/freehold-invest": freeholdInvest,
  "/districts": districts,
  "/nous": nous,
};

export type CaseEntry = { name: string; href: string; data: CaseStudyData };

// Cases in portfolio order, each joined to its full case-study content. Derived
// from ALL_PROJECTS so a new study flows into llms.txt / llms-full.txt the moment
// it's added to caseProjects.ts — the same drift-proofing the sitemap relies on.
// Throws at build time if a project has no content object (no hidden failures).
export const CASES: CaseEntry[] = ALL_PROJECTS.flatMap(({ name, href }) => {
  if (!href) return [];
  const data = DATA_BY_HREF[href];
  if (!data) {
    throw new Error(
      `caseData: ALL_PROJECTS entry "${name}" (${href}) has no CaseStudyData. ` +
        `Add its page's exported \`data\` to DATA_BY_HREF in app/caseData.ts.`,
    );
  }
  return [{ name, href, data }];
});
