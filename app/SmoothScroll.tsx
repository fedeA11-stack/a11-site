"use client";

import { ReactLenis } from "lenis/react";

// ─── Smooth scroll ──────────────────────────────────────────────────────────
// Page-scoped Lenis instance. This is the foundation of the pellmell.fr feel —
// inertia-based scrolling that ties every scroll-linked animation together.
//
// Duration + easing (Lenis' recommended exponential ease-out) gives the long,
// buttery glide used by sites like metalab.com — smoother than a flat `lerp`.
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 1,
        smoothWheel: true,
        // Honour the OS "reduce motion" setting — disable inertia for those users.
        prevent: () =>
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      }}
    >
      {children}
    </ReactLenis>
  );
}
