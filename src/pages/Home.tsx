import Seo from "@/components/Seo";
import { site } from "@/site";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <>
      <Seo />
      <section className={styles.hero} aria-labelledby="home-title">
        <p className={styles.eyebrow}>
          <span className={styles.dot} aria-hidden="true" />
          <span>{site.name}</span>
          <span className={styles.role}>Engineer &amp; maker</span>
        </p>
        <h1 id="home-title" className={styles.name}>
          Think it through.
          <br />
          Then <em>act.</em>
        </h1>
        <p className={styles.intro}>{site.tagline}.</p>
      </section>
    </>
  );
}
