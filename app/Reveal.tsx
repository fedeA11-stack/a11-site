"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

// ─── Shared reveal choreography ────────────────────────────────────────────────
// Every home-page entrance is built from three layers, all sharing one ease-out
// curve so the page reads as a single decelerating gesture:
//
//   1. surface — the card / banner box: fades + rises while a single-axis top
//                mask wipes open. Animates only opacity / transform / clip-path,
//                so it stays on the compositor (no width/height/margin).
//   2. image   — a slow parallax "settle" (1.06 → 1) on a pure-transform layer,
//                lingering a beat longer than the surface. The hallmark of a
//                high-end reveal; driven per-component so it isn't staggered.
//   3. items   — text / logo, held back then cascaded in as the surface settles.
//
// ease-out (expo): big initial velocity then a long settle — the element jumps
// toward its place and eases in. The correct family for anything ENTERING view.
export const EASE = [0.16, 1, 0.3, 1] as const;

// Image parallax settle — shared by the work cards + the footer banner.
export const IMAGE_SETTLE = { from: 1.06, duration: 1.1 } as const;

// Surface: opacity + rise + a top-edge mask (single value interpolates → smallest
// repaint region), keeping the element's own corner radius. delayChildren overlaps
// the text cascade with the tail of the surface settle (continuous, not
// sequential); staggerChildren spaces the items out.
export const makeSurfaceVariants = (radius = 4.444): Variants => ({
  hidden: { opacity: 0, y: 48, clipPath: `inset(8% 0% 0% 0% round ${radius}px)` },
  show: {
    opacity: 1,
    y: 0,
    clipPath: `inset(0% 0% 0% 0% round ${radius}px)`,
    transition: { duration: 0.9, ease: EASE, delayChildren: 0.22, staggerChildren: 0.07 },
  },
});

// Default radius matches the work cards (rounded-[4.444px]).
export const surfaceVariants = makeSurfaceVariants();

// Each text / logo element: a short, quiet fade + small rise, played in sequence.
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

// Reveal: the variants parent. Triggers on scroll-in and cascades its direct
// children. Children opt in via `surfaceVariants` / `itemVariants`. delay offsets
// the whole group so adjacent reveals feel related; amount 0.2 fires it a touch
// early so it animates as the element enters rather than after.
export function Reveal({
  children,
  delay = 0,
  amount = 0.2,
  className = "w-full",
}: {
  children: React.ReactNode;
  delay?: number;
  amount?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  // Reduced motion: no variants parent means children stay at their base
  // (visible) style — everything renders in place, no entrance.
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      transition={{ delayChildren: delay, staggerChildren: 0.07 }}
    >
      {children}
    </motion.div>
  );
}

// ImageReveal: pure-transform parallax settle for a cover image. Self-contained
// (its own whileInView) so it runs alongside the surface without being pulled
// into the text stagger. The caller's box owns overflow:hidden + radius, which
// clips the over-scaled image. Honours reduced motion by rendering static.
export function ImageReveal({
  children,
  amount = 0.2,
}: {
  children: React.ReactNode;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ scale: IMAGE_SETTLE.from }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration: IMAGE_SETTLE.duration, ease: EASE }}
      style={{ position: "absolute", inset: 0, willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}
