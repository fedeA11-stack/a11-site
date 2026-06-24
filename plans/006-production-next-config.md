# Plan 006: Populate next.config.ts with production image + hardening defaults

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat a6d217d..HEAD -- next.config.ts`
> If `next.config.ts` changed since this plan was written, compare the
> "Current state" excerpt against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: perf / tech-debt
- **Planned at**: commit `a6d217d`, 2026-06-23

## Why this matters

`next.config.ts` is empty. Two cheap, safe wins are being left on the table:
1. **AVIF image format** — `next/image` defaults to serving WebP only. Opting in
   to AVIF (`formats: ["image/avif", "image/webp"]`) typically shaves another
   10–30% off every optimized image on the site, which is almost all of them
   (the homepage cards and every case-study tile go through `next/image`).
2. **Hardening / safe defaults** (org rule: *safe defaults*) — `poweredByHeader:
   false` removes the `X-Powered-By: Next.js` fingerprint header. Long-lived
   cache headers on the immutable `/assets` directory let the CDN/browser cache
   the large media instead of re-validating.

All of these are config-only, fully reversible, and have no runtime logic risk.

## Current state

`next.config.ts` (entire file):
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

Facts verified during recon:
- `compress` already defaults to `true` in Next 16 — do **not** add it (no-op
  noise). The win here is AVIF, the powered-by header, and asset caching.
- Images are served via the `CoverImage` wrapper (`app/CoverImage.tsx`) and
  direct `next/image` usage, so the `images.formats` setting applies site-wide.
- Static assets live under `public/assets/` and are content-stable (renamed when
  changed), so they are safe to cache aggressively.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Typecheck | `npm run typecheck` | exit 0, no errors |
| Lint | `npm run lint` | exit 0 |
| Build | `npm run build` | exit 0 |

## Scope

**In scope**:
- `next.config.ts`

**Out of scope** (do NOT touch):
- Any application/source file.
- Do **not** add a `Content-Security-Policy` header here — CSP for this site
  needs a deliberate policy (it injects inline `<script type="application/ld+json">`
  and inline `<style>`), and getting it wrong breaks the page. Deferred.
- Do **not** add `compress` (already default true) or `experimental.*` flags.

## Git workflow

- Branch: `advisor/006-production-next-config`
- One commit. Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Write the config

Replace the body of `next.config.ts` with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve AVIF first (smaller than WebP), fall back to WebP, then the original.
  // Applies to every next/image on the site (homepage cards, case-study tiles).
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Drop the X-Powered-By: Next.js fingerprint header (safe default).
  poweredByHeader: false,

  // Long-lived caching for the immutable static media in /assets. These files
  // are content-stable (renamed when their content changes), so a 1-year
  // immutable cache is safe and keeps the large images/videos out of repeat
  // download paths.
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

**Verify**: `npm run typecheck` → exit 0 (the `NextConfig` type accepts all
these keys; a typo will fail here).

### Step 2: Confirm the build still succeeds and headers apply

**Verify**: `npm run build` → exit 0. The build output should not warn about an
invalid config. (AVIF generation happens on-demand at request time, so the build
itself won't visibly change.)

## Test plan

No unit tests apply to config. Verification is `typecheck` + `build`. Optionally,
after `npm run build && npm run start`, confirm the asset cache header:
```bash
curl -sI http://localhost:3000/assets/world-logo.svg | grep -i cache-control
```
Expected: `cache-control: public, max-age=31536000, immutable`. (Skip if you
cannot run a production server in the executor environment.)

## Done criteria

ALL must hold:

- [ ] `next.config.ts` contains `formats`, `poweredByHeader: false`, and the `/assets` `headers()` rule
- [ ] `npm run typecheck` exits 0
- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0
- [ ] No files outside `next.config.ts` are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back if:

- `next.config.ts` already contains an `images`, `headers`, or `poweredByHeader`
  key (it has drifted — merge carefully and report rather than overwrite).
- `npm run build` fails with a config-validation error after Step 1.

## Maintenance notes

- If a Content-Security-Policy is added later, it belongs alongside the
  `headers()` function here (or in middleware) and must allow the inline JSON-LD
  script and inline styles the site currently uses.
- The `immutable` cache assumes assets are never overwritten in place under the
  same name. Plan 005 re-encodes some videos **in place** (same filename) — land
  006 only after 005 has shipped, or invalidate the CDN cache for those paths
  after 005, so users don't get a stale cached copy. (See dependency note in
  `plans/README.md`.)
- Reviewer should confirm AVIF is actually being served in the deployed
  environment (DevTools → Network → an image request → `content-type:
  image/avif`).
