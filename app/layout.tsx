import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Cursor from "./Cursor";
import Preloader from "./Preloader";

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

export const metadata: Metadata = {
  title: "A11 Product Studio — Work",
  description: "A11 Product Studio of the Ambitious",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={systemFont.variable}>
      <body style={{ margin: 0, padding: 0 }}>
        <Cursor />
        <Preloader />
        {children}
      </body>
    </html>
  );
}
