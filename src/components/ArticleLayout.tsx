import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/date";
import { GitHubIcon } from "./icons";
import TagPill from "./TagPill";
import Prose from "./Prose";
import styles from "./ArticleLayout.module.css";

interface ArticleLayoutProps {
  title: string;
  date: string;
  readingTime?: string;
  tags: string[];
  html: string;
  backTo: string;
  backLabel: string;
  statusBadge?: ReactNode;
  github?: string;
  liveUrl?: string;
}

export default function ArticleLayout({
  title,
  date,
  readingTime,
  tags,
  html,
  backTo,
  backLabel,
  statusBadge,
  github,
  liveUrl,
}: ArticleLayoutProps) {
  return (
    <article className={styles.article}>
      <header className={styles.header}>
        {statusBadge}
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.meta}>
          <time dateTime={date}>{formatDate(date)}</time>
          {readingTime && (
            <>
              <span className={styles.dot}>·</span>
              <span>{readingTime}</span>
            </>
          )}
        </p>
        {tags.length > 0 && (
          <ul className={styles.tags}>
            {tags.map((tag) => (
              <li key={tag}>
                <TagPill tag={tag} />
              </li>
            ))}
          </ul>
        )}
        {(github || liveUrl) && (
          <div className={styles.githubButtons}>
            {github && (
              <a className={styles.button} href={github} target="_blank" rel="noreferrer">
                <GitHubIcon /> Source
              </a>
            )}
            {liveUrl && (
              <a className={styles.button} href={liveUrl} target="_blank" rel="noreferrer">
                ↗ Live
              </a>
            )}
          </div>
        )}
      </header>

      {html ? <Prose html={html} /> : null}

      <Link className={styles.backLink} to={backTo}>
        ← {backLabel}
      </Link>
    </article>
  );
}
