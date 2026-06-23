# Plan 007: Give the homepage a semantic `<h1>`

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat a6d217d..HEAD -- app/page.tsx`
> If `app/page.tsx` changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: perf / SEO
- **Planned at**: commit `a6d217d`, 2026-06-23

## Why this matters

The homepage (`/`, `app/page.tsx`) is the site's most important page for SEO,
but its main headline renders as a `<p>`, so the page has **no `<h1>`**. Every
other route already has one (`app/contact/page.tsx:58`, `app/world/page.tsx:36`,
`app/studio/page.tsx:90`, `app/manifesto/page.tsx:193`, `app/CaseStudy.tsx:563`).
A missing top-level heading weakens the page's topical signal to search engines
and removes the primary landmark screen-reader users rely on. The fix is to
change the existing headline element from `<p>` to an `<h1>` (and `motion.p` to
`motion.h1`) — same text, same styles, just the correct semantic tag.

## Current state

There are **two** hero headlines in `app/page.tsx` — one for desktop (`HeroReveal`,
inside the `hidden md:block` branch) and one for mobile (`MobileHome`, the
`md:hidden` branch). Both currently use paragraph tags with the same copy.

Desktop — `app/page.tsx` (inside `HeroReveal`, around line 752):
```tsx
<motion.p
  className="m-0 text-center whitespace-pre-wrap"
  initial={{ opacity: 0, filter: "blur(10px)" }}
  animate={{ opacity: 1, filter: "blur(0px)" }}
  transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1], delay: 0.08 }}
  style={{
    fontFamily: "var(--font-system), sans-serif",
    fontWeight: 500,
    fontSize: "clamp(32px, 4.6vw, 64px)",
    lineHeight: 0.95,
    letterSpacing: "-0.02em",
    color: "#282328",
    maxWidth: "90vw",
    textWrap: "balance",
  }}
>
  {"We are A11.\nProduct Studio Built on\nPassion and Craft."}
</motion.p>
```

Mobile — `app/page.tsx` (inside `MobileHome`, around line 891):
```tsx
<p
  className="m-0 text-center"
  style={{
    fontFamily: MFONT, fontWeight: 500, fontSize: 44, lineHeight: 0.9,
    letterSpacing: "-0.05em", color: "#282328", opacity: 0.95,
    maxWidth: 353, marginInline: "auto", textWrap: "balance",
  }}
>
  We are A11. Product Studio Built on Passion and Craft.
</p>
```

Conventions to match:
- Other pages style their `<h1>` directly (no CSS reset needed beyond `m-0`,
  which is already present here). `framer-motion` supports `motion.h1` exactly
  like `motion.p` — the change is purely the tag name.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Typecheck | `npm run typecheck` | exit 0, no errors |
| Lint | `npm run lint` | exit 0 |
| Build | `npm run build` | exit 0 |
| Count h1s | `grep -cn '<h1\|motion.h1' app/page.tsx` | `2` after this change |

## Scope

**In scope**:
- `app/page.tsx` — the two hero headline elements only.

**Out of scope** (do NOT touch):
- Any styles, animation props, or text content (the copy must stay identical).
- The card label/description `<p>` elements — those are correctly paragraphs.
- Any other page's headings (already correct).

## Git workflow

- Branch: `advisor/007-homepage-h1`
- One commit. Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Convert the desktop hero to `motion.h1`

In `app/page.tsx`, change the desktop hero opening tag `<motion.p` → `<motion.h1`
and its closing tag `</motion.p>` → `</motion.h1>`. Keep every attribute, style,
and the text exactly as-is.

**Verify**: `npm run typecheck` → exit 0.

### Step 2: Convert the mobile hero to `<h1>`

In `app/page.tsx` (`MobileHome`), change `<p` → `<h1` and the matching `</p>` →
`</h1>` for the mobile hero. Keep className, style, and text identical.

**Verify**: `grep -cn '<h1\|motion.h1' app/page.tsx` → `2`.

### Step 3: Confirm there is now exactly one h1 per rendered breakpoint

The desktop hero lives in the `hidden md:block` branch and the mobile hero in
the `md:hidden` branch, so only one is visible at a time — each breakpoint
renders exactly one `<h1>`. No further change needed; just confirm both branches
were converted.

**Verify**: `npm run build` → exit 0, and `npm run lint` → exit 0.

## Test plan

No unit tests cover page markup. Verification is the build/lint/grep gates above.
Optionally run `npm run dev`, open `/`, and confirm in DevTools that the hero
headline is an `<h1>` at both a desktop and a mobile viewport width.

## Done criteria

ALL must hold:

- [ ] `grep -cn '<h1\|motion.h1' app/page.tsx` returns `2`
- [ ] The headline copy is byte-for-byte unchanged (only tag names changed)
- [ ] `npm run typecheck` exits 0
- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0
- [ ] No files other than `app/page.tsx` are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back if:

- The hero excerpts in `app/page.tsx` don't match those above (file drifted).
- Converting `motion.p` → `motion.h1` produces a TypeScript error (it should
  not; `motion.h1` is a valid framer-motion element).
- You find the homepage already has an `<h1>` somewhere else (don't add a second
  visible-per-breakpoint one — report instead).

## Maintenance notes

- Keep the homepage to one visible `<h1>`. If the hero copy is ever split into
  multiple lines as separate elements, only the outermost should be the `<h1>`.
- Reviewer should confirm the visual rendering is unchanged (tag swap only) and
  that the animation still plays.
