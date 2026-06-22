import type { Metadata } from "next";
import Image from "next/image";
import NavMenu from "../NavMenu";
import PageEnter from "../PageEnter";
import rectangleImg from "../../public/assets/contact-page/rectangle.png";

export const metadata: Metadata = {
  title: "Let's Talk",
  description: "Got an idea we can help with? Want to join our team? Reach out to A11 Product Studio.",
  alternates: { canonical: "/contact" },
};

const BG = "#302424";
const FONT = "var(--font-system), sans-serif";

// ── Form field: label + underline-only input ──────────────────────────────────
function FormField({
  label,
  placeholder,
  type = "text",
  multiline = false,
  style,
}: {
  label: string;
  placeholder: string;
  type?: string;
  multiline?: boolean;
  style?: React.CSSProperties;
}) {
  const base: React.CSSProperties = {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.4)",
    color: "#ffffff",
    fontFamily: FONT,
    fontWeight: 400,
    fontSize: "clamp(14px, 1.3vw, 16px)",
    lineHeight: 1.4,
    width: "100%",
    padding: "0 0 8px",
    outline: "none",
    display: "block",
  };

  return (
    <div style={style}>
      <label
        style={{
          display: "block",
          fontFamily: FONT,
          fontWeight: 400,
          fontSize: 12,
          lineHeight: "19px",
          letterSpacing: "-0.137px",
          color: "#ffffff",
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          placeholder={placeholder}
          rows={4}
          style={{
            ...base,
            resize: "none",
            height: 89,
            borderBottom: "1px solid rgba(255,255,255,0.4)",
          }}
        />
      ) : (
        <input type={type} placeholder={placeholder} style={base} />
      )}
    </div>
  );
}

// ── Submit button — white bg / dark text (inverse of CtaButton) ───────────────
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
      }}
    >
      Send message
      {/* Corner dot — mirrors CtaButton's dot */}
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

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <>
    {/* Scoped styles: placeholder opacity + cursor:none for the custom cursor */}
    {/* eslint-disable-next-line react/no-unknown-property */}
    <style>{`
      .contact-form input::placeholder,
      .contact-form textarea::placeholder { color: rgba(255,255,255,0.5); }
      .contact-form input, .contact-form textarea { caret-color: #ffffff; }
    `}</style>
    <div
      style={{
        background: BG,
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <NavMenu theme="dark" />

      {/* Decorative shape — Figma group 263:11868, x=788 y=254 w=652 h=618 on 1512×1080 */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "52.12vw",   /* 788/1512 */
          top: "23.52vh",    /* 254/1080 */
          width: "43.12vw",  /* 652/1512 */
          height: "57.22vh", /* 618/1080 */
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <Image
          src={rectangleImg}
          alt=""
          fill
          style={{ objectFit: "cover" }}
          sizes="43vw"
          priority
        />
      </div>

      <PageEnter style={{ flex: 1, minHeight: 0, position: "relative", zIndex: 1 }}>
        {/*
         * Main layout — mirrors Figma 1512×1080 canvas (40px side margins):
         *   Left column  = 780px wide (headline + address + social)
         *   Right column = 620px wide (subtitle + form)
         *   Gap          = 32px
         * Vertical positions are absolute within each column, derived from Figma y
         * values with the 80px fixed nav height subtracted.
         */}
        <main
          style={{
            height: "100%",
            display: "flex",
            gap: "clamp(16px, 2.24vw, 32px)",
            paddingLeft: "clamp(20px, 2.65vw, 40px)",
            paddingRight: "clamp(20px, 2.65vw, 40px)",
          }}
        >
          {/* ── Left column ───────────────────────────────────────────────── */}
          <div
            style={{
              flex: "780 780 0",
              position: "relative",
              minWidth: 0,
              height: "100%",
            }}
          >
            {/* Headline — Figma y=200, nav=80 → top=120px */}
            <h1
              style={{
                position: "absolute",
                top: "clamp(60px, 11.11vh, 120px)",
                left: 0,
                fontFamily: FONT,
                fontWeight: 500,
                fontSize: "clamp(40px, 7.41vh, 80px)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: "#ffffff",
                margin: 0,
                whiteSpace: "pre-line",
              }}
            >
              {"We'd Love to\nHear from You"}
            </h1>

            {/* Address block — Figma y=472, nav=80 → top=392px */}
            <address
              style={{
                position: "absolute",
                top: "clamp(220px, 36.3vh, 392px)",
                left: 0,
                maxWidth: 500,
                fontStyle: "normal",
              }}
            >
              <p
                style={{
                  fontFamily: FONT,
                  fontWeight: 400,
                  fontSize: "clamp(14px, 1.85vh, 20px)",
                  lineHeight: 1.4,
                  color: "#ffffff",
                  margin: 0,
                  whiteSpace: "pre-line",
                }}
              >
                {"DMCC Business Centre, Level 12, Uptown Tower,\nDubai, United Arab Emirates\ninfo@a11.studio"}
              </p>
            </address>

            {/* Social links — Figma y=1020, bottom=60px */}
            <div
              style={{
                position: "absolute",
                bottom: "clamp(20px, 5.56vh, 60px)",
                left: 0,
                display: "flex",
                gap: 24,
              }}
            >
              {[
                { label: "Linkedin", href: "#" },
                { label: "Twitter/X", href: "#" },
                { label: "Medium", href: "#" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  style={{
                    fontFamily: FONT,
                    fontWeight: 400,
                    fontSize: 14,
                    lineHeight: 1,
                    color: "rgba(255,255,255,0.66)",
                    textDecoration: "none",
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* ── Right column ──────────────────────────────────────────────── */}
          <div
            style={{
              flex: "620 620 0",
              position: "relative",
              minWidth: 0,
              height: "100%",
            }}
          >
            {/* Subtitle — Figma y=294, nav=80 → top=214px */}
            <p
              style={{
                position: "absolute",
                top: "clamp(100px, 19.81vh, 214px)",
                left: 0,
                right: 0,
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: "clamp(14px, 1.85vh, 20px)",
                lineHeight: 1.4,
                color: "#ffffff",
                margin: 0,
              }}
            >
              Got an idea we can help with? Want to join our team?{" "}
              Here&apos;s how you can reach us.
            </p>

            {/* Form — Figma row-1 y=386, nav=80 → top=306px */}
            <form
              style={{
                position: "absolute",
                top: "clamp(170px, 28.33vh, 306px)",
                left: 0,
                right: 0,
              }}
              className="contact-form"
            >
              {/* Row 1 — First name + Last name */}
              <div
                style={{
                  display: "flex",
                  gap: "clamp(20px, 2.77vw, 40px)",
                  marginBottom: "clamp(28px, 4.81vh, 52px)",
                }}
              >
                <FormField
                  label="First name*"
                  placeholder="Enter your name"
                  style={{ flex: "274 274 0" }}
                />
                <FormField
                  label="Last name*"
                  placeholder="Enter your last name"
                  style={{ flex: "266 266 0" }}
                />
              </div>

              {/* Row 2 — Email + How did you hear */}
              <div
                style={{
                  display: "flex",
                  gap: "clamp(20px, 2.77vw, 40px)",
                  marginBottom: "clamp(28px, 4.81vh, 52px)",
                }}
              >
                <FormField
                  label="Email*"
                  placeholder="Enter your email"
                  type="email"
                  style={{ flex: "274 274 0" }}
                />
                <FormField
                  label="How did you hear of us?*"
                  placeholder="Enter the answer"
                  style={{ flex: "266 266 0" }}
                />
              </div>

              {/* Message */}
              <FormField
                label="Message*"
                placeholder="Type your message"
                multiline
                style={{ marginBottom: "clamp(28px, 4.81vh, 52px)" }}
              />

              {/* Submit */}
              <SendButton />
            </form>
          </div>
        </main>
      </PageEnter>
    </div>
    </>
  );
}
