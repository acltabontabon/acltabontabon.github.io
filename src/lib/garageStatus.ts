import type { GarageStatus } from "@/content/types";

/**
 * Plain labels for a project's availability — shared by the homepage caption,
 * the Garage and project write-ups. Each one should be backed by the
 * project's own release notes or documentation, not guessed from a version
 * number; an entry with no established status simply omits `status`.
 */
export const statusLabel: Record<GarageStatus, string> = {
  stable: "Released",
  beta: "Beta",
  alpha: "Alpha",
  wip: "In development",
  paused: "Paused",
  archived: "Archived",
};
