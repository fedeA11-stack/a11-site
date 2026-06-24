# A11 Product Studio — SEO & AI-Agent Optimization Plan

**Date:** 2026-06-19
**Codebase:** `/Users/karelbalej/Work/a11-site` (Next.js 16.2.7, App Router, SSG)
**Production origin:** `https://a11.studio`
**Branch:** `seo-optimization`
**Priorities (all weighted equally):** AI-agent legibility · Google ranking · Social sharing · Technical foundation

---

## Executive Summary

A11 is a statically-rendered portfolio for a product design studio: 13 routes, modern stack, clean server/client component split, good image and font hygiene. The technical *foundation* is strong — but the SEO/agent *surface* is almost entirely absent. There is no `metadataBase`, no sitemap, no robots file, no per-page metadata, no structured data, and no AI-agent affordances (`llms.txt`). Every case study currently shares one generic title, description, and OG image.

The single highest-leverage fix is setting `metadataBase` — it's one line, it's already flagged as a TODO in `app/layout.tsx:35`, and without it every OG image URL and canonical resolves relative (breaking social sharing and confusing crawlers). After that, the work is mostly mechanical and low-risk because the codebase is already well-structured: each case study is a server component with a typed `data` object containing a `title` and `description` we can lift straight into metadata.

**Overall SEO/Agent readiness: ~32/100** — excellent bones, missing nearly all discoverability surface.

---

## Score Breakdown

| Dimension | Score | Status |
|-----------|-------|--------|
| Technical foundation (crawlability infra) | 20/100 | Missing robots, sitemap, metadataBase, canonical |
| Metadata & social | 35/100 | Root metadata + dynamic OG exist; zero per-page coverage |
| Structured data / agent legibility | 10/100 | No JSON-LD, no llms.txt, no schema |
| Rendering & performance | 75/100 | SSG, next/font, next/image, blur placeholders — solid |
| Content & semantics | 50/100 | Good prose, but heading hierarchy & alt coverage need an audit |
| **Overall** | **~32/100** | Strong base, unbuilt surface |

---

## Architectural Notes That Shape the Plan

These two facts determine *how* each task is done — read before executing:

1. **Server vs. client route components.** Per-page metadata (`export const metadata` / `generateMetadata`) only works in **server** components. Current state:
   - **Server components (metadata is trivial — just add an export):** `app/freehold`, `app/districts`, `app/atlans`, `app/relai`, `app/tokenstudio`, `app/world/money`, `app/world/id`, `app/world/chat`, `app/world/orb` — 9 case studies.
   - **Client components (`"use client"` — need a tiny refactor):** `app/page.tsx` (home), `app/studio/page.tsx`, `app/manifesto/page.tsx`, `app/world/page.tsx`. For each: rename the current file's component into a sibling client component (e.g. `HomeClient.tsx`) and make `page.tsx` a thin **server** wrapper that exports `metadata` and renders the client child. ~10 min each.

2. **Case study data is already metadata-ready.** Every case study `data` object (see `app/freehold/page.tsx:24`) has `title`, `description`, `breadcrumb`, and a `hero` image. Per-page metadata should be *derived* from this object — ideally via a shared helper so titles/descriptions never drift from on-page content. Multi-line `title` strings contain `\n` (e.g. `"Invest and manage\non the move"`) — strip newlines when using them in `<title>`.

---

## Top 5 Critical Actions

1. **Set `metadataBase`** (`app/layout.tsx:34`) to `new URL("https://a11.studio")`. Unblocks absolute OG/Twitter image URLs and canonicals across the entire site. *One line. Do first.*
2. **Add `app/sitemap.ts` and `app/robots.ts`** — static list of all 13 routes; robots references the sitemap and allows all. Gives crawlers/agents a complete route map immediately.
3. **Per-page metadata on all 13 routes** — derive `title`, `description`, `openGraph`, `twitter`, and `alternates.canonical` from each page's existing content. Biggest win for both Google and social sharing.
4. **Per-case-study OG images** — extend the existing `app/opengraph-image.tsx` pattern to a route-segment `opengraph-image.tsx` per case study (or generate from the hero + title) so shared links preview the actual project, not the generic studio card.
5. **Structured data (JSON-LD) + `llms.txt`** — `Organization` schema sitewide (in layout), `BreadcrumbList` + `CreativeWork`/`Article` per case study, and a root `public/llms.txt` describing the studio and linking every case study. This is the core of "optimize for agents."

---

## Priority Matrix (Impact × Effort)

| # | Action | Impact | Effort | Quadrant | Files |
|---|--------|--------|--------|----------|-------|
| 1 | Set `metadataBase` | High | Trivial | **Quick Win** | `app/layout.tsx` |
| 2 | `robots.ts` | High | Low | **Quick Win** | new `app/robots.ts` |
| 3 | `sitemap.ts` | High | Low | **Quick Win** | new `app/sitemap.ts` |
| 4 | Organization JSON-LD in layout | High | Low | **Quick Win** | `app/layout.tsx` |
| 5 | `public/llms.txt` | High | Low | **Quick Win** | new `public/llms.txt` |
| 6 | Per-page metadata (9 server case studies) | High | Medium | **Strategic** | 9 `page.tsx` |
| 7 | Per-page metadata (4 client routes → wrapper refactor) | High | Medium | **Strategic** | 4 `page.tsx` + 4 new client files |
| 8 | Shared `buildCaseMetadata()` helper | High | Low | **Quick Win** | new `app/seo.ts` |
| 9 | Per-case-study OG images | Medium | Medium | **Strategic** | per-segment `opengraph-image.tsx` |
| 10 | BreadcrumbList + CreativeWork JSON-LD per case | Medium | Medium | **Strategic** | `CaseStudy.tsx` or per page |
| 11 | Alt-text + heading-hierarchy audit | Medium | Medium | **Fill Later** | `CaseStudy.tsx`, data objects |
| 12 | `manifest.ts` (PWA metadata, theme color) | Low | Low | **Fill Later** | new `app/manifest.ts` |
| 13 | `priority`/lazy-load audit on images | Low | Low | **Fill Later** | `CoverImage.tsx`, `CaseStudy.tsx` |

---

## Roadmap

### Phase 1 — Foundation & Quick Wins (the 80/20)
*Goal: every page crawlable, shareable, and discoverable with absolute URLs.*

- [ ] **Set `metadataBase`** in `app/layout.tsx` → `metadataBase: new URL("https://a11.studio")`. Remove the TODO.
- [ ] **Create `app/robots.ts`** — allow all, point `sitemap` at `https://a11.studio/sitemap.xml`.
- [ ] **Create `app/sitemap.ts`** — export all 13 routes (reuse `ALL_PROJECTS` from `app/caseProjects.ts` plus `/`, `/world`, `/studio`, `/manifesto`). Set `changeFrequency`/`priority`; home and `/world` highest.
- [ ] **Add `Organization` JSON-LD** to `app/layout.tsx` (name, url, logo, sameAs social links, description). Inject via a `<script type="application/ld+json">` in the body.
- [ ] **Create `public/llms.txt`** — H1 studio name, one-paragraph summary, then a Markdown link list of every case study with a one-line description each (pull from the `data.description` fields). This is the canonical agent-facing index.

*Exit criteria:* `next build` clean; `/sitemap.xml` and `/robots.txt` resolve; OG image URL in page source is absolute (`https://a11.studio/...`).

### Phase 2 — Per-Page Metadata & Social (the bulk of ranking + sharing value)
*Goal: each route has a unique title, description, canonical, and OG/Twitter card.*

- [ ] **Add `app/seo.ts`** with a `buildCaseMetadata(data, path)` helper that maps a `CaseStudyData` object → `Metadata` (title sans `\n`, description, `alternates.canonical`, `openGraph`, `twitter`).
- [ ] **9 server case studies:** add `export const metadata = buildCaseMetadata(data, "/freehold")` (etc.) to each `page.tsx`.
- [ ] **4 client routes:** refactor `app/page.tsx`, `app/studio/page.tsx`, `app/manifesto/page.tsx`, `app/world/page.tsx` into server `page.tsx` (exports metadata) + extracted client child. Hand-write metadata for these four.
- [ ] **Per-case-study OG images:** add a segment-level `opengraph-image.tsx` to each case study (clone `app/opengraph-image.tsx`, render the case title over its hero/brand color). Or, if simpler, point each page's `openGraph.images` at an existing high-quality asset.

*Exit criteria:* view-source on 3 sampled pages shows distinct `<title>`, `<meta description>`, canonical, and a case-specific `og:image`. Validate with a social-card debugger before/after deploy.

### Phase 3 — Agent Legibility & Polish
*Goal: machines parse the studio's structure; loose ends closed.*

- [ ] **`BreadcrumbList` JSON-LD** per case study — derive from the existing `breadcrumb`/`section` fields already in `CaseStudyData`. Emit from `CaseStudy.tsx` so all 9 get it for free.
- [ ] **`CreativeWork` (or `Article`) JSON-LD** per case study — name, description, image, author = Organization, about = the client/product.
- [ ] **Alt-text & heading audit** — confirm one `<h1>` per page (the case title), that section titles are real `<h2>`s in `CaseStudy.tsx`, and that every meaningful image has descriptive alt (current coverage ~50%; decorative SVGs correctly `alt=""`).
- [ ] **`app/manifest.ts`** — name, short_name, theme/background color, icons (reuse `icon.svg`/`favicon.ico`).
- [ ] **Image loading audit** — `priority` only on the LCP hero per page; everything below the fold lazy (next/image default).
- [ ] **Optional:** verify the heavy Framer Motion entrance animations don't hide above-the-fold text from no-JS crawlers (SSG ships the HTML, but confirm content isn't opacity:0 until hydration in a way that hurts rendering-based crawlers).

*Exit criteria:* Rich Results / schema validation passes on a case study; `llms.txt` reachable; Lighthouse SEO ≥ 95.

---

## What the Site Already Does Well

- **Static rendering (SSG)** — HTML is delivered to crawlers and agents immediately; no client-fetch dependency for content.
- **Clean server/client split** — case studies are server components, so metadata is genuinely a one-liner for 9 of 13 routes.
- **Image & font discipline** — `next/image` with static imports (blur placeholders, intrinsic sizing) and `next/font/local` with `display: swap` (no CLS). Performance won't fight SEO.
- **Dynamic OG image already exists** (`app/opengraph-image.tsx`) — Phase 2 extends a working pattern rather than inventing one.
- **Typed, centralized content** — `CaseStudyData` objects make metadata derivation reliable and drift-free.
- **Accessibility-aware motion** — `prefers-reduced-motion` respected.

---

## Risks & Notes

- **Client-route refactor (Phase 2)** is the only non-trivial change — it touches 4 page entry points. Keep each refactor mechanical (move body to `*Client.tsx`, thin server wrapper) and verify the page still renders identically.
- **`metadataBase` assumes `https://a11.studio` is final.** If the domain changes, it's still one line.
- **Multi-line titles** (`\n` in `data.title`) must be flattened for `<title>`/OG — handle in the shared helper once.
- **No analytics/Search Console** referenced in repo — after deploy, submit the sitemap to Google Search Console and verify ownership to close the loop (out of codebase scope).

---

## Appendix — Route Inventory (13)

| Route | Component type | Source |
|-------|----------------|--------|
| `/` | client → needs wrapper | `app/page.tsx` |
| `/world` | client → needs wrapper | `app/world/page.tsx` |
| `/world/money` | server | `app/world/money/page.tsx` |
| `/world/id` | server | `app/world/id/page.tsx` |
| `/world/chat` | server | `app/world/chat/page.tsx` |
| `/world/orb` | server | `app/world/orb/page.tsx` |
| `/freehold` | server | `app/freehold/page.tsx` |
| `/districts` | server | `app/districts/page.tsx` |
| `/atlans` | server | `app/atlans/page.tsx` |
| `/relai` | server | `app/relai/page.tsx` |
| `/tokenstudio` | server | `app/tokenstudio/page.tsx` |
| `/studio` | client → needs wrapper | `app/studio/page.tsx` |
| `/manifesto` | client → needs wrapper | `app/manifesto/page.tsx` |
