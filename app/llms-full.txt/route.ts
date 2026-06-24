import {
  SITE_URL,
  CONTACT_EMAIL,
  CALENDLY_URL,
  STUDIO_NAME,
  STUDIO_SUMMARY,
  STUDIO_SERVICES,
  STUDIO_PAGES,
  flattenTitle,
} from "../seo";
import { CASES, type CaseEntry } from "../caseData";

// The llms.txt deep-content companion: the full prose of every case study
// concatenated into one document, so an agent can understand the studio's entire
// body of work in a single fetch instead of crawling 10 pages. Generated from the
// same `data` objects the pages render, so the text can never drift from the site.
export const dynamic = "force-static";

function caseBlock({ name, href, data }: CaseEntry): string {
  const parts: string[] = [`## ${name}`, `URL: ${SITE_URL}${href}`, "", flattenTitle(data.title)];

  if (data.description) parts.push("", data.description);

  for (const section of data.sections) {
    if (section.title) parts.push("", `### ${flattenTitle(section.title)}`);
    if (section.body) parts.push("", section.body);
  }

  return parts.join("\n");
}

function buildLlmsFull(): string {
  const cases = CASES.map(caseBlock).join("\n\n---\n\n");
  const studio = STUDIO_PAGES.map(
    (p) => `- ${p.name}: ${SITE_URL}${p.href} — ${p.blurb}`,
  ).join("\n");

  return `# ${STUDIO_NAME} — Full Profile

> ${STUDIO_SUMMARY}

Services: ${STUDIO_SERVICES}

To engage: email ${CONTACT_EMAIL} or book a call at ${CALENDLY_URL}.

This document carries the full text of every case study, for agents that want the
studio's complete body of work in one fetch. The short index lives at ${SITE_URL}/llms.txt.

# Case studies

${cases}

# Studio pages

${studio}
`;
}

export function GET(): Response {
  return new Response(buildLlmsFull(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
