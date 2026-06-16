"use client";

import Link from "next/link";

const SHARED_STYLE: React.CSSProperties = {
  position:       "relative",
  display:        "inline-flex",
  alignItems:     "center",
  justifyContent: "center",
  whiteSpace:     "nowrap",
  textTransform:  "capitalize",
  height:         "44px",
  padding:        "10px 20px",
  borderRadius:   0,
  background:     "#282328",
  border:         "none",
  fontFamily:     "var(--font-system), sans-serif",
  fontWeight:     500,
  fontSize:       "15px",
  lineHeight:     0.95,
  letterSpacing:  "-0.3px",
  color:          "#ffffff",
  textDecoration: "none",
  cursor:         "pointer",
  transition:
    "scale 0.15s cubic-bezier(0.2, 0, 0, 1), opacity 0.15s cubic-bezier(0.2, 0, 0, 1)",
};

const handlers = {
  onMouseEnter: (e: React.MouseEvent<HTMLElement>) =>
    (e.currentTarget.style.opacity = "0.9"),
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.opacity = "1";
    e.currentTarget.style.scale = "1";
  },
  onMouseDown: (e: React.MouseEvent<HTMLElement>) =>
    (e.currentTarget.style.scale = "0.96"),
  onMouseUp: (e: React.MouseEvent<HTMLElement>) =>
    (e.currentTarget.style.scale = "1"),
};

const Dot = () => (
  <span
    aria-hidden
    style={{
      position:        "absolute",
      top:             "10px",
      right:           "10px",
      width:           "4px",
      height:          "4px",
      borderRadius:    "1px",
      background:      "#ffffff",
      pointerEvents:   "none",
    }}
  />
);

export default function CtaButton({
  label,
  href,
  onClick,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
}) {
  if (href) {
    return (
      <Link href={href} style={SHARED_STYLE} {...handlers}>
        {label}
        <Dot />
      </Link>
    );
  }

  return (
    <button type="button" style={SHARED_STYLE} onClick={onClick} {...handlers}>
      {label}
      <Dot />
    </button>
  );
}
