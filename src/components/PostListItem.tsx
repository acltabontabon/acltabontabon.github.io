import { Link } from "react-router-dom";
import { formatDate } from "@/lib/date";
import styles from "./PostListItem.module.css";

interface PostListItemProps {
  to: string;
  title: string;
  date: string;
  description?: string;
}

export default function PostListItem({ to, title, date, description }: PostListItemProps) {
  return (
    <Link className={styles.item} to={to}>
      <time className={styles.date} dateTime={date}>
        {formatDate(date)}
      </time>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </Link>
  );
}
