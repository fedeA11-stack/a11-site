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

- Video files are referenced by **string path** (not import) in the page data,
  e.g. `app/world/id/page.tsx:65` → `src: "/assets/world-id/Passport.mp4"`.
  Re-encoding in place (same filename) means **no code path changes** are needed
  for the re-encode itself.

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
- `public/assets/**/*.mp4` (re-encode in place — same filenames)
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

### Step 1: Back up originals, then re-encode large MP4s in place

Back up first (reversibility):
```bash
mkdir -p /tmp/a11-video-backup
find public/assets -name '*.mp4' -size +4M -exec cp --parents {} /tmp/a11-video-backup/ \;
```
(On macOS `cp` lacks `--parents`; use `rsync -R $(find public/assets -name '*.mp4' -size +4M) /tmp/a11-video-backup/` instead.)

Re-encode every MP4 larger than 4 MB to H.264 at a web-appropriate quality
(CRF 26, faststart for streaming, strip audio since all are `muted`). Encode to
a temp file then replace, so a failed encode never corrupts the source:

```bash
for f in $(find public/assets -name '*.mp4' -size +4M); do
  echo "Encoding $f"
  ffmpeg -y -i "$f" -an -vcodec libx264 -crf 26 -preset slow \
    -pix_fmt yuv420p -movflags +faststart "${f%.mp4}.opt.mp4" \
    && mv "${f%.mp4}.opt.mp4" "$f"
done
```

**Verify**: `find public/assets -name '*.mp4' -size +8M -exec du -h {} +` →
substantially fewer/smaller files than before (the 12–19 MB files should now be
well under 8 MB). If any single file did **not** shrink, note it but continue.

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
- [ ] `npm run build` exits 0
- [ ] `npm run typecheck` exits 0
- [ ] `npm run lint` exits 0
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
