"use server";

import { Resend } from "resend";
import { validate, isHoneypotTripped, isTooFast, type FieldErrors } from "./validate";

// State returned to the client via useActionState. The form renders from this.
//
//   idle  → first render, nothing submitted yet
//   ok    → message sent (or a bot was silently dropped — bots see success)
//   error → fieldErrors (validation) OR message (send/config failure)
export type ContactState = {
  status: "idle" | "ok" | "error";
  fieldErrors?: FieldErrors;
  message?: string;
};

// Bound the upstream call so a hung Resend request can't hold the Server
// Action open indefinitely (org rule: remote calls use bounded timeouts).
const SEND_TIMEOUT_MS = 10_000;

const GENERIC_ERROR =
  "Something went wrong sending your message. Please email hello@a11.studio directly.";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("resend-timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

export async function sendContactEmail(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // 1. Honeypot — bot filled the hidden field. Return success so the bot
  //    believes it worked and doesn't retry; never send.
  if (isHoneypotTripped(formData.get("_gotcha"))) {
    return { status: "ok" };
  }

  // 2. Time-trap — submitted faster than a human could fill the form.
  if (isTooFast(formData.get("_ts"), Date.now())) {
    return { status: "ok" };
  }

  // 3. Server-side validation — never trust the client.
  const result = validate(formData);
  if (!result.ok) {
    return { status: "error", fieldErrors: result.errors };
  }
  const { name, email, message } = result.data;

  // 4. Send. Missing config is an operational error, not a user error —
  //    log it loudly, show the user the fallback, never crash.
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set — cannot send email");
    return { status: "error", message: GENERIC_ERROR };
  }

  const to = process.env.CONTACT_TO ?? "hello@a11.studio";
  const from = process.env.CONTACT_FROM ?? "A11 Contact <noreply@a11.studio>";

  try {
    const resend = new Resend(apiKey);
    const { error } = await withTimeout(
      resend.emails.send({
        from,
        to,
        replyTo: email,
        subject: `New contact message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
      SEND_TIMEOUT_MS,
    );

    if (error) {
      console.error("[contact] Resend returned an error:", error);
      return { status: "error", message: GENERIC_ERROR };
    }

    return { status: "ok" };
  } catch (err) {
    // Timeout, network failure, or thrown SDK error — all land here. The user
    // sees the fallback, ops sees the cause. No silent failure.
    console.error("[contact] Failed to send contact email:", err);
    return { status: "error", message: GENERIC_ERROR };
  }
}
