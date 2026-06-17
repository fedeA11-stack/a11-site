"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";

// ─── Reset scroll on route change ─────────────────────────────────────────────
// With Lenis driving the scroll, Next's default "scroll to top on navigation"
// doesn't reach Lenis' internal position — so a case-study page could open
// mid-way down. Snap Lenis (and the window) back to the top on every route change.
function ScrollToTop() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  return null;
}

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
      <ScrollToTop />
      {children}
    </ReactLenis>
  );
}
