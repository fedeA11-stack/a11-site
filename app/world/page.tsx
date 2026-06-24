import type { Metadata } from "next";
import NavMenu from "../NavMenu";
import PageEnter from "../PageEnter";
import WorldCards from "./WorldCards";

const INK = "#282328";

export const metadata: Metadata = {
  title: "World",
  description:
    "Five years, nine people, four apps, and the number one crypto wallet. A11's work with Tools for Humanity across World App, World ID, World Chat, and the Orb App.",
  alternates: { canonical: "/world" },
  openGraph: {
    type: "article",
    title: "World · A11 Studio",
    description:
      "Five years, nine people, four apps, and the number one crypto wallet. A11's work with Tools for Humanity.",
    url: "/world",
  },
  twitter: {
    card: "summary_large_image",
    title: "World · A11 Studio",
    description: "Five years, nine people, four apps, and the number one crypto wallet.",
  },
};

// ── Page ────────────────────────────────────────────────────────────────────
export default function WorldPage() {
  return (
    <div className="bleed-root" style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <NavMenu breadcrumb={[{ label: "Work", href: "/" }, { label: "World" }]} />

      <PageEnter>
        <div className="w-full px-4 md:px-8 lg:px-[var(--bleed)]">
          {/* Headline */}
          <h1
            style={{
              margin: "104px 0 0",
              maxWidth: 616,
              fontFamily: "var(--font-system), sans-serif",
              fontWeight: 500,
              fontSize: "clamp(34px, 3.8vw, 56px)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: INK,
              textWrap: "balance",
            }}
          >
            Five years, nine people,
            <br />
            four apps, number one
            <br />
            crypto wallet.
          </h1>

          {/* Project navigation — 2×2 grid, notch + cursor pill on hover */}
          <WorldCards />
        </div>

        <div style={{ height: 120 }} aria-hidden />
      </PageEnter>
    </div>
  );
}
