# Plan 010: Close the SEO metadata gaps (contact sitemap + OG, Nous OG image)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat a6d217d..HEAD -- app/sitemap.ts app/contact/page.tsx app/nous`
> Compare the "Current state" excerpts against the live code before proceeding;
> on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: SEO
- **Planned at**: commit `a6d217d`, 2026-06-23

## Why this matters

The site's SEO surface is otherwise mature (metadataBase, per-case OG images,
JSON-LD, robots, manifest). Three concrete gaps remain:
1. **`/contact` is absent from the sitemap** (`app/sitemap.ts`) — a key
   conversion page that crawlers should see in the machine-readable route map.
2. **`/contact` has no OpenGraph/Twitter metadata** — shares of the contact page
   get no rich card title/description (it falls back to the root OG image only).
3. **`/nous` has no per-route `opengraph-image`** while all nine other case
   studies do — Nous shares use the generic studio image instead of a branded one.

All three are additive and low-risk.

## Current state

`app/sitemap.ts` (top-level list):
```ts
const topLevel = [
  { path: "/", priority: 1.0, changeFrequency: "monthly" as const },
  { path: "/world", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/studio", priority: 0.7, changeFrequency: "yearly" as const },
  { path: "/manifesto", priority: 0.6, changeFrequency: "yearly" as const },
];
```
(The 10 case studies — including the four `/world/*` subpages — are appended
automatically from `ALL_PROJECTS`, so they are already covered. Only `/contact`
is missing.)

`app/contact/page.tsx:7-11` — metadata has no `openGraph`/`twitter`:
```ts
export const metadata: Metadata = {
  title: "Let's Talk",
  description: "Got an idea we can help with? Want to join our team? Reach out to A11 Product Studio.",
  alternates: { canonical: "/contact" },
};
```

Per-case OG images use a shared helper. Exemplar — `app/relai/opengraph-image.tsx`
(entire file):
```tsx
import { caseStudyOgImage, size, contentType } from "../og";

export { size, contentType };
export const alt = "Relai — A11 Product Studio case study";

export default function Image() {
  return caseStudyOgImage("Relai", "Making Bitcoin saving feel simple");
}
```
`app/nous/opengraph-image.tsx` **does not exist**. Nous's on-page data
(`app/nous/page.tsx`): `breadcrumb: "Nous"`, `title: "Designing a shared\nintelligence layer"`.

The root OG metadata defaults live in `app/layout.tsx:49-60` (siteName,
type:"website") — `/contact`'s OG should mirror that shape with page-specific
title/description/url, matching how case studies set theirs in
`app/seo.ts:132-143`.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Typecheck | `npm run typecheck` | exit 0, no errors |
| Lint | `npm run lint` | exit 0 |
| Build | `npm run build` | exit 0 |
| Confirm OG route built | (after build) `find .next -path '*nous*opengraph*'` | a generated entry exists |

## Scope

**In scope**:
- `app/sitemap.ts` — add the `/contact` entry.
- `app/contact/page.tsx` — add `openGraph` + `twitter` to the existing metadata.
- `app/nous/opengraph-image.tsx` — **create** (mirror the Relai exemplar).

**Out of scope** (do NOT touch):
- `app/seo.ts`, `app/layout.tsx`, `app/robots.ts`, `app/manifest.ts`.
- The contact email value — handled by plan 011.
- The body/JSX of the contact page (only its `metadata` export).
- Breadcrumb/WebSite JSON-LD — deferred (see Maintenance notes).

## Git workflow

- Branch: `advisor/010-seo-metadata-gaps`
- One commit. Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Add `/contact` to the sitemap

In `app/sitemap.ts`, append to the `topLevel` array (after `/manifesto`):
```ts
{ path: "/contact", priority: 0.7, changeFrequency: "yearly" as const },
```
**Verify**: `grep -n '"/contact"\|/contact' app/sitemap.ts` → 1 match.

### Step 2: Add OpenGraph + Twitter to the contact page metadata

In `app/contact/page.tsx`, extend the `metadata` object to:
```ts
export const metadata: Metadata = {
  title: "Let's Talk",
  description: "Got an idea we can help with? Want to join our team? Reach out to A11 Product Studio.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    title: "Let's Talk — A11 Product Studio",
    description: "Got an idea we can help with? Want to join our team? Reach out to A11 Product Studio.",
    url: "/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Let's Talk — A11 Product Studio",
    description: "Got an idea we can help with? Want to join our team? Reach out to A11 Product Studio.",
  },
};
```
(The OG image is inherited automatically from `app/opengraph-image.tsx` via
`metadataBase`; no `images` key is needed.)

**Verify**: `npm run typecheck` → exit 0.

### Step 3: Create the Nous OG image

Create `app/nous/opengraph-image.tsx` mirroring the Relai exemplar exactly,
substituting Nous's name and tagline:
```tsx
import { caseStudyOgImage, size, contentType } from "../og";

export { size, contentType };
export const alt = "Nous — A11 Product Studio case study";

export default function Image() {
  return caseStudyOgImage("Nous", "Designing a shared intelligence layer");
}
```
Note the import path is `"../og"` (one level up from `app/nous/`), identical to
the Relai file's relative depth.

**Verify**: `npm run build` → exit 0, then
`find .next -path '*nous*opengraph*' | head` → at least one generated route entry
for the Nous OG image.

## Test plan

No unit tests cover metadata routes. Verification is `typecheck` + `build` + the
`find` check that the Nous OG route compiled. Optionally, after `npm run build &&
npm run start`, open `http://localhost:3000/nous/opengraph-image` and confirm a
1200×630 PNG renders with "Nous" and the tagline.

## Done criteria

ALL must hold:

- [ ] `app/sitemap.ts` includes a `/contact` entry
- [ ] `app/contact/page.tsx` metadata has `openGraph` and `twitter` objects
- [ ] `app/nous/opengraph-image.tsx` exists and matches the exemplar shape
- [ ] `npm run typecheck` exits 0
- [ ] `npm run build` exits 0 and the Nous OG route is generated
- [ ] `npm run lint` exits 0
- [ ] Only the three in-scope files are added/modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back if:

- `app/nous/opengraph-image.tsx` already exists (don't overwrite — report).
- The `caseStudyOgImage`/`size`/`contentType` exports are not present in
  `app/og.tsx` (the helper moved — find it and report rather than guess).
- The contact metadata excerpt doesn't match "Current state" (file drifted).

## Maintenance notes

- Deferred (separate, optional follow-up): add `WebSite` JSON-LD to the root
  layout and `BreadcrumbList` JSON-LD to `/studio`, `/manifesto`, `/contact`. Not
  included here because the sitelinks searchbox needs a real search endpoint
  (none exists) and breadcrumbs on top-level pages are low-yield.
- When a new case study is added, also add its `opengraph-image.tsx` (this Nous
  gap is exactly the failure mode to prevent).
- Reviewer should confirm the Nous OG image visually matches the other case
  studies' style.
