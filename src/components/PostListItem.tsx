import { Link } from "react-router-dom";
import { formatDate } from "@/lib/date";
import styles from "./PostListItem.module.css";

interface PostListItemProps {
  to: string;
  title: string;
  date: string;
  description?: string;
  external?: boolean;
}

/** One ruled row in a list of entries: date and title in a single link. */
export default function PostListItem({ to, title, date, description, external = false }: PostListItemProps) {
  const content = (
    <>
      <time className={styles.date} dateTime={date}>
        {formatDate(date)}
      </time>
      <span className={styles.body}>
        <span className={styles.title}>{title}</span>
        {description && <span className={styles.description}>{description}</span>}
      </span>
    </>
  );
  return external ? (
    <a className={styles.item} href={to} target="_blank" rel="noreferrer">{content}</a>
  ) : (
    <Link className={styles.item} to={to}>{content}</Link>
  );
}
