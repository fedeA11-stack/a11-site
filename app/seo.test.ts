import { describe, it, expect } from "vitest";
import { firstSentence, flattenTitle, STUDIO_PAGES } from "./seo";

// firstSentence powers the punchy one-liner on each llms.txt index entry — it
// must take only the first sentence of a multi-sentence case description and
// never lose a single-sentence one.
describe("firstSentence", () => {
  it("returns only the first sentence of a multi-sentence description", () => {
    const desc =
      "Freehold brings portfolio tracking into one mobile experience. Built for modern investors, it simplifies onchain wealth management.";
    expect(firstSentence(desc)).toBe(
      "Freehold brings portfolio tracking into one mobile experience.",
    );
  });

  it("returns a single-sentence description unchanged (with trailing period)", () => {
    expect(firstSentence("A shared intelligence layer.")).toBe(
      "A shared intelligence layer.",
    );
  });

  it("returns the whole string when there is no sentence terminator", () => {
    expect(firstSentence("Bringing athletes, places, and communities together")).toBe(
      "Bringing athletes, places, and communities together",
    );
  });

  it("does not split on a mid-sentence decimal or abbreviation period followed by no space", () => {
    expect(firstSentence("Version 2.0 ships today. More soon.")).toBe(
      "Version 2.0 ships today.",
    );
  });
});

// flattenTitle collapses the "\n"-bearing display titles into a single line for
// metadata, JSON-LD, and llms-full.txt headings.
describe("flattenTitle", () => {
  it("joins newline-separated title lines with single spaces", () => {
    expect(flattenTitle("Invest and manage\non the move")).toBe("Invest and manage on the move");
  });

  it("trims and collapses surrounding whitespace around the break", () => {
    expect(flattenTitle("  Control without  \n  complexity  ")).toBe("Control without complexity");
  });
});

// The llms.txt index lists these non-case routes; guard against an empty or
// malformed list (every entry needs a name, an absolute-from-root href, a blurb).
describe("STUDIO_PAGES", () => {
  it("is non-empty and every entry is well-formed", () => {
    expect(STUDIO_PAGES.length).toBeGreaterThan(0);
    for (const p of STUDIO_PAGES) {
      expect(p.name).toBeTruthy();
      expect(p.href.startsWith("/")).toBe(true);
      expect(p.blurb).toBeTruthy();
    }
  });
});
