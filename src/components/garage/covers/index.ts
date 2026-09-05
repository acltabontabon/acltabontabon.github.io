import type { ComponentType } from "react";
import DraftCanvasArt from "./DraftCanvasArt";
import GenericArt from "./GenericArt";
import KathaArt from "./KathaArt";
import LaunchpadArt from "./LaunchpadArt";
import VortexArt from "./VortexArt";
import type { CoverArtProps } from "./types";

/**
 * A project opts into bespoke cover artwork with `art: <key>` in its
 * frontmatter. Anything without a match falls back to the generic
 * screenshot composition, so adding a project never requires code.
 */
const registry: Record<string, ComponentType<CoverArtProps>> = {
  vortex: VortexArt,
  "draft-canvas": DraftCanvasArt,
  launchpad: LaunchpadArt,
  katha: KathaArt,
};

export function artFor(key: string | undefined): ComponentType<CoverArtProps> {
  return (key && registry[key]) || GenericArt;
}
