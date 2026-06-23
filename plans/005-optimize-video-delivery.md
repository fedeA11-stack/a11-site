# Plan 005: Shrink and harden the self-hosted case-study videos

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat a6d217d..HEAD -- app/CaseStudy.tsx app/world/chat/PhoneVideo.tsx public/assets`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `a6d217d`, 2026-06-23

## Why this matters

The case-study pages serve raw, uncompressed `.mp4` files straight from
`public/assets/` — `world-id/Passport.mp4` is **16 MB**, `world-money/REF5.mp4`
is **19 MB**, `world-id/Post_verification.mp4` is **12 MB**. `next/image` does
**not** optimize video, so every visitor who scrolls a World case study
downloads these files at full size. The total `public/` directory is 239 MB,
most of it video. Re-encoding to a sane web bitrate typically cuts these 3–6×
with no perceptible quality loss, directly improving LCP and bandwidth on the
heaviest pages. We also harden the `<video>` tags (`preload`, `width/height`,
poster) per the bundled Next.js video guide and remove a duplicate clip that
ships in both `.webm` and `.mp4`.

## Current state

- `app/CaseStudy.tsx` — the `Cell` component renders below-fold videos. Videos
  are gated to load only when in view (good), but the tag is missing
  `preload`/intrinsic dimensions:

  `app/CaseStudy.tsx:153` (inside `Cell`):
  ```tsx
  // eslint-disable-next-line jsx-a11y/media-has-caption
  <video src={inView ? (image.src as string) : undefined} autoPlay loop muted playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
  ```

- `app/world/chat/PhoneVideo.tsx:39` — the phone-mockup video, same shape:
  ```tsx
  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
  <video
    src={active ? src : undefined}
    autoPlay
    loop
    muted
    playsInline
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
  />
  ```

- Video files are referenced by **string path** (not import) in the page data.
  All 6 large videos (>4 MB) are referenced from `app/world/id/page.tsx` and
  `app/world/money/page.tsx`:

  | File | Referenced at |
  |------|---------------|
  | `world-id/Passport.mp4` | `app/world/id/page.tsx:65` |
  | `world-id/Post_verification.mp4` | `app/world/id/page.tsx:54` |
  | `world-id/preflights.mp4` | `app/world/id/page.tsx:52` |
  | `world-id/Intro-reveal.mp4` | **no reference found** — check before re-encoding (see Step 0) |
  | `world-money/REF4.mp4` | `app/world/money/page.tsx:81` |
  | `world-money/REF5.mp4` | `app/world/money/page.tsx:105` |

- **CACHE-BUST REQUIRED (decided 2026-06-23).** Plan 006's 1-year `immutable`
  cache on `/assets/*` is already live (`next.config.ts:24`). Re-encoding **in
  place** would leave returning visitors pinned to the old large files for up to
  a year. Decision: re-encode to a **new, content-versioned filename** and update
  the string `src` references. This guarantees every visitor fetches the smaller
  file immediately. (This supersedes the original "re-encode in place, no code
  changes" approach.)

- **Duplicate clip**: `public/assets/world-chat/chat-unverified-verified.webm`
  (2.9 MB) and `public/assets/world-chat/Verified-Unverified.mp4` (2.9 MB) appear
  to be the same content. Only the `.webm` is referenced
  (`app/world/chat/page.tsx:36`). Confirm before deleting (see Step 4).

- Bundled framework guidance to follow — `node_modules/next/dist/docs/01-app/02-guides/videos.md`:
  > **Good to know**: When using the `autoPlay` attribute, it is important to
  > also include the `muted` attribute … and the `playsInline` attribute … For
  > self-hosted, set `preload` appropriately.

  Recommended `<video>` attributes there: `preload="none"` for off-screen video.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Check ffmpeg present | `ffmpeg -version` | prints version, exit 0 |
| Typecheck | `npm run typecheck` | exit 0, no errors |
| Lint | `npm run lint` | exit 0 |
| Build | `npm run build` | exit 0 |
| List big videos | `find public/assets -name '*.mp4' -size +4M -exec du -h {} +` | the list of large files |

If `ffmpeg -version` fails (not installed), **STOP** — do the code-only Steps 3
and 4, then report that re-encoding (Steps 1–2) is blocked on ffmpeg.

## Scope

**In scope**:
- `public/assets/**/*.mp4` (re-encode to **new content-versioned filenames**; see Step 1)
- `app/world/id/page.tsx` + `app/world/money/page.tsx` (update the 6 video `src` strings to the new filenames — cache-bust)
- `app/CaseStudy.tsx` (`<video>` tag hardening only)
- `app/world/chat/PhoneVideo.tsx` (`<video>` tag hardening only)
- `app/world/chat/page.tsx` (only if removing the duplicate `.mp4` requires it — it should not, since the `.mp4` is unreferenced)

**Out of scope** (do NOT touch):
- The `inView` / `active` gating logic — it already defers loading correctly.
- The `.webm` files (keep them) and any video dimensions/aspect-ratio data.
- Any `framer-motion` animation wrappers around the videos.
- `next.config.ts` — handled by plan 006.

## Git workflow

- Branch: `advisor/005-optimize-video-delivery`
- Keep the re-encode commit separate from the code-hardening commit.
- Do NOT push or open a PR unless instructed. **Keep a backup** of originals
  before re-encoding (Step 1) so the change is reversible.

## Steps

### Step 0: Confirm which large videos are actually referenced

`Intro-reveal.mp4` (4.7 MB) had **no** `src` reference at planning time. Do not
waste an encode on a dead asset — and if it is truly unused, flag it for deletion
rather than re-encoding.

```bash
for v in Passport Post_verification preflights Intro-reveal; do
  echo -n "$v: "; grep -rl "$v" app/ || echo "UNREFERENCED"
done
grep -rl "REF4\|REF5" app/
```
If `Intro-reveal.mp4` is unreferenced, **skip re-encoding it** and note it as a
delete candidate in your report (do not delete in this plan — out of scope).

### Step 1: Back up originals, then re-encode to content-versioned filenames

Back up first (reversibility — macOS `cp` lacks `--parents`):
```bash
mkdir -p /tmp/a11-video-backup
rsync -R $(find public/assets -name '*.mp4' -size +4M) /tmp/a11-video-backup/
```

Re-encode every **referenced** MP4 larger than 4 MB to H.264 at a web bitrate
(CRF 26, faststart, audio stripped since all are `muted`), writing to a **new
filename that includes a short content hash** of the re-encoded output. The hash
makes the new URL cache-safe under the live 1-year `immutable` policy — a future
re-encode produces a different hash, so clients never serve a stale video.

```bash
for f in $(find public/assets -name '*.mp4' -size +4M); do
  # skip Intro-reveal if Step 0 found it unreferenced
  base="${f%.mp4}"
  ffmpeg -y -i "$f" -an -vcodec libx264 -crf 26 -preset slow \
    -pix_fmt yuv420p -movflags +faststart "${base}.tmp.mp4" || { echo "ENCODE FAILED: $f"; continue; }
  hash=$(shasum -a 256 "${base}.tmp.mp4" | cut -c1-8)
  new="${base}.${hash}.mp4"
  mv "${base}.tmp.mp4" "$new"
  echo "RENAMED: $f  ->  $new"
done
```

Record the old→new filename map (the `RENAMED:` lines) — Step 1b needs it.
**Verify**: `find public/assets -name '*.mp4' -size +8M -exec du -h {} +` →
the 12–19 MB originals still exist (not yet deleted) but each has a new
`*.<hash>.mp4` sibling well under 8 MB.

### Step 1b: Update the `src` references, then delete the originals

For each `RENAMED:` entry, update the matching string `src` in
`app/world/id/page.tsx` / `app/world/money/page.tsx` to the new
`/assets/.../<name>.<hash>.mp4` path. Then delete the old originals:

```bash
# after every reference is updated and verified:
grep -rn -E '/assets/[^"]+\.mp4' app/world/id/page.tsx app/world/money/page.tsx   # sanity: all point to *.<hash>.mp4
# remove the now-unreferenced originals (the pre-hash filenames):
for old in <list the original paths from the RENAMED map>; do rm "$old"; done
```

**Verify**: `grep -rn '\.mp4"' app/ | grep -vE '\.[0-9a-f]{8}\.mp4'` returns
nothing for the 6 large videos (every large-video ref now carries a hash), and
no orphaned pre-hash large file remains in `public/assets`.

### Step 2: Spot-check visual quality

The risk of re-encoding is visible quality loss. Open 2–3 of the re-encoded
files and confirm they still look acceptable (no blocking/banding artifacts):
```bash
# Confirm they are valid, playable, and report new bitrate:
for f in public/assets/world-id/Passport.mp4 public/assets/world-money/REF5.mp4; do
  ffprobe -v error -show_entries format=duration,bit_rate -of default=nw=1 "$f"
done
```
**Verify**: each prints a `duration` matching the original (within ~0.1s) and a
lower `bit_rate`. If duration changed or ffprobe errors → STOP (encode is bad,
restore from `/tmp/a11-video-backup`).

### Step 3: Harden the `<video>` tags

In `app/CaseStudy.tsx:153`, add `preload="none"` so the browser does not begin
fetching until playback is triggered:
```tsx
<video src={inView ? (image.src as string) : undefined} autoPlay loop muted playsInline preload="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
```

In `app/world/chat/PhoneVideo.tsx:39`, add `preload="none"` to the `<video>`:
```tsx
<video
  src={active ? src : undefined}
  autoPlay
  loop
  muted
  playsInline
  preload="none"
  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
/>
```
Do not change anything else in these files.

**Verify**: `npm run lint` → exit 0; `npm run typecheck` → exit 0.

### Step 4: Remove the unreferenced duplicate clip

Confirm `Verified-Unverified.mp4` is referenced nowhere:
```bash
grep -rn "Verified-Unverified" app
```
**If this returns zero matches**, delete it:
```bash
rm "public/assets/world-chat/Verified-Unverified.mp4"
```
**If it returns any match**, do NOT delete — leave it and note the reference in
your report.

**Verify**: `grep -rn "Verified-Unverified" app` → no matches AND
`npm run build` → exit 0.

## Test plan

There are no unit tests for video rendering (it is presentational). Verification
is the build + manual quality spot-check in Step 2. After Step 3, run the dev
server (`npm run dev`) and load `/world/id` and `/world/chat`; confirm videos
still autoplay when scrolled into view.

## Done criteria

ALL must hold:

- [ ] `find public/assets -name '*.mp4' -size +8M` returns nothing (or only files documented as un-shrinkable in your report)
- [ ] Every re-encoded large video is referenced by a **content-hashed** filename; no pre-hash original remains in `public/assets` (cache-bust complete)
- [ ] All 6 `src` strings in `app/world/{id,money}/page.tsx` updated to the new filenames (`npm run build` would 404 a stale path at request time, so also smoke-test in Step "Test plan")
- [ ] `npm run build` exits 0
- [ ] `npm run typecheck` exits 0
- [ ] `npm run lint` exits 0 (depends on plan 013 having landed)
- [ ] `grep -rn 'preload="none"' app/CaseStudy.tsx app/world/chat/PhoneVideo.tsx` returns both files
- [ ] `grep -rn "Verified-Unverified" app` returns no matches (file removed) OR report explains why it was kept
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back if:

- `ffmpeg` is not installed (do code-only Steps 3–4, report Steps 1–2 blocked).
- An ffprobe duration check in Step 2 shows the re-encode changed video length
  or produced an unplayable file (restore from `/tmp/a11-video-backup`).
- The `<video>` excerpts in `app/CaseStudy.tsx` / `PhoneVideo.tsx` don't match
  what's shown above (codebase drifted).
- `Verified-Unverified.mp4` turns out to be referenced somewhere.

## Maintenance notes

- New case-study videos should be exported/encoded at web bitrate **before**
  being committed — add a note to `AGENTS.md` if this recurs. Target: CRF 24–26
  H.264, no audio (all clips are muted), `+faststart`.
- A future improvement (deferred here) is offering a VP9/`.webm` `<source>`
  alongside the `.mp4` for further savings, and adding `poster` frames so the
  first paint isn't a blank box. Out of scope to keep this plan low-risk.
- Reviewer should diff a frame from one re-encoded video against the original to
  confirm quality is acceptable for the brand.
