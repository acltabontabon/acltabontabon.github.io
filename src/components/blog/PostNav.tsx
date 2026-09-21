import { Link } from "react-router-dom";
import type { BlogEntry } from "@/content/types";
import styles from "./PostNav.module.css";

/** Newer / older, as two ruled cells — each one link, label over title. */
export default function PostNav({ newer, older }: { newer?: BlogEntry; older?: BlogEntry }) {
  if (!newer && !older) return null;
  return (
    <nav className={styles.nav} aria-label="More writing">
      {newer && (
        <Link className={`${styles.link} ${styles.newer}`} to={`/blog/${newer.slug}`}>
          <span className={styles.label}>
            <span className={styles.arrow} aria-hidden="true">
              ←
            </span>{" "}
            Newer
          </span>
          <span className={styles.title}>{newer.meta.title}</span>
        </Link>
      )}
      {older && (
        <Link className={`${styles.link} ${styles.older}`} to={`/blog/${older.slug}`}>
          <span className={styles.label}>
            Older{" "}
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </span>
          <span className={styles.title}>{older.meta.title}</span>
        </Link>
      )}
    </nav>
  );
}
