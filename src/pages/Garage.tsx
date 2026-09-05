import HeaderAvatar from "@/components/HeaderAvatar";
import ProjectCover from "@/components/garage/ProjectCover";
import ProjectIndex from "@/components/garage/ProjectIndex";
import Seo from "@/components/Seo";
import { garageEntries } from "@/content/loader";
import styles from "./Garage.module.css";

const INTRO = "Things I've built, things I'm building, and a few things I should probably clean up.";

export default function Garage() {
  // Visual weight follows the content: `featured` entries get a full cover,
  // everything else drops to the index. Nothing here is hand-placed, so a new
  // markdown file lands in the right tier on its own.
  const covers = garageEntries.filter((e) => e.meta.featured);
  const rest = garageEntries.filter((e) => !e.meta.featured);

  const years = garageEntries.map((e) => e.meta.date.slice(0, 4)).sort();
  const span = years.length > 0 ? [years[0], years[years.length - 1]] : [];

  return (
    <>
      <Seo title="Garage" path="/garage" description={INTRO} />
      <HeaderAvatar compact />

      <div className={styles.breakout}>
        <section className={styles.intro}>
          <h2 className="visually-hidden">Garage</h2>

          <div className={styles.opening}>
            <p className={styles.statement}>
              <span className={styles.loud}>
                Things I&apos;ve built,
                <br />
                things I&apos;m building,
              </span>
              <span className={styles.aside}>and a few things I should probably clean up.</span>
            </p>

            {/* sits in the second grid column, on the statement's last
                baseline — the page's only bit of editorial voice above the
                catalogue itself */}
            <p className={styles.colophon}>
              mostly software.
              <br />
              occasionally overengineered.
            </p>
          </div>

          <p className={styles.catalogue}>
            <span>
              {String(garageEntries.length).padStart(2, "0")} {garageEntries.length === 1 ? "project" : "projects"}
            </span>
            <span className={styles.rule} aria-hidden="true" />
            {span.length > 0 && <span>{span[0] === span[1] ? span[0] : `${span[0]} – ${span[1]}`}</span>}
          </p>
        </section>

        <div className={styles.covers}>
          {covers.map((entry, i) => (
            <ProjectCover
              key={entry.slug}
              entry={entry}
              release={i + 1}
              /* an odd trailing cover takes the full width rather than
                 leaving a hole in the two-up grid */
              wide={covers.length % 2 === 1 && i === covers.length - 1}
            />
          ))}
        </div>

        <ProjectIndex entries={rest} startAt={covers.length + 1} />
      </div>
    </>
  );
}
