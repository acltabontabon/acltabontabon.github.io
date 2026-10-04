import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import Seo from "@/components/Seo";
import { actionsFor } from "@/components/garage/actions";
import { garageEntries } from "@/content/loader";
import type { GarageSummary } from "@/content/types";
import { statusLabel } from "@/lib/garageStatus";
import linkStyles from "@/components/TextLink.module.css";
import styles from "./Garage.module.css";

const INTRO = "Side projects, experiments, and tools I wanted to exist.";

function Destination({
  href,
  external,
  label,
  children,
}: {
  href: string;
  external: boolean;
  label: string;
  children: ReactNode;
}) {
  const className = `${styles.action} ${linkStyles.link}`;
  return external ? (
    <a className={className} href={href} target="_blank" rel="noreferrer" aria-label={label}>
      {children}
    </a>
  ) : (
    <Link className={className} to={href} aria-label={label}>
      {children}
    </Link>
  );
}

function ProjectActions({ entry }: { entry: GarageSummary }) {
  const { primary, source } = actionsFor(entry);
  if (!primary && !source) return null;

  return (
    <div className={styles.actions}>
      {primary && (
        <Destination
          href={primary.href}
          external={primary.external}
          label={`${primary.label}: ${entry.meta.title}`}
        >
          {primary.label}
        </Destination>
      )}
      {source && (
        <Destination href={source.href} external label={`Source code for ${entry.meta.title}`}>
          Source code
        </Destination>
      )}
    </div>
  );
}

function Project({ entry, first }: { entry: GarageSummary; first: boolean }) {
  const { meta, slug, screenshotSize } = entry;

  return (
    <li>
      <article className={styles.project} aria-labelledby={`p-${slug}`}>
        {meta.screenshot && (
          <figure className={styles.preview}>
            <img
              src={meta.screenshot}
              alt={`${meta.title} project preview`}
              width={screenshotSize?.width}
              height={screenshotSize?.height}
              loading={first ? "eager" : "lazy"}
              decoding="async"
            />
          </figure>
        )}
        <div className={styles.titleRow}>
          <h2 id={`p-${slug}`} className={styles.name}>{meta.title}</h2>
          {meta.status && meta.status !== "stable" && (
            <span className={styles.status}>{statusLabel[meta.status]}</span>
          )}
        </div>
        <p className={styles.description}>{meta.description}</p>
        <ProjectActions entry={entry} />
      </article>
    </li>
  );
}

export default function Garage() {
  const featured = garageEntries.filter((entry) => entry.meta.featured);
  const rest = garageEntries.filter((entry) => !entry.meta.featured);
  const inProgress = garageEntries.filter((entry) =>
    entry.meta.status === "wip" || (entry.meta.featured && ["alpha", "beta"].includes(entry.meta.status ?? "")),
  );

  return (
    <>
      <Seo title="Garage" path="/garage" description={INTRO} />
      <header className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>A few things I've been making</p>
          <h1>Garage</h1>
        </div>
        <p className={styles.intro}>{INTRO}<br /><em>Some finished. Some still becoming.</em></p>
      </header>

      <section aria-labelledby="garage-pinned">
        <div className={styles.wallHeading}>
          <h2 id="garage-pinned">Pinned up lately</h2>
          <p>Notes from the workshop</p>
        </div>
        <div className={styles.wall}>
          <ol className={styles.projects} aria-label="Selected projects">
            {featured.map((entry, i) => <Project key={entry.slug} entry={entry} first={i === 0} />)}
          </ol>
          <aside className={styles.workshopNote} aria-label="Workshop notes">
            <p className={styles.handwritten}>Started with<br />“what if…”</p>
            <span className={styles.scribble} aria-hidden="true" />
            {inProgress.length > 0 && (
              <div>
                <h3>Still tinkering</h3>
                <ul>
                  {inProgress.map((entry) => (
                    <li key={entry.slug}><a href={`#p-${entry.slug}`}>{entry.meta.title}</a></li>
                  ))}
                </ul>
              </div>
            )}
            <p className={styles.marginNote}>Made out of<br />curiosity.</p>
          </aside>
        </div>
      </section>

      {rest.length > 0 && (
        <section className={styles.others} aria-labelledby="garage-others">
          <div className={styles.sectionHead}>
            <h2 id="garage-others">More in the <em>drawers.</em></h2>
            <p>Pull a drawer to take a look.</p>
          </div>
          <ul className={styles.libraryList}>
            {rest.map((entry, index) => (
              <li key={entry.slug}>
                <article className={styles.library} aria-labelledby={`p-${entry.slug}`}>
                  <details className={styles.drawer}>
                    <summary className={styles.drawerFront}>
                      <span className={styles.drawerNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                      <h3 id={`p-${entry.slug}`} className={styles.libraryName}>{entry.meta.title}</h3>
                      <span className={styles.drawerPull} aria-hidden="true" />
                      <span className={styles.drawerHook}>{entry.meta.hook ?? entry.meta.description}</span>
                    </summary>
                    <div className={styles.drawerContents}>
                      <p className={styles.description}>{entry.meta.description}</p>
                      <ProjectActions entry={entry} />
                    </div>
                  </details>
                </article>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
