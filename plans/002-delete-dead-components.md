# Plan 002: Delete the two unused components

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 0c23ed1..HEAD -- app/CraftButton.tsx app/ProjectImage.tsx`
> If either file changed since this plan was written, re-run the usage grep in
> Step 1 before deleting; on a mismatch (a new import appeared), treat it as a
> STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tech-debt
- **Planned at**: commit `0c23ed1`, 2026-06-16

## Why this matters

`app/CraftButton.tsx` (88 lines) and `app/ProjectImage.tsx` (49 lines) are not
imported by any file in the project. They are dead code: they add maintenance
surface, show up in searches, and `CraftButton` in particular contains a
`scroll`/`resize` handler that calls `getBoundingClientRect()` on every scroll
event — a real perf hazard *if it were ever wired up*. Removing them shrinks
the surface with zero behavioral change.

After this plan: both files are gone and the app builds, typechecks, and lints
exactly as before.

## Current state

- `app/CraftButton.tsx` — a fixed "Let's craft together" pill with a scroll
  listener that repositions it above the footer. **Not imported anywhere.**
- `app/ProjectImage.tsx` — a generic image-in-aspect-ratio-box wrapper with an
  optional `Link`. **Not imported anywhere.** (The home page uses its own
  inline `ProjectCard`, not this component.)

Verified at plan time:

```
$ grep -rn "CraftButton\|ProjectImage" app --include='*.tsx' | grep -i import
NOT IMPORTED ANYWHERE
```

- **Convention note**: components live flat in `app/` (e.g. `NavMenu.tsx`,
  `FooterBanner.tsx`, `Cursor.tsx`). Deleting two of them does not affect the
  routing structure (`page.tsx` / `layout.tsx` files are untouched).

## Commands you will need

| Purpose   | Command              | Expected on success |
|-----------|----------------------|---------------------|
| Usage scan | `grep -rn "CraftButton\|ProjectImage" app --include='*.tsx'` | only matches inside the two files themselves, if any |
| Typecheck | `npm run typecheck` *(exists after plan 001; else `npx tsc --noEmit`)* | exit 0 |
| Lint      | `npm run lint`       | exit 0, unchanged result |
| Build     | `npm run build`      | exit 0, compiles all routes |

## Scope

**In scope** (the only files you should modify/delete):
- `app/CraftButton.tsx` (delete)
- `app/ProjectImage.tsx` (delete)

**Out of scope** (do NOT touch):
- Every other file in `app/`. In particular do NOT touch `app/page.tsx`'s
  inline `ProjectCard` — it is a different thing that happens to render
  project images, and it is in active use.

## Git workflow

- Branch: stay on `tech-optimization`.
- Commit style: conventional commits. Suggested message:
  `chore: remove unused CraftButton and ProjectImage components`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Re-confirm both components are unused

Run:

```
grep -rn "CraftButton" app --include='*.tsx'
grep -rn "ProjectImage" app --include='*.tsx'
```

Expected: the only matches are inside `app/CraftButton.tsx` and
`app/ProjectImage.tsx` respectively (the component's own
`export default function` line). **No `import ... from "./CraftButton"` or
`"./ProjectImage"` anywhere.**

**Verify**: neither grep returns an `import` line referencing these modules.
If it does → STOP (see STOP conditions).

### Step 2: Delete the files

```
rm app/CraftButton.tsx app/ProjectImage.tsx
```

**Verify**: `ls app/CraftButton.tsx app/ProjectImage.tsx 2>&1` → both report
"No such file or directory".

### Step 3: Confirm nothing broke

**Verify**:
- `npm run typecheck` → exit 0
- `npm run build` → exit 0, all routes (`/`, `/studio`, `/world`,
  `/world/chat`, `/world/money`) compile

## Test plan

No unit tests in this repo. Verification is the typecheck + build passing
after deletion, proving no import dangled. No new test files.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `app/CraftButton.tsx` and `app/ProjectImage.tsx` no longer exist
- [ ] `grep -rn "CraftButton\|ProjectImage" app` returns no matches
- [ ] `npm run typecheck` exits 0
- [ ] `npm run build` exits 0
- [ ] No files other than the two deletions appear in `git status`
- [ ] `plans/README.md` status row for 002 updated

## STOP conditions

Stop and report back (do not improvise) if:

- Step 1 finds an actual `import` of either component anywhere — the file is
  NOT dead; report where it's used instead of deleting.
- `npm run build` fails after deletion (would indicate a dynamic/string-based
  reference the grep missed).

## Maintenance notes

- For a reviewer: the only risk is a missed reference; the build step in
  Step 3 is the guard. If the design later wants a floating "craft" CTA,
  recover `CraftButton.tsx` from git history (`git show 0c23ed1:app/CraftButton.tsx`)
  rather than rewriting — but note its per-scroll `getBoundingClientRect()`
  should be rAF-throttled before reuse.
