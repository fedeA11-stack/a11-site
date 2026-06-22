// Centralized SEO constants. Single source of truth for the production origin so
// metadataBase, sitemap, robots, canonical URLs, and JSON-LD never drift apart.
// If the domain changes, change it here.
export const SITE_URL = "https://a11.studio";

// Contact email as used across the site (note: a11studio.com, distinct from the
// a11.studio web origin above).
export const CONTACT_EMAIL = "hello@a11studio.com";

import type { Metadata } from "next";
import type { CaseStudyData } from "./CaseStudy";

/** Flatten the "\n"-bearing display titles into a single line for metadata. */
export const flattenTitle = (s: string) => s.replace(/\s*\n\s*/g, " ").trim();

// Derives per-page Metadata from a case study's existing `data` object so titles
// and descriptions never drift from on-page content. The page title runs through
// the root template ("%s — A11 Product Studio"); OG/Twitter get the full string.
// The per-segment opengraph-image.tsx supplies the share image automatically.
export function buildCaseMetadata(data: CaseStudyData, path: string): Metadata {
  const name = data.breadcrumb;
  const fullTitle = `${name} — A11 Product Studio`;
  const description =
    data.description ??
    `${flattenTitle(data.title)} — a case study by A11 Product Studio.`;

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
  name: "A11 Product Studio",
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
    `${flattenTitle(data.title)} — a case study by A11 Product Studio.`;

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
