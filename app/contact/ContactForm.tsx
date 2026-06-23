"use client";

import { useState, FormEvent } from "react";

const FONT = "var(--font-system), sans-serif";

const SOCIALS = [
  { label: "X(Twitter)", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Medium", href: "#" },
];

// ── Individual field with blur validation ─────────────────────────────────────
function FormField({
  label,
  placeholder,
  type = "text",
  multiline = false,
  required = true,
  className,
}: {
  label: string;
  placeholder: string;
  type?: string;
  multiline?: boolean;
  required?: boolean;
  className?: string;
}) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const hasError = required && touched && value.trim() === "";

  const borderColor = hasError
    ? "rgba(255, 80, 80, 0.85)"
    : "rgba(255,255,255,0.2)";

  const baseStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    borderBottom: `1px solid ${borderColor}`,
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
    transition: "border-color 0.18s ease",
  };

  return (
    <div className={className}>
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
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setTouched(true)}
          style={{
            ...baseStyle,
            resize: "none",
            height: 89,
            overflowY: "auto",
          }}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setTouched(true)}
          style={baseStyle}
        />
      )}

      {/* Error message — only shown after blur on empty required field */}
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
        {hasError ? "This field is required" : ""}
      </span>
    </div>
  );
}

// ── Send button ───────────────────────────────────────────────────────────────
function SendButton() {
  return (
    <button
      type="submit"
      className="hover:opacity-90 active:scale-95 transition-[opacity,scale] duration-150"
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
        cursor: "pointer",
        whiteSpace: "nowrap",
        textTransform: "capitalize",
      }}
    >
      Send message
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
export default function ContactForm() {
  return (
    <>
      {/* Form — right column, visible on all breakpoints */}
      <form
        className="contact-form w-full mt-8 md:mt-9"
        onSubmit={(e: FormEvent) => e.preventDefault()}
      >
        {/* Row 1: Name + Email — stacked on mobile, side-by-side on desktop */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-[clamp(20px,2.65vw,40px)] mb-8 md:mb-[clamp(28px,3.44vw,52px)]">
          <FormField
            label="Name*"
            placeholder="Enter your name"
            className="w-full md:flex-1"
          />
          <FormField
            label="Email"
            placeholder="Enter your email"
            type="email"
            className="w-full md:flex-1"
          />
        </div>

        {/* Message */}
        <FormField
          label="Message*"
          placeholder="Type your message"
          multiline
          className="mb-8 md:mb-[clamp(28px,3.44vw,52px)]"
        />

        <SendButton />
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
