import type { GarageStatus } from "@/content/types";

/** The Garage's voice for each status — shared by the badge and the homepage rows. */
export const statusLabel: Record<GarageStatus, string> = {
  stable: "shipped",
  alpha: "on the bench",
  wip: "wrenches out",
  archived: "shelved",
};
