import { site } from "@/site";
import styles from "./Footer.module.css";
import textLink from "./TextLink.module.css";

export default function Footer({ compact = false }: { compact?: boolean }) {
  return (
    <footer className={`${styles.footer}${compact ? ` ${styles.compact}` : ""}`}>
      <div className={styles.bottom}>
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <ul className={styles.links}>
          <li>
            <a className={textLink.link} href={`mailto:${site.email}`}>Email</a>
          </li>
          <li>
            <a className={textLink.link} href={site.social.github}>GitHub</a>
          </li>
          <li>
            <a className={textLink.link} href={site.social.linkedin}>LinkedIn</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
