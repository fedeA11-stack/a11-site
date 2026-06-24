// Centralized SEO constants. Single source of truth for the production origin so
// metadataBase, sitemap, robots, canonical URLs, and JSON-LD never drift apart.
// If the domain changes, change it here.
export const SITE_URL = "https://a11.studio";

// Contact email as used across the site — matches the a11.studio web origin and
// the address the contact form sends to / displays.
export const CONTACT_EMAIL = "hello@a11.studio";

// Booking link — single source for the Calendly URL used in JSON-LD, llms.txt, etc.
export const CALENDLY_URL = "https://calendly.com/a11studio";

// ── Studio profile (single source of truth for agent-facing prose) ───────────
// Used by the Organization JSON-LD, llms.txt, and llms-full.txt so the studio's
// self-description never drifts between the human site and the agent surfaces.
// Verified facts only: founded 2019, nine people. Update here, everything follows.
export const STUDIO_NAME = "A11 Studio";
export const STUDIO_TAGLINE = "A11 Studio of the Ambitious.";
export const STUDIO_FOUNDED = "2019";
export const STUDIO_HEADCOUNT = 9;
export const STUDIO_DOMAINS = ["crypto", "identity", "fintech", "real-world assets"];

export const STUDIO_SUMMARY =
  'A11 is a product design studio "of the Ambitious" — nine people designing digital ' +
  "products together since 2019. Their longest engagement was five years with Tools for " +
  "Humanity, designing World App from scratch into one of the most widely used mobile " +
  "wallets in the world. The work spans crypto, identity, fintech, and real-world-asset products.";

export const STUDIO_SERVICES =
  "end-to-end product design — product/UX, brand and visual identity, and web — for " +
  "ambitious startups and scale-ups, in crypto, identity, fintech, and real-world-asset " +
  "products. Engagements range from focused project work to multi-year embedded partnerships.";

// Non-case-study routes, for the llms.txt index. Case studies are derived from
// caseProjects.ts (see app/caseData.ts), so only these handful are listed here.
export const STUDIO_PAGES: { name: string; href: string; blurb: string }[] = [
  { name: "Studio", href: "/studio", blurb: "About A11 — the team, history, and approach to product design." },
  { name: "Manifesto", href: "/manifesto", blurb: "The studio's design philosophy and principles." },
  { name: "Work", href: "/", blurb: "The full portfolio index." },
  { name: "Contact", href: "/contact", blurb: "Get in touch with the studio — start a project or book a call." },
];

/** First sentence of a description — used for the punchy llms.txt index line. */
export const firstSentence = (s: string) => {
  const m = s.match(/^.*?[.!?](?=\s|$)/);
  return (m ? m[0] : s).trim();
};

import type { Metadata } from "next";
import type { CaseStudyData } from "./CaseStudy";

/** Flatten the "\n"-bearing display titles into a single line for metadata. */
export const flattenTitle = (s: string) => s.replace(/\s*\n\s*/g, " ").trim();

// Derives per-page Metadata from a case study's existing `data` object so titles
// and descriptions never drift from on-page content. The page title runs through
// the root template ("%s — A11 Studio"); OG/Twitter get the full string.
// The per-segment opengraph-image.tsx supplies the share image automatically.
export function buildCaseMetadata(data: CaseStudyData, path: string): Metadata {
  const name = data.breadcrumb;
  const fullTitle = `${name} · A11 Studio`;
  const description =
    data.description ??
    `${flattenTitle(data.title)}. A case study by A11 Studio.`;

  return {
    title: name,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: fullTitle,
      description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

const ORGANIZATION_REF = {
  "@type": "Organization",
  name: "A11 Studio",
  url: SITE_URL,
};

// Structured data for a case study: BreadcrumbList (mirrors the on-page crumb
// trail) + CreativeWork (the portfolio piece itself). Emitted as a single @graph
// so AI agents and search engines can place the page in the site hierarchy and
// understand it as a work by the studio. Returns a plain object — stringify and
// drop into a <script type="application/ld+json">.
export function caseStudyJsonLd(data: CaseStudyData, path: string) {
  const url = `${SITE_URL}${path}`;
  const name = data.breadcrumb;
  const description =
    data.description ??
    `${flattenTitle(data.title)}. A case study by A11 Studio.`;

  const crumbs = [
    { name: "Work", item: `${SITE_URL}/` },
    ...(data.section ? [{ name: data.section.label, item: `${SITE_URL}${data.section.href}` }] : []),
    { name, item: url },
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          item: c.item,
        })),
      },
      {
        "@type": "CreativeWork",
        name,
        headline: flattenTitle(data.title),
        description,
        url,
        image: `${url}/opengraph-image`,
        inLanguage: "en",
        creator: ORGANIZATION_REF,
        publisher: ORGANIZATION_REF,
      },
    ],
  };
}
