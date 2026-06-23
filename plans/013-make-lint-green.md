# Plan 013: Make `npm run lint` exit 0 (fix 4 react-hooks errors + clear dead code)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `npm run lint 2>&1 | grep -E "error" | grep -vi warning`
> Confirm the 4 errors below still exist at the stated file:line. If the line
> numbers moved, re-locate the same code before editing. If an error is already
> gone, skip its step and note it.
>
> **Framework note**: This is a modified Next.js 16 / React 19 fork (see
> `AGENTS.md`). The lint rules here are `react-hooks` v6-era
> (`set-state-in-effect`, `refs`). Read
> `node_modules/next/dist/docs/` before reaching for any framework API.

## Status

- **Priority**: P1
- **Effort**: S–M (the 4 errors need real refactors; warnings are deletions)
- **Risk**: LOW (behavior-preserving; verified by build + manual smoke)
- **Depends on**: none
- **Category**: correctness / tech-debt / DX
- **Planned at**: commit `221f66a` (branch `dev-opt`), 2026-06-23

## Why this matters

`npm run lint` exits **non-zero on `main`** — 4 errors + 11 warnings. A red lint
gate that everyone ignores is worse than no gate: it trains the team to merge
through red, and it hides the next real regression. Two of the four errors are
genuine React correctness smells, not style nits:

- `set-state-in-effect` (3×) — calling `setState` synchronously inside an effect
  triggers a second render pass before paint. Cheap here, but it is the exact
  pattern that causes cascading re-render bugs as components grow.
- `refs` during render (1×) — reading `ref.current` while rendering is
  non-deterministic under concurrent React; the value can be torn between the
  render and what the user sees.

Fixing these makes the lint gate trustworthy so later plans (and CI) can rely on
"lint is green" as a real signal.

## The 4 errors (verified at commit `221f66a`)

| # | File:line | Rule | Root cause |
|---|-----------|------|------------|
| E1 | `app/CaseStudy.tsx:232` | `set-state-in-effect` | `StatNumber` effect calls `setDisplay(value)` synchronously for the non-numeric branch |
| E2 | `app/CaseStudy.tsx:432` | `refs` (access during render) | `const displayIndex = hovered ?? lastIndex.current` reads a ref during render to pick the visible preview |
| E3 | `app/NavMenu.tsx:194` | `set-state-in-effect` | `useEffect(() => { setMenuOpen(false); }, [pathname])` resets state on route change |
| E4 | `app/contact/CopyEmail.tsx:24` | `set-state-in-effect` | `useEffect(() => { setMounted(true); }, [])` SSR/hydration mount guard |

## Scope

**In scope**: `app/CaseStudy.tsx`, `app/NavMenu.tsx`, `app/contact/CopyEmail.tsx`
(the 4 error fixes), and the dead-code deletions in Step 5 (warnings).

**Out of scope** (do NOT touch):
- The visual design, animation timings, or behavior of any component.
- The DRY/token consolidation (that is Batch C / a separate plan — do not start it).
- `next.config.ts`, media assets, or anything in `public/`.

## Git workflow

- Branch: `dev-opt` (already created) or a child branch `advisor/013-make-lint-green`.
- Suggested commits: one per error (E1–E4) + one for the dead-code sweep, so each
  refactor is independently reviewable and revertible. Do NOT push/PR unless told.

## Steps

### Step 1 — E1: `CaseStudy.tsx:232` (StatNumber synchronous setState)

`StatNumber` parses `"45M+"` and counts up. The flagged line is the
non-numeric fallback inside the count-up effect:

```tsx
// current — app/CaseStudy.tsx:228-247 (effect dep: [visible, value, delay])
const match = value.match(/^([\d.]+)(.*)$/);
if (!match) { setDisplay(value); return; }   // <-- E1: sync setState in effect
```

**Fix (derive instead of set):** parse once with `useMemo`, and lazily
initialize `display` so the non-animated case never needs a setState. The rAF
`setDisplay` inside `tick` is fine (it runs in a callback, not synchronously in
the effect body) and stays.

```tsx
const parsed = useMemo(() => value.match(/^([\d.]+)(.*)$/), [value]);
const [display, setDisplay] = useState(() => (parsed ? "0" : value));
// ...
useEffect(() => {
  if (!visible || !parsed) return;            // non-numeric: nothing to animate
  const target = parseFloat(parsed[1]);
  const suffix = parsed[2];
  // ... unchanged rAF count-up, still calls setDisplay(`${current}${suffix}`)
}, [visible, parsed, delay]);
```

Import `useMemo` if not already imported. **Verify:** the stat still counts up on
`/atlans` (numeric stats) and renders any non-numeric stat verbatim.

### Step 2 — E2: `CaseStudy.tsx:432` (ref read during render)

`lastIndex.current` is read during render to choose which preview shows when the
pointer is between rows:

```tsx
const displayIndex = hovered ?? lastIndex.current;   // <-- E2: ref during render
```

The value affects rendered output, so it must be **state**, not a ref — that is
the rule's whole point. Promote the "last hovered row" to state:

```tsx
const [lastIndex, setLastIndex] = useState(0);
// wherever lastIndex.current = i was assigned (in the hover handler), use:
setLastIndex(i);
// render:
const displayIndex = hovered ?? lastIndex;
```

Find every `lastIndex.current` write (hover/enter handlers) and the declaration
(`const lastIndex = useRef(...)`), and convert. **Caution:** if `lastIndex.current`
is also read inside `onMove` (line ~420, `rowRefs.current[lastIndex.current]`),
reading the state value there is fine — handlers see the latest committed value.
**Verify:** hovering the "All projects" rows still moves/shows the preview; no
flicker when moving between rows.

### Step 3 — E3: `NavMenu.tsx:194` (close menu on route change)

```tsx
useEffect(() => { setMenuOpen(false); }, [pathname]);   // <-- E3
```

**Fix (explicit, no effect):** close the overlay where navigation actually
happens — each nav `<Link>`'s `onClick` — and drop the effect. This is more
explicit (the menu closes because the user clicked a link, not as a side effect
of a path string changing) and removes a render pass.

```tsx
<Link href={link.href} onClick={() => setMenuOpen(false)} ...>
```

Apply to every `<Link>` rendered inside the mobile overlay. If a path can change
without a click inside this component (e.g. browser back), the
derived-state-on-render pattern is the fallback:

```tsx
const [prevPath, setPrevPath] = useState(pathname);
if (prevPath !== pathname) { setPrevPath(pathname); setMenuOpen(false); }
```

setState **during render** (not in an effect) is allowed and does not trip the
rule. Pick the onClick approach unless back-button close is required.
**Verify:** open the mobile menu, tap a link → menu closes and navigates; the
scroll-lock effect (line 186) still releases.

### Step 4 — E4: `CopyEmail.tsx:24` (mount guard)

```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);   // <-- E4
```

First read how `mounted` is used (likely to suppress a hover-tooltip/portal until
after hydration to avoid a mismatch).

**Preferred fix:** if `mounted` only gates client-only UI that already depends on
hover/pointer state, the guard is often redundant — the tooltip only appears
after a real `onMouseEnter`, which cannot happen during SSR. If so, delete
`mounted` + its effect entirely and render based on the existing `hovered` state.

**If the guard is genuinely needed** (hydration-sensitive output on first paint),
use the hydration-safe primitive instead of an effect:

```tsx
import { useSyncExternalStore } from "react";
const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
```

(`false` on the server, `true` on the client — no effect, no lint error.)
**Verify:** copy-to-clipboard still works on `/contact`; no hydration warning in
the console; the tooltip/position behaves as before.

### Step 5 — Clear the dead-code warnings

Behavior-neutral deletions (verify each is truly unused before removing):

- Remove the unused `WordReveal` import from `app/page.tsx`,
  `app/manifesto/page.tsx`, `app/studio/page.tsx` (and `app/CaseStudy.tsx` if
  flagged) — grep each file for `<WordReveal` first; only remove if zero usages.
- Remove unused `s2a`, `s3b`, `s3c` imports in `app/world/id/page.tsx`
  (confirm they appear nowhere in the page data).
- Remove the 3 stale `eslint-disable` directives flagged as "Unused eslint-disable
  directive": `app/page.tsx:263`, `app/CaseStudy.tsx` (media-has-caption),
  `app/world/chat/PhoneVideo.tsx:38`. **Caution:** `eslint --fix` can remove
  these automatically — run `npx eslint --fix app` and review the diff, but
  hand-verify it did not touch anything in scope of Steps 1–4.

## Test plan

There are existing tests only for the contact form (`actions.test.ts`,
`validate.test.ts`); none cover these presentational components. Verification is:

1. `npm run lint` → **exit 0, no errors, no warnings**.
2. `npm run typecheck` → exit 0.
3. `npm run build` → exit 0.
4. `npm test` → existing contact tests still pass (no regression).
5. Manual smoke via `npm run dev`:
   - `/atlans` — stat numbers count up (E1).
   - `/` "All projects" — row hover preview tracks correctly (E2).
   - mobile viewport — open nav, tap link, menu closes (E3).
   - `/contact` — copy-email tooltip + clipboard work (E4).

**Completeness note:** consider adding a minimal render/interaction test (Vitest +
Testing Library) for at least `StatNumber` (E1) and the NavMenu close-on-click
(E3), since both were just refactored and have zero coverage. Optional but
recommended — the marginal cost is small and it locks in the fix.

## Done criteria

ALL must hold:

- [ ] `npm run lint` exits 0 with **zero errors and zero warnings**
- [ ] `npm run typecheck` exits 0
- [ ] `npm run build` exits 0
- [ ] `npm test` passes
- [ ] No `eslint-disable` directive was added to silence any of E1–E4 (the rule
      must be satisfied, not suppressed)
- [ ] Only the in-scope files changed (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back if:

- Any fix would change visible behavior or animation feel (e.g. the count-up
  timing, preview tracking, or menu transition look different).
- E4's `mounted` turns out to gate output that genuinely differs between server
  and client first paint — confirm the `useSyncExternalStore` path is correct
  before deleting.
- `eslint --fix` touches files outside Steps 1–5.
- The drift check shows the flagged code has materially changed since planning.

## Maintenance notes

- Once green, keep it green: lint should be a required CI check. If CI does not
  yet run `npm run lint && npm run typecheck`, that is a one-line follow-up
  worth filing.
- The `set-state-in-effect` rule will keep catching this pattern; the durable
  habit is "derive during render, don't set in an effect" — see
  `node_modules/next/dist/docs/` and the React docs on "You Might Not Need an
  Effect".
