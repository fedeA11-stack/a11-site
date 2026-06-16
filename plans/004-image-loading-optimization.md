# Plan 004: Image & font loading optimization (next/image + next/font)

> **Executor instructions**: Read this plan fully before starting. Honor STOP
> conditions. Verify each route in the live preview before moving on. When done,
> update the status row in `plans/README.md`.

## Status

- **Priority**: P1 (perf — the single biggest lever on this site)
- **Effort**: M
- **Risk**: MEDIUM (UI-heavy; one tricky clip-path interaction)
- **Depends on**: none (independent of plans 001–003)
- **Branch**: `feat/loading-optimization`
- **Reviewed**: `/plan-eng-review` 2026-06-16, base commit `c6e5cd1`

## Why this matters

The site ships **45MB of unoptimized raster assets** through raw `<img>` tags —
a 9MB `chat-main.png`, six case PNGs at 2.4–5.2MB. `next/image` is unused,
`next.config.ts` is empty, and 8 `@font-face` declarations load OTFs with no
metric fallback (FOUT/CLS). The prior `/improve` pass already flagged the
`next/image` migration as "the single biggest perf lever" and deferred it.

After this plan: every local raster photo is served as a device-sized
AVIF/WebP via `next/image` (the 9MB hero becomes ~1–2MB at the browser),
below-fold images lazy-load, above-fold heroes preload, layout shift is
eliminated by intrinsic dimensions + blur-up, and fonts self-host through
`next/font/local` with a size-adjusted fallback.

## Scope (agreed in review)

**IN scope:** raster `<img>` → `next/image`; 8 `@font-face` → `next/font/local`.
**Deferred** (see NOT in scope): non-loading correctness/a11y, token dedup,
source-asset pre-compression.

---

## Data flow this changes

```
BEFORE                                  AFTER (next/image)
<img src="/assets/x.png"          ──>   <Image src={importedX} fill
  style={{w:100%,h:100%,                   style={{objectFit:'cover'}}
          objectFit:'cover'}} />           sizes="..." [priority] />
  → 9MB PNG shipped verbatim             → /_next/image?w=640&q=75 → AVIF/WebP
  → no resize, no lazy, CLS on load      → srcset per viewport, lazy/preload,
                                            intrinsic w/h + blurDataURL (no CLS)

@font-face × 8 in globals.css     ──>   next/font/local in app/layout.tsx
  → FOUT/CLS, no metric fallback           → size-adjust fallback, managed preload
```

## Architectural decisions (locked in review)

1. **Static imports everywhere** (Q1). Every local raster is `import`ed so Next
   derives intrinsic width/height AND a build-time `blurDataURL` automatically.
   The data arrays that hold string paths today must change to hold
   `StaticImageData`:
   - `PROJECTS` in `app/page.tsx` (2 images + logos)
   - `CARDS` in `app/world/page.tsx` (4 case JPGs; icons stay SVG strings)
   - discover `.map()` arrays in `app/world/chat/page.tsx` and
     `app/world/money/page.tsx`
   - Drop `as const` where it conflicts with imported-module typing; type the
     array element explicitly instead (`{ img: StaticImageData; ... }`).

2. **Shared `CoverImage` component** (Q3). The `fill` + `objectFit:'cover'`
   pattern repeats across ~35 sites. Extract one `app/CoverImage.tsx`:

   ```
   app/CoverImage.tsx — single image policy knob
   ┌───────────────────────────────────────────────┐
   │ props: src(StaticImageData), alt, sizes,        │
   │        priority?, className?, style?,           │
   │        clipPath? (for the /world cove)          │
   │ renders: position:relative wrapper (caller      │
   │   controls aspect-ratio) > <Image fill          │
   │   style={{objectFit:'cover', ...style}}         │
   │   sizes={sizes} priority={priority} />          │
   └───────────────────────────────────────────────┘
   ```
   Fold `world/money`'s local `FullImage`/`TwoColImages` into it. `sizes` is a
   **required** prop — without it `fill` defaults to `100vw` and over-fetches
   grid cards (a 1/4-width card should declare `sizes="(max-width:768px) 50vw, 25vw"`).

3. **The /world clip-path cards** (Q2). Migrate to `CoverImage` with
   `clipPath: url(#cove)` passed through to the `<Image>` style. The generated
   element is still an `<img>`, so the `objectBoundingBox` clip and the Framer
   spring that rewrites the path keep working. **Verify the cove morph in the
   live preview at rest AND hovered** before considering this done.

4. **LCP heroes get `priority`** — per route, the above-fold hero opts out of
   lazy-load and into preload: home cards, studio grid, `/world` card grid,
   `chat-main`, `wm-hero`. Everything below the fold stays lazy (default).

5. **Fonts → `next/font/local`** in `app/layout.tsx`: register all 8 OTF
   weights/styles, expose as a CSS variable, wire that variable into the
   Tailwind v4 `@theme` and remove the 8 `@font-face` blocks from
   `globals.css`. `display: 'swap'` (matches current). The `FONT` const dup'd
   across 6 files is NOT touched here (deferred token-dedup work).

6. **`next.config.ts`** — `next/image` needs no config for local images.
   The one remote image (`flagcdn.com/w160/us.png`, a 160px flag in
   `/world/chat`) stays a raw `<img>` with a scoped `eslint-disable` — not
   worth a `remotePatterns` entry + optimization roundtrip for a tiny external
   flag. Leave AVIF/WebP at Next defaults (both enabled).

7. **Re-enable the lint gate** — remove the scattered
   `// eslint-disable-next-line @next/next/no-img-element` comments as each
   `<img>` is migrated. The rule then fails the build if a raw `<img>` returns
   (the flag is the one intentional, scoped exception).

## SVGs / video — left alone (correct)

- SVG icons (`slash.svg`, `logo.svg`, `manifesto shape.svg`, 4 world icons):
  `next/image` does not optimize SVG; keep as raw `<img>` (scoped disable) or
  inline. No payload win available.
- `<video>` (chat webm, `PhoneVideo`): out of image scope. See TODOs.

---

## What already exists

- **`world/money/page.tsx` `FullImage` / `TwoColImages` helpers** — already do
  the `fill`+`objectFit:cover`+aspect-ratio pattern. The plan REUSES this by
  generalizing it into the shared `CoverImage`, not rebuilding it.
- **`font-display: swap`** is already set on every `@font-face` — `next/font`
  preserves this behavior, adding the metric fallback on top.
- **Alt text** is already comprehensive across the site; the migration keeps it.
- Nothing else partially solves this — it is genuinely all hand-rolled `<img>`.

---

## Verification (Q4 — preview + lint/build gates, no new test rig)

Per-route live-preview check after migration:

```
ROUTE              CHECK
/                  cards render, logos overlay, no CLS, console/network clean
/studio            mobile stack + desktop staggered grid both intact
/world             CRITICAL — cove morph on hover (snapshot rest + hovered)
/world/chat        hero LCP loads, flagcdn flag still loads, webm plays
/world/money        all ~15 images via CoverImage, no layout shift
/manifesto         decorative svg untouched
all                fonts: every weight/italic resolves, no FOUT flash
```

Gates: `next build` passes, `npx tsc --noEmit` passes, ESLint
`@next/next/no-img-element` re-enabled and green (only the flag is exempt).

## Failure modes

| Codepath | Realistic failure | Test? | Error handling? | User sees |
|----------|-------------------|-------|-----------------|-----------|
| `CoverImage` missing `sizes` | over-fetch full-viewport on grid cards | preview/network | required prop | slow load, no error |
| /world clip-path under `fill` | cove clip doesn't apply / morph janks | **preview hover check** | none | broken visual — **must verify** |
| Static import of renamed asset | build fails (module not found) | `next build` | compile error | n/a (caught at build) |
| Array typing loses `as const` | TS error on `.href`/literal narrowing | `tsc` | compile error | n/a |
| Font variable not wired to Tailwind | site falls back to system font | preview (visual) | none | wrong typeface — **verify** |

No silent-failure critical gaps: the two visual risks (cove morph, font wiring)
are both covered by the mandated preview check.

---

## Implementation Tasks
Synthesized from this review's findings. Checkbox as you ship.

- [ ] **T1 (P1, human: ~1.5h / CC: ~12min)** — CoverImage — extract shared `app/CoverImage.tsx`
  - Surfaced by: Code Quality — ~35 duplicated `fill`+objectFit sites; money helpers already drifted
  - Files: `app/CoverImage.tsx` (new)
  - Verify: renders fill/objectFit, requires `sizes`, supports `priority` + `clipPath`
- [ ] **T2 (P1, human: ~3h / CC: ~25min)** — assets — migrate all local raster `<img>` to `CoverImage` via static imports
  - Surfaced by: Architecture Q1 — string→StaticImageData across data arrays
  - Files: `app/page.tsx`, `app/studio/page.tsx`, `app/world/chat/page.tsx`, `app/world/money/page.tsx`, `app/Preloader.tsx`, `app/FooterBanner.tsx` (bg→Image)
  - Verify: `next build`, per-route preview, no CLS
- [ ] **T3 (P1, human: ~1h / CC: ~15min)** — /world — migrate clip-path cards + verify cove morph
  - Surfaced by: Architecture Q2 — clipPath passthrough under `<Image fill>`
  - Files: `app/world/page.tsx`
  - Verify: preview hover at rest + hovered; morph intact
- [ ] **T4 (P2, human: ~1h / CC: ~10min)** — heroes — add `priority` to per-route LCP images
  - Surfaced by: Performance — above-fold heroes should preload, not lazy
  - Files: all route files (one hero each)
  - Verify: network shows hero requested eagerly, others lazy
- [ ] **T5 (P1, human: ~1.5h / CC: ~12min)** — fonts — move 8 `@font-face` to `next/font/local`
  - Surfaced by: Scope — CLS/preload; wire CSS var into Tailwind `@theme`
  - Files: `app/layout.tsx`, `app/globals.css`
  - Verify: every weight/italic resolves, no FOUT
- [ ] **T6 (P2, human: ~20min / CC: ~5min)** — lint — re-enable `@next/next/no-img-element`, drop stale disables
  - Surfaced by: Code Quality — lint gate enforces the migration
  - Files: all migrated files, `eslint.config.mjs` (confirm rule on)
  - Verify: `npm run lint` green; flag is the only scoped exception

## NOT in scope (considered, deferred)

- **Source-asset pre-compression** (Q5) — downscale/recompress the oversized
  source PNGs (esp. 9MB `chat-main`). `next/image` already delivers the
  served-byte win; this is repo-hygiene, deferred to keep the diff a clean code
  migration. Tracked as a TODO.
- **Video optimization** — `chat-unverified-verified.webm` + `PhoneVideo`:
  add `poster` / `preload="metadata"`. Different asset class; not "photos."
- **Remote flag → local** — `flagcdn.com` stays raw `<img>`; tiny, external.
- **Non-loading health fixes** (from `/improve`): non-functional CTA buttons,
  `div`-as-button a11y bug in studio, `FONT`/token dedup, dropping needless
  `"use client"`. Real, but correctness/refactor work — a separate PR keeps
  this branch a coherent "loading optimization."

## Parallelization

| Step | Modules | Depends on |
|------|---------|------------|
| T1 CoverImage | `app/` (new file) | — |
| T2 raster migration | `app/`, `app/world/`, `app/studio/` | T1 |
| T3 clip-path cards | `app/world/` | T1 |
| T5 fonts | `app/layout.tsx`, `globals.css` | — |

- **Lane A:** T1 → (T2, T3, T4, T6) — all share `app/` page files, sequential after T1.
- **Lane B:** T5 (fonts) — touches only `layout.tsx` + `globals.css`, independent.

Execution: launch **Lane A (start with T1)** and **Lane B (T5)** in parallel
worktrees; both touch disjoint files. Merge B anytime. No conflict flags.

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | clean | 5 issues, 0 critical gaps |
| Design Review | `/plan-design-review` | UI/UX gaps | 0 | — | — |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | — | — |

- **VERDICT:** ENG CLEARED — ready to implement. All 5 findings resolved and folded into the plan above. Outside voice skipped by user.

NO UNRESOLVED DECISIONS
