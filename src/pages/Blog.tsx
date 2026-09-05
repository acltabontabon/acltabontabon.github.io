import HeaderAvatar from "@/components/HeaderAvatar";
import Note from "@/components/blog/Note";
import Seo from "@/components/Seo";
import { blogEntries } from "@/content/loader";
import { formatYear } from "@/lib/date";
import styles from "./Blog.module.css";

const INTRO = "Longer-form writing — stories, reflections, the occasional rant.";

export default function Blog() {
  const total = blogEntries.length;
  const years = blogEntries.map((entry) => formatYear(entry.meta.date)).sort();
  const span = years.length > 0 ? [years[0], years[years.length - 1]] : [];

  return (
    <>
      <Seo title="Blog" path="/blog" description={INTRO} />
      <HeaderAvatar compact nameAs="p" />
      <section className={styles.section}>
        <header className={styles.intro}>
          <h1 className={styles.eyebrow}>Writing</h1>

          {/* One sentence, wrapping wherever the column runs out. */}
          <p className={styles.statement}>Longer thoughts, written when a note isn&apos;t enough room.</p>

          <p className={styles.aside}>things I probably should&apos;ve kept to myself.</p>

          {total > 0 && (
            <p className={styles.catalogue}>
              <span>
                {String(total).padStart(2, "0")} {total === 1 ? "note" : "notes"}
              </span>
              <span className={styles.rule} aria-hidden="true" />
              <span>{span[0] === span[1] ? span[0] : `${span[0]} — ${span[1]}`}</span>
            </p>
          )}
        </header>

        {total === 0 ? (
          <p className={styles.empty}>Nothing here yet. Check back later.</p>
        ) : (
          <ol className={styles.list}>
            {blogEntries.map((entry) => (
              <Note
                key={entry.slug}
                slug={entry.slug}
                title={entry.meta.title}
                date={entry.meta.date}
                description={entry.meta.description}
                readingTime={entry.readingTime}
              />
            ))}
          </ol>
        )}
      </section>
    </>
  );
}
