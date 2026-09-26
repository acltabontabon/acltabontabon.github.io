import { useId } from "react";

/**
 * The Muni mark: a lowercase "m" drawn as two rounded arches. The second
 * arch doesn't come all the way back down — it ends, and a small dot sits
 * ahead of it on the baseline: the path forward. A faint reflection of the
 * arches hangs below the baseline at about 20% and fades out.
 *
 * The strokes take the text colour, and only the dot takes the page accent
 * (`--muni-accent`, set by the page — it falls back to currentColor), so the
 * mark still reads in monochrome.
 */
export default function MuniMark({
  className,
  size = 40,
  title,
}: {
  className?: string;
  /** Height in px; the width follows the 60:68 viewBox. */
  size?: number;
  /** Give it a name to make it an image; leave it out and it's decorative. */
  title?: string;
}) {
  // useId can contain ":" which some engines reject inside url(#…)
  const fade = `muni-fade-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const arches = (
    <>
      <path d="M8 36V20a8 8 0 0 1 16 0v16" />
      <path d="M24 20a8 8 0 0 1 16 0v10" />
    </>
  );

  return (
    <svg
      className={className}
      viewBox="0 0 60 68"
      width={(size * 60) / 68}
      height={size}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={fade} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id={`${fade}-m`} maskContentUnits="objectBoundingBox">
          <rect width="1" height="1" fill={`url(#${fade})`} />
        </mask>
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        {arches}
        {/* the reflection: mirrored across the baseline (y = 36), a hair below it */}
        <g opacity="0.2" transform="translate(0 74) scale(1 -1)" mask={`url(#${fade}-m)`}>
          {arches}
        </g>
      </g>
      <circle cx="51" cy="36" r="3.5" style={{ fill: "var(--muni-accent, currentColor)" }} />
    </svg>
  );
}
