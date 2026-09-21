import { Link } from "react-router-dom";
import PageHead from "@/components/PageHead";
import Seo from "@/components/Seo";
import { blogEntries } from "@/content/loader";
import { formatDate, formatDayMonth, formatYear } from "@/lib/date";
import styles from "./Blog.module.css";

const INTRO = "Longer-form writing — stories, reflections, the occasional rant.";

export default function Blog() {
  const total = blogEntries.length;
  const years = blogEntries.map((entry) => formatYear(entry.meta.date)).sort();
  const span =
    years.length > 0
      ? years[0] === years[years.length - 1]
        ? years[0]
        : `${years[0]} – ${years[years.length - 1]}`
      : "";

  return (
    <>
      <Seo title="Blog" path="/blog" description={INTRO} />
      <div className={styles.page}>
        <PageHead
          title="Writing"
          lead="Notes on software, building things, and the people involved."
          meta={
            total > 0 && (
              <>
                {String(total).padStart(2, "0")} {total === 1 ? "note" : "notes"} · {span}
              </>
            )
          }
        />

        {total === 0 ? (
          <p className={styles.empty}>Nothing here yet. Check back later.</p>
        ) : (
          <ol className={styles.list}>
            {blogEntries.map(({ slug, meta, readingTime }) => (
              <li key={slug}>
                <Link className={styles.row} to={`/blog/${slug}`}>
                  <time className={styles.date} dateTime={meta.date}>
                    <span className="visually-hidden">{formatDate(meta.date)}</span>
                    <span aria-hidden="true">
                      <span className={styles.year}>{formatYear(meta.date)}</span> {formatDayMonth(meta.date)}
                    </span>
                  </time>
                  <span className={styles.text}>
                    <span className={styles.title}>{meta.title}</span>
                    <span className={styles.description}>{meta.description}</span>
                  </span>
                  <span className={styles.time}>{readingTime}</span>
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
