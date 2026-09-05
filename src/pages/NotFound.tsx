import { Link } from "react-router-dom";
import HeaderAvatar from "@/components/HeaderAvatar";
import Seo from "@/components/Seo";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="Nothing here." />
      <HeaderAvatar compact />
      <section className={styles.section}>
        <svg className={styles.illustration} viewBox="0 0 140 140" fill="none" aria-hidden="true">
          <path
            d="M30 100 C 40 60, 55 40, 70 40 C 85 40, 78 60, 70 65 C 62 70, 65 78, 70 80"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="70" cy="98" r="5" fill="currentColor" />
        </svg>
        <h1>Nothing on the workbench here</h1>
        <p className={styles.message}>
          Whatever you were looking for isn't in the Garage. Maybe it never was.
        </p>
        <Link className={styles.home} to="/">
          Back home →
        </Link>
      </section>
    </>
  );
}
