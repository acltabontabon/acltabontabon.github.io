import { Link } from "react-router-dom";
import Squiggle from "@/components/doodles/Squiggle";
import { formatDate, formatDayMonth } from "@/lib/date";
import styles from "./Note.module.css";

export interface NoteProps {
  slug: string;
  title: string;
  date: string;
  description: string;
  readingTime: string;
}

/**
 * One entry in the writing index: title, excerpt, and a quiet line of
 * metadata. Tags aren't shown here — six repeated tag lists were louder than
 * the titles they sat under — but the data is untouched and still appears on
 * the article itself and on /tags.
 */
export default function Note({ slug, title, date, description, readingTime }: NoteProps) {
  return (
    <li className={styles.note}>
      <Link className={styles.link} to={`/blog/${slug}`}>
        <span className={styles.title}>
          {title}
          <Squiggle className={styles.underline} />
        </span>

        <span className={styles.excerpt}>{description}</span>

        <span className={styles.meta}>
          <time dateTime={date}>
            <span className="visually-hidden">{formatDate(date)}</span>
            <span aria-hidden="true">{formatDayMonth(date)}</span>
          </time>
          <span aria-hidden="true">·</span>
          <span>{readingTime.replace(" read", "")}</span>
        </span>
      </Link>
    </li>
  );
}
