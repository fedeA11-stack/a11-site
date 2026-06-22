"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import logo1 from "../public/assets/preload-logo-1.png";
import logo2 from "../public/assets/preload-logo-2.png";
import logo3 from "../public/assets/preload-logo-3.png";
import logo4 from "../public/assets/preload-logo-4.png";
import logo5 from "../public/assets/preload-logo-5.png";

// ─── Preloader ──────────────────────────────────────────────────────────────
// Figma node 1788:27115 ("Preloder"): a white screen with the centered A11 mark
// (70×77). Five frames each give the mark a different fill — solid, charcoal,
// gradient, sandstone, metallic — exported with their actual fills as PNGs.
//
// The mark hard-cuts between fills (instant swap, no crossfade), resolves on the
// solid brand mark, then the whole overlay blurs + fades out to reveal the page.

const LOGOS: StaticImageData[] = [logo1, logo2, logo3, logo4, logo5];

// Cycle through the textured fills, resolve on the solid mark (index 0).
const SEQUENCE = [1, 2, 3, 4, 0];
const STEP_MS = 160; // hold per fill — the swap between them is instant
const HOLD_MS = 380; // pause on the final mark before the blur exit

// Hard ceiling on how long the overlay may stay up. If the step timers are
// starved (slow device, backgrounded/throttled tab), this guarantees the
// overlay dismisses instead of sitting at z-9999 over the page and trapping
// every click. Comfortably past the normal ~1s sequence.
const MAX_VISIBLE_MS = 2500;

export default function Preloader() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  // Advance through the sequence, then settle and trigger the exit.
  // Reduced motion: skip the flicker entirely, just hold the solid mark briefly.
  useEffect(() => {
    if (!reduceMotion && step < SEQUENCE.length - 1) {
      const t = setTimeout(() => setStep((s) => s + 1), STEP_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDone(true), HOLD_MS);
    return () => clearTimeout(t);
  }, [step, reduceMotion]);

  // Safety net: dismiss no matter what once the hard ceiling passes, so a
  // stalled sequence can never leave the overlay trapping clicks.
  useEffect(() => {
    const t = setTimeout(() => setDone(true), MAX_VISIBLE_MS);
    return () => clearTimeout(t);
  }, []);

  // Lock scroll while the overlay is up.
  useEffect(() => {
    if (done) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [done]);

  // Reduced motion shows only the resolved solid mark (index 0).
  const current = reduceMotion ? 0 : SEQUENCE[step];

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          aria-hidden
          initial={{ opacity: 1, filter: "blur(0px)" }}
          // Reduced motion: plain, quick opacity fade — no blur.
          // pointerEvents:none is applied the instant exit begins (it's not
          // animatable, so it snaps) — even if the exit animation stalls, the
          // overlay stops intercepting clicks immediately.
          exit={
            reduceMotion
              ? { opacity: 0, pointerEvents: "none" }
              : { opacity: 0, filter: "blur(20px)", pointerEvents: "none" }
          }
          transition={{
            duration: reduceMotion ? 0.3 : 0.7,
            ease: [0.2, 0, 0, 1],
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            willChange: "opacity, filter",
          }}
        >
          {/* Mark — Figma aspect ratio 70:77 */}
          <div style={{ position: "relative", width: 80, height: 88 }}>
            {LOGOS.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt=""
                fill
                priority
                sizes="80px"
                style={{
                  objectFit: "contain",
                  opacity: i === current ? 1 : 0,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
