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

  return (
    <>
      <Seo title="Garage" path="/garage" description={INTRO} />
      <header className={styles.heading}>
        <h1>Garage</h1>
        <p>{INTRO}<br /><span>Some finished. Some still becoming.</span></p>
      </header>

      <ol className={styles.projects} aria-label="Selected projects">
        {featured.map((entry, i) => <Project key={entry.slug} entry={entry} first={i === 0} />)}
      </ol>

      {rest.length > 0 && (
        <section className={styles.others} aria-labelledby="garage-others">
          <div className={styles.sectionHead}>
            <h2 id="garage-others">More from the <em>workbench.</em></h2>
            <p>Smaller things you can build on.</p>
          </div>
          <ul className={styles.libraryList}>
            {rest.map((entry) => (
              <li key={entry.slug}>
                <article className={styles.library} aria-labelledby={`p-${entry.slug}`}>
                  <h3 id={`p-${entry.slug}`} className={styles.libraryName}>{entry.meta.title}</h3>
                  <p className={styles.description}>{entry.meta.description}</p>
                  <ProjectActions entry={entry} />
                </article>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
