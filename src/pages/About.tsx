import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { actionsFor } from "@/components/garage/actions";
import { findBySlug, garageEntries } from "@/content/loader";
import { site } from "@/site";
import styles from "./About.module.css";

/** Project names and destinations follow the Garage's source of truth. */
function Project({ slug }: { slug: string }) {
  const entry = findBySlug(garageEntries, slug);
  const action = entry && actionsFor(entry).primary;
  if (!entry || !action) return <>{entry?.meta.title ?? slug}</>;
  return action.external ? (
    <a className={styles.inline} href={action.href}>
      {entry.meta.title}
    </a>
  ) : (
    <Link className={styles.inline} to={action.href}>
      {entry.meta.title}
    </Link>
  );
}

export default function About() {
  return (
    <>
      <Seo title="About" path="/about" description={`A little about ${site.shortName} — software, side projects, and life away from the keyboard.`} />
      <div className={styles.page}>
        <header className={styles.head}>
          <p className={styles.eyebrow}>{site.name}</p>
          <h1 className={styles.title}>A self-portrait,<br />in the margins.</h1>
        </header>

        <div className={styles.portrait}>
          <section className={styles.annotation} aria-labelledby="about-building">
            <h2 id="about-building" className={styles.statement}>I build<br /><em>useful things.</em></h2>
            <div className={styles.note}>
              <h3>Useful to someone.</h3>
              <p>
                Usually me, at first. <Project slug="draft-canvas" /> for a diagram to explain.
                {" "}<Project slug="vortex" /> for a service to test. <Project slug="scuttle" /> for a computer to clean.
              </p>
            </div>
          </section>

          <section className={styles.annotation} aria-labelledby="about-systems">
            <h2 id="about-systems" className={styles.statement}>I care about how<br />the pieces fit.</h2>
            <div className={styles.note}>
              <h3>The pieces matter.</h3>
              <p>
                Mostly Java and Spring Boot, with AWS and Kubernetes in the mix.
                A fair amount of asking, “What happens if this breaks?”
              </p>
            </div>
          </section>

          <section className={styles.annotation} aria-labelledby="about-life">
            <h2 id="about-life" className={styles.statement}>And yes,<br />there are <em>noodles.</em></h2>
            <div className={styles.note}>
              <h3>Also part of the picture.</h3>
              <p>
                Games. Podcasts. One more Reddit thread. Sometimes Steam “for a few minutes.”
                That remains an unreliable estimate.
              </p>
            </div>
          </section>
        </div>

        <p className={styles.postscript}>
          An occasional <Link className={styles.inline} to="/blog">writer.</Link><br />
          A frequent <Link className={styles.inline} to="/garage">tinkerer.</Link>
        </p>
      </div>
    </>
  );
}
