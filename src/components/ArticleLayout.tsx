import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/date";
import Prose from "./Prose";
import styles from "./ArticleLayout.module.css";
import textLink from "./TextLink.module.css";

interface ArticleLayoutProps {
  title: string;
  date: string;
  readingTime?: string;
  /** A standfirst under the title. */
  description?: string;
  html: string;
  /** The understated route back to the section this page belongs to. */
  back: { to: string; label: string };
  /** Anything else that belongs in the left rail (a status, project links). */
  rail?: ReactNode;
  /** Closing furniture under the body (next/previous, a closing link). */
  footer?: ReactNode;
}

/**
 * The reading layout shared by articles and garage write-ups. A narrow rail
 * on the left carries the way back and the quiet metadata — the same column
 * the writing index uses for dates — and the body reads in a single column
 * of roughly 65–70 characters beside it. On narrow screens the rail folds
 * into a line above the title.
 */
export default function ArticleLayout({
  title,
  date,
  readingTime,
  description,
  html,
  back,
  rail,
  footer,
}: ArticleLayoutProps) {
  return (
    <article className={styles.article}>
      <header className={`${styles.grid} ${styles.header}`}>
        <Link className={`${styles.back} ${textLink.link}`} to={back.to}>
          Back to {back.label}
        </Link>
        <h1 className={styles.title}>{title}</h1>

        <div className={styles.rail}>
          <p className={styles.meta}>
            <time dateTime={date}>{formatDate(date)}</time>
            {readingTime && <span>{readingTime}</span>}
          </p>
          {rail}
        </div>
        {description && <p className={styles.standfirst}>{description}</p>}
      </header>

      {html ? (
        <div className={styles.grid}>
          <div className={styles.content}>
            <Prose html={html} />
          </div>
        </div>
      ) : null}

      {footer && (
        <footer className={styles.grid}>
          <div className={styles.body}>{footer}</div>
        </footer>
      )}
    </article>
  );
}
