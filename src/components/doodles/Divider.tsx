import { SQUIGGLE_PATH, SQUIGGLE_VIEWBOX } from "./paths";

/** Hand-drawn section break, used between page sections outside of prose content. */
export default function Divider() {
  return (
    <svg className="prose-divider" viewBox={SQUIGGLE_VIEWBOX} aria-hidden="true">
      <path d={SQUIGGLE_PATH} />
    </svg>
  );
}
