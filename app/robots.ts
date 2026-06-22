import type { MetadataRoute } from "next";
import { SITE_URL } from "./seo";

// Crawl directives. Allow everything (this is a public portfolio) and point
// crawlers/agents at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
