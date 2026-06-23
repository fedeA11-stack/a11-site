# Plan 008: Make `next/image` `sizes` account for the full-bleed gutter

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat a6d217d..HEAD -- app/CaseStudy.tsx app/page.tsx app/globals.css`
> Compare the "Current state" excerpts against the live code before proceeding;
> on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `a6d217d`, 2026-06-23

## Why this matters

Full-bleed pages (homepage work grid + case studies) apply a large side gutter
at `lg+`: `--bleed: 14.5rem` (232px **each side** = 464px total), defined in
`app/globals.css:20`. But the `next/image` `sizes` hints declare `100vw` (full)
and `50vw` (duo) — they ignore that gutter. On a 2560px display the browser
therefore fetches a rendition sized for the full 2560px when the card is really
~2096px wide (full) or ~1040px (duo). `next/image` picks the next breakpoint up
from the `sizes` value, so this over-fetch wastes bandwidth on exactly the
widest, highest-DPR screens. Correcting the `sizes` strings to subtract the
gutter serves a smaller, correct rendition. This is a modest, zero-risk win —
`sizes` is only a hint; it never breaks layout.

Honest scope note: the gain is meaningful mainly at `lg+` widths; below `lg` the
gutter is only 40px (`app/globals.css:27`) and `100vw`/`50vw` are already close.

## Current state

- `app/globals.css:20` (inside `:root`): `--bleed: 14.5rem; /* 232px */`
  and at the `lg` lower edge (`app/globals.css:27`): `--bleed: 2.5rem; /* 40px */`.
  Full-bleed layout is applied via the class `lg:px-[var(--bleed)]` on the
  `<main>` of both the homepage and case studies.

- Homepage work-grid cards — `app/page.tsx` (around line 577), each
  `ProjectCard` renders:
  ```tsx
  <CoverImage src={project.image} alt={project.name} sizes="100vw" priority={priority} />
  ```
  (appears twice in `ProjectCard`: the `zoom` branch and the `ImageReveal` branch).

- Case-study media — `app/CaseStudy.tsx`:
  - `MediaBlock` `full` (line ~176): `sizes="100vw"`
  - `MediaBlock` `duo` (line ~184): `sizes="(max-width: 768px) 100vw, 50vw"`
  - `tallDuo` tall + stack (lines ~192, ~196): `sizes="(max-width: 768px) 100vw, 50vw"`

- `CoverImage` already documents that `sizes` is required to avoid over-fetch
  (`app/CoverImage.tsx:15-17`).

The `lg` breakpoint in this project is **1024px** (Tailwind default). At `lg+`
the total gutter is `29rem` (464px). So the correct full-bleed card width at
`lg+` is `calc(100vw - 29rem)` and a duo cell is `calc((100vw - 29rem - <gap>) / 2)`
≈ `calc((100vw - 29rem) / 2)` (the 10px gap is negligible for `sizes`).

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Typecheck | `npm run typecheck` | exit 0, no errors |
| Lint | `npm run lint` | exit 0 |
| Build | `npm run build` | exit 0 |

## Scope

**In scope**:
- `app/page.tsx` — the two `sizes="100vw"` on the homepage `ProjectCard` images.
- `app/CaseStudy.tsx` — the `sizes` strings in `MediaBlock` (full, duo, tallDuo).

**Out of scope** (do NOT touch):
- `app/globals.css` — read only; do not change `--bleed`.
- Mobile-only tiles in `app/page.tsx` (`MobileCard`, `sizes="100vw"`) — those
  are genuinely full-width on mobile; leave them.
- `CoverImage.tsx` itself.
- Any aspect-ratio, priority, or layout values.

## Git workflow

- Branch: `advisor/008-image-sizes-bleed`
- One commit. Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Update the homepage full-bleed cards

In `app/page.tsx`, replace both occurrences of `sizes="100vw"` **inside
`ProjectCard`** (the `zoom` and `ImageReveal` branches) with:
```tsx
sizes="(min-width: 1024px) calc(100vw - 29rem), 100vw"
```
Leave the `MobileCard` `sizes="100vw"` unchanged.

**Verify**: `grep -n 'calc(100vw - 29rem)' app/page.tsx` → 2 matches; and
`grep -c 'sizes="100vw"' app/page.tsx` → 1 (the remaining mobile tile).

### Step 2: Update the case-study `full` block

In `app/CaseStudy.tsx`, the `MediaBlock` `full` branch: change `sizes="100vw"`
to:
```tsx
sizes="(min-width: 1024px) calc(100vw - 29rem), 100vw"
```

### Step 3: Update the case-study `duo` and `tallDuo` blocks

For the three duo/tallDuo `Cell`s in `app/CaseStudy.tsx` currently using
`sizes="(max-width: 768px) 100vw, 50vw"`, change each to:
```tsx
sizes="(max-width: 768px) 100vw, (min-width: 1024px) calc((100vw - 29rem) / 2), 50vw"
```
This keeps the existing mobile (100vw) and tablet (50vw, 768–1023px) behavior and
only tightens the `lg+` case where the gutter is in effect.

**Verify**: `grep -n 'calc((100vw - 29rem) / 2)' app/CaseStudy.tsx` → 3 matches.

### Step 4: Build

**Verify**: `npm run typecheck` → exit 0; `npm run lint` → exit 0;
`npm run build` → exit 0.

## Test plan

No unit tests cover `sizes` (it's a rendering hint). Verification is the
build/grep gates. Optionally, after `npm run build && npm run start`, load `/` on
a wide viewport (≥1600px), open DevTools → Network → an image request, and
confirm the served rendition width is smaller than before this change (it should
request a narrower `w=` than the full viewport width).

## Done criteria

ALL must hold:

- [ ] `grep -c 'calc(100vw - 29rem)' app/page.tsx` → 2
- [ ] `grep -c 'sizes="100vw"' app/page.tsx` → 1 (mobile tile only)
- [ ] `grep -c 'calc((100vw - 29rem) / 2)' app/CaseStudy.tsx` → 3
- [ ] `grep -c 'calc(100vw - 29rem)"' app/CaseStudy.tsx` ≥ 1 (the full block)
- [ ] `npm run typecheck` / `npm run build` / `npm run lint` all exit 0
- [ ] Only `app/page.tsx` and `app/CaseStudy.tsx` modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back if:

- `--bleed` in `app/globals.css` is not `14.5rem` at `:root` / `2.5rem` at the
  `lg` edge (the 29rem total assumption is wrong — recompute and report).
- The `sizes` excerpts in either file don't match those in "Current state".
- The number of `sizes="100vw"` occurrences in `app/page.tsx` is not 3 before you
  start (layout changed; re-scope and report).

## Maintenance notes

- If `--bleed` is ever changed, these `sizes` strings must be updated to match
  (`29rem` = 2 × the `lg+` bleed). Consider, as a future refactor, computing the
  gutter once; out of scope here to keep the change mechanical.
- Reviewer should confirm no visual/layout change (sizes is a hint only) and
  that images still look sharp on high-DPR screens.
