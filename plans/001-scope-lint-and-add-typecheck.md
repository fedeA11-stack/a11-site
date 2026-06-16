# Plan 001: Make `npm run lint` clean and add a `typecheck` gate

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 0c23ed1..HEAD -- eslint.config.mjs package.json .gitignore`
> If any of those files changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `0c23ed1`, 2026-06-16

## Why this matters

Running `npm run lint` today reports **6307 problems (398 errors)** — but the
actual application source is clean (0 errors, 3 warnings). The noise comes
entirely from ESLint walking `.claude/worktrees/`, an ~869 MB directory of
throwaway git worktrees (each a full copy of the repo *including its own
`node_modules` and minified vendor files*). Because lint is drowning in
false positives, no one can use it as a pre-commit or CI gate, and real
warnings are invisible.

Separately, there is no `typecheck` script. `tsc --noEmit` passes cleanly
today, but nothing makes that easy to run or wires it into a gate. A
one-line script turns it into a fast, reliable check.

After this plan: `npm run lint` reports only real application issues, and
`npm run typecheck` exits 0.

## Current state

- `eslint.config.mjs` — flat config. Its `globalIgnores` only lists Next's
  build dirs; it does **not** ignore `.claude/**`, so ESLint scans the
  worktrees. Current content:

  ```js
  // eslint.config.mjs:1-18
  import { defineConfig, globalIgnores } from "eslint/config";
  import nextVitals from "eslint-config-next/core-web-vitals";
  import nextTs from "eslint-config-next/typescript";

  const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    // Override default ignores of eslint-config-next.
    globalIgnores([
      // Default ignores of eslint-config-next:
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ]),
  ]);

  export default eslintConfig;
  ```

- `package.json` — scripts block has no `typecheck`. Current content:

  ```json
  // package.json:5-10
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  ```

- `.gitignore` — does not list `.claude/`. The directory is local-only
  (only one `.claude` file is tracked by git), but ignoring it makes the
  intent explicit and prevents the 869 MB of worktrees from ever being
  accidentally staged.

- **Convention note**: this repo pins `next` and `eslint-config-next` to
  `16.2.7` and uses ESLint v9 flat config (`defineConfig` + `globalIgnores`).
  Do not introduce a legacy `.eslintignore` file — flat config ignores live
  inside `globalIgnores(...)`.

## Commands you will need

| Purpose   | Command                  | Expected on success |
|-----------|--------------------------|---------------------|
| Lint      | `npm run lint`           | exit 0, only real `app/` findings (≤ ~3 warnings, 0 errors) |
| Typecheck | `npm run typecheck`      | exit 0, no errors (after step 2) |
| Scoped lint sanity | `npx eslint app` | same small result as `npm run lint` |

## Scope

**In scope** (the only files you should modify):
- `eslint.config.mjs`
- `package.json`
- `.gitignore`

**Out of scope** (do NOT touch):
- Any file under `app/` — do not "fix" the 3 remaining warnings here; they
  are addressed by other plans (the `<img>` warning) or are intentional.
- `.claude/**` — never edit or delete worktree contents.

## Git workflow

- Branch: you are on `tech-optimization`. Stay on it unless told otherwise.
- Commit style: conventional commits (see `git log`, e.g.
  `fix: center nav links on the page`). Suggested message:
  `chore: scope eslint to app source and add typecheck script`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Ignore `.claude/**` in the ESLint config

In `eslint.config.mjs`, add `".claude/**"` to the `globalIgnores([...])`
array (alongside the existing entries). The array should become:

```js
globalIgnores([
  // Default ignores of eslint-config-next:
  ".next/**",
  "out/**",
  "build/**",
  "next-env.d.ts",
  // Local-only throwaway git worktrees — never lint these.
  ".claude/**",
]),
```

**Verify**: `npm run lint` → exit 0; output contains **no** paths under
`.claude/worktrees/` and reports at most a handful of `app/` warnings and
**0 errors**. (Before this change the same command printed "6307 problems".)

### Step 2: Add a `typecheck` script

In `package.json`, add a `typecheck` entry to `scripts`. Result:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "typecheck": "tsc --noEmit"
},
```

(`typescript` is already a devDependency, so `tsc` resolves via `npx`/npm.)

**Verify**: `npm run typecheck` → exit 0, no output errors.

### Step 3: Add `.claude/` to `.gitignore`

Append a section to `.gitignore`:

```
# local claude worktrees / scratch
.claude/
```

**Verify**: `git status --porcelain | grep '.claude/worktrees' || echo CLEAN`
→ prints `CLEAN` (the worktrees are not showing up as untracked changes).
Also confirm the one already-tracked `.claude` file is unaffected:
`git ls-files .claude | wc -l` → still prints `1`.

## Test plan

This is a tooling-config change; there is no unit-test surface. Verification
is the lint/typecheck command behavior in each step. No new test files.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `npm run lint` exits 0 and prints **no** `.claude/` paths and **0 errors**
- [ ] `npm run typecheck` exits 0
- [ ] `git status --porcelain | grep -c '.claude/worktrees'` returns `0`
- [ ] Only `eslint.config.mjs`, `package.json`, `.gitignore` are modified (`git status`)
- [ ] `plans/README.md` status row for 001 updated

## STOP conditions

Stop and report back (do not improvise) if:

- `npm run lint` still reports `.claude/` paths after adding `".claude/**"`
  (the ignore glob may need to be `"**/.claude/**"` depending on the ESLint
  version's base-path resolution — report what you observe rather than
  guessing further).
- `npm run typecheck` reports **any** type error — this plan assumes a clean
  baseline; a real type error is a separate finding, not something to fix here.
- The "Current state" excerpts for `eslint.config.mjs` or `package.json`
  don't match the live files (codebase drifted).

## Maintenance notes

- For a reviewer: confirm the lint output is genuinely scoped to `app/` and
  that no real app errors were hidden by the previous noise.
- If a future CI workflow is added, wire `npm run lint` and
  `npm run typecheck` as gates — they are now reliable.
- Deferred: the 3 remaining `app/` lint warnings (an unused `GRID` const in
  `NavMenu.tsx:12`, an unused eslint-disable in `PhoneVideo.tsx:36`, and an
  `<img>` warning in `world/chat/page.tsx:215`) are intentionally left for
  other plans / future work.
