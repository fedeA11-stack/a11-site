"use client";

import { useState, useEffect, useRef, useActionState } from "react";
import { sendContactEmail, type ContactState } from "./actions";

const FONT = "var(--font-system), sans-serif";

const SOCIALS = [
  { label: "X(Twitter)", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Medium", href: "#" },
];

const initialState: ContactState = { status: "idle" };

// ── Individual field ──────────────────────────────────────────────────────────
// Border color is NOT set inline — it lives in the page's <style> block so the
// :focus rule (white line) can take effect. Inline styles beat stylesheets, so
// setting borderBottom here would silently defeat :focus. Error state is driven
// by the `field-error` class on the wrapper instead (red line, !important).
function FormField({
  label,
  name,
  placeholder,
  type = "text",
  multiline = false,
  required = true,
  className,
  serverError,
  onValueChange,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  multiline?: boolean;
  required?: boolean;
  className?: string;
  serverError?: string;
  onValueChange?: (name: string) => void;
}) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const clientError = required && touched && value.trim() === "";
  const errorMsg = serverError ?? (clientError ? "This field is required" : "");
  const hasError = errorMsg !== "";

  const baseStyle: React.CSSProperties = {
    background: "transparent",
    color: "#ffffff",
    fontFamily: FONT,
    fontWeight: 400,
    fontSize: 14,
    letterSpacing: "-0.137px",
    lineHeight: "normal",
    width: "100%",
    padding: "0 0 8px",
    outline: "none",
    display: "block",
  };

  const handleChange = (next: string) => {
    setValue(next);
    // Clear a stale server-side error as soon as the user edits the field.
    if (serverError) onValueChange?.(name);
  };

  return (
    <div className={`${className ?? ""} ${hasError ? "field-error" : ""}`.trim()}>
      <label
        style={{
          display: "block",
          fontFamily: FONT,
          fontWeight: 400,
          fontSize: 12,
          lineHeight: "19px",
          letterSpacing: "-0.137px",
          color: hasError ? "rgba(255, 80, 80, 0.85)" : "#ffffff",
          marginBottom: 12,
          transition: "color 0.18s ease",
        }}
      >
        {label}
      </label>

      {multiline ? (
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => setTouched(true)}
          style={{ ...baseStyle, resize: "none", height: 89, overflowY: "auto" }}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => setTouched(true)}
          style={baseStyle}
        />
      )}

      {/* Error message — client (blur on empty) or server (returned from action) */}
      <span
        aria-live="polite"
        style={{
          display: "block",
          height: hasError ? "auto" : 0,
          overflow: "hidden",
          marginTop: hasError ? 4 : 0,
          fontFamily: FONT,
          fontSize: 11,
          lineHeight: 1.3,
          color: "rgba(255, 80, 80, 0.85)",
          transition: "height 0.15s ease",
          pointerEvents: "none",
        }}
      >
        {errorMsg}
      </span>
    </div>
  );
}

// ── Send button ───────────────────────────────────────────────────────────────
function SendButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="hover:opacity-90 active:scale-95 transition-[opacity,scale] duration-150 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 137,
        height: 44,
        background: "#ffffff",
        border: "none",
        borderRadius: 0,
        fontFamily: FONT,
        fontWeight: 500,
        fontSize: 15,
        lineHeight: 0.95,
        letterSpacing: "-0.3px",
        color: "#282328",
        cursor: pending ? "not-allowed" : "pointer",
        whiteSpace: "nowrap",
        textTransform: "capitalize",
      }}
    >
      {pending ? "Sending…" : "Send message"}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 4,
          height: 4,
          borderRadius: 1,
          background: "#282328",
          pointerEvents: "none",
        }}
      />
    </button>
  );
}

// ── Full contact form ─────────────────────────────────────────────────────────
//
//   submit ──► sendContactEmail (Server Action)
//                ├─ honeypot / time-trap  → silent ok (bot)
//                ├─ validate              → state.fieldErrors (red lines)
//                └─ Resend send           → ok / state.message (fallback)
//
// On success the form is remounted (key bump) to clear all fields, and a
// confirmation replaces the inline error region.
export default function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactEmail, initialState);

  // Fields the user has edited since the last submit — used to clear stale
  // server errors so a corrected field stops showing red immediately.
  const [clearedFields, setClearedFields] = useState<Set<string>>(new Set());

  // Bump on success to remount FormFields and reset their internal state.
  const [formKey, setFormKey] = useState(0);

  // Detect the transition into a successful submit during render — the
  // React-endorsed "adjust state when something changes between renders"
  // pattern (https://react.dev/learn/you-might-not-need-an-effect). Runs once
  // per transition thanks to the prevStatus guard, so it converges.
  const [prevStatus, setPrevStatus] = useState<ContactState["status"]>("idle");
  if (state.status !== prevStatus) {
    setPrevStatus(state.status);
    if (state.status === "ok") {
      setFormKey((k) => k + 1);
      setClearedFields(new Set());
    }
  }

  // A fresh submission invalidates stale server errors (handled in the event,
  // not an effect).
  const handleAction = (formData: FormData) => {
    setClearedFields(new Set());
    return formAction(formData);
  };

  const fieldError = (name: keyof NonNullable<ContactState["fieldErrors"]>) =>
    clearedFields.has(name) ? undefined : state.fieldErrors?.[name];

  const clearField = (name: string) =>
    setClearedFields((prev) => new Set(prev).add(name));

  return (
    <>
      <form
        key={formKey}
        className="contact-form w-full mt-8 md:mt-9"
        action={handleAction}
      >
        {/* Honeypot — hidden from humans, irresistible to bots. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-9999px",
            width: 1,
            height: 1,
            overflow: "hidden",
          }}
        >
          <label>
            Leave this field empty
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>

        {/* Time-trap — set on mount; submits faster than MIN_SUBMIT_MS are bots. */}
        <TimestampField />

        {/* Row 1: Name + Email */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-[clamp(20px,2.65vw,40px)] mb-8 md:mb-[clamp(28px,3.44vw,52px)]">
          <FormField
            label="Name*"
            name="name"
            placeholder="Enter your name"
            className="w-full md:flex-1"
            serverError={fieldError("name")}
            onValueChange={clearField}
          />
          <FormField
            label="Email*"
            name="email"
            placeholder="Enter your email"
            type="email"
            className="w-full md:flex-1"
            serverError={fieldError("email")}
            onValueChange={clearField}
          />
        </div>

        {/* Message */}
        <FormField
          label="Message*"
          name="message"
          placeholder="Type your message"
          multiline
          className="mb-8 md:mb-[clamp(28px,3.44vw,52px)]"
          serverError={fieldError("message")}
          onValueChange={clearField}
        />

        <div className="flex items-center gap-4 flex-wrap">
          <SendButton pending={pending} />

          {/* Form-level status — success or send/config failure */}
          <span
            aria-live="polite"
            role="status"
            style={{
              fontFamily: FONT,
              fontWeight: 400,
              fontSize: 13,
              lineHeight: 1.4,
              color:
                state.status === "ok"
                  ? "#8ec5e6"
                  : state.status === "error" && state.message
                    ? "rgba(255, 80, 80, 0.85)"
                    : "transparent",
            }}
          >
            {state.status === "ok"
              ? "Message sent — we'll be in touch."
              : state.status === "error" && state.message
                ? state.message
                : ""}
          </span>
        </div>
      </form>

      {/* Social — mobile only, rendered after form */}
      <div className="flex md:hidden gap-6 mt-24">
        {SOCIALS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            style={{
              fontFamily: FONT,
              fontWeight: 400,
              fontSize: 16,
              lineHeight: 1,
              color: "#a8a8a8",
              textDecoration: "none",
            }}
          >
            {label}
          </a>
        ))}
      </div>
    </>
  );
}

// Hidden timestamp set after mount. Rendered empty on the server and on first
// client render (no hydration mismatch); the mount time is written directly to
// the DOM node in an effect (updating an external system, not React state). A
// missing value fails open server-side, so a real user is never blocked.
function TimestampField() {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.value = String(Date.now());
  }, []);
  return <input type="hidden" name="_ts" ref={ref} defaultValue="" />;
}
