import { useEffect, useRef } from "react";

const MAX = 5; // px the photo may drift inside its frame
const REACH = 420; // px of pointer distance at which the drift maxes out
const EASE = 0.12; // per-frame lerp — lower is lazier, more "quietly watching"
const SETTLED = 0.04; // px; below this the loop parks itself

/**
 * Nudges a photo a few pixels toward the pointer inside a fixed frame, so the
 * eyes look like they're following you. Writes --eye-x/--eye-y straight onto
 * the node: no state, no re-renders. Fine pointers only, honours reduced
 * motion, and the rAF loop stops as soon as the photo settles so an idle
 * homepage burns no frames.
 */
export function useEyeTrack<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || still.matches) return;

    let frame = 0;
    let running = false;
    let tracking = false;
    let px = 0;
    let py = 0;
    let x = 0;
    let y = 0;

    const tick = () => {
      let tx = 0;
      let ty = 0;
      if (tracking) {
        // Layout read happens inside the frame, before the write — no thrash.
        const r = el.getBoundingClientRect();
        const dx = px - (r.left + r.width / 2);
        const dy = py - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        const pull = Math.min(d, REACH) / REACH;
        tx = (dx / d) * pull * MAX;
        ty = (dy / d) * pull * MAX;
      }
      x += (tx - x) * EASE;
      y += (ty - y) * EASE;
      el.style.setProperty("--eye-x", `${x.toFixed(2)}px`);
      el.style.setProperty("--eye-y", `${y.toFixed(2)}px`);

      if (Math.abs(tx - x) > SETTLED || Math.abs(ty - y) > SETTLED) {
        frame = requestAnimationFrame(tick);
      } else {
        running = false;
        frame = 0;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return; // hybrid devices: ignore pen/touch
      px = e.clientX;
      py = e.clientY;
      tracking = true;
      start();
    };
    // Drift back to centre when the pointer leaves the page or the tab blurs.
    const park = () => {
      tracking = false;
      start();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", park);
    window.addEventListener("blur", park);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", park);
      window.removeEventListener("blur", park);
      el.style.removeProperty("--eye-x");
      el.style.removeProperty("--eye-y");
    };
  }, [enabled]);

  return ref;
}
