import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve AVIF first (smaller than WebP), fall back to WebP, then the original.
  // Applies to every next/image on the site (homepage cards, case-study tiles).
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Drop the X-Powered-By: Next.js fingerprint header (safe default).
  poweredByHeader: false,

  // Long-lived caching for the immutable static media in /assets. These files
  // are content-stable (renamed when their content changes), so a 1-year
  // immutable cache is safe and keeps the large images/videos out of repeat
  // download paths.
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
