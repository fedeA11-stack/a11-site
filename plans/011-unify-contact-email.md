# Plan 011: Fix the structured-data contact email to hello@a11.studio

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat a6d217d..HEAD -- app/seo.ts app/layout.tsx`
> Compare the "Current state" excerpt against the live code before proceeding;
> on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: SEO / correctness
- **Planned at**: commit `a6d217d`, 2026-06-23

## Why this matters

The site advertises **two different** contact emails. Everything users actually
touch — the contact page UI (`app/contact/page.tsx:92`), the server action's
send target and error copy (`app/contact/actions.ts:22,70`), and the tests
(`app/contact/actions.test.ts`) — uses **`hello@a11.studio`** (matching the
`a11.studio` web origin). But the `schema.org` Organization JSON-LD emitted in
the `<head>` on every page uses **`hello@a11studio.com`**, because the
`CONTACT_EMAIL` constant in `app/seo.ts` is set to that variant. Search engines
and AI agents read the JSON-LD as the canonical contact channel, so they surface
the wrong address. The confirmed-correct address is **`hello@a11.studio`**. The
fix is a single constant change; because `layout.tsx` already reads the constant,
the JSON-LD updates automatically.

## Current state

`app/seo.ts:5-9`:
```ts
export const SITE_URL = "https://a11.studio";

// Contact email as used across the site (note: a11studio.com, distinct from the
// a11.studio web origin above).
export const CONTACT_EMAIL = "hello@a11studio.com";
```

`app/layout.tsx` consumes it in the Organization JSON-LD (no change needed here):
```ts
// app/layout.tsx:72 and :76
  email: CONTACT_EMAIL,
  ...
    email: CONTACT_EMAIL,
```

Confirmed via `grep`: `hello@a11.studio` is used in `app/contact/page.tsx:92`,
`app/contact/actions.ts:22` (error message) and `:70` (`CONTACT_TO` default),
and asserted in `app/contact/actions.test.ts:43,72,80,87`. The
`hello@a11studio.com` variant appears **only** in `app/seo.ts:8`.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Typecheck | `npm run typecheck` | exit 0, no errors |
| Tests | `npm run test` | all pass |
| Lint | `npm run lint` | exit 0 |
| Build | `npm run build` | exit 0 |
| Confirm old variant gone | `grep -rn "a11studio.com" app` | no matches |

## Scope

**In scope**:
- `app/seo.ts` — the `CONTACT_EMAIL` constant value and its now-inaccurate comment.

**Out of scope** (do NOT touch):
- `app/contact/actions.ts`, `app/contact/page.tsx`, the tests — they are already
  correct (`hello@a11.studio`).
- The `CONTACT_TO` / `CONTACT_FROM` env-var defaults in `actions.ts` — correct.
- DRY-ing the hardcoded `hello@a11.studio` strings to reference the constant —
  optional, deferred (see Maintenance notes); not required for this fix.

## Git workflow

- Branch: `advisor/011-unify-contact-email`
- One commit. Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Correct the constant and its comment

In `app/seo.ts`, replace lines 6-8 with:
```ts
// Contact email as used across the site — matches the a11.studio web origin and
// the address the contact form sends to / displays.
export const CONTACT_EMAIL = "hello@a11.studio";
```

**Verify**: `grep -n 'CONTACT_EMAIL' app/seo.ts` shows `"hello@a11.studio"`.

### Step 2: Confirm the wrong variant is gone everywhere

**Verify**: `grep -rn "a11studio.com" app` → **no matches**.

### Step 3: Run the gates

**Verify**: `npm run typecheck` → exit 0; `npm run test` → all pass;
`npm run build` → exit 0; `npm run lint` → exit 0.

## Test plan

No new test needed — existing `app/contact/actions.test.ts` already asserts
`hello@a11.studio` and must continue to pass. The JSON-LD has no test; verify it
manually after `npm run build && npm run start` by viewing source of `/` and
confirming the `application/ld+json` block contains `"email":"hello@a11.studio"`.

## Done criteria

ALL must hold:

- [ ] `app/seo.ts` `CONTACT_EMAIL` is `"hello@a11.studio"`
- [ ] `grep -rn "a11studio.com" app` returns no matches
- [ ] `npm run typecheck` exits 0
- [ ] `npm run test` passes
- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0
- [ ] Only `app/seo.ts` is modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back if:

- `app/seo.ts:8` is not `"hello@a11studio.com"` as shown (file drifted — the
  email may already have been changed; verify and report).
- `grep -rn "a11studio.com" app` still returns matches after Step 1 (there is
  another occurrence not accounted for — list it and report before continuing).

## Maintenance notes

- Optional follow-up (deferred): replace the literal `"hello@a11.studio"` strings
  in `app/contact/page.tsx` and `app/contact/actions.ts` with imports of
  `CONTACT_EMAIL` from `app/seo.ts`, so there is a single source of truth and
  this drift cannot recur. Left out here to keep the fix to one file.
- Reviewer should confirm the rendered JSON-LD now shows the correct address.
