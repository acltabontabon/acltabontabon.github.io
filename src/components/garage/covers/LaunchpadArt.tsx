import { type CSSProperties, useState } from "react";
import styles from "./LaunchpadArt.module.css";

/* Launchpad's real evidence isn't a UI — it's the contract between what it
   reads and what it leaves behind. Both sides here are the project's own:
   the four scan surfaces it walks, and the exact files it writes for the
   agent that shows up later.

   No screenshot here on purpose — a CLI's product is its output files, not a
   window of terminal chrome. */
const CHECKS = ["structure", "dependencies", "endpoints", "docs"];
const CHECK_Y = [60, 105, 150, 195];

const ARTIFACTS = [
  ".ai/index.md",
  ".ai/stack.md",
  ".ai/engineering-rules.md",
  ".ai/skills.md",
  ".ai/checklists.md",
];
const ARTIFACT_Y = [100, 128, 156, 184, 212];

const OUT_X = 240;

export default function LaunchpadArt() {
  // Same one-shot-then-clean-handoff pattern as the other covers: the
  // entrance plays once (gated by .entering), then this flips false so the
  // hover/focus replay is the only thing that can animate afterward.
  const [entering, setEntering] = useState(true);

  return (
    <div
      className={`${styles.art} ${entering ? styles.entering : ""}`}
      onAnimationEnd={() => setEntering(false)}
    >
      <svg className={styles.diagram} viewBox="0 0 500 250" fill="none" aria-hidden="true">
        <defs>
          <marker id="lp-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L8 4 L0 8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </marker>
        </defs>

        <text className={styles.colHead} x="0" y="16">
          scan
        </text>
        <text className={styles.colHead} x={OUT_X} y="16">
          emits
        </text>

        {CHECKS.map((c, i) => (
          <g key={c} className={styles.check} style={{ "--n": i } as CSSProperties}>
            <rect className={styles.box} x="0" y={CHECK_Y[i] - 11} width="14" height="14" rx="3" />
            <path
              className={styles.tick}
              d={`M3.5 ${CHECK_Y[i] - 4} L6.5 ${CHECK_Y[i] - 1} L11.5 ${CHECK_Y[i] - 8}`}
            />
            <text className={styles.checkLabel} x="24" y={CHECK_Y[i]}>
              {c}
            </text>
          </g>
        ))}

        <path className={styles.edge} d="M172 130 L214 130" markerEnd="url(#lp-arrow)" />

        <text className={styles.file} x={OUT_X} y="60">
          AGENTS.md
        </text>

        {ARTIFACTS.map((a, i) => (
          <text
            key={a}
            className={styles.artifact}
            style={{ "--n": i } as CSSProperties}
            x={OUT_X}
            y={ARTIFACT_Y[i]}
          >
            {a}
          </text>
        ))}
      </svg>
    </div>
  );
}
