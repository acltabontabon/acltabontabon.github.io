import styles from "./Prose.module.css";

// Content is self-authored markdown rendered at build time, not user input.
export default function Prose({ html }: { html: string }) {
  return <div className={styles.prose} dangerouslySetInnerHTML={{ __html: html }} />;
}
