# TODOS

## Contact form — distributed rate limiting
- **What:** Add per-IP rate limiting to the contact Server Action (`app/contact/actions.ts`).
- **Why:** Honeypot + min-submit-time guard catches ~90% of bots, but a determined attacker scripting valid-looking submits can still burn Resend send quota and spam `hello@a11.studio`.
- **Pros:** Caps abuse blast radius; aligns with the org "rate limiting / load shedding" reliability rule.
- **Cons:** Serverless has no shared memory, so this needs an external store (Upstash Redis or Vercel KV) — a new service + credentials. Overkill until abuse is actually observed.
- **Context:** Deferred during the `form-backend` eng review (2026-06-23). Trigger to build: Resend quota alerts or visible spam in the inbox. Start point: wrap the send step in a fixed-window limiter keyed on the request IP.
- **Depends on / blocked by:** Contact form backend shipped first; a KV/Redis store provisioned.

## Contact page — dead social links
- **What:** Replace placeholder `href="#"` on the X(Twitter)/LinkedIn/Medium links with real URLs.
- **Why:** They render as clickable links that go nowhere — looks broken to visitors.
- **Pros:** Removes a visibly unfinished element on a key conversion page.
- **Cons:** None; needs the actual profile URLs.
- **Context:** Found in `app/contact/ContactForm.tsx:8` (mobile) and `app/contact/page.tsx:18` (desktop) — the `SOCIALS` arrays are duplicated in both files, so fixing this is also a chance to DRY them into one shared constant. Noted during the `form-backend` eng review (2026-06-23). Out of scope for the form backend work.
- **Depends on / blocked by:** Real social profile URLs.
