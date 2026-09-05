import { site } from "@/site";
import styles from "./Footer.module.css";

/**
 * `minimal` drops the RSS link — the homepage already exposes the feed in its
 * social row, and showing one destination twice on a page that small is noise.
 * Interior pages use the compact header, which renders no socials, so there
 * the footer link is the only visible way to reach the feed.
 */
export default function Footer({ minimal = false }: { minimal?: boolean }) {
  return (
    <footer className={styles.footer}>
      <p>
        © {new Date().getFullYear()} {site.name}
        {!minimal && (
          <>
            {" · "}
            <a className={styles.link} href="/feed.xml">
              RSS
            </a>
          </>
        )}
      </p>
    </footer>
  );
}
