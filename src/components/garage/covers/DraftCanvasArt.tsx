import { useState, type CSSProperties } from "react";
import styles from "./DraftCanvasArt.module.css";

/* Draft Canvas draws its nodes with a deliberate hand-sketched wobble, so the
   cover borrows the same trick: each rect is a path whose corners are nudged
   by a deterministic pseudo-random walk rather than a clean <rect>.

   No screenshot here on purpose — a diagramming tool's real evidence is a
   diagram, drawn in its own notation. */
function roughRect(x: number, y: number, w: number, h: number, seed: number) {
  let s = seed;
  const j = () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return (s / 2147483648 - 0.5) * 5;
  };
  const p = (px: number, py: number) => `${(px + j()).toFixed(1)} ${(py + j()).toFixed(1)}`;
  return `M${p(x, y)} L${p(x + w, y)} L${p(x + w, y + h)} L${p(x, y + h)} Z`;
}

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  seed: number;
  selected?: boolean;
}

const W = 106;
const H = 46;

const NODES: Node[] = [
  { id: "api", label: "API", x: 6, y: 14, seed: 7 },
  { id: "queue", label: "Queue", x: 170, y: 14, seed: 31, selected: true },
  { id: "worker", label: "Worker", x: 170, y: 88, seed: 53 },
  { id: "db", label: "Store", x: 340, y: 88, seed: 89 },
];

export default function DraftCanvasArt() {
  // Same one-shot-then-clean-handoff pattern as VortexArt: the entrance
  // sequence plays once (gated by .entering), then this flips false so the
  // hover/focus replay below is the only thing that can ever animate these
  // elements afterward — no competing rule, so no flicker on hover-out.
  const [entering, setEntering] = useState(true);

  return (
    <div
      className={`${styles.art} ${entering ? styles.entering : ""}`}
      onAnimationEnd={() => setEntering(false)}
    >
      <svg className={styles.diagram} viewBox="0 0 452 146" fill="none" aria-hidden="true">
        <defs>
          <marker id="dc-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L8 4 L0 8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </marker>
        </defs>

        {/* solid = synchronous, dashed = async — Draft Canvas's own notation */}
        <path className={styles.edgeSync} d="M112 37 L164 37" markerEnd="url(#dc-arrow)" />
        <path className={styles.edgeSync2} d="M276 111 L334 111" markerEnd="url(#dc-arrow)" />
        <path className={styles.edgeAsync} d="M223 60 L223 84" strokeDasharray="5 4" markerEnd="url(#dc-arrow)" />

        {/* a free-text condition chip, which is how DC explains a branch */}
        <g className={styles.chip}>
          <rect x="233" y="62" width="62" height="20" rx="3" />
          <text x="264" y="76">
            [retry]
          </text>
        </g>

        {NODES.map((n, i) => (
          <g key={n.id} className={styles.node} style={{ "--n": i } as CSSProperties}>
            {n.selected && (
              <rect className={styles.selection} x={n.x - 6} y={n.y - 6} width={W + 12} height={H + 12} rx="5" />
            )}
            <path className={styles.nodeBody} d={roughRect(n.x, n.y, W, H, n.seed)} />
            <path className={styles.nodeGhost} d={roughRect(n.x, n.y, W, H, n.seed + 977)} />
            <text className={styles.nodeLabel} x={n.x + W / 2} y={n.y + H / 2 + 5}>
              {n.label}
            </text>
          </g>
        ))}
      </svg>

      {/* the counterpart to Vortex's readout: what the notation means */}
      <ul className={styles.legend}>
        <li className={styles.item}>
          <svg viewBox="0 0 26 6" aria-hidden="true">
            <line x1="1" y1="3" x2="25" y2="3" />
          </svg>
          sync
        </li>
        <li className={styles.item}>
          <svg viewBox="0 0 26 6" aria-hidden="true">
            <line x1="1" y1="3" x2="25" y2="3" strokeDasharray="5 4" />
          </svg>
          async
        </li>
        <li className={styles.item}>
          <span className={styles.cond}>[ ]</span>
          condition
        </li>
      </ul>
    </div>
  );
}
