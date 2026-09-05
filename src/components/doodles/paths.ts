// Shared path data so the inline-SVG doodles look the same whether they're
// rendered as a real React component or stamped into pre-built markdown HTML
// (see scripts/markdown.mjs, which keeps its own copy for the build-time
// rehype plugin — see the comment there for why it's not imported directly).
export const SQUIGGLE_PATH =
  "M2 10 C 14 2, 26 18, 38 10 S 62 2, 74 10 S 98 18, 110 10 S 134 2, 146 10 S 170 18, 182 10 S 206 2, 218 10";

export const SQUIGGLE_VIEWBOX = "0 0 220 20";
