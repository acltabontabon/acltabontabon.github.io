import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { blogEntries } from "@/content/loader";
import { formatDate, formatDayMonth, formatYear } from "@/lib/date";
import styles from "./Blog.module.css";

const INTRO = "Longer-form writing — stories, reflections, the occasional rant.";

export default function Blog() {
  const total = blogEntries.length;
  const years = blogEntries.map((entry) => formatYear(entry.meta.date)).sort();
  const span = years.length > 0
    ? years[0] === years[years.length - 1] ? years[0] : `${years[0]} – ${years[years.length - 1]}`
    : "";

  return (
    <>
      <Seo title="Blog" path="/blog" description={INTRO} />
      <div className={styles.page}>
        <header className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>A few things I've been thinking</p>
            <h1>Writing</h1>
          </div>
          <p className={styles.intro}>
            Notes on software, building things, and the people involved.
            <em>Thinking out loud, on paper.</em>
          </p>
        </header>
        <section aria-labelledby="writing-notebook">
          <div className={styles.notebookHeading}>
            <h2 id="writing-notebook">Pages from the notebook</h2>
            {total > 0 && (
              <p>{String(total).padStart(2, "0")} {total === 1 ? "note" : "notes"} · {span}</p>
            )}
          </div>
          {total === 0 ? (
            <p className={styles.empty}>Nothing here yet. Check back later.</p>
          ) : (
            <div className={styles.notebook}>
              <aside className={styles.marginNote} aria-label="In the margins">
                <p className={styles.handwritten}>An idea,<br />then another.</p>
                <span className={styles.scribble} aria-hidden="true" />
                <p className={styles.topics}>Software<br />People<br />Everything between</p>
              </aside>
              <ol className={styles.list}>
                {blogEntries.map(({ slug, meta, readingTime }, index) => (
                  <li key={slug}>
                    <article>
                      <Link className={styles.row} to={`/blog/${slug}`}>
                        <span className={styles.number} aria-hidden="true">{String(total - index).padStart(2, "0")}</span>
                        <span className={styles.meta}>
                          <time dateTime={meta.date}>
                            <span className="visually-hidden">{formatDate(meta.date)}</span>
                            <span aria-hidden="true">{formatDayMonth(meta.date)} {formatYear(meta.date)}</span>
                          </time>
                          <span>{readingTime}</span>
                        </span>
                        <h3 className={styles.title}>{meta.title}</h3>
                        <p className={styles.description}>{meta.description}</p>
                      </Link>
                    </article>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
