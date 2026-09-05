import { Link } from "react-router-dom";
import type { GarageEntry } from "@/content/types";
import Reveal from "@/components/Reveal";
import styles from "./ProjectIndex.module.css";

interface ProjectIndexProps {
  entries: GarageEntry[];
  /** Catalogue number the first row continues from. */
  startAt: number;
}

/** A contents page: everything that doesn't warrant a full cover. */
export default function ProjectIndex({ entries, startAt }: ProjectIndexProps) {
  if (entries.length === 0) return null;

  return (
    <Reveal className={styles.wrap}>
      <h3 className={styles.heading}>Other things</h3>
      <ol className={styles.list}>
        {entries.map((entry, i) => {
          const { meta, slug, html } = entry;
          const href = html.length > 0 ? `/garage/${slug}` : meta.github;
          const external = !!meta.github && html.length === 0;

          const label = (
            <>
              <span className={styles.num}>{String(startAt + i).padStart(2, "0")}</span>
              <span className={styles.text}>
                <span className={styles.title}>{meta.title}</span>
                <span className={styles.hook}>{meta.hook ?? meta.description}</span>
              </span>
              <span className={styles.tech}>{(meta.tech.length ? meta.tech : meta.tags).join(" / ")}</span>
              <span className={styles.arrow} aria-hidden="true">
                {external ? "↗" : "→"}
              </span>
            </>
          );

          return (
            <li key={slug} className={styles.row}>
              {!href ? (
                <span className={styles.inert}>{label}</span>
              ) : external ? (
                <a className={styles.link} href={href} target="_blank" rel="noreferrer">
                  {label}
                </a>
              ) : (
                <Link className={styles.link} to={href}>
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </Reveal>
  );
}
