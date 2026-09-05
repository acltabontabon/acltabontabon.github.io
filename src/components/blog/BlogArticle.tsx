import { Link } from "react-router-dom";
import Prose from "@/components/Prose";
import TagPill from "@/components/TagPill";
import { formatDate } from "@/lib/date";
import type { BlogEntry } from "@/content/types";
import PostNav from "./PostNav";
import { useAmbientMedia } from "./useAmbientMedia";
import styles from "./BlogArticle.module.css";

export interface BlogArticleProps {
  title: string;
  date: string;
  readingTime: string;
  description: string;
  tags: string[];
  html: string;
  newer?: BlogEntry;
  older?: BlogEntry;
}

export default function BlogArticle({
  title,
  date,
  readingTime,
  description,
  tags,
  html,
  newer,
  older,
}: BlogArticleProps) {
  useAmbientMedia(html.includes('data-media="ambient"'));

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.meta}>
          <time dateTime={date}>{formatDate(date)}</time>
          <span className={styles.slash} aria-hidden="true">
            /
          </span>
          <span>{readingTime}</span>
        </p>
        {description && <p className={styles.standfirst}>{description}</p>}
        {tags.length > 0 && (
          <ul className={styles.tags}>
            {tags.map((tag) => (
              <li key={tag}>
                <TagPill tag={tag} variant="quiet" />
              </li>
            ))}
          </ul>
        )}
      </header>

      {/* the header/body transition: one hairline with an accent tick at its
          left end — the horizontal echo of the Garage covers' accent edge */}
      <div className={styles.rule} aria-hidden="true" />

      {html ? <Prose html={html} /> : null}

      <footer className={styles.footer}>
        <PostNav newer={newer} older={older} />
        <Link className={styles.backLink} to="/blog">
          All posts
        </Link>
      </footer>
    </article>
  );
}
