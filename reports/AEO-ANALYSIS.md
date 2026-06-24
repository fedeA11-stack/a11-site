# AEO Analysis: a11.studio

**Date:** 2026-06-23
**Target:** a11.studio (local codebase, Next.js 16.2.7, fully SSG)
**Method:** seo-agent skill (Agent Engine Optimization rubric), applied to the live dev server + source

---

## Update — improvements implemented (2026-06-23)

After the initial audit below, the applicable surfaces were hardened. **Agent-Legibility score: 88 → 95/100** (the remaining 5 is inherent — there is no further meaningful agent surface for a portfolio without an actual product API, which it shouldn't have).

| Change | Effect |
|--------|--------|
| `llms.txt` is now **generated** (`app/llms.txt/route.ts`) from `app/caseData.ts` → `ALL_PROJECTS` + each case's `data` | Drift root-cause eliminated; a new case study flows into it automatically. Build **throws** if a project lacks content (no hidden failures). |
| Added **`llms-full.txt`** (`app/llms-full.txt/route.ts`) | Full prose of all 10 case studies (titles + section bodies, ~13 KB) in one fetch; same source, so it can't drift. |
| `llms.txt` gained **Services** + **To engage** lines and a link to `llms-full.txt` | An agent can now act (what's offered + how to contact), not just read history. |
| Each case page now **exports its `data`**; copy centralized in `app/seo.ts` | Single source of truth for agent-facing prose across JSON-LD, `llms.txt`, `llms-full.txt`. |
| Organization JSON-LD enriched: `foundingDate`, `numberOfEmployees`, `knowsAbout`, `sameAs`, `@id`; added a **`WebSite`** node in a single `@graph` | Stronger entity/knowledge-graph signal. |
| Removed non-standard `Host:` from `robots.ts` | Clean directives. |
| Added `app/seo.test.ts` (7 tests) | Locks the `firstSentence`/`flattenTitle` generators and the studio-pages list. |

Verified on the running server: `/llms.txt` (200, text/plain, all 10 cases + 4 studio pages, links to full, no stale `tokenstudio`), `/llms-full.txt` (200, 10 case blocks / 39 section headings), home `@graph` (Organization + WebSite). `next build` clean (35 static routes), `tsc` clean, 26/26 tests pass.

**Not done (deliberately):** MCP server, OpenAPI spec, SDK, CLI, directory listings — cargo-cult for a studio site; left N/A.

---

## Verdict first: the rubric mostly doesn't apply — and that's correct

The seo-agent rubric audits whether AI agents can **discover, understand, and call a product** without a human. It is designed for SaaS/API products: MCP servers, OpenAPI specs, SDKs, CLIs, developer docs, directory listings.

**a11.studio is a design-studio portfolio. It has no product API to call** — and shouldn't. 6 of the 9 categories (73% of the rubric weight) are structurally **N/A**: there is nothing for an agent to *invoke*, only content to *read and understand*.

Scoring it as a product gives a misleading **~15/100**. The honest, useful number is the **Agent-Legibility score on the surfaces that actually apply to a content site: 88/100.** An agent can crawl every page, understand what the studio does and its body of work, and find how to engage. That's the real AEO goal for this kind of site, and it's well met.

| Score | Value | Meaning |
|-------|-------|---------|
| Raw seo-agent rubric | ~15/100 | Misleading — penalizes the absence of an API/SDK/MCP a portfolio has no reason to ship |
| **Agent-Legibility (applicable surfaces)** | **88/100** | The meaningful score: can an agent crawl, understand, and act on this site |

---

## Category Breakdown

### Applicable to a portfolio site

| Category | Weight | Score | Findings |
|----------|--------|-------|----------|
| **robots.txt agent directives** | 5% | 90/100 | `User-Agent: *` + `Allow: /` — every agent UA (Claude-Code-Bot, OpenAI-Operator, etc.) is allowed; nothing is blocked; `Sitemap` is referenced. Minor: includes a non-standard `Host:` line (only Yandex honors it) — harmless noise. |
| **llms.txt agent profile** | 12% | 85/100 | Present and well-formed at the conventional root `/llms.txt` (200, `text/plain`). H1 + one-paragraph summary + contact + Calendly + every case study and studio page with a one-line description. Now accurate after today's drift fixes. Gap: no `llms-full.txt` companion (full prose in one fetch) and no explicit capability/services header. |
| **Content machine-readability (structured data)** | n/a* | 90/100 | Clean SSG — full HTML to agents, no client-fetch dependency. JSON-LD: `Organization` (+`ContactPoint`, now with `sameAs`), `BreadcrumbList`, `CreativeWork` per case study. Sitemap valid XML (200), 15 URLs, no drift. Semantic h1/h2, descriptive alt text. |

\* Mapped from the rubric's "API Machine-Readability" category, reinterpreted for a content site (structured data + clean server-rendered HTML in place of an OpenAPI spec).

### N/A — product/API surfaces a portfolio has no reason to ship

| Category | Weight | Status |
|----------|--------|--------|
| MCP Discoverability (`/.well-known/mcp.json`) | 20% | **N/A** — 404. No MCP server; there is no tool for an agent to call. |
| API Machine-Readability (OpenAPI) | 18% | **N/A** — `/openapi.json` 404. No public API. |
| SDK Coverage (npm/PyPI) | 12% | **N/A** — the studio ships client work, not a library. |
| Directory Presence (Smithery, mcp.so…) | 10% | **N/A** — MCP-server directories; nothing to register. |
| Developer Docs Quality | 10% | **N/A** — no developer-facing product. |
| CLI Discoverability (`bin`) | 5% | **N/A** — no `bin` entry in package.json; not a CLI tool. |
| Agent DX (sandbox, pagination) | 8% | **N/A** — no API surface to exercise. |

**Recommendation: do not build any of these to chase the score.** An MCP server / OpenAPI spec / SDK on a studio marketing site would be cargo-culting — maintenance cost with no audience. The N/A categories should stay N/A.

---

## Quick Wins (1 week)

1. **Add a one-line capability/services header to `llms.txt`.** Right now an agent learns *who* A11 is and *what they've built*, but not *what they offer*. Add a short "Services: product design, brand, web — for ambitious startups; engagements from X" line and an explicit "To engage: email hello@a11.studio or book https://calendly.com/a11studio". Turns the file from a portfolio index into something an agent can act on when a user asks "find me a product design studio."
2. **Remove the non-standard `Host:` directive from `app/robots.ts`.** Cosmetic, but it's noise no major crawler/agent uses.

## Medium Effort (1 month)

3. **Add `public/llms-full.txt`** — the full case-study prose (titles, section bodies, outcomes) concatenated in one document. This is the established llms.txt convention: `llms.txt` is the index, `llms-full.txt` is the deep content an agent fetches to actually summarize the studio's work without crawling 10 pages. Generate it from `caseProjects.ts` + each case's `data` object so it never drifts (same discipline the rest of the site already follows).
4. **Make `llms.txt` source-derived** (carried over from the SEO audit) — a `route.ts` that builds it from `ALL_PROJECTS` + `seo.ts`. This is what *caused* today's three drift bugs; fixing the generation closes the whole class.

## Architecture (2–3 months)

5. **None recommended.** The agent-relevant architecture for a portfolio is already right: static HTML, structured data, sitemap, robots, llms.txt. There is no product to make "agent-callable." Effort is better spent on named-entity authority (Search Console, complete social/directory profiles) — see the SEO audit's 31–90 day section.

---

## Bottom line

For a studio portfolio, "agent optimization" means an agent can **read the site, understand the studio and its work, and know how to get in touch** — not call an API. On that goal a11.studio scores **88/100**: clean SSG, complete structured data, valid sitemap, open robots, and an accurate `llms.txt`. The only genuinely additive moves are sharpening `llms.txt` into an *actionable* profile (services + how-to-engage) and adding an `llms-full.txt` for deep content. Everything the raw rubric flags as "missing" (MCP, OpenAPI, SDK, CLI) is correctly absent and should stay that way.

## Appendix — probe results
- `/robots.txt` → 200, allows all, sitemap referenced
- `/llms.txt` → 200, `text/plain`, 2573 bytes, accurate
- `/sitemap.xml` → 200, `application/xml`, 15 URLs
- `/.well-known/mcp.json` → 404 (N/A)
- `/openapi.json` → 404 (N/A)
- `/llms-full.txt` → 404 (improvement opportunity)
- `package.json` `bin` → none (N/A)
- JSON-LD types emitted: Organization, ContactPoint, BreadcrumbList, CreativeWork, ListItem
- Related: `reports/a11.studio-seo-audit-2026-06-23.md`
