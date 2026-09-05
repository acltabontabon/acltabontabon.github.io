import type { CSSProperties } from "react";

function toRgb(hex: string): string | undefined {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return undefined;
  const n = parseInt(m[1], 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

/**
 * A project may bring its own restrained accent. Both the light and dark
 * values are set as custom properties on the element; the stylesheet picks
 * between them by theme, falling back to the site's
 * purple when a project doesn't declare one.
 */
export function accentVars(light?: string, dark?: string): CSSProperties {
  const vars: Record<string, string> = {};
  const l = light && toRgb(light);
  const d = dark && toRgb(dark);
  if (light && l) {
    vars["--pa-light"] = light;
    vars["--pa-light-rgb"] = l;
  }
  if (dark && d) {
    vars["--pa-dark"] = dark;
    vars["--pa-dark-rgb"] = d;
  }
  return vars as CSSProperties;
}
