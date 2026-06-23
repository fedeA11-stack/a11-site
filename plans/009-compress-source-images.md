# Plan 009: Compress oversized source images (build/deploy weight)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat a6d217d..HEAD -- public/assets`
> Then re-run the size scan in Step 1 against the live tree before editing.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none (independent of 005/006/008)
- **Category**: perf / tech-debt
- **Planned at**: commit `a6d217d`, 2026-06-23

## Why this matters

`public/assets/` holds many multi-MB raster source files — case-study PNGs of
2.6–3.8 MB and JPGs up to 7.8 MB (`atlans/atlans-3-1.jpg`). **Important nuance:**
these images are served through `next/image`, so end users download an optimized
WebP/AVIF rendition, *not* the raw source. The cost of the bloated sources is
therefore **build/deploy weight and image-optimizer input size**, not direct
user bandwidth (that's plan 005's videos). Compressing the sources shrinks the
repo, speeds deploys, and reduces the work `next/image` does per transform — a
real but secondary win. This plan is deliberately conservative (visually
lossless targets, originals backed up) because the only risk is quality loss.

This is the lowest-priority item in the performance bundle; skip it if build/repo
size isn't a concern.

## Current state

The largest raster sources (from a recon scan; re-confirm in Step 1):
- `public/assets/atlans/atlans-3-1.jpg` — 7.8 MB
- `public/assets/atlans/atlans-3-4.jpg` — 7.0 MB
- `public/assets/orb/orb-4-1.jpg` — 4.2 MB
- `public/assets/Relai-case.png` — 3.8 MB
- `public/assets/World-Case.png` — 3.6 MB
- `public/assets/districts/dis-5-4.png` — 3.6 MB
- … and more JPG/PNG ≥ 2 MB.

All are referenced as **static imports** (e.g. `app/page.tsx:286` imports
`../public/assets/World-Case.png`) or string paths consumed by `next/image`.
Re-compressing **in place at the same path/filename** means no code changes.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Check tools | `command -v ffmpeg && command -v magick || command -v convert` | at least one prints a path |
| Size scan | `find public/assets -type f \( -name '*.jpg' -o -name '*.png' \) -size +2M -exec du -h {} +` | the list of large rasters |
| Typecheck | `npm run typecheck` | exit 0 |
| Build | `npm run build` | exit 0 |

Use whichever tool is available. `ffmpeg` can re-encode both JPG and PNG; if
ImageMagick (`magick`/`convert`) is present, prefer it for images. If **neither**
is available, STOP and report this plan as blocked.

## Scope

**In scope**:
- Raster files under `public/assets/` larger than 2 MB (`.jpg`, `.png`) —
  re-compressed in place, same filenames.

**Out of scope** (do NOT touch):
- SVGs (already small/vector), `.ico`, fonts, videos (plan 005 handles video).
- Any file under 2 MB (diminishing returns, not worth the quality risk).
- Any source code — filenames must not change, so no import updates are needed.
- Images whose intrinsic dimensions are load-bearing for `next/image` static
  imports — **do not resize**, only re-compress at the same pixel dimensions.

## Git workflow

- Branch: `advisor/009-compress-source-images`
- One commit. **Back up originals first** (Step 1). Do NOT push/PR unless told.

## Steps

### Step 1: Back up and scan

```bash
mkdir -p /tmp/a11-img-backup
rsync -R $(find public/assets -type f \( -name '*.jpg' -o -name '*.png' \) -size +2M) /tmp/a11-img-backup/
find public/assets -type f \( -name '*.jpg' -o -name '*.png' \) -size +2M -exec du -h {} + | sort -h
```
Record the "before" total. **Verify**: backup directory is non-empty.

### Step 2: Re-compress JPGs (visually lossless, same dimensions)

Using ffmpeg (works everywhere), re-encode each large JPG at quality ~`q:v 3`
(high quality, ~85–90) without resizing:
```bash
for f in $(find public/assets -name '*.jpg' -size +2M); do
  ffmpeg -y -i "$f" -q:v 3 "${f%.jpg}.opt.jpg" && mv "${f%.jpg}.opt.jpg" "$f"
done
```

### Step 3: Re-compress PNGs

PNG is lossless; the win comes from re-encoding/quantization. If ImageMagick is
available, run a lossless optimization that preserves dimensions and alpha:
```bash
for f in $(find public/assets -name '*.png' -size +2M); do
  magick "$f" -strip -define png:compression-level=9 "${f%.png}.opt.png" \
    && mv "${f%.png}.opt.png" "$f"
done
```
If ImageMagick is **not** available, skip PNGs (note it in your report) — do not
convert PNGs to JPG (it would break alpha transparency that the card cove
silhouettes rely on; see `app/page.tsx:937` comment about baked-in alpha).

**Verify** (Steps 2–3): every processed file still opens and has unchanged
dimensions:
```bash
for f in public/assets/atlans/atlans-3-1.jpg public/assets/World-Case.png; do
  ffprobe -v error -show_entries stream=width,height -of csv=p=0 "$f"
done
```
Dimensions must match the originals in `/tmp/a11-img-backup`. If any differ →
STOP and restore that file.

### Step 4: Verify the app still builds with the new assets

**Verify**: `npm run build` → exit 0 (static imports read intrinsic dimensions
at build time; a corrupt/altered-dimension file would fail here),
and `npm run typecheck` → exit 0.

### Step 5: Confirm the savings

```bash
find public/assets -type f \( -name '*.jpg' -o -name '*.png' \) -size +2M -exec du -h {} + | sort -h
```
Compare against the Step 1 "before" total and record the reduction.

## Test plan

No automated tests cover image bytes. Verification is `npm run build` (catches
dimension/corruption issues for static imports) plus a manual spot-check: run
`npm run dev`, open `/` and `/atlans`, and confirm the recompressed images still
look correct (no banding/artifacts, alpha intact on the homepage cards).

## Done criteria

ALL must hold:

- [ ] Originals backed up in `/tmp/a11-img-backup` before any edit
- [ ] Processed images retain their original pixel dimensions (Step 3 check)
- [ ] `npm run build` exits 0
- [ ] `npm run typecheck` exits 0
- [ ] Total size of `public/assets` rasters > 2 MB is measurably reduced (report before/after)
- [ ] No source files (`.ts`/`.tsx`) modified, no filenames changed (`git status` shows only `public/assets/**`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back if:

- Neither `ffmpeg` nor ImageMagick is available (report blocked).
- Any re-encoded image changed dimensions or failed to open.
- A PNG that needs transparency would have to be converted to JPG to shrink —
  do not; report it instead.
- `npm run build` fails after recompression (likely a corrupted static-import
  source — restore from backup).

## Maintenance notes

- The durable fix for this class of bloat is to optimize exports **before**
  committing. Consider documenting an export budget (e.g. case hero ≤ 800 KB) in
  `AGENTS.md`; deferred from this plan.
- Because `next/image` already optimizes delivery, this plan does not change what
  users download — reviewers should evaluate it on repo/deploy-size grounds, not
  Core Web Vitals.
