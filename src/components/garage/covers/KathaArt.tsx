import { type CSSProperties, useState } from "react";
import styles from "./KathaArt.module.css";

/* Katha's premise, in its own words: the work already has a story, it's just
   hidden in the activity. So the artwork is the claim itself — prose lines
   that start as scattered fragments and close into continuous text, with the
   chapter set the way the app sets it: a numbered chapter, a date range, a
   drop cap, and the structure every Katha is built from.

   The title is a real generated one from the project's own docs, not filler —
   it carries the wry dev-journal voice the prompts are tuned for.

   No screenshot here on purpose — a tool that writes a narrative should be
   shown as the page it writes. */
const TITLE = "The Setup Wizard Started to Scream";

/* x1/x2 per line; the first two clear the drop cap, the last runs short the
   way a closing paragraph line does. */
const LINES = [
  { y: 90, x1: 26, x2: 516 },
  { y: 110, x1: 26, x2: 498 },
  { y: 130, x1: 0, x2: 522 },
  { y: 150, x1: 0, x2: 506 },
  { y: 170, x1: 0, x2: 468 },
  { y: 190, x1: 0, x2: 286 },
];

const STRUCTURE = "summary · key moments · challenges · learnings · next chapter";

export default function KathaArt() {
  // Same one-shot-then-clean-handoff pattern as the other covers: the
  // entrance plays once (gated by .entering), then this flips false so the
  // hover/focus replay is the only thing that can animate afterward.
  const [entering, setEntering] = useState(true);

  return (
    <div
      className={`${styles.art} ${entering ? styles.entering : ""}`}
      onAnimationEnd={() => setEntering(false)}
    >
      <svg className={styles.page} viewBox="0 0 540 240" fill="none" aria-hidden="true">
        <text className={styles.chapterMark} x="0" y="13">
          Chapter I
        </text>
        <text className={styles.dateRange} x="78" y="13">
          Apr 30 — May 7, 2026
        </text>

        <text className={styles.title} x="0" y="50">
          {TITLE}
        </text>

        <text className={styles.cap} x="0" y="120">
          I
        </text>

        {LINES.map((l, i) => (
          <line
            key={l.y}
            className={styles.line}
            style={{ "--n": i } as CSSProperties}
            x1={l.x1}
            y1={l.y}
            x2={l.x2}
            y2={l.y}
          />
        ))}

        <line className={styles.rule} x1="0" y1="210" x2="540" y2="210" />
        <text className={styles.structure} x="0" y="228">
          {STRUCTURE}
        </text>
      </svg>
    </div>
  );
}
