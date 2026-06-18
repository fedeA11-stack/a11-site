"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/**
 * Splits text into words and reveals each one by sliding it up from an
 * overflow-hidden mask — the same technique used by lessestudio.com.
 *
 * Multi-line text (with \n) keeps each line on its own block.
 * Word spacing is handled via marginRight on each word span.
 */
interface WordRevealProps {
  children: string;
  style?: React.CSSProperties;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /** Initial delay before first word starts (ms) */
  delay?: number;
  /** Stagger between consecutive words (ms) */
  stagger?: number;
  /** Animation duration per word (ms) */
  duration?: number;
}

export default function WordReveal({
  children,
  style,
  className,
  as: Tag = "p",
  delay = 0,
  stagger = 45,
  duration = 750,
}: WordRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<HTMLElement>, { once: true, margin: "0px 0px -40px 0px" });

  const lines = children.split("\n");
  let wordIndex = 0;

  return (
    <Tag ref={ref as never} style={style} className={className}>
      {lines.map((line, li) => {
        const words = line.split(" ").filter(Boolean);
        return (
          <span key={li} style={{ display: "block" }}>
            {words.map((word, wi) => {
              const idx = wordIndex++;
              const isLast = wi === words.length - 1;
              return (
                <span
                  key={wi}
                  style={{
                    display: "inline-block",
                    overflow: "hidden",
                    verticalAlign: "bottom",
                    marginRight: isLast ? 0 : "0.25em",
                  }}
                >
                  <motion.span
                    style={{ display: "inline-block" }}
                    initial={{ y: "110%" }}
                    animate={inView ? { y: 0 } : undefined}
                    transition={{
                      duration: duration / 1000,
                      ease: [0.22, 0.61, 0.36, 1],
                      delay: delay / 1000 + idx * (stagger / 1000),
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}
