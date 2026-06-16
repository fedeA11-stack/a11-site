# Plan 003: Remove unused assets from `public/` (~71 MB)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 0c23ed1..HEAD -- app/ public/`
> If `app/` changed since this plan was written, the set of *referenced* assets
> may differ — that's fine, because Step 1 recomputes the unused set live from
> the current `app/` source. But if entire asset directories under `public/`
> were added/removed, re-read this plan's assumptions first.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tech-debt
- **Planned at**: commit `0c23ed1`, 2026-06-16

## Why this matters

`public/` holds **116 MB**, of which roughly **71 MB across 57 files is never
referenced** by any source file in `app/`. The worst offenders are an entire
abandoned export directory `public/assets/world/world chat/` (with 18 MB and
10 MB PNGs), a duplicate WebM video (`Unverified:Verified.webm`, a copy of the
referenced `chat-unverified-verified.webm`), and a pile of Figma-export
leftovers (hash-named SVGs/PNGs, `footer-bg.png`, `main picture.png`).

This bloat slows clones, balloons the deployment bundle, and makes it hard to
tell which assets are real. Deleting unreferenced files is safe — they are, by
definition, not loaded by the site — and fully reversible via git history.

After this plan: `public/` contains only assets the code actually references,
and every route still renders identically.

## Current state

- Asset references in code are **literal strings** — either `src="/assets/…"`,
  `src={…}` inside inline data arrays with literal paths, or
  `url('/assets/…')` in inline `backgroundImage` styles. There is no
  dynamically-constructed asset path anywhere in `app/`. This is why an exact
  full-path string search is a reliable test for "is this file used?".
- **Filenames contain spaces** (e.g. `public/assets/world logo.png`,
  `public/assets/Image 1.png`). A naive `grep -oE '/assets/[^"]+'` truncates
  at the space and produces false "unused" results. **You must use the
  full-path fixed-string (`grep -F`) method in Step 1** — do not write your
  own regex extraction.
- Confirmed-referenced examples that look deletable but are NOT (sanity
  anchors): `/assets/world logo.png`, `/assets/Image 1.png`,
  `/assets/freehold logo grey.png`, `/assets/footer.png` (used via
  `url(...)` in `FooterBanner.tsx`). The note-worthy near-miss:
  `/assets/footer-bg.png` IS unused, but `/assets/footer.png` IS used — do
  not confuse them.

At plan time the unused set was **57 files, ~71 MB**. Largest items:

```
 18M  /assets/world/world chat/chat-011.png
 10M  /assets/world/world chat/chat-010.png
9.0M  /assets/world-chat/main picture.png
5.5M  /assets/footer-bg.png
4.3M  /assets/world/world chat/chat-004.png
3.9M  /assets/Freehold.png
2.9M  /assets/world-chat/Unverified:Verified.webm   (dup of chat-unverified-verified.webm)
2.6M  /assets/World.png
2.4M  /assets/world-chat/group chat.png
…plus ~40 smaller PNG/SVG Figma-export leftovers
```

## Commands you will need

| Purpose   | Command              | Expected on success |
|-----------|----------------------|---------------------|
| Build     | `npm run build`      | exit 0, all 5 routes compile |
| Typecheck | `npm run typecheck` *(or `npx tsc --noEmit`)* | exit 0 |
| Dev (manual visual check) | `npm run dev` then open `http://localhost:3000` | every page renders, no broken images / 404s in console |

## Scope

**In scope** (the only files you should modify):
- Files under `public/assets/` that Step 1's scan reports as unreferenced.
- `plans/README.md` (status update).

**Out of scope** (do NOT touch):
- Any file under `app/`.
- `public/fonts/**` — fonts are referenced from `globals.css`, not from
  `app/` source; the Step 1 scan only looks at `app/` and would wrongly flag
  them. **Do not run the scan over `public/fonts`; only scan `public/assets`.**
- Root-level `public/*.svg` (`file.svg`, `globe.svg`, `next.svg`,
  `vercel.svg`, `window.svg`) — Next.js starter defaults; leave them (out of
  scope for this plan).
- Any referenced asset, even if it looks like a leftover.

## Git workflow

- Branch: stay on `tech-optimization`.
- Commit style: conventional commits. Suggested message:
  `chore: delete ~71MB of unreferenced assets from public/`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Generate the authoritative unused-asset list (space-safe)

Run this exact script from the repo root. It walks every file under
`public/assets`, and for each one greps `app/` for the file's full
public-relative path as a fixed string. Unreferenced files are written to
`/tmp/unused-assets.txt`:

```bash
: > /tmp/unused-assets.txt
while IFS= read -r f; do
  rel="${f#public}"                 # e.g. /assets/world logo.png
  if ! grep -rqF "$rel" app; then
    printf '%s\n' "$f" >> /tmp/unused-assets.txt
  fi
done < <(find public/assets -type f)

echo "unused files: $(wc -l < /tmp/unused-assets.txt)"
echo "unused bytes: $(awk '{print}' /tmp/unused-assets.txt | tr '\n' '\0' | xargs -0 stat -f%z 2>/dev/null | paste -sd+ - | bc)"
```

**Verify**: the count is in the same ballpark as the plan's expectation
(~57 files). Then **spot-check the sanity anchors are NOT listed** (they must
be referenced, i.e. absent from the file):

```bash
for k in "/assets/world logo.png" "/assets/Image 1.png" "/assets/footer.png"; do
  grep -qF "public$k" /tmp/unused-assets.txt && echo "BUG: $k flagged unused — STOP" || echo "ok (referenced): $k"
done
```

All three must print `ok (referenced)`. If any prints `BUG:` → STOP.

### Step 2: Review the list, then delete

Print the list for the record, then delete exactly those files:

```bash
cat /tmp/unused-assets.txt
# delete (null-safe for spaces):
tr '\n' '\0' < /tmp/unused-assets.txt | xargs -0 rm -v
```

Then remove any now-empty directories left behind (e.g.
`public/assets/world/world chat/`):

```bash
find public/assets -type d -empty -delete
```

**Verify**: `find public/assets -type f | wc -l` decreased by the count from
Step 1, and `du -sh public` is now well under the original 116 MB
(expect roughly ~45 MB).

### Step 3: Confirm the site still builds and renders

**Verify**:
- `npm run build` → exit 0; all routes `/`, `/studio`, `/world`,
  `/world/chat`, `/world/money` compile.
- Manual: `npm run dev`, open each of the five routes, confirm **no broken
  images** and **no 404s** for `/assets/...` in the browser devtools Network
  tab. (Deleting an unreferenced file cannot cause a 404 for a referenced one,
  but this is the cheap belt-and-suspenders check.)

## Test plan

No unit tests in this repo. Verification is: (a) the Step 1 sanity anchors
prove the scan didn't flag a live asset, (b) `npm run build` passes, (c) a
manual pass over all five routes shows no broken media. No new test files.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] Every path listed in `/tmp/unused-assets.txt` no longer exists on disk
- [ ] `find public/assets -type d -empty` returns nothing (no empty dirs left)
- [ ] `npm run build` exits 0
- [ ] The three Step 1 sanity-anchor files still exist on disk
      (`ls "public/assets/world logo.png" "public/assets/Image 1.png" public/assets/footer.png`)
- [ ] No files under `app/` changed (`git status`)
- [ ] `plans/README.md` status row for 003 updated

## STOP conditions

Stop and report back (do not improvise) if:

- A Step 1 sanity anchor is flagged as unused (the scan is wrong — do not
  delete anything).
- The unused count is wildly different from ~57 (e.g. > 80 or < 20) — the
  codebase or asset tree drifted; report the number before deleting.
- `npm run build` fails after deletion, or any referenced image 404s in the
  dev server — restore from git (`git checkout -- public/`) and report.

## Maintenance notes

- For a reviewer: the diff is deletions only under `public/assets/`. Confirm
  no `app/` file appears in the diff. Everything is recoverable via
  `git checkout 0c23ed1 -- public/assets/<file>` if an asset turns out to be
  needed for unbuilt pages later.
- This plan removes assets unused **today**. Several deleted SVGs
  (`/assets/world/dock-*.svg`, `icon-*-dark.svg`, `Menu hover.svg`) look like
  they were exported for World-page interactions that were never wired up. If
  that work resumes, recover the specific files from history rather than
  re-exporting.
- Note this only reclaims working-tree/deploy size; git *history* still
  contains the blobs. Shrinking history (e.g. `git filter-repo`) is a
  separate, higher-risk operation deliberately out of scope here.
