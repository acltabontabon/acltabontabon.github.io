import { Link } from "react-router-dom";
import { formatDate } from "@/lib/date";
import styles from "./PostListItem.module.css";

interface PostListItemProps {
  to: string;
  title: string;
  date: string;
  description?: string;
}

/** One ruled row in a list of entries: date, title, arrow — a single link. */
export default function PostListItem({ to, title, date, description }: PostListItemProps) {
  return (
    <Link className={styles.item} to={to}>
      <time className={styles.date} dateTime={date}>
        {formatDate(date)}
      </time>
      <span className={styles.body}>
        <span className={styles.title}>{title}</span>
        {description && <span className={styles.description}>{description}</span>}
      </span>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </Link>
  );
}
