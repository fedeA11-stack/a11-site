import type { MetadataRoute } from "next";

// Web app manifest — completes the metadata surface (PWA install, theme color,
// icons). Colors mirror the site: ink #282328 on white. Reuses the existing
// app icons via Next's file conventions.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "A11 Studio",
    short_name: "A11",
    description: "A11 Studio of the Ambitious.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#282328",
    icons: [
      { src: "/favicon.ico", sizes: "16x16 32x32", type: "image/x-icon" },
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
  };
}
