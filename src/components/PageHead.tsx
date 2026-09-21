import type { ReactNode } from "react";
import styles from "./PageHead.module.css";

interface PageHeadProps {
  /** The page's <h1>, set at the display size. */
  title: ReactNode;
  /** The page's introduction, set as a statement under the title. */
  lead?: ReactNode;
  /** A quieter second voice, in the right-hand column on wide screens. */
  aside?: ReactNode;
  /** One line of small mono metadata — counts, date spans. */
  meta?: ReactNode;
}

/**
 * How a section page opens: the same oversized, tight heading as the name on
 * the homepage, an introduction in two tones (a primary statement and a
 * secondary tail — wrap the tail in <PageHead.Soft>), and quiet metadata.
 */
export default function PageHead({ title, lead, aside, meta }: PageHeadProps) {
  return (
    <header className={styles.head}>
      <div className={styles.main}>
        <h1 className={styles.title}>{title}</h1>
        {lead && <p className={styles.lead}>{lead}</p>}
      </div>
      {(aside || meta) && (
        <div className={styles.side}>
          {aside && <p className={styles.aside}>{aside}</p>}
          {meta && <p className={styles.meta}>{meta}</p>}
        </div>
      )}
    </header>
  );
}

/** The secondary tail of a lead: same size, a step back in ink. */
PageHead.Soft = function Soft({ children }: { children: ReactNode }) {
  return <span className={styles.soft}>{children}</span>;
};
