import { Link } from "react-router-dom";
import type { BlogSummary } from "@/content/types";
import styles from "./PostNav.module.css";

/** Newer / older, as two ruled cells — each one link, label over title. */
export default function PostNav({ newer, older }: { newer?: BlogSummary; older?: BlogSummary }) {
  if (!newer && !older) return null;
  return (
    <nav className={styles.nav} aria-label="More writing">
      {newer && (
        <Link className={`${styles.link} ${styles.newer}`} to={`/blog/${newer.slug}`}>
          <span className={styles.label}>← Newer note</span>
          <span className={styles.title}>{newer.meta.title}</span>
        </Link>
      )}
      {older && (
        <Link className={`${styles.link} ${styles.older}`} to={`/blog/${older.slug}`}>
          <span className={styles.label}>Older note →</span>
          <span className={styles.title}>{older.meta.title}</span>
        </Link>
      )}
    </nav>
  );
}
