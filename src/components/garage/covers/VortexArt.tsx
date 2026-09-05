import { useState, type CSSProperties } from "react";
import styles from "./VortexArt.module.css";

/* Vortex's identity is a readout: a load curve that flattens where capacity
   runs out, measured against an objective, resolving into a verdict. The
   figures are the real ones from the demo-service run in its docs, and
   "offered" is Vortex's own word for load a run asked for but couldn't always
   generate — not a generic axis label.

   No screenshot here on purpose — the numbers are the product. */
const FIGURES = [
  { label: "offered", value: "79.9", unit: "req/s" },
  { label: "p95", value: "53", unit: "ms" },
  { label: "errors", value: "0", unit: "%" },
];

export default function VortexArt() {
  // The draw-in plays once, whenever the cover first reveals (immediately if
  // already in view, on scroll otherwise). Once every step has finished, this
  // flips false and stays false — see the CSS: after that, only the
  // hover/focus rules can ever declare `animation` on these elements, so a
  // replay always starts clean and un-hovering just holds at the
  // already-correct "resolved" look instead of re-animating.
  const [entering, setEntering] = useState(true);

  return (
    <div
      className={`${styles.art} ${entering ? styles.entering : ""}`}
      onAnimationEnd={() => setEntering(false)}
    >
      <svg className={styles.chart} viewBox="0 0 460 112" fill="none" aria-hidden="true">
        <line className={styles.objective} x1="0" y1="30" x2="460" y2="30" strokeDasharray="3 5" />
        <text className={styles.objectiveLabel} x="0" y="21">
          objective
        </text>
        <path
          className={styles.curve}
          d="M2 104 C74 100 132 80 186 58 C238 37 286 31 330 30 C378 29 420 30 458 30"
        />
        <circle className={styles.marker} cx="330" cy="30" r="4" />
        <text className={styles.markerLabel} x="340" y="47">
          capacity
        </text>
      </svg>

      <dl className={styles.figures}>
        {FIGURES.map((f, i) => (
          <div key={f.label} className={styles.figure} style={{ "--i": i } as CSSProperties}>
            <dt>{f.label}</dt>
            <dd>
              {f.value}
              <span className={styles.unit}>{f.unit}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
