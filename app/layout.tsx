import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Cursor from "./Cursor";
import Preloader from "./Preloader";
import SmoothScroll from "./SmoothScroll";
import {
  SITE_URL,
  CONTACT_EMAIL,
  CALENDLY_URL,
  STUDIO_NAME,
  STUDIO_TAGLINE,
  STUDIO_SUMMARY,
  STUDIO_FOUNDED,
  STUDIO_HEADCOUNT,
  STUDIO_DOMAINS,
} from "./seo";
import { SOCIAL_LINKS } from "./socialLinks";

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
    default: "A11 Studio · Work",
    template: "%s · A11 Studio",
  },
  description: "A11 Studio of the Ambitious.",
  applicationName: "A11 Studio",
  // Home canonical. Case studies and section pages override this with their own.
  alternates: { canonical: "/" },
  authors: [{ name: "A11 Studio" }],
  keywords: ["A11", "product studio", "product design", "design studio"],
  openGraph: {
    type: "website",
    siteName: "A11 Studio",
    title: "A11 Studio · Work",
    description: "A11 Studio of the Ambitious.",
    // Image is supplied automatically by app/opengraph-image.tsx.
  },
  twitter: {
    card: "summary_large_image",
    title: "A11 Studio · Work",
    description: "A11 Studio of the Ambitious.",
  },
};

// Real, resolvable social profiles only — placeholder hrefs ("#") are excluded so
// we never assert a profile that doesn't exist. Drives the Organization `sameAs`.
const socialProfiles = SOCIAL_LINKS.filter((l) => l.href.startsWith("http")).map(
  (l) => l.href,
);

// Sitewide structured data as a single @graph: the Organization (who the studio
// is — canonical URL, logo, founding facts, domains of expertise, contact channel,
// verified social profiles) and the WebSite (the site itself, published by the
// org). All facts are pulled from the seo.ts single source and are verified (no
// invented social profiles or claims). The org node carries an @id so the WebSite
// can reference it without duplicating the object.
const ORG_ID = `${SITE_URL}/#organization`;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: STUDIO_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
      description: STUDIO_TAGLINE,
      slogan: STUDIO_TAGLINE,
      foundingDate: STUDIO_FOUNDED,
      numberOfEmployees: { "@type": "QuantitativeValue", value: STUDIO_HEADCOUNT },
      knowsAbout: STUDIO_DOMAINS,
      email: CONTACT_EMAIL,
      ...(socialProfiles.length > 0 && { sameAs: socialProfiles }),
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: CONTACT_EMAIL,
        url: CALENDLY_URL,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: STUDIO_NAME,
      description: STUDIO_SUMMARY,
      inLanguage: "en",
      publisher: { "@id": ORG_ID },
    },
  ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Cursor />
        <Preloader />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
