import {
  SITE_URL,
  CONTACT_EMAIL,
  CALENDLY_URL,
  STUDIO_NAME,
  STUDIO_SUMMARY,
  STUDIO_SERVICES,
  STUDIO_PAGES,
  firstSentence,
} from "../seo";
import { CASES } from "../caseData";

// Agent-facing index, generated from the same sources as the sitemap and page
// metadata (caseData.ts → ALL_PROJECTS + each case's `data`). Hand-editing is no
// longer possible, so it can't drift: add a case to caseProjects.ts and it shows
// up here automatically. Prerendered as a static file at build time.
export const dynamic = "force-static";

function buildLlmsTxt(): string {
  const cases = CASES.map(({ name, href, data }) => {
    const blurb = data.description ? firstSentence(data.description) : name;
    return `- [${name}](${SITE_URL}${href}): ${blurb}`;
  }).join("\n");

  const studio = STUDIO_PAGES.map(
    (p) => `- [${p.name}](${SITE_URL}${p.href}): ${p.blurb}`,
  ).join("\n");

  return `# ${STUDIO_NAME}

> ${STUDIO_SUMMARY}

Services: ${STUDIO_SERVICES}

To engage: email ${CONTACT_EMAIL} or book a call at ${CALENDLY_URL}.

Full text of every case study (one document): ${SITE_URL}/llms-full.txt

## Case studies

${cases}

## Studio

${studio}
`;
}

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
