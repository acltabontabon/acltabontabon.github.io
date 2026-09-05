import { Link } from "react-router-dom";
import type { GarageEntry, GarageStatus } from "@/content/types";
import { accentVars } from "@/lib/accent";
import Reveal from "@/components/Reveal";
import { actionsFor } from "./actions";
import { artFor } from "./covers";
import styles from "./ProjectCover.module.css";

const statusLabel: Record<GarageStatus, string> = {
  alpha: "alpha",
  wip: "building",
  stable: "shipped",
  archived: "archived",
};

/* A small, deliberate per-project rhythm variation so two covers never read
   as identical instances of the same component — same publication, different
   cover art. "ruled" is the default: a lab-report feel, fully divided by
   hairlines. "open" trades the outer hairline for a single seam inside the
   artwork itself, closer to a loose sketch sheet. Keyed off the same `art`
   field that already selects bespoke artwork, so a future project inherits a
   sensible default without needing an opinion here. */
const RHYTHM: Record<string, "ruled" | "open"> = {
  "draft-canvas": "open",
};

interface ProjectCoverProps {
  entry: GarageEntry;
  /** Catalogue position across the whole garage, 1-based. */
  release: number;
  /** A cover may claim two grid columns when it deserves the extra room. */
  wide?: boolean;
}

export default function ProjectCover({ entry, release, wide = false }: ProjectCoverProps) {
  const { meta } = entry;
  const Art = artFor(meta.art);
  const rhythm = RHYTHM[meta.art ?? ""] ?? "ruled";

  // The name is the one anchor, stretched over the whole cover; anything else
  // sits above it so both remain clickable and there's a single tab stop for
  // the primary destination.
  const { primary, source } = actionsFor(entry);

  return (
    <Reveal className={`${styles.wrap} ${wide ? styles.wide : ""}`}>
      <article
        className={`cover ${styles.cover}`}
        data-rhythm={rhythm}
        style={accentVars(meta.accent, meta.accentDark)}
      >
        <div className={styles.body}>
          <p className={styles.eyebrow}>
            <span className={styles.release}>{String(release).padStart(2, "0")}</span>
            <span className={styles.slash}>/</span>
            <span className={styles.status}>{statusLabel[meta.status]}</span>
            {meta.version && <span className={styles.version}>v{meta.version}</span>}
          </p>

          <h3 className={styles.name}>
            {primary ? (
              primary.external ? (
                <a className={styles.stretch} href={primary.href} target="_blank" rel="noreferrer">
                  {meta.title}
                </a>
              ) : (
                <Link className={styles.stretch} to={primary.href}>
                  {meta.title}
                </Link>
              )
            ) : (
              meta.title
            )}
          </h3>

          <p className={styles.hook}>{meta.hook ?? meta.description}</p>
          <p className={styles.blurb}>{meta.description}</p>
        </div>

        <div className={styles.art}>
          <Art title={meta.title} screenshot={meta.screenshot} />
        </div>

        <div className={styles.foot}>
          {/* the label is the visual affordance for the stretched title link
              above — not a second tab stop to the same place */}
          {primary && (
            <span className={styles.primaryAction} aria-hidden="true">
              {primary.label}{" "}
              <span className={styles.arrow}>{primary.external ? "↗" : "→"}</span>
            </span>
          )}
          {primary && source && (
            <span className={styles.sep} aria-hidden="true">
              /
            </span>
          )}
          {source && (
            <a
              className={styles.source}
              href={source.href}
              target="_blank"
              rel="noreferrer"
              aria-label={source.label}
            >
              {source.name} <span className={styles.arrow}>↗</span>
            </a>
          )}
        </div>
      </article>
    </Reveal>
  );
}
