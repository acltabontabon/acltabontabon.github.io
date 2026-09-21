import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { actionsFor } from "@/components/garage/actions";
import { findBySlug, garageEntries } from "@/content/loader";
import { site } from "@/site";
import styles from "./About.module.css";

/** A project named in the prose, linked to its existing destination (the
 *  Garage's primary action for it), with its name from the same entry. */
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
      <Seo title="About" path="/about" description="Casual introduction — not a resume." />
      <div className={styles.page}>
        <header className={styles.head}>
          <h1 className={styles.title}>About</h1>
          <p className={styles.identity}>{site.tagline}.</p>
        </header>

        <div className={styles.prose}>
          <p>
            I build backend services with Java and Spring Boot. AWS and Kubernetes are part of the day job,
            along with figuring out why something that worked yesterday has developed opinions.
          </p>
          <p>
            I like the architecture side of software: figuring out where responsibilities belong, how systems
            talk to each other, and what happens when something goes wrong. I care about making things easier
            to understand, operate, and change.
          </p>
          <p>
            Outside work, I build tools for problems I run into myself. <Project slug="draft-canvas" /> came
            from needing to explain software quickly. <Project slug="vortex" /> is about finding out what a
            service can actually handle. <Project slug="scuttle" /> is for the stuff a computer accumulates
            while you're busy doing other things. The{" "}
            <Link className={styles.inline} to="/garage">
              Garage
            </Link>{" "}
            is where these projects live, along with a few other experiments.
          </p>
          <p>
            Away from the keyboard, there's usually a game, a podcast, a Reddit rabbit hole, or noodles
            involved. Sometimes I launch Steam "for a few minutes." That remains an unreliable estimate.
          </p>
        </div>
      </div>
    </>
  );
}
