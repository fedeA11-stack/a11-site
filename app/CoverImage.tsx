import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";

// ── CoverImage ───────────────────────────────────────────────────────────────
// Single image-policy knob for the whole site. Wraps next/image in `fill` mode
// with objectFit:cover — the pattern that ~35 sites hand-rolled before.
//
//   caller's positioned box (aspect-ratio + radius + overflow)
//   └── <Image fill objectFit:cover sizes=... [priority] [clipPath] />
//
// CONTRACT: the PARENT element must be positioned (position: relative/absolute)
// because `fill` makes the image position:absolute inset:0. Callers own the
// aspect-ratio / border-radius / overflow on that parent.
//
// `sizes` is REQUIRED on purpose: without it `fill` defaults to 100vw and
// over-fetches grid cards. Declare the real rendered width, e.g.
// "(max-width: 768px) 50vw, 25vw" for a quarter-width card.
type CoverImageProps = {
  src: StaticImageData | string;
  alt: string;
  /** Rendered width hint for srcset selection. Required — avoids 100vw over-fetch. */
  sizes: string;
  /** Above-the-fold LCP image: skip lazy-load, preload instead. */
  priority?: boolean;
  quality?: number;
  className?: string;
  /** Merged onto the <Image>. objectFit:cover is the default and can be overridden. */
  style?: CSSProperties;
  /** SVG clip, e.g. `url(#cove)` for the /world case cards. */
  clipPath?: string;
};

export default function CoverImage({
  src,
  alt,
  sizes,
  priority,
  quality,
  className,
  style,
  clipPath,
}: CoverImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={quality}
      className={className}
      style={{
        objectFit: "cover",
        ...(clipPath ? { clipPath } : null),
        ...style,
      }}
    />
  );
}
