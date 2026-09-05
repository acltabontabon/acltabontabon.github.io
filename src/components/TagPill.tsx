import { Link } from "react-router-dom";
import styles from "./TagPill.module.css";

/**
 * `quiet` drops the pill chrome for a mono `#tag` — used where a row of tags
 * would otherwise put more purple on the page than the tags are worth.
 */
export default function TagPill({ tag, variant = "pill" }: { tag: string; variant?: "pill" | "quiet" }) {
  return (
    <Link
      className={variant === "quiet" ? styles.quiet : styles.pill}
      to={`/tags/${encodeURIComponent(tag)}`}
    >
      {variant === "quiet" ? `#${tag}` : tag}
    </Link>
  );
}
