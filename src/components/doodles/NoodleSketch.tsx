import styles from "./NoodleSketch.module.css";

/**
 * Ambient background doodle: loose noodle strands drifting off the edges of
 * the viewport.
 *
 * At a glance it's just soft texture. The joke only lands once you've read the
 * tagline — which is the point; it rewards attention instead of announcing
 * itself. It also puts the closing squiggle in the same family, so the page
 * has one hand-drawn language rather than two.
 *
 * Decorative only.
 */
export default function NoodleSketch() {
  return (
    <div className={styles.sketch} aria-hidden="true">
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" focusable="false">
        <g className={styles.strands}>
          {/* Long, well-separated strands. Round caps mean the ones that stop
              mid-air read as cut noodle ends rather than as broken lines. */}
          <path d="M-80 118 C 96 78, 172 198, 98 272 S 176 398, 342 352" />
          <path d="M-84 336 C 110 286, 206 424, 108 508 S 206 630, 368 586" />
          <path d="M-70 664 C 104 626, 168 726, 322 706" />
          {/* one lazy strand drifting across the top, behind everything */}
          <path d="M-40 52 C 296 8, 518 102, 832 38 S 1148 -4, 1272 62" />
          {/* right: a looser tangle, deliberately not mirroring the left */}
          <path d="M1284 208 C 1098 172, 1026 306, 1162 372 S 1074 528, 908 476" />
          <path d="M1282 512 C 1146 552, 1116 648, 1240 700" />
          <path d="M1286 92 C 1148 128, 1108 208, 1188 278" />
          {/* and one slipping off the bottom edge */}
          <path d="M-40 754 C 254 712, 434 792, 704 742 S 1044 782, 1272 716" />
        </g>
      </svg>
    </div>
  );
}
