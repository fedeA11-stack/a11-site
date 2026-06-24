// Pure validation + spam-guard helpers for the contact form.
//
// Kept free of the "use server" boundary and the Resend import so it can be
// unit-tested directly with a plain FormData. The Server Action (actions.ts)
// is a thin shell around these functions.
//
//   sendContactEmail(formData)
//     ├─ isHoneypotTripped(_gotcha)  → bot filled hidden field
//     ├─ isTooFast(_ts, now)         → submitted faster than a human can type
//     └─ validate(formData)          → name / email / message + length caps

export type ContactInput = { name: string; email: string; message: string };

export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

export type ValidateResult =
  | { ok: true; data: ContactInput }
  | { ok: false; errors: FieldErrors };

// Deliberately loose: one @, at least one dot in the domain, no whitespace.
// Server-side email validation can only ever be a sanity check — the real
// proof an address works is whether the reply lands.
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const MAX_NAME = 200;
const MAX_MESSAGE = 5000;

// Minimum time (ms) a real human takes between page load and submit. Anything
// faster is a script. Conservative so we never reject a fast legitimate user.
export const MIN_SUBMIT_MS = 2000;

export function validate(fd: FormData): ValidateResult {
  const name = String(fd.get("name") ?? "").trim();
  const email = String(fd.get("email") ?? "").trim();
  const message = String(fd.get("message") ?? "").trim();

  const errors: FieldErrors = {};

  if (!name) errors.name = "Please enter your name";
  else if (name.length > MAX_NAME) errors.name = "Name is too long";

  if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email";

  if (!message) errors.message = "Please enter a message";
  else if (message.length > MAX_MESSAGE) errors.message = "Message is too long";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { name, email, message } };
}

// Honeypot: a hidden field no human ever sees. Any value means a bot filled it.
export function isHoneypotTripped(value: FormDataEntryValue | null): boolean {
  return typeof value === "string" && value.trim() !== "";
}

// Time-trap: reject submits faster than MIN_SUBMIT_MS. Fails OPEN — a missing
// or unparseable timestamp is treated as "not a bot" so we never block a real
// user whose hidden field didn't initialize.
export function isTooFast(
  ts: FormDataEntryValue | null,
  now: number,
  minMs: number = MIN_SUBMIT_MS,
): boolean {
  const t = Number(ts);
  if (!Number.isFinite(t) || t <= 0) return false;
  return now - t < minMs;
}
