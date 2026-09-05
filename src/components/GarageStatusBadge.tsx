import type { GarageStatus } from "@/content/types";
import styles from "./GarageStatusBadge.module.css";

const label: Record<GarageStatus, string> = {
  stable: "shipped",
  alpha: "on the bench",
  wip: "wrenches out",
  archived: "shelved",
};

interface GarageStatusBadgeProps {
  status: GarageStatus;
  /** Overrides the generic label — used when a project has its own stamp phrase. */
  label?: string;
}

const active: Record<GarageStatus, boolean> = {
  stable: false,
  alpha: true,
  wip: true,
  archived: false,
};

export default function GarageStatusBadge({ status, label: override }: GarageStatusBadgeProps) {
  return (
    <span className={`${styles.stamp} ${styles[status]}`}>
      {active[status] && <span className={styles.led} aria-hidden="true" />}
      {override ?? label[status]}
    </span>
  );
}
