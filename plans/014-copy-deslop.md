# 014 — Copy de-slop, grammar & voice pass

**Branch:** `copy-check`
**Mode:** light / voice-preserving · propose-then-apply · claims treated as approved (bugs flagged, not silently fixed)
**Status:** PROPOSAL — awaiting approval before any edit lands.

This document lists every proposed copy change, page by page, as `Current → Proposed`
with a one-line reason tagged:

- `[grammar]` — objectively wrong (agreement, missing article, comma splice, missing terminal punctuation)
- `[slop]` — AI-tell: rule-of-three padding, "continues to evolve", vague abstraction nouns, hollow intensifiers
- `[clarity]` — ambiguous or hard to parse on first read
- `[voice]` — preserves/sharpens the existing house voice
- `[consistency]` — aligns wording/format with the rest of the site
- `[format]` — punctuation/number formatting only; meaning unchanged

Headlines and primary CTAs include 2–3 alternatives per the copywriting brief.
Nothing here invents a claim, stat, or testimonial.

---

## Copy brief (locked context)

- **Product:** A11 — a small (≈9–10 person) product design studio, operating since 2019.
- **Audience:** founders of ambitious startups, mostly post-MVP ("the product is real but
  not yet what it needs to be"), heavily crypto / fintech / consumer.
- **Value prop:** an embedded senior team that takes few projects and fights for craft;
  proven on World App (a top crypto wallet).
- **Primary CTA across site:** contact ("Let's Talk").  Secondary: Read Manifesto, Discover Studio.
- **Voice:** confident, terse, anti-hype, occasionally combative ("Design got lazy. We didn't.").
  Deliberate short fragments are part of the voice and are PRESERVED.

### The house de-slop rulebook (the bar every edit is held to)

1. Cut rule-of-three triads unless each item earns its place. The corpus leans on them
   heavily: "simple, familiar, and safe", "clarity, confidence, and control",
   "trust, ownership, and long-term confidence", "identity, trust, and interaction".
2. Kill empty motion verbs: "continues to evolve", "bridges", "creating a more
   accessible and connected experience".
3. Prefer the concrete noun over the abstract one ("experience" is overused).
4. Keep terminal punctuation consistent — several bodies drop the final period.
5. One product name, one spelling, one number. (See flagged inconsistencies below.)
6. Never add a claim. If a line implies a number we can't back, flag it.

---

## 🚩 FLAGGED — needs your decision (not auto-fixed)

| # | Issue | Location | Note |
|---|-------|----------|------|
| F1 | **Duplicate placeholder quote.** "…a wallet experience that made crypto feel simple, familiar, and safe." is attributed to **both** Patrick Traughber (World Money) and Ajay Patel (World ID). | [world/money/page.tsx:65](app/world/money/page.tsx:65), [world/id/page.tsx:37](app/world/id/page.tsx:37) | One is wrong. Currently hidden (`SHOW_TESTIMONIALS=false`) so not live, but needs the real quote before testimonials are switched on. |
| F2 | **Duplicate quote across studies.** "This is what good operator tooling looks like…" appears on **Orb** (Subho Deep, "Staff Product Manager") and **Nous** (Subho Deep, "Tools for Humanity"). | [world/orb/page.tsx:62](app/world/orb/page.tsx:62), [nous/page.tsx:52](app/nous/page.tsx:52) | The Nous one is almost certainly a placeholder — an operator-tooling quote on an AI-workspace page. Also note Nous quote lacks the curly-quote characters the others have. |
| F3 | **Unbacked stat.** "in the age of AI, more than 70% of it is bots." | [world/id/page.tsx:30](app/world/id/page.tsx:30) | Strong public claim. Confirm the source, or I can soften to "much of it is bots." Your call. |
| F4 | **Stats reused verbatim.** Freehold Invest shows the exact same stat row as Orb App: 18M+ / 3700 / 160+ ("Verified users / Active operators / Countries covered"). | [freehold-invest/page.tsx:34-38](app/freehold-invest/page.tsx:34) | These are World/Orb metrics — they look copy-pasted onto a tokenization product. Likely wrong numbers + wrong labels. Need real figures or remove the row. |
| F5 | **Headcount inconsistency.** Studio + World say "nine people"; Manifesto says "Ten people cannot be." | [studio/page.tsx:60](app/studio/page.tsx:60), [manifesto/page.tsx:253](app/manifesto/page.tsx:253) | Pick one number. (I'd align Manifesto to "Nine people cannot be." but that's a fact, so it's your call.) |

---

## Page 1 — Home / Work  ([app/page.tsx](app/page.tsx))

### Hero H1 (desktop [page.tsx:509](app/page.tsx:509) + mobile [page.tsx:643](app/page.tsx:643))
Current: `We are A11.\nProduct Studio Built on\nPassion and Craft.`

- The mid-sentence Title Case ("Built on Passion and Craft") is a slop/inconsistency tell — nowhere else on the site title-cases a sentence. `[slop]`

**Alternatives:**
1. **`We are A11. A product studio built on passion and craft.`** — minimal fix: drop the Title Case, keep the line. *(Recommended — smallest change, fixes the tell.)*
2. `We are A11. A product studio built on craft, not on excuses.` — ties the hero to the studio/footer "fight for craft" theme; sharper, slightly bigger change.
3. `We are A11. We design products people return to.` — outcome-led (echoes the manifesto's best line); biggest departure.

> Note: changing the H1 touches both the desktop string and the mobile `<br/>` version — I'd keep them in sync.

### Card 03 — Nous description ([page.tsx:132](app/page.tsx:132) + mobile [page.tsx:556](app/page.tsx:556))
Current: `Shared intelligent\nlayer`
Proposed: `Shared intelligence\nlayer`
- The case study itself is titled "Designing a shared **intelligence** layer". "intelligent layer" is a typo/mismatch. `[consistency]` `[grammar]`

### Card 01 — World description ([page.tsx:95](app/page.tsx:95) + mobile [page.tsx:554](app/page.tsx:554))
Current: `Five years,\nnine people.\nFour Apps for\nreal humans`
Proposed: `Five years,\nnine people.\nFour apps for\nreal humans`
- Lowercase "apps" (no reason to capitalize mid-phrase; matches the World hub headline "four apps"). `[consistency]`

*(All other card descriptions — Atlans, Freehold, Districts, Freehold Invest, Relai — read clean. No change.)*

### CTA interstitials
- `Built with craft. Driven by passion.\nShipped without excuses.` — **keep.** Strong, on-voice. `[voice]`
- `Looking designed is easy now.\nCaring enough to craft it isn't.` — **keep.** Strong. `[voice]`

---

## Page 2 — Studio  ([app/studio/page.tsx](app/studio/page.tsx))

### H1 ([studio/page.tsx:96](app/studio/page.tsx:96))
`We make things that feel like someone cared.` — **keep.** Best headline on the site. `[voice]`

### Body ¶1 ([studio/page.tsx:109](app/studio/page.tsx:109))
Current: "…where we designed World App from scratch – now one of the most widely used mobile wallets in the world."
Proposed: "…where we designed World App from scratch — now one of the most widely used mobile wallets in the world."
- Spaced en-dash `–` → em-dash `—` to match site punctuation. `[format]`

### Body ¶2, ¶3 — **keep.** Clean, confident, on-voice. No slop.

---

## Page 3 — Manifesto  ([app/manifesto/page.tsx](app/manifesto/page.tsx))

### H1 `Design got lazy. We didn't.` — **keep.** Signature line. `[voice]`

### Body ¶3 ([manifesto/page.tsx:252](app/manifesto/page.tsx:252))
Current: "We take limited number of projects at a time…"
Proposed: "We take a limited number of projects at a time…"
- Missing article. `[grammar]`
- Also see **F5** (the "Ten people" vs "nine people" inconsistency in this paragraph).

### Body ¶1, ¶2, ¶4 — **keep.** This is the strongest prose on the site. `[voice]`

---

## Page 4 — Contact  ([app/contact/page.tsx](app/contact/page.tsx))

### H1 `We'd love to hear from you` — keep. Warm, fits the page. `[voice]`

### Locations line ([contact/page.tsx:92](app/contact/page.tsx:92))
Current: `San Francisco · Munich · Barcelona · Dubai · Italy · Czech Republic · Slovakia`
- Mixes cities (San Francisco, Munich, Barcelona, Dubai) with countries (Italy, Czech Republic, Slovakia). `[consistency]`
- **Flag, light suggestion:** either all cities or all countries. No auto-change — I don't know which cities in IT/CZ/SK. Your call.

### Subtitle, form labels, button, success/error — **keep.** Microcopy is clean and the error copy is genuinely good ("Please email hello@a11.studio directly."). `[voice]`

---

## Page 5 — World hub  ([app/world/page.tsx](app/world/page.tsx) + [WorldCards.tsx](app/world/WorldCards.tsx))

- H1 `Five years, nine people, four apps, number one crypto wallet.` — keep. `[voice]`
- Card subs ("Manage your investments", "Prove you're a real human", "Chat for real humans in World Network", "Manage your Orb operations") — keep. Clear and parallel. `[voice]`

---

## Page 6 — World Money  ([app/world/money/page.tsx](app/world/money/page.tsx))

### Section "Wallet designed for everyone" body ([money/page.tsx:49](app/world/money/page.tsx:49))
Current: "…They were not thinking about networks, or blockchain infrastructure, they simply needed to understand what they owned, how to receive it, and how to use it safely."
Proposed: "…They were not thinking about networks or blockchain infrastructure; they simply needed to understand what they owned, how to receive it, and how to use it safely."
- Removes stray comma after "networks"; fixes comma splice with a semicolon. `[grammar]`

### Section title "New financial rails\nfamiliar actions" ([money/page.tsx:74](app/world/money/page.tsx:74))
Proposed: `New financial rails,\nfamiliar actions`
- Reads as a fragment without the comma. `[grammar]` `[clarity]`

### "New financial rails" body ([money/page.tsx:75](app/world/money/page.tsx:75))
Current: "…the interface focused on clarity, confidence, and control."
Proposed: "…the interface focused on clarity and control."
- Trims the rule-of-three; "confidence" overlaps "clarity/control" and adds nothing. `[slop]`

*(Other Money sections — "From wallet balance to real-world use", "Helping users understand the value" — read clean. Keep.)*

---

## Page 7 — World ID  ([app/world/id/page.tsx](app/world/id/page.tsx))

### Description ([id/page.tsx:24](app/world/id/page.tsx:24))
Current: "…make a complex, unfamiliar concept feel simple, trustworthy, and immediately useful."
Proposed: "…make a complex, unfamiliar concept feel simple and immediately useful."
- Trims triad; "trustworthy" is implied by the page. `[slop]`

### "You know you're human" body ([id/page.tsx:30](app/world/id/page.tsx:30))
- See **F3** (the 70% claim). No wording change proposed pending your decision.

### "Meet the Orb" body ([id/page.tsx:46](app/world/id/page.tsx:46))
Current: "…So Tools For Humanity Design Lab built something they can't fake a camera that just looks at you. No voice. No instructions. No display. That's where the fun started."
Proposed: "…So Tools for Humanity Design Lab built something they can't fake — a camera that just looks at you. No voice. No instructions. No display. That's where the fun started."
- Missing punctuation: the clause runs into "a camera…" — em-dash fixes it. `[grammar]`
- "Tools For Humanity" → "Tools for Humanity" (matches Studio page + the real brand). `[consistency]`

### Section title "3 continents.\n160+ locations." — keep. Punchy, on-voice. `[voice]`
### "Wait, do I have to go somewhere?" — keep. Great conversational beat. `[voice]`

---

## Page 8 — World Chat  ([app/world/chat/page.tsx](app/world/chat/page.tsx))

### Description ([chat/page.tsx:23](app/world/chat/page.tsx:23))
Current: "A communication layer designed for a world where being human can no longer be assumed, simple to use, yet grounded in identity, trust, and interaction."
Proposed: "A communication layer for a world where being human can no longer be assumed — simple to use, but grounded in real identity."
- Cuts the "identity, trust, and interaction" triad (where "interaction" is filler for a chat app); em-dash for the aside. `[slop]` `[clarity]`

### Titles "Designing trust at scale" / "Private by design" / "Value in conversation" — keep. Tight. `[voice]`
### Bodies use curly apostrophes (`isn't`, `who's`) consistently — good, leave. ✓

---

## Page 9 — Orb App  ([app/world/orb/page.tsx](app/world/orb/page.tsx))

- Quote: see **F2**.
- "Simplicity across every workflow" body ([orb/page.tsx:50](app/world/orb/page.tsx:50)): long but accurate and specific — keep. `[voice]`
- Other sections clean. No change.

---

## Page 10 — Atlans  ([app/atlans/page.tsx](app/atlans/page.tsx))  ⚠️ roughest copy on the site

### Description ([atlans/page.tsx:22](app/atlans/page.tsx:22))
Current: "For those who doesn't care only about the wattage and comparing stats, but also about the espresso quality and how they spend their time."
Proposed: "For those who don't only care about wattage and stats, but about the espresso and how they spend their time."
- "those who **doesn't**" → "don't" (agreement); tightens the rest. `[grammar]` `[clarity]`
- **Alt:** "For people who care about more than wattage and PRs — the espresso, the route, the time well spent."

### "Find your community" body ([atlans/page.tsx:38](app/atlans/page.tsx:38))
Current: "With a map or list view to see what's the closest community or rental from your hotel, or which friends are open for activity."
Proposed: "Map and list views show the closest community or rental to your hotel — and which friends are up for an activity."
- Original is a verbless fragment ("With a map… to see what's the closest"). `[grammar]` `[clarity]`

### "Turn every workout into a shared experience" body ([atlans/page.tsx:50](app/atlans/page.tsx:50))
Current: "New way for planning, either as individual simply pinning activity on map saying 'let's run this week' or a community easily found on map with fully defined events."
Proposed: "A new way to plan — pin an activity on the map yourself ('let's run this week'), or find a community on the map with fully planned events."
- Original reads as non-native draft: missing articles, run-on. Light rebuild keeps the meaning + the 'let's run this week' voice. `[grammar]` `[clarity]`

### Titles — keep, all clean. `[voice]`

---

## Page 11 — Freehold  ([app/freehold/page.tsx](app/freehold/page.tsx))

### "Building more than a product" body ([freehold/page.tsx:68](app/freehold/page.tsx:68))
Current: "…Every touchpoint was crafted to feel consistent, familiar, and aligned with the broader vision of the platform."
Proposed: "…Every touchpoint was crafted to feel consistent with the rest of the platform."
- Trims triad + "broader vision" abstraction. `[slop]`

*(Description and other three sections read clean — keep.)*

---

## Page 12 — Nous  ([app/nous/page.tsx](app/nous/page.tsx))

- Quote: see **F2** (almost certainly a placeholder).
- Bodies are clean and specific ("From one brain to many specialists" is good). Keep. `[voice]`

---

## Page 13 — Relai  ([app/relai/page.tsx](app/relai/page.tsx))

### Description ([relai/page.tsx:28](app/relai/page.tsx:28))
Current: "…built around trust, ownership, and long-term confidence."
Proposed: "…built around ownership and long-term confidence."
- Trims triad; "trust" overlaps "confidence". `[slop]`

### "From first buy to long-term saving" body ([relai/page.tsx:47](app/relai/page.tsx:47))
Current: ends "…simple purchase flows, and recurring savings plans" *(no period)*
Proposed: add terminal period. `[grammar]`

### "Self-custody without the fear" body ([relai/page.tsx:62](app/relai/page.tsx:62))
Current: ends "…without making the wallet feel technical or risky" *(no period)*
Proposed: add terminal period. `[grammar]`

### Title "Bitcoin without the noise" — keep, excellent. `[voice]`

---

## Page 14 — Districts  ([app/districts/page.tsx](app/districts/page.tsx))

### Stats ([districts/page.tsx:41-43](app/districts/page.tsx:41))
Current: `5,6K+` / `12,3K+` / `36M+`
Proposed: `5.6K+` / `12.3K+` / `36M+`
- European decimal comma → period for an English-language site. Value unchanged. `[format]`

### Bodies — strong and specific ("claim in a tap", "not a company", "$DSTRX"). Keep. `[voice]`

---

## Page 15 — Freehold Invest  ([app/freehold-invest/page.tsx](app/freehold-invest/page.tsx))

- Stats: see **F4** (looks copy-pasted from Orb — likely wrong).

### "Real-world assets reimagined" body ([freehold-invest/page.tsx:42](app/freehold-invest/page.tsx:42))
Current: "As investing continues to evolve, the platform bridges traditional opportunities with digital ownership, creating a more accessible and connected investment experience."
Proposed: "The platform connects traditional investments with digital ownership, so more people can own assets that used to be out of reach."
- Three slop tells in one sentence: "continues to evolve", "bridges", "more accessible and connected experience". Rebuilt around a concrete benefit (access). `[slop]` `[clarity]`

### "Owning a piece in minutes" / "Ownership you can trade" — keep, genuinely sharp ("speaks plain English", "shouldn't be harder to sell than it was to buy"). `[voice]`

### "Ownership beyond the transaction" body ([freehold-invest/page.tsx:84](app/freehold-invest/page.tsx:84))
Current: "…support the complete lifecycle of digital ownership, from investor management and liquidity to reporting and ongoing asset operations."
- Borderline jargon-stack but accurate for the audience; **keep** under light-touch. (Flag only.)

---

## Page 16 — Footer / Nav / Error / 404 / Metadata

- **Footer** "It's time to fight for craft. Let's talk." — keep, excellent. `[voice]`
- **Nav** "Work / Studio / Let's Talk" — keep.
- **error.tsx** "Something went wrong" / "head back to our work" — keep, on-voice.
- **not-found.tsx** "Page not found" / "doesn't exist or has moved" — keep.
- **layout.tsx** description "A11 Product Studio of the Ambitious." — slightly cryptic as a meta description (search snippet). `[clarity]`
  - **Alt:** "A11 is a product design studio for the ambitious — we design digital products people return to."
  - Flag only; this is the sitewide default description and an SEO decision.

---

## Suggested apply order (once approved)

1. Pure grammar/format fixes (uncontroversial): Atlans, World Money body, Relai periods,
   Manifesto article, Nous "intelligence", Districts number format, Tools for Humanity,
   em-dashes. → one commit `fix(copy): grammar, punctuation & number formatting`.
2. Slop trims (triads / filler): World Money, World ID, World Chat, Freehold,
   Relai, Freehold Invest. → `refactor(copy): cut AI-slop padding`.
3. Headline/description decisions you pick from the alternatives (home H1, layout
   description, contact locations). → `feat(copy): sharpen headlines`.
4. Flagged bugs (F1–F5) — only after you supply the correct quotes/stats/number.

Each step: `npm run typecheck` + `npm run build`, then preview-verify the rendered text.
