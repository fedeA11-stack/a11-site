import type { MetadataRoute } from "next";
import { SITE_URL } from "./seo";
import { ALL_PROJECTS } from "./caseProjects";

// Full route map. Top-level pages are listed explicitly; the 9 case studies are
// derived from ALL_PROJECTS so new studies appear in the sitemap automatically.
export default function sitemap(): MetadataRoute.Sitemap {
  const topLevel = [
    { path: "/", priority: 1.0, changeFrequency: "monthly" as const },
    { path: "/world", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/studio", priority: 0.7, changeFrequency: "yearly" as const },
    { path: "/manifesto", priority: 0.6, changeFrequency: "yearly" as const },
  ];

  const caseStudies = ALL_PROJECTS.map((project) => ({
    path: project.href,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  return [...topLevel, ...caseStudies].map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency,
    priority,
  }));
}
