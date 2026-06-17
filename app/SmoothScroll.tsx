"use client";

import { ReactLenis } from "lenis/react";

// ─── Smooth scroll ──────────────────────────────────────────────────────────
// Page-scoped Lenis instance. This is the foundation of the pellmell.fr feel —
// inertia-based scrolling that ties every scroll-linked animation together.
// Lower `lerp` = heavier/slower glide. `wheelMultiplier` tempers trackpads.
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        wheelMultiplier: 0.9,
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
