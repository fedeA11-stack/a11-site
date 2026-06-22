import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Cursor from "./Cursor";
import Preloader from "./Preloader";
import SmoothScroll from "./SmoothScroll";
import { SITE_URL, CONTACT_EMAIL } from "./seo";

// ── System Unlicensed Trial — self-hosted via next/font/local ────────────────
// Replaces the 8 hand-rolled @font-face blocks in globals.css. next/font adds a
// size-adjusted fallback (kills CLS) and manages preload. Exposed as the CSS
// variable --font-system, which globals.css / body reference.
const systemFont = localFont({
  src: [
    { path: "../public/fonts/SystemUnlicensedTrial-Light.otf", weight: "300", style: "normal" },
    { path: "../public/fonts/SystemUnlicensedTrial-LightItalic.otf", weight: "300", style: "italic" },
    { path: "../public/fonts/SystemUnlicensedTrial-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/SystemUnlicensedTrial-Italic.otf", weight: "400", style: "italic" },
    { path: "../public/fonts/SystemUnlicensedTrial-Medium.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/SystemUnlicensedTrial-MediumItalic.otf", weight: "500", style: "italic" },
    { path: "../public/fonts/SystemUnlicensedTrial-Bold.otf", weight: "700", style: "normal" },
    { path: "../public/fonts/SystemUnlicensedTrial-BoldItalic.otf", weight: "700", style: "italic" },
  ],
  display: "swap",
  variable: "--font-system",
});

const geistMono = localFont({
  src: "../public/fonts/GeistMono-SemiBold.ttf",
  weight: "600",
  display: "swap",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  // Production origin — makes OpenGraph/Twitter image and canonical URLs resolve absolutely.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "A11 Product Studio — Work",
    template: "%s — A11 Product Studio",
  },
  description: "A11 Product Studio of the Ambitious.",
  applicationName: "A11 Product Studio",
  // Home canonical. Case studies and section pages override this with their own.
  alternates: { canonical: "/" },
  authors: [{ name: "A11 Product Studio" }],
  keywords: ["A11", "product studio", "product design", "design studio"],
  openGraph: {
    type: "website",
    siteName: "A11 Product Studio",
    title: "A11 Product Studio — Work",
    description: "A11 Product Studio of the Ambitious.",
    // Image is supplied automatically by app/opengraph-image.tsx.
  },
  twitter: {
    card: "summary_large_image",
    title: "A11 Product Studio — Work",
    description: "A11 Product Studio of the Ambitious.",
  },
};

// Organization schema — lets search engines and AI agents identify the studio,
// its canonical URL, logo, and contact channel. Only verified facts are included
// (no invented social profiles).
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "A11 Product Studio",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  description: "A11 Product Studio of the Ambitious.",
  email: CONTACT_EMAIL,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: CONTACT_EMAIL,
    url: "https://calendly.com/a11studio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${systemFont.variable} ${geistMono.variable}`}>
      <body style={{ margin: 0, padding: 0 }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Cursor />
        <Preloader />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
