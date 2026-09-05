import { SQUIGGLE_PATH, SQUIGGLE_VIEWBOX } from "./paths";

/**
 * The homepage's closing mark — the same hand-drawn shape as the prose
 * divider, but larger and self-drawing. It deliberately does NOT reuse the
 * global `.prose-divider` class: markdown output (see scripts/markdown.mjs)
 * stamps that class into every post, and stroke-dash properties have no
 * business there.
 */
export default function ClosingSquiggle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={SQUIGGLE_VIEWBOX} aria-hidden="true" focusable="false">
      <path d={SQUIGGLE_PATH} />
    </svg>
  );
}
