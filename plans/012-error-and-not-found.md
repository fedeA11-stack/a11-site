# Plan 012: Add app/error.tsx and app/not-found.tsx (no hidden failures)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat a6d217d..HEAD -- app`
> Confirm `app/error.tsx` and `app/not-found.tsx` still do not exist before
> creating them (`ls app/error.tsx app/not-found.tsx`).

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tech-debt / correctness
- **Planned at**: commit `a6d217d`, 2026-06-23

## Why this matters

The App Router has no `app/error.tsx` and no `app/not-found.tsx`. Today, a
runtime render error shows Next's default error screen and a bad URL shows the
default 404 — both off-brand and, for errors, with **no logging**, violating the
org's *"no hidden failures / explicit error handling"* rule. Adding a root error
boundary (that logs the error with context) and a branded 404 (that routes users
back to real pages) is a standard, low-risk App Router practice that improves
both UX and incident triage.

## Current state

- No `app/error.tsx`, no `app/not-found.tsx`, no `app/global-error.tsx` exist
  (confirmed: only `app/layout.tsx`, `app/page.tsx`, etc.).
- The shared nav is `app/NavMenu.tsx`, a client component. It accepts a `theme`
  prop — `app/contact/page.tsx:45` uses `<NavMenu theme="dark" />`; the homepage
  uses `<NavMenu />` (default/light). Reuse it for visual consistency.
- The site's ink color is `#282328` on white (see `app/manifest.ts:253` and the
  homepage backgrounds). Body has `margin:0` set in `app/layout.tsx:89`.
- Bundled framework convention — `node_modules/next/dist/docs/01-app` file
  conventions: `error.tsx` **must be a Client Component** (`"use client"`) and
  receives `{ error: Error & { digest?: string }, reset: () => void }`.
  `not-found.tsx` is a Server Component and renders the 404 UI.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Typecheck | `npm run typecheck` | exit 0, no errors |
| Lint | `npm run lint` | exit 0 |
| Build | `npm run build` | exit 0 |

## Scope

**In scope** (create only):
- `app/error.tsx`
- `app/not-found.tsx`

**Out of scope** (do NOT touch):
- `app/layout.tsx`, `app/page.tsx`, `app/NavMenu.tsx` (import NavMenu, don't edit it).
- `app/global-error.tsx` — not needed here (covers layout-level crashes only);
  deferred.
- Any styling system change — use inline styles matching the existing pattern
  (the codebase styles heavily with inline `style={{}}`; match that).

## Git workflow

- Branch: `advisor/012-error-and-not-found`
- One commit. Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Create the root error boundary

Create `app/error.tsx`:
```tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";

// Root error boundary. Catches render/runtime errors in the route tree, logs
// them (org rule: no hidden failures — errors must be observable), and shows a
// branded recovery UI with a retry. `reset` re-renders the segment.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Structured-ish console error so the failure is never silent. `digest` is
    // Next's stable error id, useful for correlating with server logs.
    console.error("[app/error] route render failed", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: 24,
        background: "#fff",
        color: "#282328",
        fontFamily: "var(--font-system), sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ margin: 0, fontWeight: 500, fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.02em" }}>
        Something went wrong
      </h1>
      <p style={{ margin: 0, maxWidth: 480, opacity: 0.7 }}>
        An unexpected error occurred. You can try again, or head back to our work.
      </p>
      <div style={{ display: "flex", gap: 16 }}>
        <button
          onClick={reset}
          style={{
            fontFamily: "inherit", fontSize: 16, padding: "12px 24px",
            borderRadius: 999, border: "1px solid #282328", background: "#282328",
            color: "#fff", cursor: "pointer",
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            fontFamily: "inherit", fontSize: 16, padding: "12px 24px",
            borderRadius: 999, border: "1px solid #282328", color: "#282328",
            textDecoration: "none",
          }}
        >
          Back to work
        </Link>
      </div>
    </main>
  );
}
```

**Verify**: `npm run typecheck` → exit 0.

### Step 2: Create the 404 page

Create `app/not-found.tsx`:
```tsx
import Link from "next/link";
import NavMenu from "./NavMenu";

// Branded 404. Server Component (Next renders this for unmatched routes and
// explicit notFound() calls). Reuses the shared nav for consistency.
export default function NotFound() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#fff" }}>
      <NavMenu />
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: 24,
          color: "#282328",
          fontFamily: "var(--font-system), sans-serif",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0, fontWeight: 500, fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.02em" }}>
          Page not found
        </h1>
        <p style={{ margin: 0, maxWidth: 480, opacity: 0.7 }}>
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <Link
          href="/"
          style={{
            fontFamily: "inherit", fontSize: 16, padding: "12px 24px",
            borderRadius: 999, border: "1px solid #282328", color: "#282328",
            textDecoration: "none",
          }}
        >
          Back to work
        </Link>
      </main>
    </div>
  );
}
```

**Verify**: `npm run typecheck` → exit 0.

### Step 3: Build

**Verify**: `npm run build` → exit 0 (the build compiles both files and registers
the 404), and `npm run lint` → exit 0.

If `NavMenu` triggers a build/type error inside `not-found.tsx` (e.g. it requires
props or browser-only context that fails to prerender), **remove the `<NavMenu />`
usage** from `not-found.tsx` (keep the rest) and note it in your report — the 404
must still build. Do not edit `NavMenu.tsx`.

## Test plan

No unit tests apply. Verification is `typecheck` + `build` + `lint`. Optionally,
after `npm run dev`: visit a bogus path like `/this-does-not-exist` and confirm
the branded 404 renders; the error boundary is harder to trigger manually and is
covered by the build.

## Done criteria

ALL must hold:

- [ ] `app/error.tsx` exists, starts with `"use client"`, and logs via `console.error` in a `useEffect`
- [ ] `app/not-found.tsx` exists and renders a branded 404 with a link home
- [ ] `npm run typecheck` exits 0
- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0
- [ ] Only `app/error.tsx` and `app/not-found.tsx` are added; nothing else modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back if:

- `app/error.tsx` or `app/not-found.tsx` already exists (don't overwrite — report).
- The bundled docs say `error.tsx` should NOT be a Client Component in this
  Next.js fork (then follow the docs and report the discrepancy).
- `npm run build` fails and removing `<NavMenu />` from `not-found.tsx` (per
  Step 3) does not resolve it.

## Maintenance notes

- `console.error` is the minimum bar. If/when a real telemetry sink (Datadog,
  Sentry) is wired up, the `useEffect` in `error.tsx` is where to forward the
  error + `digest`. Flagged for the observability backlog.
- A `global-error.tsx` (catches errors in the root layout itself) is a possible
  follow-up; deferred because the root layout here is simple.
- Reviewer should confirm the 404 and error pages match the brand and that the
  error boundary actually logs (check the console when a thrown error is forced).
